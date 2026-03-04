# 孕早期模块内容填充

## TL;DR

> **Quick Summary**: 为孕期教育网站创建3个全新的HTML页面（孕妈安全、心理健康、家庭支持），每个页面包含权威机构推荐、禁忌事项、图片资源、信息来源和外链链接，采用分层结构和TDD测试驱动方法。

> **Deliverables**:
> - src/first-trimester-safety.html（孕妈安全）
> - src/first-trimester-mental.html（心理健康）
> - src/first-trimester-family.html（家庭支持）
> - 每个页面包含完整内容：概述、核心要点、权威推荐、禁忌事项、常见问题、免责声明、图片资源、外链引用

> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: 1-2-3 → 4-6 → 7-9 → 10-12 → 13-15

---

## Context

### Original Request
用户要求填充孕早期模块的3个空白子模块（孕妈安全、心理健康、家庭支持），目前只有饮食安全有内容。需要包含权威机构推荐、禁忌内容、图片资源、信息来源和外链，并采用分层结构和TDD测试驱动方法。

### Interview Summary

**Key Discussions**:
- 图片资源：使用外部图床（CDN）
- 权威来源：中国卫健委 + WHO国际指南 + 三甲医院 + 中国营养学会
- 内容深度：分层结构（要点摘要+详细展开）
- 禁忌展示：用❌图标标记
- 测试策略：TDD（测试驱动）

**各模块详细需求**:
- 孕妈安全：产检时间表、早孕反应缓解、风险预警信号、运动与生活禁忌、应急联系指南
- 心理健康：情绪监测量表、焦虑抑郁识别、放松技巧指导、角色转换适应、专业求助时机
- 家庭支持：准爸爸行动指南、夫妻沟通技巧、待产准备清单、医院选择指南、陪产准备课程

### Research Findings
- 项目使用静态HTML文件
- 现有模板（first-trimester-diet.html）展示了标准结构：header、概述、核心要点、常见问题、免责声明
- 已收集权威医疗资源（中国卫健委、WHO、三甲医院、中国营养学会的指南）

### Metis Review
Metis调用超时，基于已收集信息生成计划。

---

## Work Objectives

### Core Objective
创建3个高质量的孕期教育HTML页面，提供权威、实用、易读的孕早期指导内容。

### Concrete Deliverables
- src/first-trimester-safety.html（孕妈安全，约2000字）
- src/first-trimester-mental.html（心理健康，约1800字）
- src/first-trimester-family.html（家庭支持，约1800字）

### Definition of Done
- [ ] 每个页面包含完整的HTML结构和正确的导航链接
- [ ] 每个页面包含概述、核心要点、权威推荐、禁忌事项、常见问题、免责声明
- [ ] 每个页面包含至少3张相关图片（外部图床链接）
- [ ] 每个页面包含至少5个权威机构的外链引用
- [ ] 每个页面通过HTML验证
- [ ] 所有TDD测试用例通过

### Must Have
- 权威机构推荐（每个模块至少3个来源）
- 禁忌事项（用❌图标标记）
- 外链引用（信息来源）
- 分层结构（要点摘要+详细展开）
- 外部图片资源（每个模块至少3张）
- 免责声明

### Must NOT Have (Guardrails)
- 不使用未经验证的医疗建议
- 不使用本地图片存储（仅外部图床）
- 不修改现有的first-trimester-diet.html
- 不超出用户明确要求的范围
- 不使用过于专业的医学术语（保持易懂）

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (HTML静态页面，使用浏览器验证)
- **Automated tests**: NO (HTML验证通过手动检查+浏览器渲染验证)
- **Framework**: None
- **TDD**: YES - 每个任务先定义验收标准，再实现内容

### QA Policy
每个任务完成后，执行以下QA验证：

- **HTML验证**: 使用Bash运行`xmllint --noout`验证HTML语法
- **链接检查**: 使用Bash运行curl检查外链可访问性
- **图片验证**: 使用Bash运行curl HEAD检查图片URL有效性
- **内容完整性**: 检查所有必需章节是否存在
- **浏览器渲染**: 使用Playwright打开页面，截图验证布局

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - 3个HTML页面骨架):
├── Task 1: 创建孕妈安全页面骨架 [quick]
├── Task 2: 创建心理健康页面骨架 [quick]
└── Task 3: 创建家庭支持页面骨架 [quick]

Wave 2 (After Wave 1 - 孕妈安全内容填充):
├── Task 4: 产检时间表与早孕反应缓解 [unspecified-high]
├── Task 5: 风险预警信号与运动禁忌 [unspecified-high]
└── Task 6: 应急联系指南与QA验证 [unspecified-high]

Wave 3 (After Wave 1 - 心理健康内容填充):
├── Task 7: 情绪监测量表与焦虑识别 [unspecified-high]
├── Task 8: 放松技巧与角色转换 [unspecified-high]
└── Task 9: 专业求助与QA验证 [unspecified-high]

Wave 4 (After Wave 1 - 家庭支持内容填充):
├── Task 10: 准爸爸行动指南与沟通技巧 [unspecified-high]
├── Task 11: 待产准备与医院选择 [unspecified-high]
└── Task 12: 陪产准备与QA验证 [unspecified-high]

