import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";

const properties = [
  {
    number: "01",
    name: "Agency X",
    type: "Field Notes",
    copy: "Building an independent agency in public. The systems, the misses, the numbers, and the decisions that usually stay behind closed doors.",
    color: "#48d7c5",
    className: "property--agency",
  },
  {
    number: "02",
    name: "Miced Up",
    type: "Conversations",
    copy: "Long-form conversations with the people changing how insurance gets sold, serviced, and understood.",
    color: "#d6b8ff",
    className: "property--miced",
  },
  {
    number: "03",
    name: "The Community",
    type: "In Real Life",
    copy: "The room where operators, agents, and builders stop posting and start comparing notes.",
    color: "#ffcc75",
    className: "property--community",
  },
];

const vendors = [
  ["1Fort AI", "Commercial Lines"],
  ["Submissions Co.", "Submissions"],
  ["AgencyBeam", "AMS"],
  ["Hearth Compare", "Personal Lines"],
  ["BenefitsBeam", "Benefits"],
  ["ClaimsFlow", "Claims"],
];

function Mark({ children }) {
  return <span className="mark">[{children}]</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Casey B. Nelson, home">
        Casey B. Nelson <sup>©</sup>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
        <a href="#properties" onClick={() => setOpen(false)}>Properties</a>
        <a href="#directory" onClick={() => setOpen(false)}>The list</a>
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a className="nav-cta" href="mailto:casey@caseybnelson.com">Talk to Casey <ArrowUpRight size={15} /></a>
      </nav>
    </header>
  );
}

export default function Home() {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-beam" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <p className="eyebrow hero-eyebrow">Independent insurance, on the record <span>●</span> Est. 2025</p>
          <h1>
            Content for the people
            <br />
            <Mark>rebuilding insurance</Mark>.
          </h1>
          <div className="hero-bottom">
            <p>Three properties. One obsession: how independent agencies actually get built.</p>
            <a href="#properties" className="scroll-cue">Explore the work <ArrowDown size={18} /></a>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>NO FLUFF</span>
            <strong>CBN</strong>
            <span>ALL FIELD NOTES</span>
          </div>
        </section>

        <section id="properties" className="section properties">
          <div className="section-kicker" data-reveal>
            <span>01 / The network</span>
            <span>Three ways in</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>Three properties.<br /><Mark>One point of view.</Mark></h2>
            <p>Not a content machine. A connected body of work for the people doing the actual rebuilding.</p>
          </div>
          <div className="property-grid">
            {properties.map((property) => (
              <article className={`property-card ${property.className}`} key={property.name} data-reveal>
                <div className="property-top">
                  <span>{property.number}</span>
                  <span>{property.type}</span>
                </div>
                <div className="property-art" style={{ "--property": property.color }} aria-hidden="true">
                  <span>{property.name.charAt(0)}</span>
                </div>
                <div>
                  <h3>{property.name}</h3>
                  <p>{property.copy}</p>
                </div>
                <a href="mailto:casey@caseybnelson.com" aria-label={`Ask about ${property.name}`}>
                  Enter property <ArrowUpRight size={18} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto-line" aria-hidden="true">BUILD IT · TALK ABOUT IT · FIX IT ·</div>
          <div className="manifesto-inner" data-reveal>
            <p className="eyebrow">The working thesis</p>
            <blockquote>
              “The best insurance content shouldn’t feel like insurance content. It should feel like someone finally <em>said the quiet part out loud.</em>”
            </blockquote>
            <p className="signature">Casey B. Nelson</p>
          </div>
        </section>

        <section id="directory" className="section directory">
          <div className="section-kicker" data-reveal>
            <span>02 / The directory</span>
            <span>Actively introducing</span>
          </div>
          <div className="directory-intro" data-reveal>
            <h2>On the <Mark>list.</Mark></h2>
            <p>A deliberately short working directory of vendors worth the meeting. No pay-to-play ranking. No fifty-logo graveyard.</p>
          </div>
          <div className="vendor-list">
            {vendors.map(([name, category], index) => (
              <a href={`mailto:casey@caseybnelson.com?subject=Introduction to ${encodeURIComponent(name)}`} className="vendor-row" key={name} data-reveal>
                <span className="vendor-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <span>{category}</span>
                <ArrowUpRight />
              </a>
            ))}
          </div>
          <div className="directory-note" data-reveal>
            <p>Buying a tool is easy. Getting it adopted is the work.</p>
            <a href="mailto:casey@caseybnelson.com?subject=Help me find the right vendor">Tell me what you’re solving <ArrowUpRight /></a>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="about-copy" data-reveal>
            <p className="eyebrow">03 / Behind the byline</p>
            <h2>Operator first.<br /><Mark>Media company second.</Mark></h2>
            <p className="about-lede">Casey is building the thing he reports on: an independent agency, a media platform, and a more honest room for the insurance channel.</p>
            <p>The result is content with dirt under its fingernails—specific enough to use, candid enough to trust, and entertaining enough to finish.</p>
          </div>
          <div className="about-panel" data-reveal>
            <div className="about-monogram">CBN</div>
            <div className="about-meta">
              <span>Based in the U.S.</span>
              <span>Working nationwide</span>
              <span>Independent by design</span>
            </div>
          </div>
        </section>

        <section className="newsletter">
          <div data-reveal>
            <p className="eyebrow">The monthly brief</p>
            <h2>One useful email.<br /><Mark>No content sludge.</Mark></h2>
          </div>
          {subscribed ? (
            <p className="success">You’re on the list. Keep an eye on your inbox.</p>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }} data-reveal>
              <label htmlFor="email">Email address</label>
              <div>
                <input id="email" type="email" required placeholder="you@youragency.com" />
                <button type="submit">Join the brief <ArrowUpRight /></button>
              </div>
              <small>New names, channel signals, and one thing worth pushing back on. Monthly.</small>
            </form>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-title">Let’s make the channel<br /><Mark>less boring.</Mark></div>
        <div className="footer-grid">
          <div><span>Start here</span><a href="mailto:casey@caseybnelson.com">casey@caseybnelson.com</a></div>
          <div><span>Properties</span><a href="#properties">Agency X</a><a href="#properties">Miced Up</a><a href="#properties">The Community</a></div>
          <div><span>Follow</span><a href="#top">LinkedIn ↗</a><a href="#top">YouTube ↗</a><a href="#top">Spotify ↗</a></div>
          <div><span>Colophon</span><p>Built in the open.<br />Made for independent operators.</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Casey B. Nelson</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
