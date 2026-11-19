"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CircleAlert, Info } from "lucide-react";
import { CONTACT_EMAIL, FORM_ENDPOINT, LIVE, PREVIEW } from "@/lib/config";
import { PICK_EVENT, type PriceChoice } from "./PickLink";

type Values = {
  name: string;
  age: string;
  location: string;
  email: string;
  confused_recent: string;
  price: string;
  price_amount: string;
  price_period: string;
  consent: boolean;
};
type Key = "name" | "age" | "location" | "email" | "confused_recent" | "price" | "consent";
type Errors = Partial<Record<Key, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Every question, in order: what the error list calls it, where the error list sends focus, and its check. */
const FIELDS: Array<{ key: Key; short: string; focus: (v: Values) => string; check: (v: Values) => string }> = [
  { key: "name", short: "Your name", focus: () => "f-name", check: (v) => (v.name.trim() ? "" : "Please pop your name in.") },
  {
    key: "age",
    short: "Your age",
    focus: () => "f-age",
    check: (v) => (v.age ? "" : "Choose your age, lovely. This list is for sisters aged 18 and over."),
  },
  {
    key: "location",
    short: "Where you live",
    focus: () => "f-location",
    check: (v) => (v.location.trim() ? "" : "Please add your town or city, and country."),
  },
  {
    key: "email",
    short: "Email address",
    focus: () => "f-email",
    check: (v) => {
      const e = v.email.trim();
      if (!e) return "Add your email so we know where to send your Quru update.";
      if (!EMAIL.test(e)) return "Please enter a full email address, like name@example.com.";
      return "";
    },
  },
  {
    key: "confused_recent",
    short: "The last three months",
    focus: () => "f-recent-yes",
    check: (v) => (v.confused_recent ? "" : "Choose an answer, or select “I’d rather not say.”"),
  },
  {
    key: "price",
    short: "The price you would pick",
    focus: (v) => (v.price === "custom" ? "f-own-amount" : "f-price-monthly"),
    check: (v) => {
      if (!v.price) return "Choose the price that feels right, or tell us your own.";
      if (v.price !== "custom") return "";
      const a = v.price_amount.trim().replace(/^£\s*/, "");
      if (!a) return "Enter the amount in pounds, like 4 or 4.50.";
      if (!/^\d{1,4}(\.\d{1,2})?$/.test(a)) return "Enter the amount in pounds, like 4 or 4.50.";
      if (Number(a) <= 0) return "Please enter an amount above £0, or choose “I think it should be free.”";
      return "";
    },
  },
  {
    key: "consent",
    short: "Your agreement",
    focus: () => "f-consent",
    check: (v) => (v.consent ? "" : "Please tick the box so we can keep your answers and contact you."),
  },
];
const fieldFor = (key: Key) => FIELDS.find((f) => f.key === key)!;

const EMPTY: Values = {
  name: "",
  age: "",
  location: "",
  email: "",
  confused_recent: "",
  price: "",
  price_amount: "",
  price_period: "month",
  consent: false,
};

const PRICES: Array<{ value: PriceChoice; title: string; note?: string }> = [
  { value: "monthly", title: "£3 a month", note: "Pay monthly" },
  { value: "yearly", title: "£25 a year", note: "One yearly payment" },
  { value: "founding", title: "£75 once", note: "Founding sister price, with nothing to renew" },
  { value: "custom", title: "My own price", note: "Tell us an amount and whether it’s per month or per year" },
  { value: "free", title: "It should be free" },
];

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <p className="qu-error" id={id} hidden={!message}>
      <CircleAlert />
      <span>{message}</span>
    </p>
  );
}

/** Joins the ids a control is described by, skipping the error's while there is none. */
const describedBy = (...ids: Array<string | false | undefined>) => ids.filter(Boolean).join(" ") || undefined;