Wave 5 (After Waves 2-4 - 最终整合):
├── Task 13: 跨模块一致性检查 [deep]
├── Task 14: 更新首页导航链接 [quick]
└── Task 15: 完整性验证与文档 [deep]

Critical Path: Task 1-3 → Task 4-6 → Task 7-9 → Task 10-12 → Task 13-15
Parallel Speedup: ~70% faster than sequential
Max Concurrent: 3 (Waves 2-4)
```

### Dependency Matrix

- **1-3**: — — 4-12, 1
- **4**: 1 — 6, 2
- **5**: 1 — 6, 2
- **6**: 4, 5 — 13, 2
- **7**: 2 — 9, 3
- **8**: 2 — 9, 3
- **9**: 7, 8 — 13, 3
- **10**: 3 — 12, 4
- **11**: 3 — 12, 4
- **12**: 10, 11 — 13, 4
- **13**: 6, 9, 12 — 14, 15, 5
- **14**: 13 — 15, 5
- **15**: 14 — —, 5

### Agent Dispatch Summary

- **1**: **3** — T1-T3 → `quick`
- **2**: **3** — T4-T6 → `unspecified-high`
- **3**: **3** — T7-T9 → `unspecified-high`
- **4**: **3** — T10-T12 → `unspecified-high`
- **5**: **3** — T13 → `deep`, T14 → `quick`, T15 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. 创建孕妈安全页面骨架

  **What to do**:
  - 创建 src/first-trimester-safety.html 文件
  - 复制 first-trimester-diet.html 的基础结构
  - 修改页面标题为"孕早期孕妈安全指南"
  - 更新 meta description
  - 更新面包屑导航：首页 > 孕早期 > 孕妈安全
  - 保留CSS样式，调整配色为蓝色系（#3182ce）
  - 创建基础章节：概述、核心要点、常见问题、免责声明
  - 创建占位subsection（标题为"待填充"）
  - 在 first-trimester.html 中更新链接指向新文件

  **Must NOT do**:
  - 不添加具体内容（只占位）
  - 不添加图片或外链
  - 不修改其他页面

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4-6
  - **Blocked By**: None

  **References**:
  - `src/first-trimester-diet.html:1-182` - 完整的HTML结构和章节组织模式
  - `src/first-trimester-diet.html:10-60` - CSS样式和配色方案

  **Acceptance Criteria**:
  - [ ] 文件已创建：src/first-trimester-safety.html
  - [ ] 文件通过HTML验证：xmllint --noout src/first-trimester-safety.html
  - [ ] 页面标题正确：<title>孕早期孕妈安全 - 孕期教育网站</title>
  - [ ] 面包屑导航正确：首页 > 孕早期 > 孕妈安全
  - [ ] 基础章节存在：概述、核心要点、常见问题、免责声明
  - [ ] 首页链接已更新：first-trimester.html中"孕早期孕妈安全指南"链接指向新文件

  **QA Scenarios**:
  ```
  Scenario: HTML文件语法正确
    Tool: Bash (xmllint)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. xmllint --noout src/first-trimester-safety.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-1-html-validation.txt

  Scenario: 页面标题正确
    Tool: Bash (grep)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. grep "<title>" src/first-trimester-safety.html
      2. Verify contains "孕早期孕妈安全"
    Expected Result: Title contains "孕早期孕妈安全"
    Failure Indicators: Title incorrect
    Evidence: .sisyphus/evidence/task-1-title-check.txt

  Scenario: 首页链接已更新
    Tool: Bash (grep)
    Preconditions: first-trimester.html exists
    Steps:
      1. grep "first-trimester-safety" src/first-trimester.html
      2. Count occurrences (should be 1)
    Expected Result: Exactly 1 link
    Failure Indicators: Link missing or multiple links
    Evidence: .sisyphus/evidence/task-1-link-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES (groups with 2, 3)
  - Message: `feat: create HTML skeleton for early pregnancy modules`
  - Files: `src/first-trimester-safety.html`, `src/first-trimester.html`

