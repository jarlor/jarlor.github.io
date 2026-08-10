# Editorial Portrait Replacement Design

## Goal

Replace the current formal Hero portrait with the supplied canal-boat photograph while preserving a credible, candid research-profile tone. The result should feel personal and documentary, but remain quiet enough to sit beside the homepage typography in both light and dark themes.

## Source and Output

- Edit target: the user-supplied `Photo 1.jpg`.
- Final aspect ratio: 4:5, matching the existing Hero portrait frame.
- Final project asset: a high-quality JPEG at approximately 1536 × 1920 pixels, with an optimized web derivative if required by the build.
- The existing GitHub-avatar toggle remains unchanged.

## Editing Direction

1. Keep Jiale Zhang's identity, facial structure, expression, hairstyle, glasses, pose, and clothing construction unchanged.
2. Reframe the image as an upper-body portrait with the face slightly above center and enough shoulder context to retain the candid quality.
3. Remove the two distracting passengers at the left edge and reconstruct a plausible continuation of the boat and canal background.
4. Preserve the night canal, water reflections, and warm environmental light so the photograph does not become a synthetic studio portrait.
5. Correct the strong yellow cast on the face, recover highlight detail, reduce low-light noise, and add restrained local sharpness around the eyes and glasses.
6. Reduce the life jacket's red-orange saturation and brightness toward a muted brick-red, while keeping it recognizably the same jacket.
7. Add subtle background separation through natural depth-of-field and tonal control, without artificial cutout edges or dramatic bokeh.

## Invariants and Avoid List

- Do not beautify, reshape, age, slim, or otherwise reinterpret the face or body.
- Do not change the glasses, hairline, gaze, expression, or skin texture beyond photographic cleanup.
- Do not remove the life jacket, replace the clothing, add academic props, or introduce logos and text.
- Do not convert the scene into a studio, office, laboratory, campus, or generic AI-generated background.
- Avoid HDR contrast, plastic skin, excessive sharpening, cinematic teal-orange grading, fake rim lighting, and visibly generated water or architecture.

## Homepage Integration

- Replace only the primary portrait asset consumed by `PortraitToggle`.
- Retain the existing 4:5 frame, click-to-switch behavior, caption, shadow, responsive sizing, and object-fit behavior.
- Adjust `object-position` only if the final crop requires a small alignment correction.
- Do not change surrounding Hero layout, typography, copy, or theme behavior.

## Validation

- Compare the edited output with the source at full resolution to confirm identity and scene invariants.
- Inspect the portrait inside the actual Hero at desktop and 390-pixel mobile widths in both light and dark themes.
- Confirm that the face and glasses remain fully visible, the portrait does not dominate the Hero, and no removed-person artifacts appear at the left edge.
- Run the repository's production test command after integration.

## Scope

This change is local-only until the user reviews the integrated result. It does not publish to GitHub Pages.
