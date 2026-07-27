import Image from "next/image";
import { PageMotion } from "./components/PageMotion";
import { PortraitToggle } from "./components/PortraitToggle";
import {
  ResearchFieldSelector,
  type ResearchArea,
} from "./components/ResearchFieldSelector";
import { ResearchTrace } from "./components/ResearchTrace";
import { ThemeToggle } from "./components/ThemeToggle";

const researchAreas: ResearchArea[] = [
  {
    code: "AI4S",
    title: "AI for Science",
    description:
      "I study research agents that help formulate questions, assemble evidence, test intermediate claims, and carry investigations forward across iterative scientific workflows.",
    questions: [
      "Research agents",
      "Evidence synthesis & inquiry",
    ],
  },
  {
    code: "MAS",
    title: "Multi-Agent Systems",
    description:
      "I study how specialized agents share evidence, divide work, resolve disagreement, and coordinate long-horizon reasoning in research and other knowledge-intensive settings.",
    questions: [
      "Agent coordination",
      "Shared memory & critique",
    ],
  },
  {
    code: "IR",
    title: "RAG & Generative Retrieval",
    description:
      "I build retrieval systems that connect generative models with structured, attributable evidence through entity- and relationship-aware representations.",
    questions: [
      "Grounded generation",
      "Generative retrieval",
    ],
  },
];

const selectedWorks = [
  {
    year: "2025",
    status: "PREPRINT",
    area: "RAG",
    title: "SlimRAG: Retrieval without Graphs via Entity-Aware Context Selection",
    authors:
      "Jiale Zhang, Jiaxiang Chen, Zhucong Li, Jie Ding, Kui Zhao, Zenglin Xu, Xin Pang, Yinghui Xu",
    venue: "arXiv · 2025",
    href: "https://arxiv.org/abs/2506.17288",
  },
  {
    year: "2025",
    status: "CONFERENCE",
    area: "RAG / RETRIEVAL",
    title:
      "ChunkGraph: Relationship-Driven Retrieval Through Progressive Complete Graphs",
    authors: "Jiale Zhang, Kui Zhao, Hao Zhang, Fuzhe Zhang, Xu Liu",
    venue: "IEEE ICCC · 2025",
    href: "https://doi.org/10.1109/ICCC68654.2025.11438132",
  },
  {
    year: "2025",
    status: "ACL DEMO",
    area: "AGENT SYSTEMS",
    title:
      "AI2Agent: An End-to-End Framework for Deploying AI Projects as Autonomous Agents",
    authors:
      "Jiaxiang Chen, Jingwei Shi, Lei Gan, Jiale Zhang, Qingyu Zhang, Dongqian Zhang, Xin Pang, Zhucong Li, Yinghui Xu",
    venue: "ACL System Demonstrations · 2025",
    href: "https://aclanthology.org/2025.acl-demo.51/",
  },
];

function Authors({ names }: { names: string }) {
  const parts = names.split("Jiale Zhang");

  return (
    <>
      {parts[0]}
      <strong className="self-author">Jiale Zhang</strong>
      {parts[1]}
    </>
  );
}

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
              <a
                className="quiet-link"
                href="https://scholar.google.com/citations?user=51ZzY0AAAAAJ&hl=en"
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar ↗
              </a>
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
                    <a href="mailto:zhangjiale23@mails.ucas.ac.cn">
                      <span>Academic</span>
                      zhangjiale23@mails.ucas.ac.cn
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="hero-current-focus" data-research-mode="AI4S">
                <span>Current focus / AI for Science</span>
                <h2>Reshaping scientific inquiry</h2>
                <p>
                  I build agentic systems that reshape how questions are
                  formed, evidence is organized, and investigations evolve.
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

            <div className="publication-list">
              {selectedWorks.map((work, index) => (
                <a
                  className="publication-row"
                  key={work.title}
                  href={work.href}
                  target="_blank"
                  rel="noreferrer"
                  data-research-mode={
                    work.area.includes("AGENT SYSTEMS") ? "MAS" : "RAG"
                  }
                >
                  <span className="publication-index">0{index + 1}</span>
                  <div className="publication-meta">
                    <span>{work.year}</span>
                    <span>{work.status}</span>
                    <span>{work.area}</span>
                  </div>
                  <div className="publication-main">
                    <h3>{work.title}</h3>
                    <p>
                      <Authors names={work.authors} />
                    </p>
                  </div>
                  <span className="publication-venue">{work.venue}</span>
                  <span className="publication-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>

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

          <div className="research-intro">
            <h2 data-reveal>
              <span>AI as part of the</span>
              <em>scientific method.</em>
            </h2>
            <p data-reveal>
              I study how AI systems can search, synthesize, and act on
              evidence across iterative research workflows. The goal is not to
              automate one scientific domain, but to build general
              infrastructure for inquiry.
            </p>
          </div>

          <ResearchFieldSelector areas={researchAreas} />
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
                href="mailto:zhangjiale23@mails.ucas.ac.cn"
              >
                <span className="email-kind">Academic</span>
                <span className="email-address">
                  zhangjiale23@mails.ucas.ac.cn
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
