# GitHub Pages publishing

**Live website: https://grubbiy.github.io/AteaCoWorker/**

**Current source: `gh-pages` branch, `/(root)`.** GitHub's native Pages build and deployment publishes this branch. It contains only the static website assets copied from `site/` on main.

[Verified deployment](https://github.com/grubbiy/AteaCoWorker/actions/runs/36361826737) · [Live asset integrity report](evidence/live-assets.json)

## What was configured

Initially GitHub reported Pages disabled. The first custom deployment workflow could not publish. Creating the dedicated `gh-pages` branch triggered GitHub's native Pages enablement and successful publication, without changing repository visibility or purchasing services.

The redundant custom deployment workflow was replaced by `.github/workflows/checks.yml`, which runs syntax and deterministic tests for changes on main and pull requests. Native Pages deployment is a separate workflow maintained by GitHub.

## Publishing an update

1. Edit `site/` on main and bump the cache version in `site/sw.js` for a site release.
2. Run the tests and inspect changed user flows.
3. Update the root of `gh-pages` to contain exactly the contents of `site/`, preserving `.nojekyll`.
4. Commit that branch with an authorized repository connection. Do not push the entire main repository tree onto it.
5. Wait for **Actions → pages build and deployment** to succeed.
6. Open the live website and verify the changed assets. A main-only commit does not publish website updates.

Do not assume a workflow push using the default `GITHUB_TOKEN` will trigger a separate branch-based Pages build; GitHub documents restrictions on workflow-triggered builds. The source branch can instead be updated through the authorized repository connection used for this delivery.

If the configuration is later removed, open **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then **gh-pages** and **/(root)**. The main branch root is not the website.

## Visibility

The repository remains **private**. The published concept website is **public**. A private source repository does not automatically give the Pages site private access controls. Only fictional data and public-safe concept content are published; repository documentation and original specifications are not included in the website assets.

GitHub documents private-repository Pages availability on supported plans such as GitHub Pro. No subscription purchase or repository visibility change was made or authorized in this task.

## Offline cache and local preview

`npm run dev` serves the same assets under `/AteaCoWorker/`, matching the live site's path prefix. Once cached by the service worker, they can reopen offline in the tested Chromium browser. A hard refresh or clearing site data helps a tester discard an older cache when needed. Change the cache version with each new site release.

The service worker caches only same-origin static assets, not remote documents or model weights. The website's offline test does not validate the future Windows app's offline contract.

Official references checked 2026-09-28:

- [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Use custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
