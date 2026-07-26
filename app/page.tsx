import Image from "next/image";
import { PageMotion } from "./components/PageMotion";
import { ResearchTrace } from "./components/ResearchTrace";

const researchAreas = [
  {
    code: "MAS",
    title: "Multi-Agent Systems",
    description:
      "I study how multiple intelligent agents communicate, coordinate, and reason together, especially when no single agent has the complete context or capability.",
    questions: [
      "Coordination & communication",
      "Collective reasoning",
      "Agent learning & evaluation",
    ],
  },
  {
    code: "AI4S",
    title: "AI for Science",
    description:
      "My interest is not tied to one scientific domain. I explore AI as a new layer in the research process: helping formulate questions, connect evidence, run inquiry, and reshape how discovery is organized.",
    questions: [
      "AI-native research workflows",
      "Human-agent collaboration",
      "Scientific discovery systems",
    ],
  },
  {
    code: "IR",
    title: "RAG & Generative Retrieval",
    description:
      "I work on systems that retrieve, generate, and ground knowledge, connecting foundation models with external evidence through RAG and generative retrieval.",
    questions: [
      "Retrieval-augmented generation",
      "Generative retrieval",
      "Knowledge-intensive systems",
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
    authors: "Jiale Zhang, Kui Zhao, H. Zhang, F. Zhang, X. Liu",
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
      "Jiaxiang Chen, Jingwei Shi, Lei Gan, Jiale Zhang, Qingyu Zhang, et al.",
    venue: "ACL System Demonstrations · 2025",
    href: "https://aclanthology.org/2025.acl-demo.51/",
  },
];

export default function Home() {
  return (
    <main>
      <PageMotion />
      <div className="scroll-meter" aria-hidden="true" />

      <header className="site-header">
        <a className="identity" href="#top" aria-label="Back to top">
          <span className="identity-mark">JZ</span>
          <span>
            JIALE ZHANG
            <small>JARLOR · AI RESEARCH</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#research">Research</a>
          <a href="#publications">Publications</a>
          <a href="#about">About</a>
        </nav>

        <a className="contact-link" href="#contact">
          Contact <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <ResearchTrace />
        <div className="hero-main">
          <p className="eyebrow">
            Ph.D. Student in Computer Science / Fudan University
          </p>

          <h1 aria-label="Jiale Zhang">
            <span>Jiale</span>
            <span>Zhang.</span>
          </h1>

          <p className="hero-thesis">
            I study{" "}
            <span className="typed-line" aria-live="polite">
              <span
                data-phrases="multi-agent systems.|AI-enabled research paradigms.|RAG and generative retrieval."
              >
                multi-agent systems.
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

        <aside className="hero-profile" aria-label="Profile at a glance">
          <div className="hero-profile-core">
            <div className="hero-profile-head">
              <Image
                src="/jiale-zhang.jpg"
                alt="Jarlor, Jiale Zhang's illustrated GitHub avatar"
                width={54}
                height={54}
                priority
              />
              <div>
                <strong>Jiale Zhang</strong>
                <span>Jarlor online</span>
              </div>
            </div>

            <p className="hero-profile-intro">
              I build AI systems that coordinate, retrieve evidence, and support
              the general process of scientific inquiry.
            </p>

            <dl>
              <div>
                <dt>Position</dt>
                <dd>Ph.D. Student</dd>
              </div>
              <div>
                <dt>Affiliation</dt>
                <dd>Fudan University</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>Shanghai, China</dd>
              </div>
            </dl>

            <div className="hero-profile-group">
              <span>Research focus</span>
              <p>Multi-Agent Systems</p>
              <p>AI for Science</p>
              <p>RAG &amp; Generative Retrieval</p>
            </div>

            <div className="hero-profile-group hero-profile-work">
              <span>Recent work</span>
              <a
                href="https://arxiv.org/abs/2506.17288"
                target="_blank"
                rel="noreferrer"
              >
                SlimRAG <b>2025 ↗</b>
              </a>
              <a
                href="https://aclanthology.org/2025.acl-demo.51/"
                target="_blank"
                rel="noreferrer"
              >
                AI2Agent <b>ACL 2025 ↗</b>
              </a>
            </div>

            <a
              className="hero-profile-link"
              href="https://github.com/jarlor"
              target="_blank"
              rel="noreferrer"
            >
              github.com/jarlor <span aria-hidden="true">↗</span>
            </a>
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
            From individual models to
            <em> connected research systems.</em>
          </h2>
          <p data-reveal>
            Three strands of work, joined by one systems view: intelligence
            becomes more useful when it can coordinate, access knowledge, and
            participate in the process of discovery.
          </p>
        </div>

        <div className="research-grid">
          {researchAreas.map((area, index) => (
            <article className="research-card" key={area.code} data-reveal>
              <header>
                <span className="area-number">0{index + 1}</span>
                <span className="area-code">{area.code}</span>
              </header>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <ul>
                {area.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside className="position-note" data-reveal>
          <span className="position-note-label">A note on AI4S</span>
          <p>
            Here, “AI for Science” means using AI to transform the general
            methodology and infrastructure of research, not specializing in a
            single downstream field such as computational chemistry.
          </p>
        </aside>
      </section>

      <section className="publications" id="publications">
        <div className="section-shell">
          <div className="section-label section-label-dark" data-reveal>
            <span>Selected publications</span>
            <span>论文与项目</span>
          </div>

          <div className="publication-heading" data-reveal>
            <h2>Research, recorded.</h2>
            <p>
              Papers, preprints, and working systems across retrieval and
              autonomous agents.
            </p>
          </div>

          <div className="publication-list">
            {selectedWorks.map((work, index) => (
              <a
                className="publication-row"
                key={work.title}
                href={work.href}
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <span className="publication-index">0{index + 1}</span>
                <div className="publication-meta">
                  <span>{work.year}</span>
                  <span>{work.status}</span>
                  <span>{work.area}</span>
                </div>
                <div className="publication-main">
                  <h3>{work.title}</h3>
                  <p>{work.authors}</p>
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
                alt="Jarlor, Jiale Zhang's illustrated GitHub avatar"
                width={460}
                height={460}
              />
              <span>JARLOR / GITHUB IDENTITY</span>
            </div>
            <dl>
              <div>
                <dt>BASE</dt>
                <dd>Shanghai, China</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd>Ph.D. Student</dd>
              </div>
              <div>
                <dt>FIELD</dt>
                <dd>Computer Science / AI</dd>
              </div>
            </dl>
          </aside>

          <div className="about-copy" data-reveal>
            <p className="about-lead">
              I&apos;m <em>Jiale Zhang</em>, Jarlor online, a doctoral researcher
              at Fudan University studying how AI systems collaborate, connect
              to knowledge, and become part of the scientific process.
            </p>
            <div className="about-columns">
              <p>
                My recent work spans entity-aware and relationship-driven
                retrieval, as well as agent frameworks that turn AI projects
                into more autonomous systems.
              </p>
              <p>
                Across these projects, I&apos;m interested in systems that can
                organize evidence, coordinate complex work, and make scientific
                inquiry more capable, not just automate one narrow domain.
              </p>
            </div>

            <div className="timeline">
              <div>
                <span>PRESENT</span>
                <p>
                  <strong>Ph.D. in Computer Science</strong>
                  Fudan University · Shanghai
                </p>
              </div>
              <div>
                <span>PREVIOUS</span>
                <p>
                  <strong>Earlier public affiliation</strong>
                  University of Chinese Academy of Sciences
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
            href="https://github.com/jarlor"
            target="_blank"
            rel="noreferrer"
          >
            github.com/jarlor
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
              GitHub
            </a>
            <a
              href="https://arxiv.org/abs/2506.17288"
              target="_blank"
              rel="noreferrer"
            >
              arXiv
            </a>
          </div>
        </div>
        <footer>
          <span>© 2026 Jiale Zhang</span>
          <span>Fudan University · Shanghai</span>
        </footer>
      </section>
    </main>
  );
}
