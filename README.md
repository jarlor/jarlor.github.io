# Jiale Zhang - Research Homepage

Academic homepage for Jiale Zhang, a Ph.D. student in Computer Science at
Fudan University. The site presents research on process representation and
inference-time control in long-horizon LLM agents, alongside publications in
retrieval and agent systems.

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
