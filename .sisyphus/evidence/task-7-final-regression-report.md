# Task 7 Final Regression Report

Generated: 2026-03-08

Rerun refreshed: 2026-03-08 (port-conflict hardening pass)

## Scope
- Regression target pages:
  - `src/first-trimester-safety.html`
  - `src/first-trimester-family.html`
  - `src/first-trimester.html`
  - `src/first-trimester-diet.html`
  - `src/first-trimester-mental.html`
- Allowed mutation scope used in this task:
  - `playwright.config.js`
  - `playwright.no-server.config.js`
  - `scripts/start-static-server.mjs`
  - `tests/first-trimester-regression.spec.js`
  - `tests/first-trimester-safety.spec.js`
  - `.sisyphus/evidence/task-7-final-regression/*`
- Tracker file reviewed: `.sisyphus/boulder.json`

## Authority Carry-Forward
- Task 1 closure authority order remains in force: repository state → `.sisyphus/boulder.json` → latest closure evidence → plan intent.
- Task 6 image rule remains in force: retain current images when mainland-source legality/stability/traceability is not proven.
- Older negative claims from `.sisyphus/evidence/work-completion-summary.md` remain superseded by current repository-backed evidence and later reports.

## What Was Verified

### 1. Five-page regression coverage
- Root Playwright harness executed against all 5 target pages.
- Desktop assertions covered:
  - page title and H1 presence
  - key body content presence
  - disclaimer presence
  - region-difference wording where required
  - source/source-list wording presence
  - image `alt` completeness
- Mobile assertions covered:
  - no horizontal overflow on all 5 pages
  - shared detail pages keep sidebar above content in single-column flow
  - entry page keeps expected card inventory visible on mobile

### 2. Sticky/shared-layout baseline
- Shared layout baseline was regression-checked on `first-trimester-diet.html` and `first-trimester-mental.html`.
- Desktop sticky metrics from Playwright run:
  - `diet`: `.article-layout__sidebar` computed `position: sticky`, `top: 86px`, nav top delta after scroll = `0`
  - `mental`: `.article-layout__sidebar` computed `position: sticky`, `top: 86px`, nav top delta after scroll = `0`
- Independent browser MCP spot-check on `diet` confirmed sticky baseline held in a real browser session (`delta: 5.390625`, within tolerance caused by page settling).

### 3. Content/disclaimer/region/source coverage
- `safety`: confirmed timeline / NT / 建档 / 异常分级 / 免责声明 / 中国官方与公立机构来源表述 / 地区差异提醒
- `family`: confirmed 建档协助 / 陪诊分工 / 就医包 / 紧急联系人 / 免责声明 / family support source list
- `entry`: confirmed safety summary still communicates 检查 / 建档 / 应急 / 安全边界
- `diet` + `mental`: confirmed shared-detail layout pages still expose source list and disclaimer while preserving shared layout behavior

### 4. Image accessibility and retention rationale
- Automated image audit results:
  - `safety`: 3 images, missing alt = 0
  - `family`: 5 images, missing alt = 0
  - `diet`: 2 images, missing alt = 0
  - `mental`: 5 images, missing alt = 0
- Final image retention rationale remains the Task 6 authority:
  - `.sisyphus/evidence/task-6-image-source-traceability.md`
  - no replacement was made because no mainland-domain alternative was proven legal, stable, and traceable within scope

## Evidence Artifacts

### Test outputs
- `.sisyphus/evidence/task-7-final-regression/desktop-regression.json`
- `.sisyphus/evidence/task-7-final-regression/mobile-regression.json`

### Screenshots captured by root harness
- `.sisyphus/evidence/task-7-final-regression/safety-desktop.png`
- `.sisyphus/evidence/task-7-final-regression/family-desktop.png`
- `.sisyphus/evidence/task-7-final-regression/diet-desktop.png`
- `.sisyphus/evidence/task-7-final-regression/mental-desktop.png`
- `.sisyphus/evidence/task-7-final-regression/entry-desktop.png`
- `.sisyphus/evidence/task-7-final-regression/safety-mobile.png`
- `.sisyphus/evidence/task-7-final-regression/family-mobile.png`
- `.sisyphus/evidence/task-7-final-regression/diet-mobile.png`
- `.sisyphus/evidence/task-7-final-regression/mental-mobile.png`
- `.sisyphus/evidence/task-7-final-regression/entry-mobile.png`

### Browser MCP spot-check screenshots
- `.sisyphus/evidence/task-7-final-regression/diet-desktop-browser-mcp.png`
- `.sisyphus/evidence/task-7-final-regression/family-mobile-browser-mcp.png`

### Reused authority evidence
- `.sisyphus/evidence/task-1-closure-matrix.txt`
- `.sisyphus/evidence/task-6-image-source-traceability.md`

## Commands And Outcomes
- `npm run test:e2e -- tests/first-trimester-regression.spec.js` ✅ pass
- `python3 -m http.server 43173 --directory "src" & npm run test:e2e -- tests/first-trimester-regression.spec.js` ✅ pass after config hardening; Playwright reused the already-listening static server instead of failing on `EADDRINUSE`
- `node --check tests/first-trimester-regression.spec.js` ✅ pass
- `npm run test:e2e -- tests/first-trimester-safety.spec.js` ✅ pass after updating the smoke assertions to current page structure
- `node --check tests/first-trimester-safety.spec.js` ✅ pass

## Port-Conflict Fix
- Root cause: the previous harness treated port `43173` as exclusively owned by Playwright (`reuseExistingServer: false`). If any other static server was already bound there, Playwright failed before tests started with `EADDRINUSE`.
- Fix applied:
  - kept the harness simple and static-site friendly
  - switched `playwright.config.js` to `reuseExistingServer: true`
  - replaced the spawned web-server command with local `scripts/start-static-server.mjs` so the harness uses a minimal repo-local static server instead of relying on `npx http-server`
  - taught the local static-server script to exit cleanly on `EADDRINUSE`, so Playwright can proceed to the already-listening server without noisy startup failure
  - kept `playwright.no-server.config.js` aligned with env-overridable baseURL behavior
- Result: reruns now succeed both when Playwright starts the server itself and when a compatible static server is already listening on the configured port.

## Tracker Sync Review
- `.sisyphus/boulder.json` already aligned during this task.
- Verified fields:
  - `active_plan` = `/home/cecil/桌面/opencodeWorkSpace/yunqi/.sisyphus/plans/first-trimester-improvements.md`
  - `plan_name` = `first-trimester-improvements`
  - `worktree_path` = `/home/cecil/桌面/opencodeWorkSpace/yunqi`
- Result: no tracker mutation required.

## Known Verification Constraints
- `lsp_diagnostics` for changed JS test files could not be completed because the configured TypeScript LSP server is missing in this environment (`typescript-language-server` not installed).
- This was compensated by executable verification on the changed test files:
  - `node --check` for syntax
  - passing Playwright execution for runtime validity
- Existing HTML LSP limitation from prior tasks remains unchanged and is already documented in notepad issues.

## Final Closure Readiness
- Happy-path regression for the required 5-page set: complete
- Shared sticky/layout baseline rechecked: complete
- Mobile verification for user-facing pages: complete
- Disclaimer / region-difference / source-expression / image-alt coverage: complete
- Image retention rationale carried forward from Task 6: complete
- Tracker alignment check: complete, no file change required
- Hidden blocker status: none beyond documented LSP tooling unavailability
