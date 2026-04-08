# React + Tailwind 内容站重构计划

## TL;DR
> **Summary**: 将当前静态多页面孕期教育站重构为 **Vite 多页面 + React + TypeScript + Tailwind CSS v4** 的数据驱动内容站，保持现有 `.html` URL 语义与核心搜索契约，同时完成一轮“母婴温和”风格的 UI 改版。
> **Deliverables**:
> - Vite MPA React 工程基础（保留 `.html` 页面入口）
> - 结构化内容模型与搜索索引生成链路
> - Tailwind 设计令牌与共享 UI 组件体系
> - 迁移后的首页、阶段页、文章详情页、家庭支持页、案例页、关于页、搜索页
> - 兼容现有 Playwright 回归并补足 URL / metadata / 链接校验
> **Effort**: Large
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 → 2 → 3 → 4 → 5/6/7/8 → 9 → 10 → 11 → 12

## Context
### Original Request
- 使用 React 重构当前项目
- UI 需要改版，并使用 Tailwind CSS，让界面更清新舒适

### Interview Summary
- 迁移路线：**渐进式 React 内容站**，不是客户端 SPA
- 工程化范围：**最小补齐**，锁定 `Vite + TypeScript + ESLint`
- 内容管理：抽离为**结构化数据源**，不再继续维护分散 HTML
- 视觉方向：**母婴温和**（低饱和暖色 / 自然绿 / 圆角 / 大留白 / 轻阴影）
- URL 策略：**尽量保持现有 `.html` 语义与主要路径不变**
- 测试策略：保留现有 **Playwright E2E** 作为迁移安全网

### Metis Review (gaps addressed)
- 已将 `src/data/search-config.json` 视为**权威 URL allowlist**，不把路由设计留给执行者决定
- 已区分**保留契约**与**现有缺陷**：坏链接、缺失 `search.html`、占位页链接属于迁移修复项，不属于需要复刻的旧行为
- 已将成熟模板基线锁定为 **first-trimester detail pages**，不以较弱的 second/third trimester 占位结构定义通用模板
- 已明确共享壳层不仅是布局，还必须保留 `main.js` 中的菜单、键盘、`aria-current`、锚点行为

## Work Objectives
### Core Objective
将当前静态 HTML/CSS/JS 多页面站点，重构为可持续维护的 React 内容站：
- 保持现有核心 URL、页面语义、搜索行为与主要 SEO 元信息
- 用 React 组件 + 结构化内容数据替代重复 HTML 与命令式 DOM 脚本
- 用 Tailwind CSS v4 建立统一视觉系统并完成“母婴温和”UI 升级

### Deliverables
- Vite 多页面工程，可直接输出 `/index.html`、`/first-trimester.html`、`/about.html` 等页面
- `src/content/**` 的类型化内容数据模型
- `search.html` 页面与统一搜索数据源/生成脚本
- 共享 Layout / Navigation / Breadcrumb / Footer / Search / Article UI 组件
- Tailwind 主题令牌、排版策略、交互状态规范
- Playwright 回归通过，并新增链接/metadata/路由契约校验

### Definition of Done (verifiable conditions with commands)
- `npm install` 成功且无缺失依赖
- `npm run build` 成功并生成可部署产物
- `npm run lint` 通过
- `npm run test:e2e` 通过
- `curl -I http://127.0.0.1:<port>/index.html`、`/first-trimester.html`、`/search.html?q=孕早期饮食` 返回 `200`
- 关键页面标题与 `meta description` 保持页面级差异
- 不再输出 `/pages/` 占位链接与 `.bak` 资源引用

### Must Have
- 保留 `src/data/search-config.json:16-35,37-125` 定义的 `.html` URL 契约
- 保留并满足 `tests/search.spec.js:10-163` 的搜索页面与导航搜索交互契约
- 以 `src/first-trimester-diet.html:46-346` 为文章详情模板基线
- 将 `src/js/main.js:6-184` 的关键行为迁入 React 壳层
- 使用 Tailwind CSS v4 + 令牌化主题；避免继续堆叠页面内联 `<style>`

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- 不得在第一阶段改成客户端 SPA 或依赖 React Router 的 history fallback
- 不得破坏现有 `.html` 语义或擅自改成无扩展名路由
- 不得将 second/third trimester 的占位结构当成最终信息架构标准
- 不得保留硬编码搜索数组与结构化搜索索引双轨并存
- 不得引入 Redux/Zustand/React Query 等非必要状态方案
- 不得把这次工作扩展为 CMS、SSR、后端表单提交、深度 SEO 平台化项目
- 不得为 Tailwind 大量引入运行时拼接 class 名的写法

