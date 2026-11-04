# Visual foundation — issue #7

The home route is explicitly a component preview, not finished portfolio content.
The case-study and unknown routes exercise the same shell. No migrated copy,
metadata, media mapping, routing architecture or deployment configuration changes.

`src/styles.css` defines Tailwind v4 theme tokens for the six approved colors,
supporting border/focus colors, a system sans-serif stack, fluid display type,
section spacing and card radius. Components consume these tokens; future pages
can also use Tailwind utilities such as `bg-canvas`, `text-muted`, `bg-accent` and
`rounded-card`. Typography uses one font stack, fluid display/section headings,
1.125rem body copy, 0.875rem metadata and a 65ch article measure. No font download
or additional dependency is required.

Container, Section, Card, SectionHeading, PageHeader, Button and ButtonLink are
small composition primitives. Use Button for actions and ButtonLink for internal
navigation. The preview demonstrates primary, outlined, disabled and text actions.
SiteHeader and SiteFooter retain Notion-sourced email, LinkedIn and CV URLs.
Selected work and Contact use router-aware fragment navigation, preserving the
HashRouter prefix and restoring focus after scrolling. The main-content skip link
focuses the main landmark without replacing the router hash.

The header uses always-visible navigation that wraps below the identity on narrow
screens. This deliberately avoids a hidden mobile menu for four links. Two-column
samples collapse below 48rem. Sections share fluid vertical spacing; separators
and card borders are restrained and the blue accent is confined to primary actions.
Transitions affect only button colors and are disabled for reduced motion. There
is no smooth scrolling, animation, parallax or autoplay.

Both the approved Notion direction and Iris Vale visual reference were reviewed.
The reference's oversized hierarchy and whitespace inform this preview; its light
background, serif display font, green accent, content and page composition are not
copied. A system sans serif is the intentional MVP font choice, consistent with
the approved direction's unfinalized typography. Existing imagery remains untouched.

Review desktop, tablet and mobile widths, Tab/Shift+Tab order, skip link, fragment
navigation, case-study reload, missing routes, hover/focus and reduced motion.
Run lint, typecheck, format:check, verify:content, verify:media and build before PR.

## Review evidence

All repository checks passed, including byte-identical production media checks.
Production preview was inspected at 1440×1000, 768×1024 and 390×844. Desktop and
mobile full-page captures are in `screenshots/`. Keyboard Tab focus and Enter on
the skip link were checked; fragment navigation moves focus to its section. The
case-study route survives reload under `/portfolio_website/`; the missing route
shows the same shell. No horizontal overflow was observed at the reviewed widths.

Calculated contrast ratios: primary text/canvas 16.88:1, secondary text/canvas
8.08:1, secondary text/card 7.28:1, white/primary button 9.35:1 and white/hover
button 4.99:1. All exceed 4.5:1. Reduced-motion behavior was checked by reviewing
the media rule that removes the only transition; the preference was not emulated
in the browser. No other motion is present.
