# 孕早期模块增强收口计划

## TL;DR
> **Summary**: 当前仓库并非“未开始”，而是已有一轮孕早期页面建设与部分 UI 收益落地。本计划只覆盖未闭环或未被证据证明的剩余工作，并同步完成跟踪器、证据和计划状态的收口。
> **Deliverables**:
> - 已完成基线/部分满足/真实剩余项的权威映射
> - 增强后的 `src/first-trimester-safety.html`
> - 增强后的 `src/first-trimester-family.html`
> - 对齐后的 `src/first-trimester.html`
> - 根目录静态站点自动化测试基础设施与回归用例
> - 大陆优先图片/来源追溯补充与最终证据同步
> **Effort**: Medium
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 → 3 → 4 → 6 → 7

## Context
### Original Request
用户希望继续推进当前目录中的未完成任务。基于仓库现状，当前最合理的推进方式不是重复实现，而是把 `first-trimester-improvements` 重构成一份只针对剩余工作的收口计划。

### Interview Summary
- 用户明确要求继续推进未完成任务。
- 已确认沿用现有 `first-trimester-improvements` 方向，不新开平行计划。
- 计划目标从“大而全的重新实施”收敛为“基线确认 + 剩余实现 + 最终收口”。
- 默认保留原改进计划中的产品目标，不将测试基础设施降级为可选项。

### Metis Review (gaps addressed)
- 旧计划的最大问题是把“未勾选”误判为“未实现”；本计划已改为收口矩阵。
- 明确把共享 sticky 侧栏、文章布局、标题/卡片可读性优化视为**已满足基线**，除非回归验证推翻。
- 明确把中国语境安全内容、家庭支持扩展、入口摘要对齐、根级测试框架、图片来源追溯、跟踪器同步视为**仍需验证或实现**。
- 增加“Authoritative State”与“Closure/Admin”任务，解决旧证据与新证据并存造成的状态冲突。

## Work Objectives
### Core Objective
在不重复已完成 UI/布局工作的前提下，补齐孕早期增强计划中尚未落地或尚未被证据证明的内容、测试和收口动作，并让仓库内的计划状态与实际完成状态一致。

### Authoritative State
#### Baseline Satisfied（已满足基线，执行者不得重复实现）
- `src/css/style.css` 已存在共享视觉与布局增强基线；`first-trimester-improvements` notepads 明确记录了 `.article-layout`、桌面 sticky 侧栏与页首可读性优化决策。
- `src/first-trimester.html` 已存在入口卡片视觉优化基线。
- `src/first-trimester-safety.html`、`src/first-trimester-mental.html`、`src/first-trimester-family.html` 已完成第一轮专题页交付。
- `.sisyphus/evidence/final-qa/` 已存在桌面/移动端截图，说明至少一轮页面 QA 已发生。
- `.sisyphus/evidence/consistency-report.md` 与 `.sisyphus/evidence/final-verification-report.md` 已覆盖旧版缺图/缺链问题，旧的负面结论不得再当作当前事实复用。

#### Partially Satisfied（已部分满足，但未达到本计划目标）
- `src/first-trimester-safety.html` 已包含基础产检、风险预警、应急联系，但尚未达到“时间线 + NT + 中国建档 + 分症状分级处理 + 指标边界”的目标。
- `src/first-trimester-family.html` 已包含医院选择、陪产、待产准备，但尚未明确覆盖“建档协助 / 陪诊分工 / 就医包 / 紧急联系人”正文结构。
- `src/first-trimester.html` 已有卡片视觉优化，但“孕妈安全”摘要尚未被证明完整体现“检查、建档、应急”三大主题。

#### Remaining（本次必须完成）
- Safety 页中国语境内容扩充与 guardrails 对齐。
- Family 页家属协助内容扩充。
- 入口页摘要文本与新范围对齐。
- 根目录静态站点测试基础设施。
- 大陆优先图片/来源追溯策略的补齐或保留理由记录。
- 自动化回归、证据更新、活动计划/状态同步。

