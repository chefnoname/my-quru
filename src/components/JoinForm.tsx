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
  { key: "name", short: "Your name", focus: () => "f-name", check: (v) => (v.name.trim() ? "" : "Enter your name.") },
  {
    key: "age",
    short: "Your age",
    focus: () => "f-age",
    check: (v) => (v.age ? "" : "Choose your age. This list is for sisters aged 18 and over."),
  },
  {
    key: "location",
    short: "Where you live",
    focus: () => "f-location",
    check: (v) => (v.location.trim() ? "" : "Enter your town or city, and country."),
  },
  {
    key: "email",
    short: "Email address",
    focus: () => "f-email",
    check: (v) => {
      const e = v.email.trim();
      if (!e) return "Enter your email address, so we can tell you when the app is ready.";
      if (!EMAIL.test(e)) return "Enter a full email address, like name@example.com.";
      return "";
    },
  },
  {
    key: "confused_recent",
    short: "The last three months",
    focus: () => "f-recent-yes",
    check: (v) => (v.confused_recent ? "" : "Choose an answer, or “I would rather not say”."),
  },
  {
    key: "price",
    short: "The price you would pick",
    focus: (v) => (v.price === "custom" ? "f-own-amount" : "f-price-monthly"),
    check: (v) => {
      if (!v.price) return "Choose the price you would pick, or tell us your own.";
      if (v.price !== "custom") return "";
      const a = v.price_amount.trim().replace(/^£\s*/, "");
      if (!a) return "Enter the amount you would pay, in pounds.";
      if (!/^\d{1,4}(\.\d{1,2})?$/.test(a)) return "Enter an amount in pounds, like 4 or 4.50.";
      if (Number(a) <= 0) return "Enter an amount above £0, or choose “It should be free”.";
      return "";
    },
  },
  {
    key: "consent",
    short: "Your agreement",
    focus: () => "f-consent",
    check: (v) => (v.consent ? "" : "Tick the box, so we may keep your answers and write to you."),
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
  { value: "monthly", title: "£3 a month", note: "Month by month." },
  { value: "yearly", title: "£25 a year", note: "One payment a year." },
  { value: "founding", title: "£75 once, as a founding sister", note: "One payment, with nothing to renew." },
  { value: "custom", title: "My own price", note: "Tell us what you would pay, a month or a year." },
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
              <strong>Design preview.</strong> Nothing was sent or saved. This is what a sister sees after she signs up.
            </p>
          </div>
        )}
        <span className="qu-status qu-status-confirmed" style={{ justifySelf: "start" }}>
          On the list
        </span>
        <h3>{done.firstName ? `You're on the list, ${done.firstName}.` : "You're on the list."}</h3>
        <p>We will write to {done.email} when the app is ready. There is nothing to pay and nothing else to do.</p>
        {CONTACT_EMAIL && <p className="lp-fine">Questions? Write to {CONTACT_EMAIL}.</p>}
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
              <strong>{problems.length === 1 ? "Check 1 answer before you send" : `Check ${problems.length} answers before you send`}</strong>
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
              <option value="18-24">18 to 24</option>
              <option value="25-34">25 to 34</option>
              <option value="35-44">35 to 44</option>
              <option value="45-54">45 to 54</option>
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
          We use it to tell you when the app is ready. No newsletters.
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
        legend="In the last three months, was there a moment when you didn't know whether you should be praying?"
        help="For example, you weren't sure whether your bleeding was hayd or istihada."
        errorId="g-recent-error"
        error={errors.confused_recent}
      >
        <div className="lp-inline">
          {[
            ["yes", "Yes"],
            ["no", "No"],
            ["prefer_not", "I would rather not say"],
          ].map(([value, title]) => (
            <label className="qu-choice" key={value}>
              <input type="radio" id={`f-recent-${value.replace("_", "-")}`} name="confused_recent" value={value} required {...choose("confused_recent", value)} />
              <span className="qu-choice-title">{title}</span>
            </label>
          ))}
        </div>
      </Choices>

      <Choices legend="Which price sounds most attractive to you?" help="What would you pick? We are not taking payment." errorId="g-price-error" error={errors.price}>
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
            <span className="qu-choice-title">I agree to Quru keeping my answers to contact me about the app.</span>
            <span className="qu-choice-note">
              We use them to write to you when the app is ready, and to understand who needs it. You can ask us to delete them at any time.
            </span>
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
              <strong>We could not send your form.</strong> Check your connection and send it again. Your answers are still here.
            </p>
          </div>
        )}
        <button className="qu-btn qu-btn-primary qu-btn-block" type="submit" disabled={sending}>
          {sending ? "Sending your form" : "Tell me when Quru opens"}
        </button>
        <p className="lp-fine">No payment is taken.</p>
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
