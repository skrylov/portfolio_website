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

## CI and deployment

Production URL: [skrylov.github.io/portfolio_website](https://skrylov.github.io/portfolio_website/).
This is the intended live address; it becomes available after Pages is enabled
and the first deployment succeeds. A case-study link uses
`https://skrylov.github.io/portfolio_website/#/work/example`.

The [CI and Pages workflow](.github/workflows/ci-pages.yml) runs on pull requests
targeting `main` and pushes to `main`. Its **Check and build** job uses Node.js 24
from `.nvmrc`, restores npm's download cache, installs the lockfile with `npm ci`,
then runs ESLint, TypeScript, Prettier, and the production build. A failed step
fails the job and prevents deployment.

On `main`, the successful build uploads only `dist/` with the official
`actions/upload-pages-artifact` action. A separate deployment job uses
`actions/configure-pages` and `actions/deploy-pages` to publish that artifact to
the `github-pages` environment. Pull requests do not upload a Pages artifact or
deploy a preview. Deployments run one at a time without cancelling an active
deployment. You can also run the workflow manually from the Actions tab; select
`main` to deploy. Other manually selected branches run checks only.

The build token has only `contents: read`; checkout does not retain credentials.
Only the deployment job gets `pages: write` and `id-token: write`. No personal
access token or repository secret is needed. Official actions are pinned to
commit SHAs with release comments; update the SHA and comment together when
upgrading an action.

### One-time repository setup

A repository administrator must configure these settings before the first
deployment:

1. Open [Settings → Pages](https://github.com/skrylov/portfolio_website/settings/pages).
   Under **Build and deployment → Source**, select **GitHub Actions**. Leave the
   custom domain empty for the URL above. Do not choose a publishing branch.
2. Under **Settings → Actions → General**, ensure Actions is enabled and the
   repository's action policy permits the official `actions/*` actions used by
   this workflow. The default workflow token can remain read-only; the workflow
   grants the deployment permissions explicitly.
3. Under **Settings → Environments**, check the `github-pages` environment when
   it exists (GitHub may create it on the first deployment). If deployment branch
   restrictions are configured, allow `main`. Required reviewers will make
   deployment wait for approval; leave them unset if unattended deployment is
   desired.
4. After merging this workflow, open **Actions → CI and Pages** and check the
   `main` run. If Pages was enabled after a failed deployment, rerun the failed
   jobs or use **Run workflow** with branch `main`.

To enforce CI before merging, optionally add a `main` branch ruleset requiring
the **Check and build** status check after its first run. The workflow reports
failures but does not itself configure branch protection.

### Deployment verification and troubleshooting

After a successful deployment, use its environment URL to open the homepage,
follow the case-study link, open that hash URL directly, and reload it. In the
browser's Network panel, confirm the JS and CSS requests under
`/portfolio_website/assets/` return successfully. The current placeholders have
no image assets; verify image requests when images are introduced.

- **Pages setup or permission error:** confirm the Pages source is GitHub Actions
  and that repository or organization policy allows the job's explicit Pages
  and OIDC token permissions. Do not add a personal token as a workaround.
- **Deployment waiting:** inspect the `github-pages` environment for required
  approval or a branch rule that excludes `main`.
- **404 before the first deployment:** enable Pages and wait for a successful
  `main` deployment. A green PR check alone does not publish the site.
- **Blank page or missing assets:** keep Vite's `base: '/portfolio_website/'`,
  publish `dist/`, and inspect the built `dist/index.html` asset URLs. Rebuild
  after any base-path change.
- **Case-study 404 on reload:** use `/#/work/<slug>` after the repository path,
  not `/work/<slug>`. HashRouter remains the accepted MVP routing approach.
- **CI failure:** inspect the failing Actions step and run the same npm command
  locally with Node.js 24 and dependencies installed with `npm ci`.

References: [Vite static deployment](https://vite.dev/guide/static-deploy),
[React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter),
and [Tailwind's Vite setup](https://tailwindcss.com/docs/installation/using-vite).
Deployment follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