## Verification Strategy
> ZERO HUMAN INTERVENTION — all verification is agent-executed.
- Test decision: **tests-after** + existing Playwright (`@playwright/test`)；新增 lint/build/route checks
- QA policy: 每个任务都附带 agent-executed 场景；无人工点点点验收
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. Shared dependencies extracted into Wave 1.

Wave 1: foundation / architecture / design system / content contracts / search contracts / QA harness
- Tasks 1-6

Wave 2: page migration by archetype
- Tasks 7-10

Wave 3: contract fixes / hardening
- Tasks 11-12

### Dependency Matrix (full, all tasks)
| Task | Depends On | Blocks |
|---|---|---|
| 1 | - | 2,3,4,5,6 |
| 2 | 1 | 4,5,6,7,8,9,10 |
| 3 | 1 | 5,7,8,9,10 |
| 4 | 1,2 | 7,8,9,10 |
| 5 | 1,2,3 | 7,8,9,10,11 |
| 6 | 1,2 | 10,11,12 |
| 7 | 2,3,4,5 | 11,12 |
| 8 | 2,3,4,5 | 11,12 |
| 9 | 2,3,4,5 | 11,12 |
| 10 | 2,4,5,6 | 11,12 |
| 11 | 6,7,8,9,10 | 12 |
| 12 | 7,8,9,10,11 | F1,F2,F3,F4 |

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 6 tasks → `deep`, `visual-engineering`, `writing`, `quick`
- Wave 2 → 4 tasks → `visual-engineering`, `deep`, `quick`
- Wave 3 → 2 tasks → `deep`, `unspecified-high`
- Final Verification Wave → 4 tasks → `oracle`, `unspecified-high`, `deep`

## TODOs
> Implementation + Test = ONE task. Never separate.
> Every task below is decision-complete; do not substitute alternative architecture.

- [x] 1. 建立 Vite 多页面 React 工程骨架并锁定入口契约

  **What to do**: 
  - 将当前项目迁移为 **Vite MPA**，不是 SPA。
  - 保留以下 HTML 入口：`index.html`、`first-trimester.html`、`first-trimester-diet.html`、`first-trimester-safety.html`、`first-trimester-mental.html`、`first-trimester-family.html`、`second-trimester.html`、`third-trimester.html`、`family-support.html`、`cases.html`、`about.html`、`search.html`。
  - 每个 HTML 页面输出同名 `.html` 文件，并提供页面级 `<title>` / `<meta name="description">` 占位。
  - 统一在各 HTML 中挂载 React 根节点，使用共享 bootstrap，不引入 React Router。
  - 新增 `build`、`dev`、`lint` 脚本；保留现有 Playwright 脚本。

  **Must NOT do**:
  - 不得改成单一 `index.html` + history fallback
  - 不得移除现有 `test:e2e` / `test:e2e:no-server`
  - 不得把页面 meta 延后到“以后再处理”

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 需要锁定工程骨架、入口模式与现有测试兼容性
  - Skills: `[]` — 保持实现专注于仓库现状即可
  - Omitted: `[git-master]` — 本任务不涉及 git 操作

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2,3,4,5,6 | Blocked By: -

  **References**:
  - Pattern: `package.json:1-14` — 现有脚本很少，需在其上增补而非推翻
  - Pattern: `playwright.config.js:1-29` — 测试服务器当前直接以 `./src` 为静态根目录
  - API/Type: `src/data/search-config.json:16-35,37-125` — URL allowlist 与 `.html` 语义是契约基线
  - Test: `tests/search.spec.js:61-100` — 搜索与 `search.html` 路径要求

  **Acceptance Criteria**:
  - [ ] `npm run build` 成功
  - [ ] 构建产物中存在所有约定的 `.html` 页面入口
  - [ ] `npm run lint` 成功
  - [ ] `npm run test:e2e:no-server` 可继续运行于构建后产物或兼容的新静态服务方式

  **QA Scenarios**:
  ```
  Scenario: Build emits preserved html entrypoints
    Tool: Bash
    Steps: run `npm run build`; inspect build output for index/about/search and trimester/article html files
    Expected: all required `.html` files exist, build exits 0
    Evidence: .sisyphus/evidence/task-1-vite-mpa-build.txt

  Scenario: E2E harness still boots against new app structure
    Tool: Bash
    Steps: run `npm run test:e2e:no-server`
    Expected: Playwright starts and executes without missing server/bootstrap errors
    Evidence: .sisyphus/evidence/task-1-vite-mpa-e2e.txt
  ```

  **Commit**: YES | Message: `feat(app): scaffold vite multipage react site` | Files: `package.json`, `vite config`, html entries, bootstrap files