export function JoinForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [problems, setProblems] = useState<Array<{ key: Key; message: string }> | null>(null);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [done, setDone] = useState<{ firstName: string; email: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const donePanel = useRef<HTMLDivElement>(null);

  const setError = (key: Key, message: string) => setErrors((e) => ({ ...e, [key]: message || undefined }));
  const validate = (key: Key, v: Values = values) => {
    const message = fieldFor(key).check(v);
    setError(key, message);
    return message;
  };

  // The price buttons higher up the page pick the matching answer here.
  useEffect(() => {
    const onPick = (e: Event) => {
      const pick = (e as CustomEvent<PriceChoice>).detail;
      setValues((v) => ({ ...v, price: pick }));
      setErrors((e) => ({ ...e, price: undefined }));
    };
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, []);

  useEffect(() => {
    if (problems?.length) summary.current?.focus();
  }, [problems]);
  useEffect(() => {
    if (done) donePanel.current?.focus();
  }, [done]);

  /* Typed answers are checked when she leaves the box, and again as she types once they have an error.
     Choices clear their error as soon as she answers. */
  const typed = (key: "name" | "location" | "email") => ({
    value: values[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [key]: e.target.value };
      setValues(next);
      if (errors[key]) validate(key, next);
    },
    onBlur: () => {
      if (values[key].trim()) validate(key);
    },
    "aria-invalid": errors[key] ? true : undefined,
  });
  const choose = (key: "confused_recent" | "price", value: string) => ({
    checked: values[key] === value,
    onChange: () => {
      setValues((v) => ({ ...v, [key]: value }));
      setError(key, "");
    },
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendFailed(false);
    const found = FIELDS.map((f) => ({ key: f.key, message: f.check(values) })).filter((p) => p.message);
    setErrors(Object.fromEntries(FIELDS.map((f) => [f.key, f.check(values) || undefined])));
    if (found.length) {
      setProblems(found);
      return;
    }
    setProblems(null);

    const data = new FormData(form.current!);
    if (data.get("_gotcha")) return;
    if (values.price !== "custom") {
      data.delete("price_amount");
      data.delete("price_period");
    }
    const finished = { firstName: values.name.trim().split(/\s+/)[0], email: values.email.trim() };
    if (!LIVE) {
      setDone(finished);
      return;
    }
    setSending(true);
    try {
      const response = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("send failed");
      setDone(finished);
    } catch {
      setSendFailed(true);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="lp-done" ref={donePanel} role="status" tabIndex={-1}>
        {PREVIEW && (
          <div className="qu-notice">
            <Info />
            <p>
              <strong>This is a design preview only.</strong> No form was submitted, and no details were saved.
            </p>
          </div>
        )}
        <span className="qu-status qu-status-confirmed" style={{ justifySelf: "start" }}>
          You&apos;re on the list!
        </span>
        <h3>{done.firstName ? `You're on the list, ${done.firstName}.` : "You're on the list."}</h3>
        <p>Thank you for being here, sis. We&apos;ll email you at {done.email} as soon as Quru is ready. There&apos;s nothing else you need to do for now. We&apos;ll keep you posted!</p>
        {CONTACT_EMAIL && <p className="lp-fine">Have a question in the meantime? You can reach us at {CONTACT_EMAIL}.</p>}
      </div>
    );
  }

  // data-clarity-mask: the answers are personal (age, place, cycle), so Clarity replays never show them.
  return (
    <form className="lp-form" id="join-form" ref={form} noValidate onSubmit={onSubmit} data-clarity-mask="true">
      {problems && problems.length > 0 && (
        <div className="qu-notice qu-notice-danger lp-summary" ref={summary} role="alert" tabIndex={-1}>
          <CircleAlert />
          <div>
            <p>
              <strong>{problems.length === 1 ? "Just one little thing to check before you send" : `${problems.length} things to check before you send`}</strong>
            </p>
            <ul>
              {problems.map((p) => {
                const target = fieldFor(p.key).focus(values);
                return (
                  <li key={p.key}>
                    <a
                      href={`#${target}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(target)?.focus();
                      }}
                    >
                      {fieldFor(p.key).short}: {p.message}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="lp-pair-fields">
        <div className="qu-field">
          <label className="qu-label" htmlFor="f-name">
            Your name
          </label>
          <ErrorText id="f-name-error" message={errors.name} />
          <input
            className="qu-input"
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            required
            aria-describedby={describedBy(errors.name && "f-name-error")}
            {...typed("name")}
          />
        </div>
        <div className="qu-field">
          <label className="qu-label" htmlFor="f-age">
            Your age
          </label>
          <ErrorText id="f-age-error" message={errors.age} />
          <span className="qu-select">
            <select
              className="qu-input"
              id="f-age"
              name="age"
              required
              value={values.age}
              aria-invalid={errors.age ? true : undefined}
              aria-describedby={describedBy(errors.age && "f-age-error")}
              onChange={(e) => {
                setValues((v) => ({ ...v, age: e.target.value }));
                setError("age", "");
              }}
            >
              <option value="">Choose</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45-54">45–54</option>
              <option value="55+">55 or over</option>
            </select>
          </span>
        </div>
      </div>

      <div className="qu-field">
        <label className="qu-label" htmlFor="f-location">
          Where you live
        </label>
        <p className="qu-help" id="f-location-help">
          Your town or city, and country. For example: Leicester, UK.
        </p>
        <ErrorText id="f-location-error" message={errors.location} />
        <input
          className="qu-input"
          id="f-location"
          name="location"
          type="text"
          maxLength={80}
          required
          aria-describedby={describedBy("f-location-help", errors.location && "f-location-error")}
          {...typed("location")}
        />
      </div>

      <div className="qu-field">
        <label className="qu-label" htmlFor="f-email">
          Email address
        </label>
        <p className="qu-help" id="f-email-help">
          We&apos;ll use this to let you know when Quru is ready. No newsletters, promise.
        </p>
        <ErrorText id="f-email-error" message={errors.email} />
        <input
          className="qu-input"
          id="f-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          required
          aria-describedby={describedBy("f-email-help", errors.email && "f-email-error")}
          {...typed("email")}
        />
      </div>

      <Choices
        legend="In the last three months, was there a time when you weren't sure whether you should be praying?"
        help="For example, you weren't sure whether your bleeding was hayd or istihada."
        errorId="g-recent-error"
        error={errors.confused_recent}
      >
        <div className="lp-inline">
          {[
            ["yes", "Yes"],
            ["no", "No"],
            ["prefer_not", "I’d rather not say"],
          ].map(([value, title]) => (
            <label className="qu-choice" key={value}>
              <input type="radio" id={`f-recent-${value.replace("_", "-")}`} name="confused_recent" value={value} required {...choose("confused_recent", value)} />
              <span className="qu-choice-title">{title}</span>
            </label>
          ))}
        </div>
      </Choices>

      <Choices legend="Which option feels best to you?" help="We’re not taking payment." errorId="g-price-error" error={errors.price}>
        {PRICES.map((p) => (
          <PriceOption key={p.value} {...p} control={choose("price", p.value)}>
            {p.value === "custom" && values.price === "custom" && (
              <div className="lp-own" id="own-price">
                <div className="qu-field">
                  <label className="qu-label" htmlFor="f-own-amount">
                    Amount
                  </label>
                  <span className="lp-own-amount">
                    <span aria-hidden="true">£</span>
                    <input
                      className="qu-input"
                      id="f-own-amount"
                      name="price_amount"
                      type="text"
                      inputMode="decimal"
                      maxLength={7}
                      autoComplete="off"
                      value={values.price_amount}
                      aria-invalid={errors.price ? true : undefined}
                      aria-describedby={describedBy(errors.price && "g-price-error")}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, price_amount: e.target.value }));
                        setError("price", "");
                      }}
                    />
                  </span>
                </div>
                <div className="qu-field">
                  <label className="qu-label" htmlFor="f-own-period">
                    How often
                  </label>
                  <span className="qu-select">
                    <select
                      className="qu-input"
                      id="f-own-period"
                      name="price_period"
                      value={values.price_period}
                      onChange={(e) => setValues((v) => ({ ...v, price_period: e.target.value }))}
                    >
                      <option value="month">a month</option>
                      <option value="year">a year</option>
                    </select>
                  </span>
                </div>
              </div>
            )}
          </PriceOption>
        ))}
      </Choices>

      <div className="qu-field">
        <ErrorText id="f-consent-error" message={errors.consent} />
        <label className="qu-choice">
          <input
            type="checkbox"
            id="f-consent"
            name="consent"
            value="yes"
            required
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy(errors.consent && "f-consent-error")}
            onChange={(e) => {
              setValues((v) => ({ ...v, consent: e.target.checked }));
              setError("consent", "");
            }}
          />
          <span>
            <span className="qu-choice-title">I agree to Quru keeping my answers so the team can contact me about the app and understand who needs it.</span>
            <span className="qu-choice-note">I can ask for my details to be deleted at any time.</span>
          </span>
        </label>
      </div>

      {/* A trap for bots: people never see or fill it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />

      <div className="lp-submit">
        {sendFailed && (
          <div className="qu-notice qu-notice-danger" role="alert">
            <CircleAlert />
            <p>
              <strong>Oh no, your form didn&apos;t go through.</strong> Check your connection and try sending it again. Don&apos;t worry, your answers are still here.
            </p>
          </div>
        )}
        <button className="qu-btn qu-btn-primary qu-btn-block" type="submit" disabled={sending}>
          {sending ? "Sending your form…" : "Let me know when Quru opens"}
        </button>
        <p className="lp-fine">No payment will be taken. You&apos;re just joining the list.</p>
      </div>
    </form>
  );
}

function Choices({ legend, help, errorId, error, children }: { legend: string; help: string; errorId: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="qu-choices" aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}>
      <legend>{legend}</legend>
      <p className="qu-help">{help}</p>
      <ErrorText id={errorId} message={error} />
      {children}
    </fieldset>
  );
}

function PriceOption({
  value,
  title,
  note,
  control,
  children,
}: {
  value: PriceChoice;
  title: string;
  note?: string;
  control: { checked: boolean; onChange: () => void };
  children?: ReactNode;
}) {
  return (
    <>
      <label className="qu-choice">
        <input type="radio" id={`f-price-${value}`} name="price" value={value} required {...control} />
        {note ? (
          <span>
            <span className="qu-choice-title">{title}</span>
            <span className="qu-choice-note">{note}</span>
          </span>
        ) : (
          <span className="qu-choice-title">{title}</span>
        )}
      </label>
      {children}
    </>
  );
}
