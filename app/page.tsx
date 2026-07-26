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
      "I design AI-native workflows that support literature synthesis, question formulation, iterative investigation, and scientific decision-making across domains.",
    questions: [
      "Research agents",
      "Evidence-to-insight workflows",
    ],
  },
  {
    code: "MAS",
    title: "Multi-Agent Systems",
    description:
      "I study how specialized agents share context, divide work, and coordinate long-horizon reasoning in research and other knowledge-intensive settings.",
    questions: [
      "Agent coordination",
      "Collective reasoning",
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
    <main>
        <PageMotion />
        <div className="scroll-meter" aria-hidden="true" />

        <header className="site-header">
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#research">Research</a>
            <a href="#publications">Publications</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <a className="contact-link" href="#contact">
              Contact <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

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
              I build AI-native systems for{" "}
              <span className="typed-line" aria-live="polite">
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

        <aside className="hero-profile" aria-label="Current research focus">
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
                    <a href="mailto:jarlor@foxmail.com">jarlor@foxmail.com</a>
                    <a href="mailto:zhangjiale23@mails.ucas.ac.cn">
                      zhangjiale23@mails.ucas.ac.cn
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="hero-current-focus" data-research-mode="AI4S">
                <span>Current focus / AI for Science</span>
                <h2>AI-native research workflows</h2>
                <p>
                  Studying how agentic systems support evidence search,
                  synthesis, iterative analysis, and scientific
                  decision-making.
                </p>
                <a href="#research">
                  Research agenda <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>
        </aside>
      </section>

      <section className="research section-shell" id="research">
        <div className="section-label" data-reveal>
          <span>Research agenda</span>
          <span>研究方向</span>
        </div>

        <div className="research-intro">
          <h2 data-reveal>
            <span>AI as part of the</span>
            <em>scientific method.</em>
          </h2>
          <p data-reveal>
            My work explores how AI can organize evidence, coordinate inquiry,
            and participate in the research process itself—not as a model for
            one narrow scientific domain, but as infrastructure for research.
          </p>
        </div>

        <ResearchFieldSelector areas={researchAreas} />
      </section>

      <section className="publications" id="publications">
        <div className="section-shell">
          <div className="section-label section-label-dark" data-reveal>
            <span>Selected publications</span>
            <span>论文</span>
          </div>

          <div className="publication-heading" data-reveal>
            <h2>Publications.</h2>
            <p>Selected peer-reviewed papers and preprints.</p>
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

      <section className="about section-shell" id="about">
        <div className="section-label" data-reveal>
          <span>Profile</span>
          <span>个人简介</span>
        </div>

        <div className="about-layout">
          <aside className="profile-plate" data-reveal>
            <div className="portrait">
              <Image
                src="/jiale-zhang.jpg"
                alt="Portrait of Jiale Zhang"
                width={1086}
                height={1448}
                unoptimized
              />
            </div>
          </aside>

          <div className="about-copy" data-reveal>
            <div className="about-heading about-heading-simple">
              <h2>About.</h2>
            </div>
            <p className="about-lead">
              Known online as <em>Jarlor</em>, I care about research systems
              that are not only capable, but legible, maintainable, and useful
              over long horizons.
            </p>
            <div className="about-columns">
              <p>
                My current work centers on AI for Science at the level of
                research methodology: systems that augment how research is
                organized, conducted, and evaluated.
              </p>
              <p>
                I am especially interested in connecting evidence access,
                agentic coordination, and executable workflows into research
                systems that can improve through use.
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
                <span>2023—2026</span>
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
          <p className="eyebrow eyebrow-light">
            Open to research conversations
          </p>
          <h2>
            Questions are better
            <em> when shared.</em>
          </h2>
          <a
            className="email-link"
            href="mailto:jarlor@foxmail.com"
          >
            jarlor@foxmail.com
            <span aria-hidden="true">↗</span>
          </a>
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
          <span>Ethically aligned. Probably.</span>
        </footer>
        </section>
    </main>
  );
}