- [ ] 2. 定义类型化内容模型与页面清单的单一事实来源

  **What to do**:
  - 在 `src/content/` 下建立类型化数据层，使用 TypeScript 定义：site meta、nav、breadcrumb、trimester index、article detail、support page、cases page、about page、search record。
  - 将 `src/data/search-config.json` 的 `includePages` 作为权威页面清单，同步映射为内部页面注册表。
  - 明确 `first-trimester` 详情页为文章详情模板 archetype。
  - 为每个页面记录：`pageId`、`url`、`title`、`description`、`pageType`、`navSection`、`searchableFields`。
  - about 联系表单默认保持**静态展示**，不接后端提交。

  **Must NOT do**:
  - 不得继续保留页面内容只存在于 HTML 中
  - 不得把占位或损坏链接页面纳入 canonical page registry
  - 不得为尚不存在的 CMS/Markdown 先设计过度抽象接口

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: 主要是内容建模与 schema 明确
  - Skills: `[]` — 无额外技能依赖
  - Omitted: `[frontend-ui-ux]` — 本任务不做视觉实现

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 4,5,6,7,8,9,10 | Blocked By: 1

  **References**:
  - API/Type: `src/data/search-config.json:1-174` — 页面 allowlist、pageType、排除规则的权威来源
  - Pattern: `src/index.html:48-147` — 首页信息块结构
  - Pattern: `src/first-trimester-diet.html:46-346` — 完整 article-detail 模板
  - Pattern: `src/family-support.html:95-177` — support 页面结构
  - Pattern: `src/about.html:138-197` — about 页面与静态表单结构

  **Acceptance Criteria**:
  - [ ] 存在类型定义文件，覆盖所有页面类型与共享数据段
  - [ ] 页面注册表与 `search-config.json` allowlist 一一对应
  - [ ] `search.html` 被纳入注册表且具备页面元信息
  - [ ] 无 `.bak`、`pages/`、未列入 allowlist 的页面被注册

  **QA Scenarios**:
  ```
  Scenario: Registry matches search-config allowlist exactly
    Tool: Bash
    Steps: run a verification script comparing content registry URLs to `src/data/search-config.json`
    Expected: exact match, no extra URLs, no missing URLs
    Evidence: .sisyphus/evidence/task-2-content-registry-audit.txt

  Scenario: Invalid placeholder page is rejected
    Tool: Bash
    Steps: run registry validation against `.bak` and `/pages/` examples
    Expected: validation fails or rejects those entries explicitly
    Evidence: .sisyphus/evidence/task-2-content-registry-rejects.txt
  ```

  **Commit**: YES | Message: `feat(content): add typed page registry and content schema` | Files: `src/content/**`, validation scripts

- [ ] 3. 建立 Tailwind 设计令牌与“母婴温和”视觉基础

  **What to do**:
  - 采用 Tailwind CSS v4 CSS-first 方式，主样式文件中配置 `@import "tailwindcss";`。
  - 在全局主题层定义语义令牌：`brand`, `accent`, `surface`, `surface-muted`, `text-primary`, `text-secondary`, `border`, `success`, `warning`, `danger`, `focus`, `radius`, `shadow`, `content-width`。
  - 视觉基调锁定为：暖白背景、鼠尾草绿/浅粉点缀、圆角卡片、中等阴影、较大段间距。
  - 建立 typography 策略：文章主体使用官方 typography 插件风格；正文宽度优先可读性，不追求大屏铺满。
  - 统一焦点态、hover、disabled、表单态与 `motion-reduce` 支持。

  **Must NOT do**:
  - 不得保留旧的页面内联 `<style>` 作为长期方案
  - 不得用大量任意值和运行时拼接 class 代替令牌
  - 不得引入暗黑模式作为本阶段目标

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: 需要可执行设计系统落地
  - Skills: `[frontend-ui-ux]` — 需要把“母婴温和”抽成组件级风格规则
  - Omitted: `[ui-ux-pro-max]` — 现有需求不需要额外复杂设计库查询

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 5,7,8,9,10 | Blocked By: 1

  **References**:
  - Pattern: `src/css/style.css` — 当前全局样式需被迁移为令牌体系
  - Pattern: `src/family-support.html:10-56` — 现有 support 页内联样式是需吸收的视觉线索，不是实现方式
  - Pattern: `src/about.html:10-99` — 现有 about 页内联样式同理
  - External: `https://tailwindcss.com/docs/theme` — 主题变量与令牌模式
  - External: `https://tailwindcss.com/docs/responsive-design` — 移动优先与容器/断点策略
  - External: `https://github.com/tailwindlabs/tailwindcss-typography` — 内容页排版基线

  **Acceptance Criteria**:
  - [ ] 存在单一全局 Tailwind 入口与语义主题令牌
  - [ ] 文章正文、卡片、按钮、输入框、链接、焦点态均有统一样式基线
  - [ ] 不再依赖页面级 `<style>` 完成新 UI
  - [ ] 主要文本对比度达到 WCAG AA 基线

  **QA Scenarios**:
  ```
  Scenario: Design tokens render consistently on sample pages
    Tool: Playwright
    Steps: open home, article, about pages at desktop and mobile widths; capture screenshots
    Expected: shared colors, spacing, cards, buttons, inputs, and focus visuals are consistent
    Evidence: .sisyphus/evidence/task-3-tailwind-design-baseline.png

  Scenario: Focus and reduced-motion states remain accessible
    Tool: Playwright
    Steps: tab through nav/search/form controls; emulate reduced motion preference if supported
    Expected: visible focus ring on all controls; no essential interaction depends on animation
    Evidence: .sisyphus/evidence/task-3-tailwind-a11y.txt
  ```

  **Commit**: YES | Message: `feat(ui): add tailwind design tokens and maternal theme` | Files: global css/theme/tailwind setup

