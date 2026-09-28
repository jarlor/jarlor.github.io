export function ResearchNarrative() {
  return (
    <div className="research-statement" data-reveal>
      <h2>Research</h2>
      <p className="research-lead">
        My current research connects <strong>process representation</strong> with{" "}
        <strong>inference-time control</strong> in{" "}
        <span className="research-term">long-horizon</span> LLM agents.
      </p>
      <p>
        I study how agents can use evidence from their execution history to decide
        when to <strong>continue, narrow, or revisit</strong> a line of work, and
        evaluate whether these interventions lead to sustained progress.
        Scientific research is my primary setting.
      </p>
    </div>
  );
}
