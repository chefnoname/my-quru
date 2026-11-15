import Image from "next/image";
import { BellRing, CalendarDays } from "lucide-react";
import { Term } from "../Term";
import appScreens from "../../../public/app-screens.webp";

/** What TahaaraEngine does today, how Quru learns a cycle, and early designs of the app. */
export function Engine() {
  return (
    <section className="lp-band lp-section" id="engine" aria-labelledby="h-engine">
      <div className="lp-wrap">
        <div className="lp-band-panel lp-engine-panel">
          <div className="lp-engine-head" data-reveal>
            <p className="lp-kicker">
              TahaaraEngine<span className="lp-tm">™</span> and your cycle
            </p>
            <h2 className="lp-h2" id="h-engine">
              Answers today. Learns your cycle. A teacher when you need one.
            </h2>
          </div>
          <div className="lp-band-side" data-reveal>
            <ul className="lp-engine-list">
              <li>
                <span className="lp-ico">
                  <CalendarDays />
                </span>
                <div>
                  <h3>Today&apos;s answer, with the reason</h3>
                  <p>
                    <Term /> asks you a few careful questions about your bleeding and discharge. In seconds it tells you whether to pray or fast today,
                    and why.
                  </p>
                </div>
              </li>
              <li>
                <span className="lp-ico">
                  <BellRing />
                </span>
                <div>
                  <h3>A heads-up before your next period</h3>
                  <p>
                    Bring your past dates, from memory or another app. Quru learns your rhythm and reminds you a few days before, with simple ways to
                    get ready in body and heart.
                  </p>
                </div>
              </li>
            </ul>
            <p className="lp-fine">
              Every rule inside TahaaraEngine<span className="lp-tm">™</span> is checked by Ustadh Yasin before it reaches you. A reminder is a
              heads-up, not a ruling.
            </p>
          </div>
          <figure className="lp-band-art" data-reveal>
            <Image
              src={appScreens}
              sizes="(min-width: 920px) 560px, 100vw"
              alt="Three screens from the Quru app. On the left, worship you can do on your period: remember Allah, listen to the Quran, make dua. In the middle, today's answer on day 4 of 7 of hayd: rest from salah today, expected to end Monday night, with a hadith of the day and worship to do today. On the right, the lock screen with today's prayers."
            />
            <figcaption className="lp-fine">Early designs of the app.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