- [ ] 4. 实现共享 React 壳层与导航行为等价迁移

  **What to do**:
  - 实现 `PageShell`, `Header`, `PrimaryNav`, `Breadcrumb`, `Footer`, `SkipLink`, `Container` 等共享组件。
  - 将 `src/js/main.js` 中以下行为迁入 React：移动菜单开关、点击外部关闭、`Escape` 关闭、平滑滚动、`aria-current` 与 detail page → parent nav 映射。
  - 使用页面注册表而不是 `window.location.pathname` 的硬编码映射维护 nav 状态；但运行时仍需以当前 URL 为准做激活态确认。
  - 支持 hash anchor 页面内跳转，并仅在目标锚点存在时执行平滑滚动。

  **Must NOT do**:
  - 不得丢失 skip-link、键盘可用性、aria 属性
  - 不得让 detail page 在导航中失去所属阶段高亮
  - 不得保留原始命令式脚本与 React 壳层双重绑定

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 共享壳层涉及行为等价与多页面复用
  - Skills: `[]` — 可直接按现有行为迁移
  - Omitted: `[playwright]` — 任务内 QA 用现有测试即可，不需浏览器技能指导

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 7,8,9,10 | Blocked By: 1,2

  **References**:
  - Pattern: `src/js/main.js:6-184` — 所有需迁移的共享交互行为
  - Pattern: `src/index.html:15-46,150-188` — 共享 header/breadcrumb/footer 布局
  - Pattern: `src/first-trimester-diet.html:14-44` — detail 页 breadcrumb 与 nav 高亮模式
  - Test: `tests/search.spec.js:61-75,140-163` — nav 壳层中 search 与 mobile 行为约束

  **Acceptance Criteria**:
  - [ ] 所有页面共享同一套壳层组件
  - [ ] 移动菜单可开关、外部点击关闭、ESC 关闭、`aria-expanded` 更新正确
  - [ ] detail 页在主导航中高亮其所属阶段，而非空态
  - [ ] 旧 `src/js/main.js` 不再作为运行时依赖

  **QA Scenarios**:
  ```
  Scenario: Shared shell parity across key pages
    Tool: Playwright
    Steps: visit `/index.html`, `/first-trimester.html`, `/first-trimester-diet.html`, `/about.html`; inspect nav/breadcrumb/footer
    Expected: one shared shell structure, correct active nav and breadcrumb state on each page
    Evidence: .sisyphus/evidence/task-4-shell-parity.json

  Scenario: Mobile menu keyboard behavior remains correct
    Tool: Playwright
    Steps: open page on mobile viewport, click menu toggle, press Escape, click outside menu
    Expected: menu opens/closes correctly and restores toggle focus on Escape
    Evidence: .sisyphus/evidence/task-4-shell-mobile.txt
  ```

  **Commit**: YES | Message: `feat(shell): migrate shared layout and navigation behavior` | Files: layout/navigation components, bootstrap cleanup

