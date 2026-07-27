import Image from "next/image";
import { PageMotion } from "./components/PageMotion";
import { PortraitToggle } from "./components/PortraitToggle";
import {
  ResearchFieldSelector,
  type ResearchArea,
} from "./components/ResearchFieldSelector";
import { ResearchTrace } from "./components/ResearchTrace";
import { ThemeToggle } from "./components/ThemeToggle";
import { PublicationList } from "./components/PublicationList";
import { publications } from "./data/publications";

const researchAreas: ResearchArea[] = [
  {
    code: "AI4S",
    title: "AI for Science",
    description:
      "I design research agents and workflow infrastructure that help formulate questions, assemble evidence, test intermediate claims, and carry inquiry forward.",
    questions: [
      "Research agents",
      "Workflow infrastructure",
      "Evidence synthesis & inquiry",
    ],
  },
  {
    code: "MAS",
    title: "Multi-Agent Systems",
    description:
      "I study how specialized agents divide work, share evidence, resolve disagreement, and coordinate long-horizon reasoning.",
    questions: [
      "Agent coordination",
      "Shared memory & critique",
      "Orchestration & observability",
    ],
  },
  {
    code: "IR",
    title: "RAG & Generative Retrieval",
    description:
      "I build retrieval systems that connect generative models to compact, attributable evidence through entity- and relationship-aware representations.",
    questions: [
      "Evidence-centered retrieval",
      "Grounded generation",
      "Generative retrieval",
    ],
  },
];

