# Jiale Zhang — Research Homepage

Academic homepage for Jiale Zhang, a computer science Ph.D. candidate at Fudan
University working on AI for Science, multi-agent systems, RAG, and generative
retrieval.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

The local site is available at `http://localhost:3000`.

## Validation

```bash
npm test
```

This runs linting and a production-compatible static export.

## Deployment

The site is hosted exclusively on GitHub Pages. Pushing to `main` triggers
`.github/workflows/pages.yml`, which builds the static export and publishes the
`out` directory.