#### Deferred / Out of Closure Scope
- 不对所有既有图片做全站无边界替换。
- 不重做已存在的共享 sticky/sidebar/header/card 视觉方案，除非回归测试明确发现缺陷。
- 不新增全新的孕早期专题页，不重构为单页应用或引入重型构建框架。

### Deliverables
- `src/first-trimester-safety.html`：补齐检查时间线、NT、建档、异常分级、指标边界、就医准备、中国优先来源表达。
- `src/first-trimester-family.html`：补齐家属协助建档、陪诊、就医包、紧急联系人、异常场景协助动作。
- `src/first-trimester.html`：将“孕妈安全”摘要更新为检查/建档/应急导向，并保持卡片风格统一。
- 根目录测试配置：可安装依赖、启动静态服务、运行 Playwright 页面验证。
- `.sisyphus/evidence/*`：输出新的测试、截图、链接可达性与收口报告。
- `.sisyphus/boulder.json` 与计划文件：与实际活动计划状态保持一致。

### Definition of Done (verifiable conditions with commands)
- [x] `src/first-trimester-safety.html` 中可检出“NT”“建档”“检查时间线”或等价标题，以及腹痛/流血/头晕/发热/剧吐对应的升级动作。
- [x] `src/first-trimester-family.html` 中可检出“建档”“陪诊”“就医包”“紧急联系人”正文内容，而非仅 FAQ 提及。
- [x] `src/first-trimester.html` 中“孕妈安全”摘要可检出“检查/建档/应急”三类信息。
- [x] 根目录存在独立于 `.opencode/` 的 `package.json` 与 Playwright/静态服务测试入口。
- [x] 自动化测试覆盖 3 个目标页面与 2 个共享布局回归页面，并能产出 `.sisyphus/evidence/` 证据。
- [x] `.sisyphus/boulder.json` 与 `.sisyphus/plans/first-trimester-improvements.md` 的状态描述不再与实际执行状态冲突。

### Must Have
- 明确区分已完成基线与真实剩余项，执行者不得自行重开已满足工作。
- Safety 页新增内容必须体现中国语境，但保持“教育用途、不替代诊疗、因地而异、遵医嘱”的边界。
- 测试框架必须位于仓库根目录可见位置，不能借用 `.opencode/package.json` 伪装完成。
- 所有收口结论必须有文件、截图、日志或 grep/脚本结果支撑。

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- 不因计划复选框未勾选就重复实施 sticky/sidebar/header/card 优化。
- 不把孕酮、HCG、甲状腺等指标写成所有孕妇都必须检查。
- 不把建档规则写成全国统一标准，必须提示地区/医院差异。
- 不使用来源不清、不可追溯、不可达的大陆图片替换现有图片。
- 不用“人工目测感觉完成”作为验收依据。

## Verification Strategy
> ZERO HUMAN INTERVENTION — all verification is agent-executed.
- Test decision: **tests-after + 新增自动化测试基础设施 + 收口同步验证**。
- Framework: 根目录 Node + Playwright + 轻量静态服务。
- QA policy: 每个任务同时包含实现与验证，必须有 happy path 与 failure/edge case。
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Closure policy: 最后必须额外验证 tracker、计划状态、证据权威性同步。

## Execution Strategy
### Parallel Execution Waves
Wave 1: 基线确认与基础设施
- Task 1: 建立收口基线矩阵与权威状态同步规则
- Task 2: 建立根目录静态站点测试基础设施

Wave 2: 页面剩余内容实现
- Task 3: 补齐 Safety 页的中国语境检查/NT/建档/异常处理主体内容
- Task 4: 补齐 Safety 页活动建议、指标边界、就医准备与来源表达
- Task 5: 补齐 Family 页协助内容并对齐入口页摘要

Wave 3: 媒体、回归与收口
- Task 6: 完成大陆优先图片/来源追溯补充或保留理由
- Task 7: 执行全量自动化回归、证据刷新与计划/跟踪器同步

