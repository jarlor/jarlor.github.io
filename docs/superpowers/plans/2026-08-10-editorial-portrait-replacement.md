# Editorial Portrait Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's formal portrait with a cleaned, documentary-style 4:5 edit of the supplied canal-boat photograph while preserving identity and the existing portrait interaction.

**Architecture:** Generate one identity-preserving edited bitmap from the supplied photograph, validate it before integration, then reference it as a new explicit public asset. Keep the React component and frame behavior intact except for the asset path and a crop-position adjustment only if browser QA proves it necessary.

**Tech Stack:** OpenAI built-in image generation/editing, JPEG assets, Next.js Image, React, CSS, Node test runner, Next.js static export, browser QA.

## Global Constraints

- Preserve Jiale Zhang's identity, facial structure, expression, hairstyle, glasses, pose, and clothing construction.
- Preserve the canal, water reflections, warm environmental light, and the life jacket.
- Remove the two passengers at the left edge and reconstruct a plausible continuation of the boat and canal.
- Use a 4:5 upper-body composition with the face slightly above center.
- Correct the face's yellow cast, reduce low-light noise, recover highlights, and use restrained sharpening.
- Reduce the life jacket toward muted brick-red without changing its construction or markings.
- Avoid face reshaping, plastic skin, studio replacement, academic props, HDR contrast, cinematic teal-orange grading, fake rim lighting, text, and watermarks.
- Keep the existing portrait frame, GitHub-avatar toggle, caption, responsive sizing, and theme behavior.
- Work locally only; do not publish to GitHub Pages.

---

### Task 1: Generate and Validate the Edited Portrait

**Files:**
- Read: `/tmp/codex-remote-attachments/019f9da5-6de2-71f3-811f-b7dd3057585c/C78AD6C0-3ADC-4F96-BDCB-E7B0F45F29A6/1-Photo-1.jpg`
- Create: `tmp/portrait-edit/jiale-zhang-canal-source.png`
- Create: `public/jiale-zhang-canal.jpg`

**Interfaces:**
- Consumes: the attached source photograph and the editing constraints in `docs/superpowers/specs/2026-08-10-editorial-portrait-design.md`.
- Produces: `public/jiale-zhang-canal.jpg`, a 4:5 identity-preserving portrait ready for the existing Next.js Image frame.

- [ ] **Step 1: Generate one identity-preserving edit with the built-in image tool**

Use this prompt with the attached photograph as the edit target:

```text
Use case: identity-preserve
Asset type: academic homepage portrait
Primary request: Turn this candid canal-boat selfie into a restrained editorial portrait while preserving the real person and the real night-tour setting.
Input image: Image 1 is the edit target.
Scene/backdrop: Keep the night canal, water reflections, boat, and warm ambient lights. Remove only the two distracting passengers at the left edge and reconstruct a natural continuation of the boat and canal behind them.
Subject: Preserve Jiale Zhang's exact identity, facial proportions, expression, gaze, hairstyle, hairline, glasses, pose, body proportions, clothing construction, and visible jacket markings.
Composition/framing: Vertical 4:5 upper-body portrait. Place the face slightly above center with comfortable headroom and enough shoulder context. Do not crop the top of the hair or the glasses.
Lighting/mood: Natural documentary night photography. Correct the strong yellow cast on the face, recover highlights, reduce low-light noise, and apply restrained sharpness around the eyes and glasses.
Color palette: Keep warm environmental light and cool canal shadows. Reduce the life jacket's red-orange saturation and brightness toward muted brick-red without changing the jacket itself.
Constraints: Preserve realistic skin texture and the original photographic character. Use subtle natural depth separation only.
Avoid: face reshaping, beautification, skin smoothing, changed glasses, changed hair, changed clothing, removed life jacket, studio or office background, academic props, dramatic bokeh, HDR, teal-orange grading, artificial rim light, generated-looking water, logos, new text, and watermark.
```

- [ ] **Step 2: Inspect the generated image at original resolution**

Use `view_image` and reject the candidate if any of these checks fail:

```text
identity unchanged
glasses and hairline unchanged
both left-edge passengers absent without visible fill artifacts
night canal and water reflections still plausible
life jacket still the same object and markings remain plausible
skin texture remains photographic
composition has full hair and full glasses within a 4:5 frame
```

- [ ] **Step 3: Perform at most one targeted edit iteration if validation fails**

Repeat the original invariants and request only the failed correction. Do not combine unrelated visual changes in the iteration.

- [ ] **Step 4: Copy the selected image into the project and normalize it to 1536 × 1920 JPEG**

