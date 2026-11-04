# Homepage hero and metrics — issue #8

The homepage now renders only the original hero and four key metrics. Source
selection comes from `homepage.json`; `homepageContent.ts` reads the existing raw
Markdown through Vite, extracts the known hero and callout structures, and resolves
the portrait by its stable source identity in `media.json`. Missing sections,
portrait data or an incorrect number of metrics fail explicitly.

`InlineContent` renders only bold emphasis, ordinary Markdown links and the literal
escaped tilde used by these two files. It uses React nodes rather than injected
HTML. It is deliberately not a general Markdown/Notion or case-study renderer.
Source copy, metadata and media mappings remain unchanged.

The desktop composition uses a wider reading column and a supporting portrait.
At narrow widths it stacks text then the original uncropped portrait. The metrics
use a restrained two-column grid and collapse to one column on mobile. Existing
tokens and Card/Section primitives supply colors, surfaces and spacing. There is
no new animation, photo overlay or image transformation.

Selected Work navigation temporarily becomes Key metrics. Contact still targets
the existing shared footer, not a new contact section. The footer's temporary
Design preview qualifier is removed. All route definitions, HashRouter and Pages
deployment are unchanged. No later homepage sections are rendered.

## Verification

Production preview inspected at 1440×1000, 768×1024, 390×844 and 375×812, with no
horizontal overflow. The portrait renders at its original 1117×1365 aspect ratio
without cropping. Metrics share equal row heights on desktop; mobile cards grow
with their descriptions instead of using fixed heights. All source qualifications
and emphasis are preserved; escaped Markdown tildes display as literal tildes.

Home, Key metrics and Contact navigation were exercised in the browser. Email,
LinkedIn and CV hrefs match the source links; external destinations were not
authenticated into or modified. No duplicate application section IDs were found.
The portrait URL begins `/portfolio_website/assets/content/`, and screenshots are
saved as `screenshots/hero-desktop.jpg` and `screenshots/hero-mobile.jpg`.

Lint, TypeScript, formatting, content/media verification, production build and
byte-identical production media checks passed. No intentional content deviation
or new design direction is introduced. The system preview headline and samples
are removed; the approved portfolio headline and source copy now occupy the home
route. The original cover, later sections and case-study renderer remain out of scope.