- [x] 2. 创建心理健康页面骨架

  **What to do**:
  - 创建 src/first-trimester-mental.html 文件
  - 复制 first-trimester-diet.html 的基础结构
  - 修改页面标题为"孕早期心理健康指南"
  - 更新 meta description
  - 更新面包屑导航：首页 > 孕早期 > 心理健康
  - 保留CSS样式，调整配色为紫色系（#805ad5）
  - 创建基础章节：概述、核心要点、常见问题、免责声明
  - 创建占位subsection（标题为"待填充"）
  - 在 first-trimester.html 中更新链接指向新文件

  **Must NOT do**:
  - 不添加具体内容（只占位）
  - 不添加图片或外链
  - 不修改其他页面

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 7-9
  - **Blocked By**: None

  **References**:
  - `src/first-trimester-diet.html:1-182` - 完整的HTML结构和章节组织模式
  - `src/first-trimester-diet.html:10-60` - CSS样式和配色方案

  **Acceptance Criteria**:
  - [ ] 文件已创建：src/first-trimester-mental.html
  - [ ] 文件通过HTML验证：xmllint --noout src/first-trimester-mental.html
  - [ ] 页面标题正确：<title>孕早期心理健康 - 孕期教育网站</title>
  - [ ] 面包屑导航正确：首页 > 孕早期 > 心理健康
  - [ ] 基础章节存在：概述、核心要点、常见问题、免责声明
  - [ ] 首页链接已更新：first-trimester.html中"孕早期心理健康指南"链接指向新文件

  **QA Scenarios**:
  ```
  Scenario: HTML文件语法正确
    Tool: Bash (xmllint)
    Preconditions: first-trimester-mental.html exists
    Steps:
      1. xmllint --noout src/first-trimester-mental.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-2-html-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES (groups with 1, 3)
  - Message: `feat: create HTML skeleton for early pregnancy modules`
  - Files: `src/first-trimester-mental.html`, `src/first-trimester.html`

- [x] 3. 创建家庭支持页面骨架

  **What to do**:
  - 创建 src/first-trimester-family.html 文件
  - 复制 first-trimester-diet.html 的基础结构
  - 修改页面标题为"孕早期家庭支持指南"
  - 更新 meta description
  - 更新面包屑导航：首页 > 孕早期 > 家庭支持
  - 保留CSS样式，调整配色为橙色系（#dd6b20）
  - 创建基础章节：概述、核心要点、常见问题、免责声明
  - 创建占位subsection（标题为"待填充"）
  - 在 first-trimester.html 中更新链接指向新文件

  **Must NOT do**:
  - 不添加具体内容（只占位）
  - 不添加图片或外链
  - 不修改其他页面

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 10-12
  - **Blocked By**: None

  **References**:
  - `src/first-trimester-diet.html:1-182` - 完整的HTML结构和章节组织模式
  - `src/first-trimester-diet.html:10-60` - CSS样式和配色方案

  **Acceptance Criteria**:
  - [ ] 文件已创建：src/first-trimester-family.html
  - [ ] 文件通过HTML验证：xmllint --noout src/first-trimester-family.html
  - [ ] 页面标题正确：<title>孕早期家庭支持 - 孕期教育网站</title>
  - [ ] 面包屑导航正确：首页 > 孕早期 > 家庭支持
  - [ ] 基础章节存在：概述、核心要点、常见问题、免责声明
  - [ ] 首页链接已更新：first-trimester.html中"孕早期家庭支持指南"链接指向新文件

  **QA Scenarios**:
  ```
  Scenario: HTML文件语法正确
    Tool: Bash (xmllint)
    Preconditions: first-trimester-family.html exists
    Steps:
      1. xmllint --noout src/first-trimester-family.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-3-html-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES (groups with 1, 2)
  - Message: `feat: create HTML skeleton for early pregnancy modules`
  - Files: `src/first-trimester-family.html`, `src/first-trimester.html`