- [ ] 5. 重建数据驱动搜索契约并生成 `search.html`

  **What to do**:
  - 以内容注册表为单一事实来源生成搜索索引，不再保留 `src/js/search.js` 内硬编码搜索数组。
  - 新建独立 `search.html` 页面，并满足 `?q=` 直达加载契约。
  - 导航搜索框保留唯一实例，提交后跳转到 `/search.html?q=关键词`。
  - 搜索结果项必须链接到真实内容页（如 `/first-trimester-diet.html`），绝不能出现 `/pages/` 占位路径。
  - 保留短查询提示、无结果提示、特殊字符安全处理。

  **Must NOT do**:
  - 不得继续仅在控制台打印查询
  - 不得让 `search-config.json` 与实际搜索结果数据源脱节
  - 不得在渲染中直接插入未转义 HTML

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 搜索同时涉及路由契约、数据源、页面实现与回归测试
  - Skills: `[]` — 无额外技能依赖
  - Omitted: `[frontend-ui-ux]` — 搜索视觉由 Task 3 统一定义

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 10,11 | Blocked By: 1,2,3

  **References**:
  - Pattern: `src/js/search.js:105-249` — 当前命令式搜索流程与结果渲染
  - API/Type: `src/data/search-config.json:37-125` — 搜索语料权威 allowlist
  - Test: `tests/search.spec.js:10-163` — 需完整满足的行为契约
  - Pattern: `package.json:5-13` — 保持 Playwright 作为回归入口

  **Acceptance Criteria**:
  - [ ] `/search.html?q=孕早期饮食` 返回 200 且渲染结果页
  - [ ] 导航搜索提交后跳转到 `search.html?q=`
  - [ ] 一字符查询显示“请输入至少 2 个字符”
  - [ ] 特殊字符查询不会导致异常或脚本错误
  - [ ] 搜索结果中无 `/pages/`、`.bak`、隐藏页面链接

  **QA Scenarios**:
  ```
  Scenario: Search direct-load and nav-submit contracts pass
    Tool: Bash
    Steps: run `npm run test:e2e -- tests/search.spec.js`
    Expected: all search contract tests pass
    Evidence: .sisyphus/evidence/task-5-search-contract.txt

  Scenario: Search index excludes forbidden pages
    Tool: Bash
    Steps: run generated index audit against `.bak`, `/pages/`, and unregistered pages
    Expected: zero forbidden URLs appear in search output
    Evidence: .sisyphus/evidence/task-5-search-index-audit.txt
  ```

  **Commit**: YES | Message: `feat(search): add route-driven search page and generated index` | Files: search page, search components, index generator

- [ ] 6. 补齐 lint / build / route-contract / link-check 质量门禁

  **What to do**:
  - 配置 ESLint（TypeScript + React hooks + 基础可访问性规则）。
  - 新增脚本验证：HTML 页面输出、核心路由 200、metadata 存在、坏链接检查、锚点存在性检查。
  - 将现有 `.sisyphus/evidence` 产物命名约定沿用到新验证任务。
  - 让检查显式识别并禁止 `/pages/`、`.bak`、缺失锚点、空 `title/description`。

  **Must NOT do**:
  - 不得把质量门禁留给最终人工 review
  - 不得只校验首页而忽略 allowlist 中其他页面

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 质量脚本和 lint 配置相对聚焦
  - Skills: `[]`
  - Omitted: `[simplify]` — 当前重点是质量护栏，不是代码润色

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 10,11,12 | Blocked By: 1,2

  **References**:
  - Pattern: `playwright.config.js:1-29` — 现有 E2E 基础
  - Test: `tests/search.spec.js:41-59` — 已有 evidence 写入模式
  - API/Type: `src/data/search-config.json:127-159` — 禁止路径规则可直接转为检查逻辑

  **Acceptance Criteria**:
  - [ ] `npm run lint` 可用并通过
  - [ ] 存在自动路由/链接/metadata 校验脚本
  - [ ] 校验脚本覆盖 allowlist 全量页面
  - [ ] 校验结果可输出到 `.sisyphus/evidence/`

  **QA Scenarios**:
  ```
  Scenario: Contract checks pass across canonical routes
    Tool: Bash
    Steps: run route/link/meta verification script after build
    Expected: all canonical routes return 200 and no forbidden links/anchors are reported
    Evidence: .sisyphus/evidence/task-6-route-link-meta-check.txt

  Scenario: Lint gate blocks structural issues
    Tool: Bash
    Steps: run `npm run lint`
    Expected: command exits 0 with no React/TS/hooks violations
    Evidence: .sisyphus/evidence/task-6-lint.txt
  ```

  **Commit**: YES | Message: `chore(quality): add lint and route contract checks` | Files: eslint config, quality scripts

