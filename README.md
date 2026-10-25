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
4. After a successful deployment, visit **https://edwinphilip.github.io/knowledge-base/**.

The VitePress config sets `base: '/knowledge-base/'`, required for this project site.

## Structure

- `docs/index.md` — portfolio homepage
- `docs/about.md` — experience and professional story
- `docs/guides/index.md` — learning guide directory
- `docs/guides/networking/q1.md` … `q8.md` — complete networking module
- `docs/.vitepress/` — site config, navigation, theme
- `.github/workflows/deploy.yml` — automated Pages deployment

All educational examples are general and do not represent an employer's private systems.