export default function Home() {
  return (
    <>
      <PageMotion />
      <div className="scroll-meter" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#publications">Publications</a>
          <a href="#research">Research</a>
          <a href="#about">About</a>
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
            <p className="hero-slogan hero-slogan-inline">
              Ethically aligned. <em>Probably.</em>
            </p>

            <h1 aria-label="Jiale Zhang">
              <span>Jiale</span>
              <span>Zhang.</span>
            </h1>

            <p className="hero-thesis">
              <span className="hero-thesis-prefix">
                I build AI-native systems for
              </span>{" "}
              <span className="typed-line">
                <span
                  data-phrases="scientific inquiry.|multi-agent collaboration.|evidence-grounded generation."
                >
                  scientific inquiry.
                </span>
              </span>
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#publications">
                Publications
                <span aria-hidden="true">↘</span>
              </a>
              <div className="hero-resource-links">
                <a
                  className="quiet-link"
                  href="https://scholar.google.com/citations?user=51ZzY0AAAAAJ&hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Scholar ↗
                </a>
                <a
                  className="quiet-link"
                  href="/jiale-zhang-academic-cv.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Academic CV ↗
                </a>
              </div>
            </div>
          </div>

          <aside className="hero-profile" aria-label="Academic profile">
            <div className="hero-focus-layout">
              <PortraitToggle />
              <dl className="hero-facts">
                <div>
                  <dt>Affiliation</dt>
                  <dd>Fudan University</dd>
                </div>
                <div>
                  <dt>Position</dt>
                  <dd>Ph.D. Candidate / Computer Science</dd>
                </div>
                <div>
                  <dt>Based in</dt>
                  <dd>Shanghai, China</dd>
                </div>
                <div className="hero-facts-email">
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:jarlor@foxmail.com">
                      <span>Personal</span>
                      jarlor@foxmail.com
                    </a>
                    <a href="mailto:jlzhang26@m.fudan.edu.cn">
                      <span>Academic</span>
                      jlzhang26@m.fudan.edu.cn
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="hero-current-focus" data-research-mode="AI4S">
                <span>Current focus / AI for Science</span>
                <h2>AI-Native Research</h2>
                <p>
                  I design agentic infrastructure that helps formulate
                  questions, organize evidence, and carry scientific
                  investigations forward.
                </p>
                <a href="#research">
                  Research agenda <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>
          </aside>
        </section>

        <section className="publications" id="publications">
          <div className="section-shell">
            <div className="section-label section-label-dark" data-reveal>
              <span>Research record</span>
              <span>01 / 04</span>
            </div>

            <div className="publication-heading" data-reveal>
              <h2>Publications.</h2>
              <p>Peer-reviewed papers and preprints.</p>
            </div>

            <PublicationList works={publications} />

            <a
              className="scholar-link"
              href="https://scholar.google.com/citations?user=51ZzY0AAAAAJ&hl=en"
              target="_blank"
              rel="noreferrer"
              data-reveal
            >
              View the complete record on Google Scholar
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="research section-shell" id="research">
          <div className="section-label" data-reveal>
            <span>Research agenda</span>
            <span>02 / 04</span>
          </div>

          <div className="research-composition">
            <div className="research-intro">
              <h2 data-reveal>
                <span>From Evidence</span>
                <em>to Systems for Discovery.</em>
              </h2>
              <p data-reveal>
                Retrieval grounds evidence. Agents coordinate reasoning.
                Together, they turn scientific inquiry into an inspectable,
                iterative system.
              </p>
            </div>

            <ResearchFieldSelector areas={researchAreas} />
          </div>
        </section>

        <section className="about section-shell" id="about">
          <div className="section-label" data-reveal>
            <span>Profile</span>
            <span>03 / 04</span>
          </div>

          <div className="about-layout">
            <aside className="profile-plate" data-reveal>
              <div className="portrait">
                <Image
                  src="/jiale-zhang-dark.jpg"
                  alt="Portrait of Jiale Zhang"
                  width={768}
                  height={1024}
                  unoptimized
                />
              </div>
            </aside>

            <div className="about-copy" data-reveal>
              <div className="about-heading about-heading-simple">
                <h2>About.</h2>
              </div>
              <p className="about-lead">
                My research examines how AI can participate in scientific
                inquiry while keeping <em>evidence</em>, reasoning, and
                responsibility visible.
              </p>
              <div className="about-columns">
                <p>
                  I approach AI for Science as a problem of research
                  methodology: supporting how questions are formed, evidence
                  is gathered, and investigations are iterated across domains.
                </p>
                <p>
                  My earlier work on retrieval and agent systems now informs a
                  broader agenda around transparent, evidence-aware research
                  workflows.
                </p>
              </div>

              <div className="education-list">
                <div>
                  <span>PRESENT</span>
                  <p>
                    <strong>Ph.D. Candidate in Computer Science</strong>
                    Fudan University · Shanghai
                  </p>
                </div>
                <div>
                  <span>2023-2026</span>
                  <p>
                    <strong>Master&apos;s in Computer Technology</strong>
                    University of Chinese Academy of Sciences · Shenyang
                    Institute of Computing Technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-grid" aria-hidden="true" />
          <div className="contact-inner section-shell" data-reveal>
            <p className="eyebrow eyebrow-light">Research & collaboration</p>
            <h2>
              Research conversations
              <em> are welcome.</em>
            </h2>
            <div className="contact-emails">
              <a className="email-link" href="mailto:jarlor@foxmail.com">
                <span className="email-kind">Personal</span>
                <span className="email-address">jarlor@foxmail.com</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="email-link"
                href="mailto:jlzhang26@m.fudan.edu.cn"
              >
                <span className="email-kind">Academic</span>
                <span className="email-address">
                  jlzhang26@m.fudan.edu.cn
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="social-links">
              <a
                href="https://scholar.google.com/citations?user=51ZzY0AAAAAJ&hl=en"
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar
              </a>
              <a
                href="https://github.com/jarlor"
                target="_blank"
                rel="noreferrer"
              >
                GitHub profile
              </a>
              <a
                href="/jiale-zhang-academic-cv.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Academic CV
              </a>
            </div>
          </div>
          <footer>
            <span>© 2026 Jiale Zhang</span>
            <span>Shanghai · China</span>
          </footer>
        </section>
      </main>
    </>
  );
}
