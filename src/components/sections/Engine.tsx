import Image from "next/image";
import { Term } from "../Term";
import appScreens from "../../../public/app-screens.webp";

/** What TahaaraEngine does today, how Quru learns a cycle, and early designs of the app. */
export function Engine() {
  return (
    <section className="lp-band lp-section" id="engine" aria-labelledby="h-engine">
      <div className="lp-wrap">
        <div className="lp-band-panel lp-engine-panel">
          <div className="lp-engine-head" data-reveal>
            <h2 className="lp-h2" id="h-engine">
              Your daily answer, a clearer picture of your cycle, and a teacher by your side.
            </h2>
          </div>
          <div className="lp-band-side" data-reveal>
            <ul className="lp-engine-list">
              <li>
                <h3>A little clarity for today</h3>
                <p>
                  Answer a few thoughtful questions about your bleeding and discharge. In just a moment, Quru helps you understand whether you should
                  pray or fast today, and explains why, so you&apos;re not left guessing.
                </p>
              </li>
              <li>
                <h3>
                  TahaaraEngine<span className="lp-tm">™</span>, right by your side
                </h3>
                <p>
                  <Term /> takes your answers and turns them into clear guidance, made just for you. Gentle notifications and widgets keep it close:
                  see today&apos;s prayers on your lock screen, get a soft heads-up before your next period, and find worship you can still enjoy on the
                  days you rest from salah. Less guessing, more peace of mind.
                </p>
              </li>
            </ul>
            <p className="lp-fine">
              Every rule within TahaaraEngine<span className="lp-tm">™</span> is reviewed by a qualified Ustadh (Islamic teacher) before it reaches you. Cycle
              reminders are simply a heads-up to help you prepare. They are not religious rulings.
            </p>
          </div>
          <figure className="lp-band-art" data-reveal>
            <Image
              src={appScreens}
              sizes="(min-width: 920px) 560px, 100vw"
              alt="Three screens from the Quru app. On the left: worship you can do during your period, including remembering Allah, listening to the Quran, and making dua. In the middle: today's answer on day 4 of 7 of hayd, showing that you should rest from salah today, with an expected end on Monday night, a hadith of the day, and worship suggestions. On the right: the lock screen with today's prayers."
            />
            <figcaption className="lp-fine">A first look at the Quru app. More lovely details are on the way.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
