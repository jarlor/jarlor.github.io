import { PageMotion } from "./components/PageMotion";
import { PortraitToggle } from "./components/PortraitToggle";
import { ResearchFieldSelector } from "./components/ResearchFieldSelector";
import { ResearchTrace } from "./components/ResearchTrace";
import { ThemeToggle } from "./components/ThemeToggle";
import { PublicationList } from "./components/PublicationList";
import { publications } from "./data/publications";
import {
  defaultResearchThemeId,
  researchThemes,
  researchThemesById,
} from "./data/research";
import { siteProfile } from "./data/site";

const defaultResearchTheme = researchThemesById[defaultResearchThemeId];

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
          <a href="#research">Research</a>
          <a href="#publications">Publications</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="contact-link" href="#contact">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <ResearchTrace />
          <div className="hero-main">
            <div className="hero-name-lockup">
              <p className="hero-slogan">
                <strong>{siteProfile.slogan.lead}</strong>{" "}
                <em>{siteProfile.slogan.aside}</em>
              </p>
              <h1 aria-label={siteProfile.name}>
                <span className="hero-name-given" aria-hidden="true">
                  {siteProfile.firstName}
                </span>
                <span className="hero-name-family" aria-hidden="true">
                  {siteProfile.lastName}
                </span>
              </h1>
            </div>
            <p className="hero-research-title">
              <span>{siteProfile.researchTitle.lead}</span>{" "}
              <span>{siteProfile.researchTitle.tail}</span>
            </p>
            <p
              className="hero-thesis"
              aria-label={researchThemes
                .map((theme) => theme.heroPhrase)
                .join(" ")}
            >
              <span className="hero-phrase-window" aria-hidden="true">
                <span data-phrases>
                  {defaultResearchTheme.heroPhrase}
                </span>
              </span>
            </p>
            <div
              className="hero-research-sequence"
              aria-label="Research progression"
            >
              {researchThemes.map((theme) => (
                <button
                  className={
                    theme.id === defaultResearchThemeId
                      ? "is-active"
                      : undefined
                  }
                  type="button"
                  key={theme.id}
                  data-hero-theme={theme.id}
                  aria-pressed={theme.id === defaultResearchThemeId}
                >
                  {theme.heroStage}
                </button>
              ))}
            </div>
            <div className="hero-actions" aria-label="Academic links">
              <a
                className="primary-button"
                href={siteProfile.links.scholar}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar <span aria-hidden="true">↗</span>
              </a>
              <a
                className="quiet-link"
                href={siteProfile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <aside className="hero-profile" aria-label="Academic profile">
            <PortraitToggle />
            <dl className="hero-facts">
              <div>
                <dt>Status</dt>
                <dd>
                  <strong>{siteProfile.position.title}</strong>
                  <span>{siteProfile.position.detail}</span>
                </dd>
              </div>
              <div>
                <dt>Institution</dt>
                <dd>
                  <strong>{siteProfile.institution.name}</strong>
                  <span>{siteProfile.institution.location}</span>
                </dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd className="education-list">
                  {siteProfile.education.map((entry) => (
                    <span key={entry.period}>
                      <time dateTime={entry.startDate}>{entry.period}</time>
                      <b>{entry.institution}</b>
                      <small>{entry.degree}</small>
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
            </dl>
          </aside>
        </section>

        <section className="research" id="research">
          <div className="section-shell">
            <div className="research-intro" data-reveal>
              <h2>Representing Long-Horizon Agent Interaction</h2>
              <p>
                Long scientific workflows outgrow a single context. I study how
                their traces can support reconstruction, continuation, and
                later learning.
              </p>
            </div>
            <ResearchFieldSelector />
          </div>
        </section>

        <section className="publications" id="publications">
          <div className="section-shell">
            <div className="publication-heading" data-reveal>
              <h2>Publications</h2>
              <p>
                Previous work in retrieval and agent systems informs this
                research agenda.
              </p>
            </div>

            <PublicationList works={publications} />

            <a
              className="scholar-link"
              href={siteProfile.links.scholar}
              target="_blank"
              rel="noreferrer"
              data-reveal
            >
              Complete record on Google Scholar
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner section-shell" data-reveal>
            <h2>Open to Research Collaborations</h2>
            <p>
              I welcome discussions on long-horizon agents, process
              representation, and scientific workflows.
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
