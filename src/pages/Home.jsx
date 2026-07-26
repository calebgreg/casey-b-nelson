import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import HeroSpotlight from "../components/HeroSpotlight";

const properties = [
  {
    number: "01",
    name: "Agency X",
    type: "Field Notes",
    copy: "Building an independent agency in public. The systems, the misses, the numbers, and the decisions that usually stay behind closed doors.",
    color: "#48d7c5",
    className: "property--agency",
    href: "/agency-x",
  },
  {
    number: "02",
    name: "Miced Up",
    type: "Conversations",
    copy: "Long-form conversations with the people changing how insurance gets sold, serviced, and understood.",
    color: "#d6b8ff",
    className: "property--miced",
    href: "/miced-up",
  },
  {
    number: "03",
    name: "The Community",
    type: "In Real Life",
    copy: "The room where operators, agents, and builders stop posting and start comparing notes.",
    color: "#ffcc75",
    className: "property--community",
    href: "/community",
  },
];

const vendors = [
  { name: "1Fort AI", category: "Commercial Lines", image: "https://base44.app/api/apps/6a037576ebf42363ca2506d2/files/mp/public/6a037576ebf42363ca2506d2/3cc89497b_1fort-transparent-v3.png", fit: "contain", background: "#26251f" },
  { name: "Submissions Co.", category: "Submissions", image: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/1a13e9ac9_generated_image.png" },
  { name: "AgencyBeam", category: "AMS", image: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/8800b4fd6_generated_image.png" },
  { name: "Hearth Compare", category: "Personal Lines", image: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/de2946259_generated_image.png" },
  { name: "BenefitsBeam", category: "Benefits", image: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/ea9e8aa0c_generated_image.png" },
  { name: "ClaimsFlow", category: "Claims", image: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/22b20e4f6_generated_image.png" },
];

function Mark({ children }) {
  return <span className="mark">[{children}]</span>;
}

function PropertyProof({ name }) {
  if (name === "Agency X") {
    return (
      <div className="property-proof proof-episode">
        <span>Latest field note · EP 04</span>
        <strong>Rebuilding a three-year renewal backlog.</strong>
        <div className="waveform" aria-hidden="true">{[18, 34, 52, 28, 68, 42, 76, 32, 58, 22, 46, 64, 36, 72, 44].map((height, index) => <i key={index} style={{ height }} />)}</div>
        <small>47:23 · Watch the rebuild</small>
      </div>
    );
  }
  if (name === "Miced Up") {
    return (
      <div className="property-proof proof-road">
        <span>Casey on the road · 2026</span>
        <strong>Nashville<br />Las Vegas<br />Austin<br />Hartford</strong>
        <small>Keynotes · Panels · Fireside chats</small>
      </div>
    );
  }
  return (
    <div className="property-proof proof-community">
      <span>Inside the room · Active now</span>
      <p>Who’s actually renewed their AMS contract this year—and why?</p>
      <p>Producer comp plans: post yours, roast mine.</p>
      <small>400+ verified agency operators</small>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [wordmarkColor, setWordmarkColor] = useState("#f0ece2");

  useEffect(() => {
    const palette = [
      [240, 236, 226],
      [72, 215, 197],
      [240, 236, 226],
      [214, 184, 255],
      [72, 215, 197],
      [255, 204, 117],
      [240, 236, 226],
    ];
    const mix = (from, to, amount) => Math.round(from + (to - from) * amount);
    let frame;

    const updateColor = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      const scaled = progress * (palette.length - 1);
      const index = Math.min(Math.floor(scaled), palette.length - 2);
      const amount = scaled - index;
      const from = palette[index];
      const to = palette[index + 1];
      setWordmarkColor(`rgb(${mix(from[0], to[0], amount)}, ${mix(from[1], to[1], amount)}, ${mix(from[2], to[2], amount)})`);
      frame = undefined;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateColor);
    };

    updateColor();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Casey B. Nelson, home" style={{ color: wordmarkColor }}>
        Casey B. Nelson <sup>©</sup>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
        <a href="/#properties" onClick={() => setOpen(false)}>Properties</a>
        <a href="/#directory" onClick={() => setOpen(false)}>The list</a>
        <a href="/#about" onClick={() => setOpen(false)}>About</a>
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
          <HeroSpotlight />
          <div className="hero-grain" aria-hidden="true" />
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
            <span>IN THE FIELD</span>
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
            <p>One connected body of work for the people rebuilding independent insurance.</p>
          </div>
          <div className="property-grid">
            {properties.map((property) => (
              <article className={`property-card ${property.className}`} key={property.name} data-reveal>
                <div className="property-top">
                  <span>{property.number}</span>
                  <span>{property.type}</span>
                </div>
                <PropertyProof name={property.name} />
                <div>
                  <h3>{property.name}</h3>
                  <p>{property.copy}</p>
                </div>
                <a href={property.href} aria-label={`Explore ${property.name}`}>
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
              “The best insurance content feels like someone finally <em>said the quiet part out loud.</em>”
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
            <p>A deliberately short working directory of vendors Casey knows, follows, and considers worth the meeting.</p>
          </div>
          <div className="vendor-list">
            {vendors.map((vendor, index) => (
              <a href={`mailto:casey@caseybnelson.com?subject=Introduction to ${encodeURIComponent(vendor.name)}`} className="vendor-row" key={vendor.name} data-reveal>
                <span className="vendor-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{vendor.name}</strong>
                <span className="vendor-preview" style={{ background: vendor.background || "#111" }}>
                  <img src={vendor.image} alt="" style={{ objectFit: vendor.fit || "cover" }} />
                </span>
                <span className="vendor-category">{vendor.category}</span>
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
            <h2>One monthly brief.<br /><Mark>Names worth knowing.</Mark></h2>
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
        <div className="footer-title">Keep the channel<br /><Mark>moving forward.</Mark></div>
        <div className="footer-grid">
          <div><span>Start here</span><a href="mailto:casey@caseybnelson.com">casey@caseybnelson.com</a></div>
          <div><span>Properties</span><a href="/agency-x">Agency X</a><a href="/miced-up">Miced Up</a><a href="/community">The Community</a></div>
          <div><span>Follow</span><a href="#top">LinkedIn ↗</a><a href="#top">YouTube ↗</a><a href="#top">Spotify ↗</a></div>
          <div><span>Colophon</span><p>Built in the open.<br />Made for independent operators.</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Casey B. Nelson</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
