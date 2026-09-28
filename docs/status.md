# Status — 28 September 2026

## Current phase

**Hackathon concept website and interactive browser demonstration.** The owner explicitly deferred construction of the Windows application. The attached implementation specification remains under `specification/` unchanged.

## Working and verified

- Responsive concept page, animated prepare/disconnect/create preview with pause controls, six-step walkthrough, and product-boundary explanations.
- Eight-tab interactive workspace with synthetic source inspection, optional selection, explicit approval, animated preparation, and visible evidence gaps.
- Offline Lock state gates preparation, source refresh, and coding-network approval.
- Scripted project answers with captured fixture citations, unsupported-topic disclosure, and missing-budget abstention.
- Locally persisted notes, document editing, revision-checked sample patch review, undo, and Markdown downloads.
- Five-slide editable storyboard with reviewed outline and Markdown export.
- Coding-agent concept with diff review, undo, simulated one-task internet permission, and grant clearing at reload or Offline Lock.
- Light/Balanced/Performance preferences and advanced controls, explicitly illustrative.
- Source refresh scenario updates the captured date while preserving working drafts and flagging stale document references.
- Savings calculator uses visible assumptions and can show negative net savings.
- Service-worker asset cache supports offline reload in the tested browser. No third-party asset or API request was observed.
- Original documents retained; README, concept explanation, decision log, presenter guide, publishing guide, and animated real-UI capture supplied.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| JavaScript syntax | Passed | `node --check site/app.js`, `node --check site/model.js`. |
| Deterministic state, arithmetic, and asset tests | Passed: 17/17 | `npm test`; `tests/model.test.mjs`, `tests/site.test.mjs`. |
| Browser workflow | Passed: 50 checks | `docs/evidence/browser-report.json`; `tests/browser.mjs`. |
| Offline reload and interaction | Passed in test browser | Browser networking disabled through Playwright; cached page reopened with saved draft and scripted answers usable. |
| Application console/CSP errors | None observed in browser journey | Report has an empty error list. |
| Third-party requests | None observed in browser journey | Report has an empty external-request list. |
| Responsive overflow | Passed at 390, 768, 1440 px | Overview and five content surfaces tested; desktop/mobile captures inspected. |
| Visual inspection | Passed with one corrected hero spacing issue | Screenshots of desktop page, mobile page, workspace, and mobile workspace; captured preview in `docs/images/`. |
| GitHub Pages live deployment | Passed | [Native Pages run 36361826737](https://github.com/grubbiy/AteaCoWorker/actions/runs/36361826737): build and deploy succeeded. Live address returns HTTP 200. |
| Published asset integrity | Passed | `docs/evidence/live-assets.json`: live HTML, CSS, JS modules, service worker, and favicon match the tested local files byte-for-byte. |

Environment: Linux container, Node.js v24.19.0, Playwright 1.62.1, headless Chromium 153.0.8010.0. The browser executable was supplied through the temporary `@sparticuz/chromium` test dependency because the default browser download failed; that dependency is not part of the website. The agent-browser CLI daemon failed to start in this environment, so the functional and visual checks used Playwright directly. No system security settings were changed.

Commands actually run include:

```sh
npm install --ignore-scripts --no-audit --no-fund
npm test
node --check site/app.js
node --check site/model.js
node scripts/serve.mjs
node tests/browser.mjs
node scripts/capture.mjs
```

The browser commands used `BROWSER_EXECUTABLE` pointing to the temporary local Chromium binary. The test server and browser ran in the same isolated network namespace. In a normal developer environment, use the README's standard Playwright install instructions.

## Publishing

**Live: https://grubbiy.github.io/AteaCoWorker/**

At initial repository inspection, GitHub reported `has_pages: false`. The first custom Actions deployment failed before Pages was enabled. Creating a dedicated `gh-pages` branch with only the website assets caused GitHub to enable native branch publishing. Repository visibility remains private; the website is public.

Native [Pages run 36361826737](https://github.com/grubbiy/AteaCoWorker/actions/runs/36361826737) built and deployed commit `e079de0eb1c145f7b700775d20f77a08d1b0f588` successfully. Deployment logs report the exact live address above. After the initial propagation-time 404, the site returned HTTP 200. Published assets match the tested source files.

The redundant custom deployment workflow was replaced with `.github/workflows/checks.yml`. Pages now uses GitHub's native `gh-pages` branch deployment. Future site edits must be mirrored from `site/` on main to the root of `gh-pages`; main-only documentation changes do not redeploy the site.

## Deliberate demo limitations

- No local inference, model download, hardware scan, speed benchmark, or cloud inference.
- No Microsoft sign-in, Graph/SharePoint requests, tenant permission checks, or policy enforcement.
- No real filesystem imports or source downloads. Sizes and preparation stages are illustrative.
- Browser local storage is unencrypted. Only synthetic data is appropriate.
- Downloads are `.md`. No `.docx`/`.pptx` export or Office layout validation is implemented here.
- Coding changes are demo state. No code execution, OS isolation, network broker, installation, or security proof.
- Only a small scripted Q&A topic set. This is not a chatbot quality evaluation.
- Browser/SW behaviour verified in the disclosed Chromium environment only. Safari, Firefox, Windows x64/ARM64, and assistive-technology audits have not been independently tested.
- No measured financial savings, approved company branding, production readiness, or compliance claim.

## Original application acceptance gates

**AT01–AT15 in the original `specification/goal.md`: Not run for the desktop application.** Website tests do not satisfy those gates. In particular, actual local inference, real Microsoft preparation, encrypted storage, native Office outputs, Windows guest operation, and independent process egress validation remain future implementation work.

## Next action

Use the live concept demo to gather hackathon feedback before authorizing desktop implementation. The requested concept website and repository documentation are complete; the actual application remains intentionally unbuilt.