- [x] 4. 产检时间表与早孕反应缓解（孕妈安全）

  **What to do**:
  - 填充"产检时间表"subsection内容：
    - 第6-8周：首次产检，确认孕周和胎儿心跳
    - 第12周：NT检查（颈部透明带厚度）
    - 每次产检项目：血压、体重、尿常规、胎心
    - 提供表格形式展示时间表
    - 添加权威机构：北京协和医院产科指南
    - 添加外链：https://www.pumch.cn/obstetrics/guide.html（示例）
  - 填充"早孕反应缓解"subsection内容：
    - 孕吐缓解：少食多餐、生姜水、避免油腻
    - 疲劳应对：充足睡眠、适度休息、合理作息
    - 乳房胀痛：选择合适内衣、避免刺激
    - 添加权威机构：中国营养学会孕期营养指南
    - 添加外链：https://www.cnsoc.org/pregnancy-diet.html（示例）
  - 添加2张相关图片（外部图床）:
    - 产检流程图
    - 孕早期营养食物示意图
  - 在"禁忌事项"中添加：
    - ❌ 不可自行服用止吐药物
    - ❌ 不可忽视严重孕吐（体重下降超过5%）
  - 添加常见问题：
    - Q: 孕早期一定要做NT检查吗？
    - A: 是的，NT检查是唐氏筛查的重要指标，建议所有孕妇在第12周完成。

  **Must NOT do**:
  - 不使用未经验证的偏方
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `src/first-trimester-diet.html:113-126` - subsection结构示例
  - `src/first-trimester-diet.html:144-150` - 常见问题格式示例

  **Acceptance Criteria**:
  - [ ] 产检时间表内容完整（第6-8周、第12周）
  - [ ] 早孕反应缓解内容完整（孕吐、疲劳、乳房胀痛）
  - [ ] 包含2个权威机构外链
  - [ ] 包含2张外部图片（产检流程图、营养示意图）
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题
  - [ ] HTML验证通过

  **QA Scenarios**:
  ```
  Scenario: 内容完整且包含必要元素
    Tool: Bash (grep)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. grep "产检时间表" src/first-trimester-safety.html | wc -l
      2. grep "NT检查" src/first-trimester-safety.html
      3. grep "http" src/first-trimester-safety.html | grep -c "<a"
      4. grep "❌" src/first-trimester-safety.html | wc -l
    Expected Result: 产检时间表出现1次，NT检查存在，至少2个外链，至少2个❌
    Failure Indicators: 内容缺失或数量不足
    Evidence: .sisyphus/evidence/task-4-content-check.txt

  Scenario: 图片链接有效
    Tool: Bash (curl)
    Preconditions: first-trimester-safety.html contains image URLs
    Steps:
      1. Extract image URLs from HTML
      2. curl -I -s [each-image-URL] | head -1
    Expected Result: All images return 200 OK
    Failure Indicators: Any image returns 404 or error
    Evidence: .sisyphus/evidence/task-4-image-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 5, 6)

- [x] 5. 风险预警信号与运动禁忌（孕妈安全）

  **What to do**:
  - 填充"风险预警信号"subsection内容：
    - 阴道出血：鲜红色、量多需立即就医
    - 腹痛：持续性、剧烈腹痛需警惕
    - 高烧：体温超过38°C需就医
    - 无胎心：第8周仍无胎心需检查
    - 添加权威机构：WHO孕期保健指南
    - 添加外链：https://www.who.int/zh/health-topics/pregnancy#tab=tab_1
  - 填充"运动与生活禁忌"subsection内容：
    - 适度运动：散步、孕妇瑜伽、游泳
    - 运动禁忌：❌ 避免剧烈运动、❌ 避免高温环境（桑拿、温泉）
    - 生活禁忌：❌ 禁止吸烟饮酒、❌ 避免接触化学物质
    - 添加权威机构：中国卫健委孕期保健规范
    - 添加外链：https://www.nhc.gov.cn/obstetrics-guidelines.html（示例）
  - 添加1张相关图片（外部图床）:
    - 孕期适宜运动示意图
  - 在"禁忌事项"中添加：
    - ❌ 不可忽视阴道出血（无论量多少）
    - ❌ 不可自行服用止痛药
    - ❌ 不可进行腹部X光检查
  - 添加常见问题：
    - Q: 孕早期可以运动吗？
    - A: 可以适度运动，如散步、孕妇瑜伽，但要避免剧烈运动和高温环境。

  **Must NOT do**:
  - 不提供自行诊断建议
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `src/first-trimester-diet.html:113-141` - 禁忌事项示例（用❌标记）
  - `src/first-trimester-diet.html:144-150` - 常见问题格式示例

  **Acceptance Criteria**:
  - [ ] 风险预警信号内容完整（出血、腹痛、高烧、无胎心）
  - [ ] 运动与生活禁忌内容完整
  - [ ] 包含2个权威机构外链
  - [ ] 包含1张外部图片
  - [ ] 包含至少3个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题
  - [ ] HTML验证通过

  **QA Scenarios**:
  ```
  Scenario: 风险预警内容完整
    Tool: Bash (grep)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. grep "阴道出血" src/first-trimester-safety.html
      2. grep "腹痛" src/first-trimester-safety.html
      3. grep "高烧" src/first-trimester-safety.html
      4. grep "无胎心" src/first-trimester-safety.html
    Expected Result: All 4 risk signals present
    Failure Indicators: Any risk signal missing
    Evidence: .sisyphus/evidence/task-5-risk-check.txt

  Scenario: 禁忌事项用❌标记
    Tool: Bash (grep)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. grep -c "❌" src/first-trimester-safety.html
    Expected Result: At least 3 ❌ symbols
    Failure Indicators: Less than 3 ❌ symbols
    Evidence: .sisyphus/evidence/task-5-taboo-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 4, 6)

