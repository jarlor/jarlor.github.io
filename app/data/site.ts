export const siteProfile = {
  name: "Jiale Zhang",
  firstName: "Jiale",
  lastName: "Zhang",
  siteUrl: "https://jarlor.github.io",
  researchTitle: {
    lead: "Long-Horizon",
    tail: "LLM Agents",
  },
  slogan: {
    lead: "Ethically aligned.",
    aside: "Probably.",
  },
  description:
    "Jiale Zhang studies long-horizon LLM-based agents, task-level process reconstruction from interaction traces, retrieval for task continuation, and prospective learning from recorded interactions.",
  position: {
    title: "Ph.D. Student",
    detail: "Computer Science",
  },
  institution: {
    name: "Fudan University",
    location: "Shanghai, China",
  },
  education: [
    {
      period: "2026-present",
      startDate: "2026-09",
      institution: "Fudan University",
      degree: "Ph.D. in Computer Science",
    },
    {
      period: "2023-2026",
      startDate: "2023",
      institution: "University of Chinese Academy of Sciences",
      degree: "M.S. in Computer Technology",
    },
  ],
  emails: [
    { label: "Academic", address: "jlzhang26@m.fudan.edu.cn" },
    { label: "Personal", address: "jarlor@foxmail.com" },
  ],
  links: {
    scholar:
      "https://scholar.google.com/citations?user=51ZzY0AAAAAJ&hl=en",
    github: "https://github.com/jarlor",
  },
} as const;