### Dependency Matrix (full, all tasks)
- 1: Blocks [7] | Blocked By: none
- 2: Blocks [7] | Blocked By: none
- 3: Blocks [4, 6, 7] | Blocked By: [1]
- 4: Blocks [6, 7] | Blocked By: [1, 3]
- 5: Blocks [6, 7] | Blocked By: [1]
- 6: Blocks [7] | Blocked By: [3, 4, 5]
- 7: Blocks [Final Verification Wave] | Blocked By: [1, 2, 3, 4, 5, 6]

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 2 tasks → `deep`, `unspecified-high`
- Wave 2 → 3 tasks → `writing`, `writing`, `visual-engineering`
- Wave 3 → 2 tasks → `quick`, `deep`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. 建立收口基线矩阵与权威状态同步规则

  **What to do**: 在执行开始前先把 `first-trimester-improvements` 的旧任务逐项映射到“Baseline Satisfied / Partially Satisfied / Remaining / Deferred”，并在实现总结中明确哪几份证据是当前权威版本、哪几份旧结论已被 supersede。同步定义收口时对 `.sisyphus/boulder.json`、计划复选框与最终报告的处理方式，避免执行结束后仍出现状态冲突。
  **Must NOT do**: 不把旧版负面报告继续当作现状；不把未验证项目直接标成已完成；不跳过 tracker/admin 收口。

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 需要将计划、证据、跟踪器和真实代码状态做精确映射。
  - Skills: []
  - Omitted: [`frontend-ui-ux`] — 非视觉任务。

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [7] | Blocked By: []

  **References**:
  - Pattern: `.sisyphus/plans/first-trimester-improvements.md` — 当前需被收口化的计划文件。
  - Pattern: `.sisyphus/boulder.json` — 当前 active plan 指针仍指向旧计划。
  - Pattern: `.sisyphus/notepads/first-trimester-improvements/decisions.md:38-47` — 共享 sticky/layout 已完成基线证据。
  - Pattern: `.sisyphus/evidence/consistency-report.md:1-99` — 当前跨页一致性权威报告。
  - Pattern: `.sisyphus/evidence/final-verification-report.md:1-44` — 当前验证权威报告。
  - Pattern: `.sisyphus/evidence/final-qa/` — 页面 QA 截图基线证据。

  **Acceptance Criteria**:
  - [ ] 最终收口报告中明确列出 baseline / partial / remaining / deferred 四类状态。
  - [ ] 最终收口报告中明确标出哪些旧报告已被 supersede。
  - [ ] `.sisyphus/boulder.json` 的 active plan/plan name 与当前收口计划一致。

  **QA Scenarios**:
  ```
  Scenario: 权威状态映射存在
    Tool: Bash
    Steps: 检查最终收口报告是否包含 “Baseline Satisfied”“Partially Satisfied”“Remaining”“Deferred” 四个标题；检查是否提到 superseded evidence
    Expected: 四类状态和 superseded 说明都存在
    Evidence: .sisyphus/evidence/task-1-closure-matrix.txt

  Scenario: tracker 未同步时失败
    Tool: Bash
    Steps: 读取 .sisyphus/boulder.json 中 active_plan 与 plan_name；与当前计划文件名比对
    Expected: 若仍指向 `early-pregnancy-content` 则失败
    Evidence: .sisyphus/evidence/task-1-closure-matrix-error.txt
  ```

  **Commit**: YES | Message: `docs(plan): align closure state for trimester improvements` | Files: [.sisyphus/plans/first-trimester-improvements.md, .sisyphus/boulder.json, .sisyphus/evidence/*]

- [x] 2. 建立根目录静态站点测试基础设施

  **What to do**: 在仓库根目录新增最小 Node + Playwright + 静态服务测试环境，使执行者能通过根目录命令安装依赖、启动静态页面并对 `src/*.html` 做页面级断言与截图留证。所有配置必须明确与 `.opencode/package.json` 隔离。
  **Must NOT do**: 不引入 React/Vite/Next；不把测试入口放在 `.opencode/`；不要求手工打开浏览器验证。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: 需在无现成业务 package 的静态站点中建立可复用验证基建。
  - Skills: [`playwright`] — 浏览器自动化与截图；[`superpowers/test-driven-development`] — 先定义失败标准。
  - Omitted: [`frontend-ui-ux`] — 非设计任务。

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [7] | Blocked By: []

  **References**:
  - Pattern: `src/first-trimester-safety.html:90-217` — 首个验证目标页。
  - Pattern: `src/first-trimester-family.html:108-198` — 第二目标页。
  - Pattern: `src/first-trimester.html:100-179` — 入口页摘要/卡片验证目标。
  - Pattern: `src/js/main.js` — 当前站点为原生 JS，无重型构建流程。
  - Pattern: `.opencode/package.json` — 明确不能作为业务测试入口复用。

  **Acceptance Criteria**:
  - [ ] 根目录新增 `package.json` 与 Playwright/静态服务配置文件。
  - [ ] `npm install` 可在根目录成功执行。
  - [ ] 自动化测试可在本地静态服务下访问至少一个孕早期页面。
  - [ ] 测试失败时能输出日志或截图证据。

  **QA Scenarios**:
  ```
  Scenario: 基础测试环境可运行
    Tool: Bash + Playwright
    Steps: 在仓库根目录执行依赖安装；启动静态服务；运行针对 /first-trimester-safety.html 的测试
    Expected: 页面可被打开，测试结果为通过，并产生日志/截图
    Evidence: .sisyphus/evidence/task-2-test-harness.txt

  Scenario: 服务未启动时快速失败
    Tool: Bash
    Steps: 不启动静态服务直接执行测试命令
    Expected: 测试明确报连接/服务不可用，不出现静默通过
    Evidence: .sisyphus/evidence/task-2-test-harness-error.txt
  ```

  **Commit**: YES | Message: `test(site): add root static html verification harness` | Files: [root package.json, test config files]

- [x] 3. 补齐孕妈安全页的检查时间线、NT、建档与异常分级主结构

  **What to do**: 在 `src/first-trimester-safety.html` 现有基础产检/应急内容上扩写为中国语境可执行版本：加入阶段化检查时间线（发现怀孕后、6-8 周、9-10 周、11-13+6 周等）、NT 时间窗与准备、中国建档常见时间与材料、腹痛/流血/头晕/发热/剧吐的“观察 / 当天咨询 / 立即就医”分级动作。现有“风险预警信号与运动禁忌”“应急联系指南”应重组，不是简单追加一段散文。
  **Must NOT do**: 不把建档写成全国统一；不遗漏急诊触发条件；不保留模糊的“必要时看看医生”式表述。

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: 需要高密度结构化健康教育内容重写。
  - Skills: []
  - Omitted: [`frontend-ui-ux`] — 本任务重心是内容结构。

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [4, 6, 7] | Blocked By: [1]

  **References**:
  - Pattern: `src/first-trimester-safety.html:90-189` — 当前 safety 页主体内容，需在此基础上重组扩写。
  - Pattern: `.sisyphus/plans/first-trimester-improvements.md`（旧版任务4意图）— 原定目标范围。
  - Pattern: `.sisyphus/notepads/first-trimester-improvements/learnings.md:51-56` — 当前 safety 页已扩过一轮，但仍不足以覆盖本计划目标。
  - External: 中国官方/公立医院/妇幼保健机构公开资料 — 用于建档与检查表达的中国语境校正。

  **Acceptance Criteria**:
  - [ ] 页面出现清晰时间线或阶段化检查结构。
  - [ ] 页面明确写出 NT 时间窗与准备要点。
  - [ ] 页面明确写出建档时间、常见材料与地区差异提醒。
  - [ ] 腹痛、流血、头晕、发热、剧吐均绑定升级动作词，如“观察”“当天联系”“立即急诊/就医”。

  **QA Scenarios**:
  ```
  Scenario: 关键主结构完整存在
    Tool: Playwright
    Steps: 打开 /first-trimester-safety.html；定位“检查时间线”“NT”“建档”“腹痛”“流血”“头晕”“发热”“剧吐”等标题或关键词
    Expected: 所有结构存在并位于正文核心区，而非仅零散出现在 FAQ
    Evidence: .sisyphus/evidence/task-3-safety-structure.png

  Scenario: 红旗症状没有升级动作时失败
    Tool: Bash + Grep
    Steps: 检查上述异常关键词附近是否存在“观察/咨询/急诊/立即就医”等动作词
    Expected: 每类异常至少绑定一个明确动作；缺失则失败
    Evidence: .sisyphus/evidence/task-3-safety-structure-error.txt
  ```

  **Commit**: YES | Message: `feat(first-trimester): expand safety timeline nt and escalation guidance` | Files: [src/first-trimester-safety.html]

- [x] 4. 补齐孕妈安全页活动建议、指标边界、就医准备与来源表达

  **What to do**: 在 Task 3 完成的主体结构上，补齐“有益活动 / 需避免活动 / 出现异常立即停止”的边界；对孕酮、HCG、B 超、血常规、尿常规、感染筛查等采用“用途说明 + 常规/视情况/遵医嘱”表达；补充就医前准备清单、症状记录建议、统一免责声明、地区差异提醒和中国优先来源呈现。
  **Must NOT do**: 不写成论文式堆砌；不把指标绝对化；不删除现有免责声明承接。

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: 需要把医学术语翻译成用户友好的边界化表达。
  - Skills: []
  - Omitted: [`playwright`] — 综合校验在 Task 7。

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [6, 7] | Blocked By: [1, 3]

  **References**:
  - Pattern: `src/first-trimester-safety.html:104-189` — 当前活动、风险与来源区块。
  - Pattern: `.sisyphus/evidence/consistency-report.md:46-64` — 现有免责声明与来源呈现基线。
  - Pattern: `docs/evidence-policy.md:141-141` — 指标边界说明语气参考。

  **Acceptance Criteria**:
  - [ ] 页面明确区分“有益活动”“需避免活动”“异常时停止并就医”。
  - [ ] 页面提到孕酮/HCG 等指标时包含“并非人人都查/需结合医生判断”边界。
  - [ ] 页面包含就医前准备清单或症状记录建议。
  - [ ] 来源区块包含中国优先来源或明确中国语境说明。

  **QA Scenarios**:
  ```
  Scenario: 指标边界表达清晰
    Tool: Playwright
    Steps: 打开 /first-trimester-safety.html；定位“孕酮”“HCG”“B超”等关键词附近内容
    Expected: 同时出现“用途/意义”和“结合医生判断/并非人人都查”等边界表达
    Evidence: .sisyphus/evidence/task-4-indicator-boundary.png

  Scenario: 绝对化措辞被拦截
    Tool: Bash + Grep
    Steps: 搜索“所有孕妇都要”“必须检查孕酮”“一律需要”等绝对化表述
    Expected: 无匹配；若有则失败
    Evidence: .sisyphus/evidence/task-4-indicator-boundary-error.txt
  ```

  **Commit**: YES | Message: `feat(first-trimester): add activity and indicator guardrails` | Files: [src/first-trimester-safety.html]

- [x] 5. 补齐家庭支持页协助内容并对齐入口页摘要

  **What to do**: 在 `src/first-trimester-family.html` 中新增家属协助建档、陪诊前准备、异常场景协助分工、就医包整理、紧急联系人正文；在 `src/first-trimester.html` 中更新“孕妈安全”摘要，使其明确体现检查、建档、应急三大主题，并仅做必要的文案长度/信息密度平衡，不重做整套视觉。
  **Must NOT do**: 不把家庭页写成 safety 页复述；不重新大改卡片视觉；不只把关键词塞进 FAQ。

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: 同时涉及正文协同增强与入口摘要/卡片内容密度调整。
  - Skills: [`frontend-ui-ux`] — 保证入口摘要更新后视觉仍平衡。
  - Omitted: [`playwright`] — 综合校验在 Task 7。

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [6, 7] | Blocked By: [1]

  **References**:
  - Pattern: `src/first-trimester-family.html:108-170` — 当前家庭支持页核心内容。
  - Pattern: `src/first-trimester.html:135-179` — 入口卡片文本与视觉容器。
  - Pattern: `.sisyphus/notepads/first-trimester-improvements/learnings.md:65-70` — family 页现有增强基线。

  **Acceptance Criteria**:
  - [ ] 家庭支持页正文中存在“建档”“陪诊”“就医包”“紧急联系人”内容。
  - [ ] 入口页“孕妈安全”摘要包含检查、建档、应急三类信息。
  - [ ] 更新后入口页卡片长度与同页卡片相比未出现明显失衡或溢出。

  **QA Scenarios**:
  ```
  Scenario: 家庭协助内容补齐
    Tool: Playwright
    Steps: 打开 /first-trimester-family.html；检索“建档”“陪诊”“就医包”“紧急联系人”正文节点
    Expected: 关键词位于正文区块，不仅是 FAQ 文案
    Evidence: .sisyphus/evidence/task-5-family-support.png

  Scenario: 入口摘要未对齐时失败
    Tool: Bash + Grep
    Steps: 搜索 src/first-trimester.html 中“孕妈安全”卡片附近文案
    Expected: 可检出检查/建档/应急语义；若缺任一类则失败
    Evidence: .sisyphus/evidence/task-5-entry-summary-error.txt
  ```

  **Commit**: YES | Message: `feat(first-trimester): align family support and entry summary` | Files: [src/first-trimester-family.html, src/first-trimester.html]

- [x] 6. 完成大陆优先图片/来源追溯补充或保留理由

  **What to do**: 仅针对本轮新增或明确替换的孕早期页面图片，优先使用大陆域名远程图；若找不到合法、稳定、可追溯的大陆来源，则保留现图并在最终报告中逐项记录未替换原因、风险与后续建议。所有相关图片都必须补齐 alt 与来源说明。
  **Must NOT do**: 不全站替换；不为满足“大陆优先”而引入来源不明图片；不只改图片 URL 而不补来源说明。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 范围受限于新增/替换图片和来源追溯。
  - Skills: []
  - Omitted: [`frontend-ui-ux`] — 不是主要设计任务。

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [7] | Blocked By: [3, 4, 5]

  **References**:
  - Pattern: `src/first-trimester-safety.html` — 当前 safety 页图片结构。
  - Pattern: `src/first-trimester-family.html` — 当前 family 页图片结构。
  - Pattern: `.sisyphus/evidence/final-verification-report.md:10-26` — 当前图片/alt 基线统计。
  - API/Type: `docs/navigation-accessibility.md:183-187` — alt 与语义要求。

  **Acceptance Criteria**:
  - [ ] 本轮新增/替换图片优先采用大陆域名；未替换项有明确书面理由。
  - [ ] 每张相关图片均有准确 alt 与来源/追溯说明。
  - [ ] 图片可访问性检查有日志输出。

  **QA Scenarios**:
  ```
  Scenario: 相关图片链接可访问
    Tool: Bash
    Steps: 提取本轮新增/替换图片 URL；逐个执行 HEAD/GET 检查
    Expected: 返回可访问状态或有明确失败记录与替代说明
    Evidence: .sisyphus/evidence/task-6-image-links.txt

  Scenario: 无来源说明时失败
    Tool: Bash + Grep
    Steps: 搜索 figure/img 附近是否存在 figcaption 或来源说明；核对最终报告中是否记录未替换原因
    Expected: 缺失来源说明或缺失保留理由则失败
    Evidence: .sisyphus/evidence/task-6-image-links-error.txt
  ```

  **Commit**: YES | Message: `chore(media): trace trimester image sources and decisions` | Files: [target html files, .sisyphus/evidence/*]

- [x] 7. 执行全量自动化回归、证据刷新与计划/跟踪器同步

  **What to do**: 使用 Task 2 的测试框架，对 `src/first-trimester-safety.html`、`src/first-trimester-family.html`、`src/first-trimester.html` 以及共享布局回归页 `src/first-trimester-diet.html`、`src/first-trimester-mental.html` 执行自动化验证，覆盖内容存在性、sticky 侧栏基线未回退、移动端布局、入口摘要、免责声明、地区差异、图片可访问、来源说明。随后刷新 `.sisyphus/evidence/` 报告，更新 `.sisyphus/boulder.json` 与计划状态，使仓库进入单一一致的收口状态。
  **Must NOT do**: 不只跑截图不做断言；不跳过共享布局回归页；不在证据仍冲突时宣称完成。

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 需整合测试、证据、回归与管理收口。
  - Skills: [`playwright`] — 浏览器自动化与截图；[`superpowers/verification-before-completion`] — 完成前证据核对。
  - Omitted: [`frontend-ui-ux`] — 本任务以验证与同步为主。

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [Final Verification Wave] | Blocked By: [1, 2, 3, 4, 5, 6]

  **References**:
  - Pattern: `src/first-trimester-safety.html` — 主验证目标页。
  - Pattern: `src/first-trimester-family.html` — 主验证目标页。
  - Pattern: `src/first-trimester.html` — 入口摘要验证目标页。
  - Pattern: `src/first-trimester-diet.html` — 共享布局回归页。
  - Pattern: `src/first-trimester-mental.html` — 共享布局回归页。
  - Pattern: `.sisyphus/boulder.json` — 活动计划同步目标。
  - Pattern: `.sisyphus/evidence/consistency-report.md` — 需刷新为最终权威状态。
  - Pattern: `.sisyphus/evidence/final-verification-report.md` — 需刷新为最终权威状态。

  **Acceptance Criteria**:
  - [ ] 自动化测试覆盖 3 个目标页与 2 个共享布局回归页。
  - [ ] 测试验证 sticky 基线未回退、移动端布局正常、核心文案存在、免责声明/地区差异在位、图片可访问。
  - [ ] `.sisyphus/evidence/` 中存在新的日志、截图与最终收口报告。
  - [ ] `.sisyphus/boulder.json` 不再指向旧的 `early-pregnancy-content` 活动计划。
  - [ ] 计划文件状态描述与最终报告结论一致，不再出现“全部未完成”的假象。

  **QA Scenarios**:
  ```
  Scenario: 全量回归与收口同步通过
    Tool: Bash + Playwright
    Steps: 安装依赖；启动静态服务；运行全量测试；生成截图/日志；读取 boulder.json 与最终报告
    Expected: 页面回归全部通过，证据生成完整，tracker 与计划状态同步完成
    Evidence: .sisyphus/evidence/task-7-full-closure.txt

  Scenario: 共享布局或 tracker 状态异常可被发现
    Tool: Playwright + Bash
    Steps: 对 /first-trimester-diet.html 和 /first-trimester-mental.html 执行 sticky/布局检查；读取 .sisyphus/boulder.json
    Expected: 若共享布局回退或 active plan 仍为旧计划，则任务失败并输出截图/日志
    Evidence: .sisyphus/evidence/task-7-full-closure-error.txt
  ```

  **Commit**: YES | Message: `chore(trimester): finalize verification evidence and tracker sync` | Files: [test files, target html files, .sisyphus/evidence/*, .sisyphus/boulder.json]

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Task 1 and Task 7 may update `.sisyphus` artifacts, but must not be mixed with Task 2 test harness creation in one commit.
- Task 3 and Task 4 may be split into two commits if content structure and guardrail language are implemented separately.
- Task 5 should stay separate from Task 3/4 so family-page and entry-summary alignment remain reviewable.
- Task 6 may either be a standalone media/source-traceability commit or be merged into Task 7 only if no product HTML changes are needed beyond captions/source notes.

## Success Criteria
- 执行者不会重复已完成的 sticky/sidebar/header/card 基线工作。
- 用户打开 `first-trimester-safety.html` 后，能按中国语境理解检查时间线、NT、建档与异常升级动作。
- 用户打开 `first-trimester-family.html` 后，能明确家属在建档、陪诊、就医包与紧急联系人方面的具体协助动作。
- 用户从 `first-trimester.html` 即可看到“检查、建档、应急”的入口价值。
- 仓库根目录具备可执行的静态站点自动化验证框架。
- `.sisyphus` 中只保留单一一致的当前状态：计划、证据、活动指针三者一致。