- [x] 6. 应急联系指南与QA验证（孕妈安全）

  **What to do**:
  - 填充"应急联系指南"subsection内容：
    - 紧急情况：出血、剧烈腹痛、高烧、胎动异常
    - 就医流程：就近医院急诊、带齐检查资料、告知孕周
    - 常用联系方式：120急救、医院急诊科、产科医生
    - 添加权威机构：复旦附属妇产科医院急诊指南
    - 添加外链：https://www.obgyn.fudan.edu.cn/emergency.html（示例）
  - 添加1张相关图片（外部图床）:
    - 孕期急救流程图
  - 在"禁忌事项"中添加：
    - ❌ 不可拖延就医时间
    - ❌ 不可自行处理紧急情况
  - 添加常见问题：
    - Q: 什么情况下需要立即就医？
    - A: 阴道出血、剧烈腹痛、高烧超过38°C、胎动异常等情况需立即就医。
  - 验证HTML文件语法正确性
  - 验证所有外链可访问性
  - 验证所有图片链接有效性

  **Must NOT do**:
  - 不提供具体的医院推荐（只提供通用指导）
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Tasks 13-15
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `src/first-trimester-diet.html:144-150` - 常见问题格式示例
  - `src/first-trimester-diet.html:152-156` - 免责声明格式示例

  **Acceptance Criteria**:
  - [ ] 应急联系指南内容完整（紧急情况、就医流程、联系方式）
  - [ ] 包含1个权威机构外链
  - [ ] 包含1张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题
  - [ ] HTML验证通过
  - [ ] 所有外链可访问
  - [ ] 所有图片链接有效

  **QA Scenarios**:
  ```
  Scenario: HTML验证通过
    Tool: Bash (xmllint)
    Preconditions: first-trimester-safety.html exists
    Steps:
      1. xmllint --noout src/first-trimester-safety.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-6-html-validation.txt

  Scenario: 外链可访问性验证
    Tool: Bash (curl)
    Preconditions: first-trimester-safety.html contains external links
    Steps:
      1. Extract all external links from HTML
      2. For each link: curl -I -s [URL] | head -1
    Expected Result: All links return 200 OK
    Failure Indicators: Any link returns 404 or error
    Evidence: .sisyphus/evidence/task-6-link-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES
  - Message: `feat: add mom safety content (TDD)`
  - Files: `src/first-trimester-safety.html`
  - Pre-commit: `xmllint --noout src/first-trimester-safety.html`

- [x] 7. 情绪监测量表与焦虑识别（心理健康）

  **What to do**:
  - 填充"情绪监测量表"subsection内容：
    - PHQ-9抑郁筛查问卷（简化版）：9个问题，评分0-27分
    - 每日情绪记录：记录情绪状态、睡眠质量、食欲变化
    - 监测频率：每周至少记录1次
    - 添加权威机构：中国心理卫生协会孕期心理指南
    - 添加外链：https://www.camh.org.cn/pregnancy-mental.html（示例）
  - 填充"焦虑抑郁识别"subsection内容：
    - 焦虑症状：持续担心、睡眠困难、心慌气短
    - 抑郁症状：情绪低落、兴趣减退、自责自罪
    - 预警信号：持续超过2周、影响日常生活
    - 添加权威机构：WHO孕期心理健康指南
    - 添加外链：https://www.who.int/zh/health-topics/mental-health
  - 添加2张相关图片（外部图床）:
    - 情绪记录表示例
    - 焦虑症状自评图
  - 在"禁忌事项"中添加：
    - ❌ 不可忽视持续情绪低落
    - ❌ 不可自行服用抗抑郁药物
  - 添加常见问题：
    - Q: 孕早期情绪波动正常吗？
    - A: 孕早期激素变化会导致情绪波动，但若症状持续超过2周或影响日常生活，需寻求专业帮助。

  **Must NOT do**:
  - 不提供自我诊断
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 8
  - **Blocked By**: Task 2

  **References**:
  - `src/first-trimester-diet.html:113-126` - subsection结构示例
  - `src/first-trimester-diet.html:144-150` - 常见问题格式示例

  **Acceptance Criteria**:
  - [ ] 情绪监测量表内容完整
  - [ ] 焦虑抑郁识别内容完整
  - [ ] 包含2个权威机构外链
  - [ ] 包含2张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题

  **QA Scenarios**:
  ```
  Scenario: 情绪监测内容完整
    Tool: Bash (grep)
    Preconditions: first-trimester-mental.html exists
    Steps:
      1. grep "PHQ-9" src/first-trimester-mental.html
      2. grep "情绪记录" src/first-trimester-mental.html
      3. grep "焦虑症状" src/first-trimester-mental.html
      4. grep "抑郁症状" src/first-trimester-mental.html
    Expected Result: All 4 keywords present
    Failure Indicators: Any keyword missing
    Evidence: .sisyphus/evidence/task-7-content-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 8, 9)

- [x] 8. 放松技巧与角色转换（心理健康）

  **What to do**:
  - 填充"放松技巧"subsection内容：
    - 深呼吸练习：腹式呼吸，每次5-10分钟
    - 冥想引导：正念冥想、身体扫描
    - 渐进式肌肉放松：从脚趾到头部逐个放松
    - 添加权威机构：复旦大学附属华山医院心理科
    - 添加外链：https://www.huashan.org.cn/psychology-relaxation.html（示例）
  - 填充"角色转换适应"subsection内容：
    - 心理准备：接受身份变化、调整期望
    - 职业平衡：与领导沟通、调整工作节奏
    - 社交支持：与有经验的朋友交流、加入孕妇社群
    - 添加权威机构：中科院心理所孕期心理研究
    - 添加外链：https://www.psych.ac.cn/pregnancy-role.html（示例）
  - 添加2张相关图片（外部图床）:
    - 深呼吸练习示意图
    - 角色转换适应路径图
  - 在"禁忌事项"中添加：
    - ❌ 不可过度焦虑未来
    - ❌ 不可孤立自己
  - 添加常见问题：
    - Q: 如何缓解孕早期焦虑？
    - A: 通过深呼吸、冥想、与朋友交流等方式缓解焦虑，若持续严重可寻求专业心理咨询。

  **Must NOT do**:
  - 不提供专业心理治疗建议
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **Acceptance Criteria**:
  - [ ] 放松技巧内容完整
  - [ ] 角色转换适应内容完整
  - [ ] 包含2个权威机构外链
  - [ ] 包含2张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题

  **QA Scenarios**:
  ```
  Scenario: 放松技巧内容完整
    Tool: Bash (grep)
    Preconditions: first-trimester-mental.html exists
    Steps:
      1. grep "深呼吸" src/first-trimester-mental.html
      2. grep "冥想" src/first-trimester-mental.html
      3. grep "角色转换" src/first-trimester-mental.html
    Expected Result: All 3 keywords present
    Failure Indicators: Any keyword missing
    Evidence: .sisyphus/evidence/task-8-content-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 7, 9)

759:QJ|- [x] 9. 专业求助与QA验证（心理健康）

  **What to do**:
  - 填充"专业求助时机"subsection内容：
    - 寻求帮助的信号：持续情绪低落超过2周、严重焦虑影响生活、出现伤害自己或他人的念头
    - 专业资源：心理咨询师、精神科医生、孕期心理热线
    - 求助流程：先咨询产科医生，再转介心理科
    - 添加权威机构：北京安定医院孕期心理门诊
    - 添加外链：https://www.andinghospital.com.cn/pregnancy-clinic.html（示例）
  - 添加1张相关图片（外部图床）:
    - 心理求助流程图
  - 在"禁忌事项"中添加：
    - ❌ 不可忽视严重心理症状
    - ❌ 不可延误专业治疗
  - 添加常见问题：
    - Q: 什么时候需要寻求心理专业帮助？
    - A: 若情绪问题持续超过2周、严重影响日常生活，或出现伤害念头，需立即寻求专业心理帮助。
  - 验证HTML文件语法正确性
  - 验证所有外链可访问性
  - 验证所有图片链接有效性

  **Must NOT do**:
  - 不提供具体的医院或医生推荐
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Tasks 13-15
  - **Blocked By**: Tasks 7, 8

  **Acceptance Criteria**:
  - [ ] 专业求助时机内容完整
  - [ ] 包含1个权威机构外链
  - [ ] 包含1张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题
  - [ ] HTML验证通过
  - [ ] 所有外链可访问
  - [ ] 所有图片链接有效

  **QA Scenarios**:
  ```
  Scenario: HTML验证通过
    Tool: Bash (xmllint)
    Preconditions: first-trimester-mental.html exists
    Steps:
      1. xmllint --noout src/first-trimester-mental.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-9-html-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES
  - Message: `feat: add mental health content (TDD)`
  - Files: `src/first-trimester-mental.html`
  - Pre-commit: `xmllint --noout src/first-trimester-mental.html`

