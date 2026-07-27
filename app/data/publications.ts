export type PaperFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  title: string;
  caption: string;
  source: string;
};

export type PublicationWork = {
  slug: string;
  year: string;
  status: string;
  area: string;
  title: string;
  authors: string;
  venue: string;
  summary: string;
  abstract: string;
  preview: {
    src: string;
    alt: string;
  };
  resources: {
    label: string;
    href: string;
  }[];
  figures: PaperFigure[];
};

export const publications = [
  {
    slug: "slimrag",
    year: "2025",
    status: "PREPRINT",
    area: "RAG",
    title: "SlimRAG: Retrieval without Graphs via Entity-Aware Context Selection",
    authors:
      "Jiale Zhang, Jiaxiang Chen, Zhucong Li, Jie Ding, Kui Zhao, Zenglin Xu, Xin Pang, Yinghui Xu",
    venue: "arXiv · 2025",
    summary:
      "SlimRAG replaces graph construction with entity-aware context selection, improving retrieval precision while reducing index and context overhead.",
    abstract:
      "SlimRAG is a lightweight, entity-aware retrieval framework that avoids graph construction. It builds a compact entity-to-chunk index, identifies query entities, and ranks the associated chunks by overlap and semantic relevance. Experiments on HotpotQA show competitive retrieval quality with lower redundancy, indexing cost, and context overhead than graph-based baselines.",
    preview: {
      src: "/paper-figures/slimrag/comparison.png",
      alt: "Complete comparison between graph-based retrieval and SlimRAG",
    },
    resources: [
      { label: "Paper", href: "https://arxiv.org/abs/2506.17288" },
      { label: "PDF", href: "https://arxiv.org/pdf/2506.17288" },
      {
        label: "Code",
        href: "https://github.com/continue-ai-company/SlimRAG",
      },
      { label: "DOI", href: "https://doi.org/10.48550/arXiv.2506.17288" },
    ],
    figures: [
      {
        src: "/paper-figures/slimrag/comparison.png",
        alt: "Comparison between graph-based retrieval and SlimRAG",
        width: 902,
        height: 770,
        label: "Figure 01",
        title: "Graph-based retrieval vs. SlimRAG",
        caption:
          "Graph-based methods construct and refine subgraphs, while SlimRAG retrieves context through a lightweight entity-to-chunk index.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/slimrag/pipeline.png",
        alt: "The indexing and retrieval phases of the SlimRAG pipeline",
        width: 1656,
        height: 606,
        label: "Figure 02",
        title: "Indexing and retrieval pipeline",
        caption:
          "Documents are split into chunks and indexed by salient entities; query entities then retrieve and rank the most relevant chunks.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/slimrag/index-efficiency.png",
        alt: "SlimRAG indexing cost and elapsed time as corpus size grows",
        width: 2363,
        height: 1485,
        label: "Figure 03",
        title: "Indexing efficiency",
        caption:
          "Index construction cost and elapsed time across corpus sizes for SlimRAG, LightRAG, and GraphRAG.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/slimrag/benchmark-radar.png",
        alt: "Radar comparison of SlimRAG and retrieval baselines on HotpotQA",
        width: 886,
        height: 685,
        label: "Figure 04",
        title: "HotpotQA comparison",
        caption:
          "A normalized comparison across retrieval quality, indexing time, and relative index token utilization.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/slimrag/main-results-table.png",
        alt: "Main HotpotQA comparison table for SlimRAG and retrieval baselines",
        width: 1766,
        height: 608,
        label: "Table 01",
        title: "Main retrieval results",
        caption:
          "SlimRAG achieves the strongest retrieval accuracy and the lowest relative index token utilization among the compared methods.",
        source: "Paper table",
      },
    ],
  },
  {
    slug: "chunkgraph",
    year: "2025",
    status: "CONFERENCE",
    area: "RAG / RETRIEVAL",
    title:
      "ChunkGraph: Relationship-Driven Retrieval Through Progressive Complete Graphs",
    authors: "Jiale Zhang, Kui Zhao, Hao Zhang, Fuzhe Zhang, Xu Liu",
    venue: "IEEE ICCC · 2025",
    summary:
      "ChunkGraph models relationships directly between document chunks, progressively discovering and pruning retrieval paths without entity extraction.",
    abstract:
      "ChunkGraph introduces a relationship-driven retrieval method that treats document chunks as nodes in a progressive complete graph. It adaptively discovers candidate relations, prunes the graph with Personalized PageRank, and constructs a compact set of query-relevant paths. The method is designed to preserve multi-hop evidence without the cost of entity extraction.",
    preview: {
      src: "/paper-figures/chunkgraph/workflow.png",
      alt: "Complete progressive graph refinement workflow in ChunkGraph",
    },
    resources: [
      {
        label: "DOI",
        href: "https://doi.org/10.1109/ICCC68654.2025.11438132",
      },
    ],
    figures: [
      {
        src: "/paper-figures/chunkgraph/workflow.png",
        alt: "ChunkGraph workflow from a complete graph to final context",
        width: 1462,
        height: 808,
        label: "Figure 01",
        title: "Progressive retrieval workflow",
        caption:
          "Complete graph initialization is followed by adaptive selection, relationship expansion, PPR pruning, and progressive relationship construction.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/chunkgraph/concept.svg",
        alt: "A detailed conceptual view of graph initialization, relationship discovery, and evidence-path pruning",
        width: 1600,
        height: 820,
        label: "Figure 02",
        title: "Relationship refinement, redrawn",
        caption:
          "A closer view of the transition from candidate relations to a compact, query-conditioned evidence path.",
        source: "Redrawn from the method description",
      },
      {
        src: "/paper-figures/chunkgraph/main-results-table.png",
        alt: "Main HotpotQA and Quality comparison table for ChunkGraph",
        width: 2759,
        height: 635,
        label: "Table 01",
        title: "Main retrieval results",
        caption:
          "The full ChunkGraph system balances retrieval quality with lower indexing time and fewer LLM calls than entity-graph baselines.",
        source: "Paper table",
      },
    ],
  },
  {
    slug: "ai2agent",
    year: "2025",
    status: "ACL DEMO",
    area: "AGENT SYSTEMS",
    title:
      "AI2Agent: An End-to-End Framework for Deploying AI Projects as Autonomous Agents",
    authors:
      "Jiaxiang Chen, Jingwei Shi, Lei Gan, Jiale Zhang, Qingyu Zhang, Dongqian Zhang, Xin Pang, Zhucong Li, Yinghui Xu",
    venue: "ACL System Demonstrations · 2025",
    summary:
      "AI2Agent turns AI projects into autonomous deployment agents through guideline-driven execution, adaptive debugging, and reusable deployment cases.",
    abstract:
      "AI2Agent is an end-to-end framework for turning AI projects into deployable autonomous agents. It executes deployment guidelines, diagnoses runtime failures, and retrieves prior cases to refine later actions. The system was evaluated across 30 AI projects spanning speech, image generation, and related deployment tasks.",
    preview: {
      src: "/paper-figures/ai2agent/paradigms.png",
      alt: "Complete comparison of DevOps, AutoDevOps, and AI2Agent",
    },
    resources: [
      {
        label: "Paper",
        href: "https://aclanthology.org/2025.acl-demo.51/",
      },
      {
        label: "PDF",
        href: "https://aclanthology.org/2025.acl-demo.51.pdf",
      },
      {
        label: "DOI",
        href: "https://doi.org/10.18653/v1/2025.acl-demo.51",
      },
    ],
    figures: [
      {
        src: "/paper-figures/ai2agent/overview.png",
        alt: "AI2Agent interface and autonomous agent packaging workflow",
        width: 2079,
        height: 2458,
        label: "Figure 01",
        title: "From project request to deployed agent",
        caption:
          "A user request initiates project search, guideline execution, automated deployment, debugging, and agent packaging.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/ai2agent/paradigms.png",
        alt: "Comparison between DevOps, AutoDevOps, and AI2Agent",
        width: 2947,
        height: 1704,
        label: "Figure 02",
        title: "Comparison of deployment paradigms",
        caption:
          "AI2Agent combines guideline-driven execution, self-adaptive debugging, and case accumulation in an end-to-end agent workflow.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/ai2agent/deployment-process.png",
        alt: "Screenshots of the AI2Agent local deployment process",
        width: 1124,
        height: 795,
        label: "Figure 03",
        title: "Local auto-deployment process",
        caption:
          "Execution follows predefined guidelines while the planning interface adapts to deployment conditions.",
        source: "Paper figure",
      },
      {
        src: "/paper-figures/ai2agent/evaluation.png",
        alt: "Comparison of manual deployment and AI2Agent",
        width: 965,
        height: 1043,
        label: "Figure 04",
        title: "Deployment evaluation",
        caption:
          "The paper compares average deployment time and success rate between manual deployment and AI2Agent.",
        source: "Paper figure",
      },
    ],
  },
] satisfies PublicationWork[];

export function getPublication(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
