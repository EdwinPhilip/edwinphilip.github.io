# Edwin Philip — Knowledge Base

Personal portfolio and public engineering guides powered by [VitePress](https://vitepress.dev/).

## Local development

Requires Node.js 20+.

```bash
npm install
npm run docs:dev
```

## Build

```bash
npm run docs:build
npm run docs:preview
```

## Publish to GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Source: GitHub Actions**.
3. Open the **Actions** tab and run **Deploy VitePress to GitHub Pages** if it has not started automatically.
4. After a successful deployment, visit **https://edwinphilip.github.io/**.

The VitePress config sets `base: '/'` for the GitHub Pages user site.

## Migration to the root URL

1. Review this PR and verify the PR build passes.
2. Rename this repository in **Settings → General** from `knowledge-base` to `EdwinPhilip.github.io`.
3. Merge this PR into `main` after the rename; verify **Settings → Pages → GitHub Actions**.
4. Verify the Pages deployment and check `https://edwinphilip.github.io/`, `/about`, `/guides/` and diagrams.
5. Update links to the former `/knowledge-base/` Pages URL. GitHub repository redirects do not guarantee Pages URL redirects.

**Do not merge before the repository rename:** deploying `base: '/'` under the old project-site URL may break assets and navigation. To roll back, coordinate reverting this config change with restoring the old repository name.

## Structure

- `docs/index.md` — portfolio homepage
- `docs/about.md` — experience and professional story
- `docs/guides/index.md` — learning guide directory
- `docs/guides/networking/q1.md` … `q8.md` — complete networking module
- `docs/.vitepress/` — site config, navigation, theme
- `.github/workflows/deploy.yml` — automated Pages deployment

All educational examples are general and do not represent an employer's private systems.