- [ ] 7. 迁移首页与阶段总览页模板，完成首轮 UI 改版落地

  **What to do**:
  - 使用共享壳层与 Tailwind 设计系统重做首页、`first-trimester.html`、`second-trimester.html`、`third-trimester.html`。
  - 首页保留 hero、阶段选择、热门文章、家庭支持入口、证据政策模块，但改为清新舒适视觉层次。
  - 阶段页统一成相同模板：阶段 hero、文章卡片分区、阶段提示、延伸阅读/FAQ（如果当前页缺失，则按最小数据模型落地，不凭空编造医学内容）。
  - second/third trimester 的占位结构允许规范化，但不得虚构不存在内容；可用“即将完善/更多内容整理中”受控占位文案，仅限确实缺内容的区块。

  **Must NOT do**:
  - 不得把 second/third trimester 生造为 first trimester 同等密度内容
  - 不得删除首页已有信息模块
  - 不得让主导航与搜索在这些页面出现多实例

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: 模板迁移与 UI 改版并重
  - Skills: `[frontend-ui-ux]` — 需要控制卡片、排版、分区层级
  - Omitted: `[playwright]` — 验证用现有测试和截图即可

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 11,12 | Blocked By: 2,3,4,5

  **References**:
  - Pattern: `src/index.html:48-147` — 首页模块清单
  - Pattern: `src/first-trimester.html` — 阶段页基线结构
  - API/Type: `src/data/search-config.json:46-100` — 阶段页 canonical URLs
  - Test: `tests/search.spec.js:61-75,143-162` — shared nav search on key pages, including `/first-trimester.html`

  **Acceptance Criteria**:
  - [ ] 首页与三个阶段页全部迁移到 React 模板
  - [ ] 页面 URL 与页面标题保持正确
  - [ ] 页面在移动端与桌面端均无布局破损
  - [ ] `first-trimester.html` 上导航搜索仍满足唯一实例与可用性契约

  **QA Scenarios**:
  ```
  Scenario: Home and trimester pages render with new UI consistently
    Tool: Playwright
    Steps: capture desktop/mobile screenshots of `/index.html`, `/first-trimester.html`, `/second-trimester.html`, `/third-trimester.html`
    Expected: shared visual system, no overflow, readable content hierarchy
    Evidence: .sisyphus/evidence/task-7-home-trimester-regression.png

  Scenario: First trimester page keeps shared nav search behavior
    Tool: Bash
    Steps: run `npm run test:e2e -- tests/search.spec.js`
    Expected: the first-trimester shared-nav assertions continue to pass
    Evidence: .sisyphus/evidence/task-7-home-trimester-search.txt
  ```

  **Commit**: YES | Message: `feat(pages): migrate home and trimester index templates` | Files: page components, content data, page entries

- [ ] 8. 迁移 canonical 文章详情模板与孕早期四篇文章

  **What to do**:
  - 以 `first-trimester-diet.html` 及其同类页面为 canonical article-detail archetype。
  - 实现共享文章模板：侧栏文章导航、文章头部 meta、长文内容区、FAQ、证据说明、图片/figcaption、免责声明。
  - 迁移四个孕早期详情页：diet / safety / mental / family。
  - 保持文章间侧栏导航、breadcrumb、nav 高亮逻辑正确。
  - 长文正文使用统一 `ArticleBody` / typography 样式，不逐页手写样式。

  **Must NOT do**:
  - 不得压平长文结构成纯文本块
  - 不得丢失 FAQ / evidence / disclaimer 等信息分区
  - 不得改变这四篇文章的 canonical URL

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 长文模板、数据迁移与信息结构完整性要求高
  - Skills: `[]`
  - Omitted: `[writing]` — 不是改写文案，而是结构化迁移

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 11,12 | Blocked By: 2,3,4,5

  **References**:
  - Pattern: `src/first-trimester-diet.html:46-346` — 最成熟文章模板
  - Pattern: `src/first-trimester-safety.html` — sibling article variant
  - Pattern: `src/first-trimester-mental.html` — sibling article variant
  - Pattern: `src/first-trimester-family.html` — sibling article variant
  - Test: `tests/first-trimester-safety.spec.js` — 页面渲染与内容验证
  - Test: `tests/first-trimester-regression.spec.js` — 回归与截图验证

  **Acceptance Criteria**:
  - [ ] 四个孕早期文章详情页均使用统一 React 模板
  - [ ] 每页仍有正确 title/description、breadcrumb、侧栏导航、FAQ 等分区
  - [ ] 图片具有非空 alt，正文与列表样式可读
  - [ ] 现有 first-trimester 相关 Playwright 回归通过

  **QA Scenarios**:
  ```
  Scenario: Canonical article pages preserve content structure and metadata
    Tool: Playwright
    Steps: visit the four first-trimester detail pages and assert heading, sidebar, faq/details, evidence/disclaimer sections
    Expected: all article sections are present with correct page-specific metadata
    Evidence: .sisyphus/evidence/task-8-article-template.json

  Scenario: Existing article regression suite still passes
    Tool: Bash
    Steps: run `npm run test:e2e -- tests/first-trimester-safety.spec.js tests/first-trimester-regression.spec.js`
    Expected: all targeted article regression tests pass
    Evidence: .sisyphus/evidence/task-8-article-regression.txt
  ```

  **Commit**: YES | Message: `feat(articles): migrate first trimester detail pages` | Files: article components, article content data

