import { ResearchSystem } from "./components/ResearchSystem";

const researchAreas = [
  {
    code: "MAS",
    title: "Multi-Agent Systems",
    description:
      "I study how multiple intelligent agents communicate, coordinate, and reason together—especially when no single agent has the complete context or capability.",
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
      "Human–agent collaboration",
      "Scientific discovery systems",
    ],
  },
  {
    code: "IR",
    title: "RAG & Generative Retrieval",
    description:
      "I work on systems that retrieve, generate, and ground knowledge—connecting foundation models with external evidence through RAG and generative retrieval.",
    questions: [
      "Retrieval-augmented generation",
      "Generative retrieval",
      "Knowledge-intensive systems",
    ],
  },
];

const workPlaceholders = [
  {
    year: "2026",
    status: "MANUSCRIPT",
    area: "MULTI-AGENT SYSTEMS",
    title: "Your primary paper title goes here",
    authors: "Your Name, Collaborator A, Collaborator B",
    venue: "Conference / Journal",
  },
  {
    year: "2025",
    status: "CONFERENCE",
    area: "AI FOR SCIENCE",
    title: "A paper on AI-native scientific research",
    authors: "Your Name, Collaborator A",
    venue: "Conference · Oral / Spotlight",
  },
  {
    year: "2025",
    status: "PREPRINT",
    area: "GENERATIVE RETRIEVAL",
    title: "A project connecting generation and retrieval",
    authors: "Collaborator A, Your Name, Collaborator B",
    venue: "arXiv preprint",
  },
];

export default function Home() {
  return (
    <main>
      <div className="scroll-meter" aria-hidden="true" />

      <header className="site-header">
        <a className="identity" href="#top" aria-label="Back to top">
          <span className="identity-mark">YN</span>
          <span>
            YOUR NAME
            <small>FUDAN UNIVERSITY</small>
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
        <div className="hero-main">
          <p className="eyebrow">
            <span className="status-dot" />
            Ph.D. Student in Computer Science · Fudan University
          </p>

          <h1>
            Intelligence,
            <span>in systems.</span>
          </h1>

          <p className="hero-thesis">
            I build AI systems that{" "}
            <span className="typed-line" aria-live="polite">
              <span
                data-phrases="reason and coordinate across agents.|turn AI into infrastructure for scientific discovery.|retrieve, generate, and ground knowledge."
              >
                reason and coordinate across agents.
              </span>
            </span>
          </p>

          <p className="hero-summary">
            My research connects multi-agent intelligence, AI-enabled scientific
            research, and retrieval. The common question is how to turn
            foundation models into systems that can work with others, use
            evidence, and support open-ended inquiry.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#research">
              View research
              <span aria-hidden="true">↓</span>
            </a>
            <a className="quiet-link" href="#publications">
              Selected publications
            </a>
          </div>
        </div>

        <ResearchSystem />

        <div className="hero-register" aria-hidden="true">
          <span>RESEARCH PROFILE / 2026</span>
          <span />
          <span>31.2304° N · 121.4737° E</span>
        </div>
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
            methodology and infrastructure of research—not specializing in a
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
              Papers, preprints, and working systems. Replace the sample rows
              below with your publication list.
            </p>
          </div>

          <div className="publication-list">
            {workPlaceholders.map((work, index) => (
              <article
                className="publication-row"
                key={work.title}
                tabIndex={0}
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
              </article>
            ))}
          </div>

          <p className="sample-note" data-reveal>
            <span>NOTE</span>
            Sample copy is deliberately marked. Add your Scholar profile or
            BibTeX to turn this into your actual publication record.
          </p>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-label" data-reveal>
          <span>Profile</span>
          <span>个人简介</span>
        </div>

        <div className="about-layout">
          <aside className="profile-plate" data-reveal>
            <div className="portrait-placeholder">
              <span>PORTRAIT</span>
              <small>Replace with a monochrome research portrait</small>
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
              I am a doctoral researcher at <em>Fudan University</em>. I study
              how AI systems collaborate, connect to knowledge, and become part
              of the scientific process.
            </p>
            <div className="about-columns">
              <p>
                Add the path that brought you here: your previous training,
                research groups, and the questions that led you to multi-agent
                systems, AI4S, and retrieval.
              </p>
              <p>
                Add one human detail outside research. A serious academic page
                can still show the person behind the work—what you read, build,
                photograph, or care about.
              </p>
            </div>

            <div className="timeline">
              <div>
                <span>2024 — PRESENT</span>
                <p>
                  <strong>Ph.D. in Computer Science</strong>
                  Fudan University · Shanghai
                </p>
              </div>
              <div>
                <span>PREVIOUS</span>
                <p>
                  <strong>Your previous chapter</strong>
                  University, lab, or research team
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
            <span className="status-dot" />
            Open to research conversations
          </p>
          <h2>
            Questions are better
            <em> when shared.</em>
          </h2>
          <a className="email-link" href="mailto:your.email@fudan.edu.cn">
            your.email@fudan.edu.cn
            <span aria-hidden="true">↗</span>
          </a>
          <div className="social-links">
            <a href="#contact" aria-label="Add Google Scholar link">
              Google Scholar
            </a>
            <a href="#contact" aria-label="Add GitHub link">
              GitHub
            </a>
            <a href="#contact" aria-label="Add ORCID link">
              ORCID
            </a>
            <a href="#contact" aria-label="Add CV link">
              Curriculum Vitae
            </a>
          </div>
        </div>
        <footer>
          <span>© 2026 Your Name</span>
          <span>Fudan University · Shanghai</span>
        </footer>
      </section>
    </main>
  );
}