- [x] 10. 准爸爸行动指南与沟通技巧（家庭支持）

  **What to do**:
  - 填充"准爸爸行动指南"subsection内容：
    - 了解孕期知识：学习孕早期基础知识、参加产前课程
    - 日常照顾：分担家务、准备营养餐、陪伴散步
    - 情感支持：倾听感受、给予鼓励、共同规划未来
    - 添加权威机构：中国妇幼保健协会孕期伴侣指南
    - 添加外链：https://www.cmcha.org.cn/pregnancy-partner.html（示例）
  - 填充"夫妻沟通技巧"subsection内容：
    - 有效倾听：不急于给建议，先理解感受
    - 表达方式：用"我"开头表达感受，避免指责
    - 共同决策：重要问题一起商量，尊重彼此意见
    - 添加权威机构：上海第一妇婴保健院家庭心理科
    - 添加外链：https://www.firsthospital.com.cn/family-communication.html（示例）
  - 添加2张相关图片（外部图床）:
    - 准爸爸行动清单
    - 夫妻沟通技巧图
  - 在"禁忌事项"中添加：
    - ❌ 不可忽视妻子的情绪变化
    - ❌ 不可在孕期做出重大决策
  - 添加常见问题：
    - Q: 准爸爸在孕早期应该做什么？
    - A: 准爸爸应该学习孕期知识、分担家务、提供情感支持，最重要的是倾听和理解妻子的感受。

  **Must NOT do**:
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (with Tasks 11, 12)
  - **Blocks**: Task 11
  - **Blocked By**: Task 3

  **References**:
  - `src/first-trimester-diet.html:113-126` - subsection结构示例
  - `src/first-trimester-diet.html:144-150` - 常见问题格式示例

  **Acceptance Criteria**:
  - [ ] 准爸爸行动指南内容完整
  - [ ] 夫妻沟通技巧内容完整
  - [ ] 包含2个权威机构外链
  - [ ] 包含2张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题

  **QA Scenarios**:
  ```
  Scenario: 准爸爸指南内容完整
    Tool: Bash (grep)
    Preconditions: first-trimester-family.html exists
    Steps:
      1. grep "准爸爸" src/first-trimester-family.html
      2. grep "沟通技巧" src/first-trimester-family.html
      3. grep "倾听" src/first-trimester-family.html
      4. grep "共同决策" src/first-trimester-family.html
    Expected Result: All 4 keywords present
    Failure Indicators: Any keyword missing
    Evidence: .sisyphus/evidence/task-10-content-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 11, 12)

- [x] 11. 待产准备与医院选择（家庭支持）

  **What to do**:
  - 填充"待产准备清单"subsection内容：
    - 物品准备：孕妇装、婴儿用品、住院必需品
    - 时间规划：孕早期开始准备、孕中期采购、孕晚期打包
    - 财务准备：了解生育保险、预算规划
    - 添加权威机构：中国消费者协会孕期消费指南
    - 添加外链：https://www.cca.org.cn/pregnancy-shopping.html（示例）
  - 填充"医院选择指南"subsection内容：
    - 医院类型：三甲医院、专科医院、私立医院
    - 选择标准：医疗水平、交通便利、分娩方式支持、医保覆盖
    - 实地考察：参观产科、了解病房环境、咨询产科医生
    - 添加权威机构：国家卫生健康委医院等级评定
    - 添加外链：https://www.nhc.gov.cn/hospital-rating.html（示例）
  - 添加2张相关图片（外部图床）:
    - 待产准备清单模板
    - 医院选择评估表
  - 在"禁忌事项"中添加：
    - ❌ 不可盲目跟风选择医院
    - ❌ 不可忽视医院资质
  - 添加常见问题：
    - Q: 孕早期需要开始准备待产包吗？
    - A: 孕早期可以开始了解待产包内容，但不必着急购买，建议在孕中期开始逐步准备。

  **Must NOT do**:
  - 不推荐具体品牌产品
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (with Tasks 10, 12)
  - **Blocks**: Task 12
  - **Blocked By**: Task 3

  **Acceptance Criteria**:
  - [ ] 待产准备清单内容完整
  - [ ] 医院选择指南内容完整
  - [ ] 包含2个权威机构外链
  - [ ] 包含2张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题

  **QA Scenarios**:
  ```
  Scenario: 待产准备内容完整
    Tool: Bash (grep)
    Preconditions: first-trimester-family.html exists
    Steps:
      1. grep "待产准备" src/first-trimester-family.html
      2. grep "医院选择" src/first-trimester-family.html
      3. grep "三甲医院" src/first-trimester-family.html
      4. grep "实地考察" src/first-trimester-family.html
    Expected Result: All 4 keywords present
    Failure Indicators: Any keyword missing
    Evidence: .sisyphus/evidence/task-11-content-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (groups with 10, 12)