- [ ] 9. 迁移支持类与信息类页面：家庭支持、案例库、关于我们

  **What to do**:
  - 迁移 `family-support.html`、`cases.html`、`about.html` 到 React 模板。
  - `family-support.html` 保留现有内容分段和 checklist，并补齐首页链接所需的 `#communication`、`#preparation` 锚点；若当前内容无对应区块，则新增受控锚点容器并放置与原主题一致的简短标题/说明，不得凭空扩展长文。
  - `about.html` 保留使命、原则、证据来源、免责声明、联系我们结构；联系表单维持静态非提交状态，但视觉与可访问性必须完整。
  - `cases.html` 迁移时保持当前 URL 与内容语义；若存在占位内容，使用统一卡片/列表模板承载。

  **Must NOT do**:
  - 不得把 about 表单接入后端或伪装成真实提交成功
  - 不得忽略首页已有 hash 链接契约
  - 不得继续使用页面内联 `<style>`

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: 信息页结构较简单，但包含明显 UI 改版目标
  - Skills: `[frontend-ui-ux]`
  - Omitted: `[writing]` — 不做内容扩写项目

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 11,12 | Blocked By: 2,3,4

  **References**:
  - Pattern: `src/family-support.html:95-177` — support 页面内容区块
  - Pattern: `src/about.html:138-197` — about 页面内容与静态表单
  - Pattern: `src/index.html:110-128` — 首页链接到 `family-support.html#communication` / `#preparation`
  - API/Type: `src/data/search-config.json:102-125` — support/cases/about canonical URLs

  **Acceptance Criteria**:
  - [ ] 三个页面全部迁移到 React 模板
  - [ ] `family-support.html#communication` 与 `#preparation` 实际可定位
  - [ ] `about.html` 表单字段、标签、焦点态完整可用，但无真实提交副作用
  - [ ] 页面不再依赖内联样式

  **QA Scenarios**:
  ```
  Scenario: Family support anchors resolve from homepage links
    Tool: Playwright
    Steps: open `/index.html`, click the communication and preparation support cards, verify resulting anchors on `/family-support.html`
    Expected: both links land on existing anchor targets and scroll to visible sections
    Evidence: .sisyphus/evidence/task-9-family-anchor-check.txt

  Scenario: About page form remains accessible and static
    Tool: Playwright
    Steps: visit `/about.html`, tab through name/email/message/submit controls, attempt form submission
    Expected: labels are associated, focus visible, no broken navigation or fake success flow occurs
    Evidence: .sisyphus/evidence/task-9-about-form-a11y.txt
  ```

  **Commit**: YES | Message: `feat(info): migrate support cases and about pages` | Files: support/about/cases page components and content

- [ ] 10. 统一页面 head、元信息与静态资源输出策略

  **What to do**:
  - 为每个 HTML 入口输出页面级 `<title>` 与 `<meta name="description">`，值来自页面注册表。
  - 保持中文 `lang="zh-CN"`、viewport、基础 description 等 head 语义。
  - 对首页、阶段页、文章页、关于页、搜索页分别保证 head 数据差异化，禁止所有页面共用同一标题。
  - 静态资源（图片、logo、icons）输出路径需适配 Vite 构建后目录，不得破坏页面可加载性。

  **Must NOT do**:
  - 不得把 metadata 当作“后续优化项”跳过
  - 不得出现构建后图片/样式路径 404

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 规则清晰，偏工程细节
  - Skills: `[]`
  - Omitted: `[frontend-ui-ux]` — 非视觉问题

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 11,12 | Blocked By: 2,4,5,6

  **References**:
  - Pattern: `src/index.html:1-10` — 首页 head 基线
  - Pattern: `src/first-trimester-diet.html:1-10` — 文章详情页 head 基线
  - Pattern: `src/about.html:1-9` — 信息页 head 基线
  - Test: `tests/search.spec.js:77-88` — `search.html` 页面标题契约

  **Acceptance Criteria**:
  - [ ] 所有 canonical 页面输出非空且页面级差异化的 title/description
  - [ ] `search.html` 标题包含“搜索”
  - [ ] 构建产物中无关键静态资源 404

  **QA Scenarios**:
  ```
  Scenario: Metadata parity across canonical pages
    Tool: Bash
    Steps: build app, fetch each canonical page HTML, extract title and meta description
    Expected: every page has non-empty page-specific values; search page title contains 搜索
    Evidence: .sisyphus/evidence/task-10-metadata-audit.txt

  Scenario: Static assets resolve after build
    Tool: Bash
    Steps: serve build output and request representative CSS/image assets referenced by home/article/about pages
    Expected: requested assets return HTTP 200
    Evidence: .sisyphus/evidence/task-10-asset-audit.txt
  ```

  **Commit**: YES | Message: `fix(head): preserve per-page metadata and asset paths` | Files: html templates, metadata helpers, asset references

