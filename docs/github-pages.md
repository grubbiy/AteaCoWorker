# GitHub Pages publishing

The intended public-safe concept URL is **https://grubbiy.github.io/AteaCoWorker/**. Do not treat it as live until `docs/status.md` records a successful deployment and HTTP verification.

## Recommended: GitHub Actions

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Deploy CoWorker demo → Run workflow**, selecting `main` if a deployment did not already start.
4. Wait for the deploy job to complete, then open the URL shown in its `github-pages` environment.

The workflow runs deterministic checks and uploads **only `site/`**. No desktop specifications, test results, secrets, or repository documentation are included in that website artifact. Future changes to `site/` trigger a fresh deployment. Static assets require no build or runtime package installation.

## Private repository consideration

GitHub documents Pages availability for private repositories on supported paid plans such as GitHub Pro. If Settings says the account must upgrade, the owner must choose whether to do so; this task does not authorize purchasing a subscription or making the repository public.

A private repository does not, by itself, make the published Pages site private. This demonstration contains fictional data and no official company assets. Treat the site as public unless explicit Pages access control has been configured and verified.

## Alternate branch publishing

If using a `gh-pages` deployment branch containing only the contents of `site/`, choose **Deploy from a branch → gh-pages → /(root)**. Do not point a branch deployment at the entire main repository root, and do not set the documentation folder as the site: the interactive assets are under `site/` in main.

## Constraints in this session

The GitHub connection exposes file, branch, commit, and workflow-inspection operations but no Pages settings mutation. A complete, tested site and deployment configuration can therefore be committed before any owner-side setup is needed. Do not try to grant an Actions token repository-admin rights to work around that limit.

## Local verification

`npm run dev` serves the same files under `/AteaCoWorker/` so relative URLs are checked before publication. To update a previously cached deployment, change the static cache version in `site/sw.js` with each site release. A hard refresh or clearing site data can help a tester discard an older cache; the service worker also checks its own updates normally.

Official references checked 2026-09-28:

- [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Use custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
