# CoWorker hackathon concept — current repository scope

The owner's 28 September 2026 instruction supersedes the earlier build assignment for this phase: **do not build the desktop application yet**. Explain the idea and provide a beautiful, animated, interactive GitHub-hosted concept demo.

- `site/` is the dependency-free static website and browser demo. Keep it deployable under `/AteaCoWorker/` on GitHub Pages using relative asset URLs.
- GitHub Pages currently publishes `gh-pages` from its root. After verifying changes to `site/` on main, mirror only those assets to `gh-pages`, bumping the service-worker cache version. Do not publish the main repository root. Check the native Pages deployment result and live assets after updating the branch.
- `specification/` preserves all five supplied documents unchanged, including their original instructions for the future Windows implementation. Their full-app acceptance gates are not demo acceptance gates.
- Read `docs/decisions.md` and `docs/status.md` before changing scope.
- The current brief adds adjustable low-to-high resource profiles and a bounded coding-agent concept with explicitly approved internet access. These are proposals, not proven capabilities.
- Never present scripted answers as local inference, browser storage as encryption, sample dates as real customer information, or the coding animation as an actual sandbox.
- Preserve the central story: choose task and scope → review pack → prepare → offline work with sources → review outputs → explicit refresh.
- Only synthetic content. No sign-in, company uploads, telemetry, external fonts, cloud inference, arbitrary code execution, or embedded secrets.
- Test actual interactions, mobile layout, persisted edits, reduced motion, and cached offline reload. Record exact evidence and remaining hosting blockers.
- Do not change repository visibility or purchase services without the owner's explicit approval.

Run `npm test` for deterministic checks. Start `npm run dev`, then `npm run test:browser` for the browser journey after installing the documented dev dependencies.