- [ ] 11. 修复迁移过程中已知坏链接、占位路径与契约偏差

  **What to do**:
  - 系统性移除或替换所有 `/pages/` 占位链接。
  - 修复首页与 footer 中指向不存在页面或锚点的链接；能映射到现有页面的映射到现有页面，不能映射的直接移除或替换为当前存在内容。
  - 显式排除 `.bak` 页面、隐藏目录和测试/证据文件进入用户可见链接或搜索结果。
  - 如现有 Playwright 依赖的契约与旧实现不一致，以 **tests + allowlist + plan** 为准修正应用，而不是回退测试。

  **Must NOT do**:
  - 不得把坏链接“保留原样”称为兼容
  - 不得修改 tests 去迁就错误实现，除非计划中明确更新了契约（本计划未授权）

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 需要综合应用 allowlist、页面结构、搜索输出与 tests 契约
  - Skills: `[]`
  - Omitted: `[git-master]` — 非 git 任务

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 12 | Blocked By: 5,6,7,8,9,10

  **References**:
  - API/Type: `src/data/search-config.json:127-159` — forbidden path rules
  - Test: `tests/search.spec.js:49-56,85-90,158-162` — `/pages/` 禁止与真实目标页要求
  - Pattern: `src/index.html:120-128` — 现有 family-support hash 链接契约
  - Pattern: `src/family-support.html:141-176` — 需承接的 communication / preparation 主题区块

  **Acceptance Criteria**:
  - [ ] 站内已无 `/pages/` 链接
  - [ ] 站内已无 `.bak` 页面链接与索引项
  - [ ] 首页、footer、搜索结果中的全部用户可见链接都能解析到现有页面/锚点

  **QA Scenarios**:
  ```
  Scenario: Broken-link sweep reports zero forbidden targets
    Tool: Bash
    Steps: run the route/link verification script over built HTML and search index
    Expected: zero `/pages/`, zero `.bak`, zero missing-anchor reports
    Evidence: .sisyphus/evidence/task-11-broken-link-sweep.txt

  Scenario: Search result targets remain canonical
    Tool: Bash
    Steps: run `npm run test:e2e -- tests/search.spec.js`
    Expected: search results point to canonical detail pages and no forbidden paths
    Evidence: .sisyphus/evidence/task-11-search-targets.txt
  ```

  **Commit**: YES | Message: `fix(contracts): remove broken links and placeholder targets` | Files: content data, link mappings, validation scripts

- [ ] 12. 完成整站回归、视觉核对与交付文档更新

  **What to do**:
  - 运行全量 lint/build/e2e/checks，并收集桌面/移动端截图证据。
  - 更新项目 README 或最小交付文档，说明新的开发/构建/测试命令、页面注册表、搜索生成链路、设计令牌入口。
  - 核对新 UI 是否满足“母婴温和”目标：留白充足、卡片圆角、正文易读、强调色节制、表单和导航视觉统一。

  **Must NOT do**:
  - 不得在未完成全量验证前宣称完成
  - 不得遗漏对移动端截图与搜索页的最终回归

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: 汇总回归与交付材料需要跨模块核对
  - Skills: `[]`
  - Omitted: `[simplify]` — 优先交付完整验证，而非风格微调

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: F1,F2,F3,F4 | Blocked By: 6,7,8,9,10,11

  **References**:
  - Test: `playwright.config.js:1-29` — 现有 E2E 运行方式
  - Test: `tests/search.spec.js:1-163` — 搜索契约最终回归
  - Pattern: `.sisyphus/evidence/**` — 现有 evidence 产物组织方式

  **Acceptance Criteria**:
  - [ ] `npm run lint`、`npm run build`、`npm run test:e2e` 全部通过
  - [ ] 生成整站桌面/移动端核心截图与审计证据
  - [ ] 交付文档可指导后续维护者继续开发

  **QA Scenarios**:
  ```
  Scenario: Full project verification passes end-to-end
    Tool: Bash
    Steps: run `npm run lint && npm run build && npm run test:e2e`
    Expected: all commands exit 0
    Evidence: .sisyphus/evidence/task-12-full-verification.txt

  Scenario: Final visual regression covers representative pages
    Tool: Playwright
    Steps: capture desktop/mobile screenshots for home, first trimester, first-trimester-diet, family-support, about, search pages
    Expected: no broken layout, consistent maternal-friendly visual system
    Evidence: .sisyphus/evidence/task-12-final-visual-regression.png
  ```

  **Commit**: YES | Message: `chore(release): finalize verification and handoff docs` | Files: evidence docs, readme/handoff docs

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Prefer one commit per completed task as listed above.
- Do not squash search-contract work into unrelated UI commits.
- Keep content-schema commits separate from page-template migration for easier rollback.
- Final verification/doc updates should be last commit before PR.

## Success Criteria
- The site is now maintained as a React + TypeScript + Tailwind content site, not duplicated HTML templates.
- All canonical `.html` URLs in `search-config.json` remain reachable.
- Existing Playwright search and article regression contracts pass.
- Search is route-driven, data-driven, and canonical-link-safe.
- Shared shell behavior from `main.js` is preserved accessibly inside React.
- The UI is visibly more modern, lighter, and more comfortable, while preserving readability and trust.
