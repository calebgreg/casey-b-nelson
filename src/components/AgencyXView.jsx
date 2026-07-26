import { ArrowDownToLine, ArrowRight, Clock3, Headphones, Play } from "lucide-react";

const episodes = [
  { ep: "04", title: "The Renewal Rebuild", note: "Three years of backlog. One working system by the end.", runtime: "47:23" },
  { ep: "03", title: "The Tool Nobody Used", note: "A rollout rebuilt around the people doing the work.", runtime: "42:08" },
  { ep: "02", title: "The Producer Problem", note: "Following the handoff from first call to bound account.", runtime: "38:41" },
  { ep: "01", title: "Walk the Floor", note: "The first week inside the agency—and what the workflows revealed.", runtime: "51:16" },
];

const clips = [
  { title: "Your intake is the real AMS problem.", ep: "04", runtime: "0:58" },
  { title: "The 15-minute renewal huddle.", ep: "03", runtime: "1:24" },
  { title: "How to get producers into the rollout.", ep: "03", runtime: "0:47" },
  { title: "The org chart for a 10-person agency.", ep: "02", runtime: "1:03" },
];

const fieldKits = [
  { name: "The Renewal Rebuild", type: "Playbook · 14 pages", copy: "A 90-day process for turning a neglected renewal book into a working system." },
  { name: "Producer Adoption Scorecard", type: "Scorecard · 2 pages", copy: "Measure whether a new tool is becoming part of the agency’s daily work." },
  { name: "The Intake Audit", type: "Worksheet · 6 pages", copy: "Trace one submission through the agency and find where the hours go." },
];

export default function AgencyXView({ onBack }) {
  return (
    <section className="ax-show">
      <button type="button" onClick={onBack} className="ax-back">← Casey B. Nelson</button>

      <div className="ax-hero">
        <div className="ax-hero-copy">
          <div className="ax-kicker">A Casey B. Nelson original series</div>
          <h1>Agency <i>X</i></h1>
          <p className="ax-logline">A real insurance agency.<br />Rebuilt in public.</p>
          <p className="ax-intro">Casey walks the floor, follows the work, and rebuilds the systems alongside the people who use them. Every decision becomes an episode. Every lesson becomes a field kit.</p>
          <div className="ax-actions">
            <a className="ax-primary" href="#latest"><Play size={16} fill="currentColor" /> Watch latest episode</a>
            <a className="ax-secondary" href="#episodes"><Headphones size={16} /> Browse season one</a>
          </div>
        </div>

        <div className="ax-key-art" aria-label="Agency X season one key art">
          <div className="ax-frame-corners" aria-hidden="true" />
          <div className="ax-key-meta">
            <span>Season 01</span>
            <span>Field Series</span>
          </div>
          <div className="ax-key-title"><span>AGENCY</span><strong>X</strong></div>
          <div className="ax-key-credit">Created & hosted by<br /><strong>Casey B. Nelson</strong></div>
        </div>
      </div>

      <div className="ax-marquee" aria-hidden="true">
        <span>ON LOCATION · REAL OPERATORS · REAL WORKFLOWS · BUILT IN PUBLIC ·&nbsp;</span>
        <span>ON LOCATION · REAL OPERATORS · REAL WORKFLOWS · BUILT IN PUBLIC ·&nbsp;</span>
      </div>

      <section id="latest" className="ax-latest">
        <div className="ax-player">
          <div className="ax-player-screen">
            <div className="ax-player-label">Now playing · S01 E04</div>
            <button type="button" aria-label="Play The Renewal Rebuild"><Play size={30} fill="currentColor" /></button>
            <div className="ax-timecode">00:00:00:00</div>
          </div>
          <div className="ax-player-bar">
            <span><Play size={13} fill="currentColor" /> Episode 04</span>
            <span><Clock3 size={13} /> 47:23</span>
          </div>
        </div>
        <div className="ax-latest-copy">
          <div className="ax-kicker">Latest episode</div>
          <h2>The Renewal<br /><i>Rebuild.</i></h2>
          <p>Three years of renewal backlog. Casey and the service team map the existing process, rebuild the weekly rhythm, and put ownership where the work happens.</p>
          <a href="#field-kits">Get the episode playbook <ArrowDownToLine size={17} /></a>
        </div>
      </section>

      <section id="episodes" className="ax-section">
        <div className="ax-section-head">
          <div><span>Season one</span><h2>Episode guide.</h2></div>
          <p>Inside the agency, from first walkthrough to working system.</p>
        </div>
        <div className="ax-episodes">
          {episodes.map((episode) => (
            <a href="#latest" className="ax-episode" key={episode.ep}>
              <span className="ax-episode-number">E{episode.ep}</span>
              <div><h3>{episode.title}</h3><p>{episode.note}</p></div>
              <span className="ax-runtime">{episode.runtime}</span>
              <Play size={18} />
            </a>
          ))}
        </div>
      </section>

      <section className="ax-section ax-clips-section">
        <div className="ax-section-head">
          <div><span>From the edit</span><h2>Watch the clips.</h2></div>
          <p>Specific moments from the rebuild, cut short enough to use today.</p>
        </div>
        <div className="ax-clips">
          {clips.map((clip, index) => (
            <a href="#latest" className="ax-clip" key={clip.title}>
              <div className="ax-clip-still">
                <span>0{index + 1}</span>
                <Play size={22} fill="currentColor" />
              </div>
              <div className="ax-clip-meta"><span>EP {clip.ep} · {clip.runtime}</span><ArrowRight size={16} /></div>
              <h3>{clip.title}</h3>
            </a>
          ))}
        </div>
      </section>

      <section id="field-kits" className="ax-section ax-kits-section">
        <div className="ax-section-head">
          <div><span>Made on the show</span><h2>Field kits.</h2></div>
          <p>The exact tools used inside the agency, ready for your next operating meeting.</p>
        </div>
        <div className="ax-kits">
          {fieldKits.map((kit, index) => (
            <a href="#" className="ax-kit" key={kit.name}>
              <span>0{index + 1}</span>
              <div><h3>{kit.name}</h3><p>{kit.copy}</p></div>
              <small>{kit.type}</small>
              <ArrowDownToLine size={20} />
            </a>
          ))}
        </div>
      </section>

      <div className="ax-credits">
        <div><span>Created & hosted by</span><strong>Casey B. Nelson</strong></div>
        <div><span>Produced on location</span><strong>Inside independent agencies</strong></div>
        <div><span>New episodes</span><strong>Season one · 2026</strong></div>
      </div>
    </section>
  );
}