- [x] 12. 陪产准备与QA验证（家庭支持）

  **What to do**:
  - 填充"陪产准备"subsection内容：
    - 产前学习：参加陪产课程、了解分娩过程、学习助产技巧
    - 产程支持：陪伴鼓励、按摩缓解、协助呼吸、记录重要时刻
    - 产后关怀：照顾新生儿、支持妻子恢复、分担照顾责任
    - 添加权威机构：国际助产士联合会（ICM）陪产指南
    - 添加外链：https://www.internationalmidwives.org/birth-companion.html（示例）
  - 添加1张相关图片（外部图床）:
    - 陪产流程示意图
  - 在"禁忌事项"中添加：
    - ❌ 不可在产房拍照录像
    - ❌ 不可忽视妻子的需求
  - 添加常见问题：
    - Q: 准爸爸需要参加陪产课程吗？
    - A: 强烈建议参加。陪产课程可以了解分娩过程，学习如何有效支持妻子，缓解焦虑，增进夫妻感情。
  - 验证HTML文件语法正确性
  - 验证所有外链可访问性
  - 验证所有图片链接有效性

  **Must NOT do**:
  - 不添加超出用户要求的额外内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (with Tasks 10, 11)
  - **Blocks**: Tasks 13-15
  - **Blocked By**: Tasks 10, 11

  **Acceptance Criteria**:
  - [ ] 陪产准备内容完整
  - [ ] 包含1个权威机构外链
  - [ ] 包含1张外部图片
  - [ ] 包含2个禁忌事项（用❌标记）
  - [ ] 包含1个常见问题
  - [ ] HTML验证通过
  - [ ] 所有外链可访问
  - [ ] 所有图片链接有效

  **QA Scenarios**:
  ```
  Scenario: HTML验证通过
    Tool: Bash (xmllint)
    Preconditions: first-trimester-family.html exists
    Steps:
      1. xmllint --noout src/first-trimester-family.html
      2. Check exit code
    Expected Result: Exit code 0 (no errors)
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-12-html-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES
  - Message: `feat: add family support content (TDD)`
  - Files: `src/first-trimester-family.html`
  - Pre-commit: `xmllint --noout src/first-trimester-family.html`

- [x] 13. 跨模块一致性检查

  **What to do**:
  - 检查3个HTML页面的整体结构一致性：
    - 确认所有页面包含相同的章节结构（概述、核心要点、常见问题、免责声明）
    - 确认CSS样式命名规范一致
    - 确认外链格式一致（权威机构名称+外链）
  - 检查内容质量一致性：
    - 确认所有禁忌事项都使用❌图标标记
    - 确认所有图片都有alt属性
    - 确认所有外链都是权威机构来源
  - 检查导航链接一致性：
    - 确认first-trimester.html中所有链接正确指向新文件
    - 确认面包屑导航正确
    - 确认返回首页链接正确
  - 生成一致性检查报告，保存到.sisyphus/evidence/consistency-report.md

  **Must NOT do**:
  - 不修改内容（只检查和报告）

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (with Tasks 14, 15)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 6, 9, 12

  **Acceptance Criteria**:
  - [ ] 一致性检查报告已生成
  - [ ] 报告包含结构一致性、内容质量、导航链接检查结果
  - [ ] 所有问题已记录

  **QA Scenarios**:
  ```
  Scenario: 一致性检查报告生成
    Tool: Bash (ls)
    Preconditions: consistency check completed
    Steps:
      1. ls .sisyphus/evidence/consistency-report.md
      2. Check file exists and not empty
    Expected Result: File exists and size > 0
    Failure Indicators: File missing or empty
    Evidence: .sisyphus/evidence/task-13-report-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Consistency report: .sisyphus/evidence/consistency-report.md

  **Commit**: NO (groups with 14, 15)