Copy the selected built-in output into `tmp/portrait-edit/jiale-zhang-canal-source.png`, then use ImageMagick's cover resize and centered extent to preserve proportions while producing an exact 4:5 frame:

```bash
magick tmp/portrait-edit/jiale-zhang-canal-source.png -resize '1536x1920^' -gravity center -extent 1536x1920 -sampling-factor 4:2:0 -quality 88 public/jiale-zhang-canal.jpg
```

- [ ] **Step 5: Verify the final asset metadata and visual output**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g format public/jiale-zhang-canal.jpg
```

Expected: width `1536`, height `1920`, format `jpeg`. Inspect `public/jiale-zhang-canal.jpg` with `view_image` after conversion.

---

### Task 2: Integrate the New Portrait with a Rendered-Output Regression Test

**Files:**
- Modify: `scripts/homepage-content.test.mjs`
- Modify: `app/components/PortraitToggle.tsx`
- Delete after successful integration: `public/jiale-zhang-dark.jpg`
- Test: `scripts/homepage-content.test.mjs`

**Interfaces:**
- Consumes: `public/jiale-zhang-canal.jpg` from Task 1.
- Produces: a rendered homepage whose primary portrait URL is `/jiale-zhang-canal.jpg` while the GitHub-avatar toggle remains present.

- [ ] **Step 1: Add a failing rendered-output test**

Add this test to `scripts/homepage-content.test.mjs`:

```js
test("homepage uses the canal portrait as its primary profile image", async () => {
  const html = await readHomepage();
  assert.match(html, /jiale-zhang-canal\.jpg/);
  assert.doesNotMatch(html, /jiale-zhang-dark\.jpg/);
  assert.match(html, /jarlor-github-avatar\.jpg/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
node --test scripts/homepage-content.test.mjs
```

Expected: FAIL because the built static output still references `jiale-zhang-dark.jpg`.

- [ ] **Step 3: Update the primary portrait path**

In `app/components/PortraitToggle.tsx`, change only:

```tsx
src="/jiale-zhang-dark.jpg"
```

to:

```tsx
src="/jiale-zhang-canal.jpg"
```

- [ ] **Step 4: Rebuild and run the focused test**

Run:

```bash
GITHUB_PAGES=true npm run build
node --test scripts/homepage-content.test.mjs
```

Expected: PASS for the new portrait assertion and all existing content assertions.

- [ ] **Step 5: Remove the retired portrait asset**

Delete `public/jiale-zhang-dark.jpg` only after the rendered output no longer references it. Confirm with:

```bash
rg -n "jiale-zhang-dark" app scripts out
```

Expected: no matches.

---

### Task 3: Browser QA, Final Verification, and Local Commit

**Files:**
- Modify only if required by QA: `app/globals.css`
- Verify: `public/jiale-zhang-canal.jpg`
- Verify: `app/components/PortraitToggle.tsx`
- Verify: `scripts/homepage-content.test.mjs`

**Interfaces:**
- Consumes: the integrated portrait and unchanged Hero layout.
- Produces: a locally committed, tested portrait replacement with desktop and mobile screenshots.

- [ ] **Step 1: Inspect the local page at desktop width in light and dark themes**

At `1440 × 1000`, verify:

```text
full hair and glasses remain visible
face sits slightly above frame center
left-edge background repair is not visible
portrait does not dominate the Hero
theme switch does not make the image clash with the surrounding palette
```

- [ ] **Step 2: Inspect the local page at 390 × 844 in light and dark themes**

Verify the same invariants and confirm there is no horizontal overflow. Save one desktop and one mobile screenshot under `tmp/portrait-edit/`.

- [ ] **Step 3: Adjust crop position only if the browser frame clips the subject**

If required, change only the primary image positioning rule in `app/globals.css` from its current value to the measured correction, then repeat desktop and mobile checks. Do not resize the surrounding Hero profile.

- [ ] **Step 4: Run the complete repository verification**

Run:

```bash
npm test
git diff --check
```

Expected: ESLint, Next.js production build, TypeScript, and all Node tests pass; `git diff --check` prints no output.

- [ ] **Step 5: Commit the local implementation**

Stage only the portrait asset, retired asset deletion, component reference, optional crop CSS, and regression test. Commit with:

```bash
git commit -m "feat: replace homepage portrait"
```

- [ ] **Step 6: Report the local preview without publishing**

Provide the LAN URL, screenshot paths, image-generation prompt, final asset path, test result, and commit hash. Explicitly state that GitHub Pages was not updated.
