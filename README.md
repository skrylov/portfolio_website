# Portfolio website

Static personal product portfolio built with React, TypeScript, Vite, Tailwind CSS,
React Router, and Lucide React. This foundation contains routing placeholders only.
Visual design and content migration belong to subsequent issues.

## Setup

Use Node.js 24 LTS (also specified in `.nvmrc`) and its bundled npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/portfolio_website/`.
After cloning with an existing lockfile, `npm ci` provides a reproducible install.
Commit `package-lock.json` when dependencies change.

## Commands

| Command                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Start the local development server with hot reload            |
| `npm run lint`         | Run ESLint; warnings fail the check                           |
| `npm run typecheck`    | Check application and Vite configuration types                |
| `npm run format`       | Format source, configuration, and documentation with Prettier |
| `npm run format:check` | Check formatting without changing files                       |
| `npm run build`        | Check types and produce the static site in `dist/`            |
| `npm run preview`      | Serve the production build locally                            |

Run lint, typecheck, format:check, and build before opening a pull request.
The preview server is for local verification, not production hosting.

## Structure and conventions

```text
src/
  assets/       Images and other assets imported by the application
  components/   Shared UI, currently just the page layout
  content/      Future local portfolio content
  pages/        Homepage, case-study template, and not-found page
  App.tsx       Route definitions
  main.tsx      Application entry point and router
  styles.css    Tailwind import and minimal base styles
```

- Use TypeScript and functional React components. Strict type checking is enabled.
- Keep page-specific UI in `pages/`; extract shared components when reuse emerges.
- Use Tailwind utilities and Lucide icons. No component library is introduced.
- Keep future content in local files under `src/content/`. There is no runtime
  Notion connection, backend, database, authentication, or CMS.
- Import assets from `src/assets/` so Vite handles their production URLs. If a
  future asset needs to live in `public/`, reference it with `import.meta.env.BASE_URL`
  rather than a domain-root path.
- Prettier uses two spaces, single quotes, and no semicolons. ESLint checks
  TypeScript, React Hooks, and React Refresh conventions.

## Routes and GitHub Pages

The router supports `/` and `/work/:slug`, plus a catch-all not-found page.
Every slug currently renders the same diagnostic placeholder; `example` is only
a routing fixture. Real case studies and valid slugs will be added with content.

Vite's `base` is `/portfolio_website/`, matching this repository's GitHub Pages
project path. React Router uses `HashRouter`, keeping the route after `#`:

- Home: `/portfolio_website/`
- Case study: `/portfolio_website/#/work/example`

GitHub Pages has no SPA rewrite support. Hash routes allow direct navigation and
reloads because the server receives only `/portfolio_website/`. Bare paths such
as `/portfolio_website/work/example` are **not supported** on Pages. Hash URLs are
a deliberate simplicity tradeoff and may limit search indexing of individual
case studies. If clean URLs or per-page SEO become requirements, revisit routing
and static page generation in a separate issue.

If the repository is renamed or a custom domain is added, update `base` in
`vite.config.ts` (use `/` for a domain-root site), rebuild, and recheck asset URLs.

### Local route verification

```sh
npm run build
npm run preview
```

At the printed preview URL (normally `http://localhost:4173/portfolio_website/`):

1. Verify the homepage placeholder appears.
2. Follow “Open case-study placeholder”; confirm `Route slug: example` appears.
3. Reload that URL, then open `#/work/another-slug` directly in a new tab.
4. Use Home and browser back/forward to verify navigation.
5. Open `#/missing` to check the not-found page.

Deployment configuration and publishing belong to issue #4. No deployment workflow
or Pages settings are created here. The future deployment should publish `dist/`
after a successful build.

References: [Vite static deployment](https://vite.dev/guide/static-deploy),
[React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter),
and [Tailwind's Vite setup](https://tailwindcss.com/docs/installation/using-vite).