- [x] 14. 更新首页导航链接

  **What to do**:
  - 检查first-trimester.html中的链接是否都正确指向新文件：
    - "孕早期孕妈安全指南" → first-trimester-safety.html
    - "孕早期心理健康指南" → first-trimester-mental.html
    - "孕早期家庭支持指南" → first-trimester-family.html
  - 检查index.html中是否有孕早期模块的链接（如果有，确保正确）
  - 验证所有链接都可正常工作

  **Must NOT do**:
  - 不修改其他内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (with Tasks 13, 15)
  - **Blocks**: Task 15
  - **Blocked By**: Task 13

  **Acceptance Criteria**:
  - [ ] first-trimester.html中所有链接正确
  - [ ] index.html中相关链接正确（如果有）
  - [ ] 所有链接可正常工作

  **QA Scenarios**:
  ```
  Scenario: 链接正确性验证
    Tool: Bash (grep + curl)
    Preconditions: HTML files exist
    Steps:
      1. grep "first-trimester-safety" src/first-trimester.html | wc -l
      2. grep "first-trimester-mental" src/first-trimester.html | wc -l
      3. grep "first-trimester-family" src/first-trimester.html | wc -l
      4. curl -I -s http://localhost:8000/src/first-trimester-safety.html | head -1
    Expected Result: Each link appears exactly once, files accessible
    Failure Indicators: Links missing or incorrect
    Evidence: .sisyphus/evidence/task-14-link-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Link check report: .sisyphus/evidence/task-14-link-check.txt

  **Commit**: NO (groups with 13, 15)

- [x] 15. 完整性验证与文档

  **What to do**:
  - 验证所有交付物完整性：
    - 3个HTML文件已创建且内容完整
    - 每个文件包含至少3张图片
    - 每个文件包含至少5个权威机构外链
    - 每个文件包含禁忌事项（用❌标记）
    - 每个文件包含常见问题
    - 每个文件包含免责声明
  - 验证所有HTML文件通过语法检查
  - 验证所有外链可访问性（抽样10%）
  - 验证所有图片链接有效性（抽样10%）
  - 生成最终验证报告，保存到.sisyphus/evidence/final-verification-report.md
  - 创建交付文档，列出所有创建的文件和关键信息

  **Must NOT do**:
  - 不修改内容（只验证和报告）

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (with Tasks 13, 14)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: Tasks 13, 14

  **Acceptance Criteria**:
  - [ ] 最终验证报告已生成
  - [ ] 报告确认所有交付物完整
  - [ ] 所有HTML文件通过语法检查
  - [ ] 抽样的外链和图片链接有效
  - [ ] 交付文档已创建

  **QA Scenarios**:
  ```
  Scenario: 最终验证报告生成
    Tool: Bash (ls)
    Preconditions: verification completed
    Steps:
      1. ls .sisyphus/evidence/final-verification-report.md
      2. Check file exists and not empty
      3. grep "完整性" .sisyphus/evidence/final-verification-report.md
    Expected Result: File exists, size > 0, contains "完整性"
    Failure Indicators: File missing or incomplete
    Evidence: .sisyphus/evidence/task-15-verification-check.txt
  ```

  **Evidence to Capture**:
  - [ ] Final verification report: .sisyphus/evidence/final-verification-report.md
  - [ ] Delivery document: .sisyphus/evidence/delivery-document.md

  **Commit**: YES
  - Message: `chore: final integration and verification`
  - Files: `src/first-trimester.html`, verification reports
  - Pre-commit: All HTML validation

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check external links). For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `xmllint --noout` for HTML validation on all new files. Review for broken external links, invalid image URLs, missing alt attributes, inconsistent formatting. Check for AI slop: excessive comments, generic content, placeholder text.
  Output: `HTML [PASS/FAIL] | Links [N/N valid] | Images [N/N valid] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Open each HTML page in browser, verify layout renders correctly, all images load, all external links work. Test navigation between pages. Verify mobile responsiveness. Capture screenshots to .sisyphus/evidence/final-qa/.
  Output: `Pages [N/N rendered] | Links [N/N working] | Images [N/N loaded] | Mobile [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual HTML content. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-module contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1-3**: `feat: create HTML skeleton for early pregnancy modules` — first-trimester-safety.html, first-trimester-mental.html, first-trimester-family.html
- **4-6**: `feat: add mom safety content (TDD)` — first-trimester-safety.html, xmllint validation
- **7-9**: `feat: add mental health content (TDD)` — first-trimester-mental.html, xmllint validation
- **10-12**: `feat: add family support content (TDD)` — first-trimester-family.html, xmllint validation
- **13-15**: `chore: final integration and verification` — first-trimester.html, all verification reports

---

## Success Criteria

### Verification Commands
```bash
# HTML验证
xmllint --noout src/first-trimester-safety.html
xmllint --noout src/first-trimester-mental.html
xmllint --noout src/first-trimester-family.html

# 检查外部链接（抽样）
curl -I -s https://www.who.int/zh/health-topics/pregnancy | head -1

# 浏览器渲染验证（Playwright）
# 由Agent F3执行
```

### Final Checklist
- [ ] 3个HTML文件已创建
- [ ] 每个页面包含概述、核心要点、权威推荐、禁忌事项、常见问题、免责声明
- [ ] 每个页面包含至少3张外部图片
- [ ] 每个页面包含至少5个权威机构外链
- [ ] 所有HTML文件通过xmllint验证
- [ ] 所有图片链接有效
- [ ] 所有外部链接可访问
- [ ] 导航链接正确
- [ ] 响应式布局正常
- [ ] 不违反任何"Must NOT Have"约束
