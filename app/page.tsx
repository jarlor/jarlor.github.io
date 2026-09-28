import { PageMotion } from "./components/PageMotion";
import { PortraitToggle } from "./components/PortraitToggle";
import { ResearchNarrative } from "./components/ResearchNarrative";
import { ThemeToggle } from "./components/ThemeToggle";
import { PublicationList } from "./components/PublicationList";
import { publications } from "./data/publications";
import { heroResearchLead, heroResearchPhrases } from "./data/research";
import { siteProfile } from "./data/site";

export default function Home() {
  return (
    <>
      <PageMotion />
      <div className="scroll-meter" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a
          className="site-name"
          href="#top"
          aria-label={`${siteProfile.name}, home`}
        >
          {siteProfile.name}
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#research" data-nav-target="research">
            Research
          </a>
          <a href="#publications" data-nav-target="publications">
            Publications
          </a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="contact-link" href="#contact" data-nav-target="contact">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-main">
            <div className="hero-name-lockup">
              <p className="hero-slogan">
                <strong>{siteProfile.slogan.lead}</strong>{" "}
                <em>{siteProfile.slogan.aside}</em>
              </p>
              <h1>{siteProfile.name}</h1>
            </div>
            <p className="hero-affiliation">
              {siteProfile.position.title} in {siteProfile.position.detail}
              <span aria-hidden="true"> · </span>
              {siteProfile.institution.name}
            </p>
            <p className="hero-research-title">
              <span>{siteProfile.researchTitle.lead}</span>{" "}
              <span>{siteProfile.researchTitle.tail}</span>
            </p>
            <p
              className="hero-research-statement"
              aria-label={heroResearchPhrases
                .map((phrase) => `${heroResearchLead} ${phrase}`)
                .join(" ")}
            >
              <span className="hero-research-lead" aria-hidden="true">
                {heroResearchLead}
              </span>
              <span className="hero-phrase-window" aria-hidden="true">
                <span data-phrases>{heroResearchPhrases[0]}</span>
              </span>
            </p>
            <div className="hero-actions" aria-label="Academic links">
              <a
                className="academic-link"
                href={siteProfile.links.scholar}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar <span aria-hidden="true">↗</span>
              </a>
              <a
                className="academic-link"
                href={siteProfile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <aside className="hero-profile" aria-label="Portrait">
            <PortraitToggle />
          </aside>
          <dl className="hero-facts">
            <div>
              <dt>Education</dt>
              <dd className="education-list">
                {siteProfile.education.map((entry) => (
                  <span key={entry.period}>
                    <b>{entry.institution}</b>
                    <small>
                      {entry.degree} ·{" "}
                      <time dateTime={entry.startDate}>{entry.period}</time>
                    </small>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd className="profile-emails">
                {siteProfile.emails.map((email) => (
                  <a key={email.address} href={`mailto:${email.address}`}>
                    {email.address}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{siteProfile.institution.location}</dd>
            </div>
          </dl>
        </section>

        <section className="research" id="research">
          <div className="section-shell">
            <ResearchNarrative />
          </div>
        </section>

        <section className="publications" id="publications">
          <div className="section-shell">
            <div className="publication-heading" data-reveal>
              <h2>Publications</h2>
            </div>

            <PublicationList works={publications} />
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner section-shell" data-reveal>
            <h2>Open to Research Collaborations</h2>
            <p>
              I welcome discussions on agent reasoning, process representation,
              and inference-time control.
            </p>
            <div className="contact-emails">
              {siteProfile.emails.map((email) => (
                <a key={email.address} href={`mailto:${email.address}`}>
                  <span>{email.label}</span>
                  <strong>{email.address}</strong>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
            <div className="social-links">
              <a
                href={siteProfile.links.scholar}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar
              </a>
              <a
                href={siteProfile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
          <footer className="section-shell">
            <span>© 2026 {siteProfile.name}</span>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}
