# Pregnancy Education Site MVP Plan

## TL;DR
- MVP 将建立一个以饮食安全、孕妈/宝宝安全、心理健康为核心的孕期科普站点，聚焦孕早期、孕中期、孕晚期三阶段内容，提供真实案例与科学证据支撑，且实现家庭（尤其是丈夫）支持要点的初步指引。区域限定为中国大陆，语言为简体中文。初期以科普教育为主，后续逐步引入医学审核与证据等级框架，逐步扩展国际化与多语言能力的评估。计划以阶段性里程碑推进，确保核心内容先行稳定上线。 

## Context
- MVP 路线：Plan Direction A（MVP 教育型中心）
- 内容范围：孕早期/孕中期/孕晚期三阶段的注意事项，跨阶段要点，真实案例与证据呈现，家庭支持要点（丈夫照护、情绪支持等）
- 区域与语言： Mainland China，Simplified Chinese，单语言 MVP
- 证据策略：初期以权威科普指南为主，后续引入外部医学审核与证据等级框架
- 编辑与 QA：个人网站自我审核为主，未来引入外部顾问/同行评审的扩展
- MVP 上线节奏：计划/阶段性里程碑导向，先上线核心内容，逐步扩展
- 医学伦理与案例：外部合作机构提供、需伦理审批与去识别化处理
- 安全性与合规：隐私保护、数据治理、无障碍设计作为底线

## Work Objectives
- 构建孕早期/孕中期/孕晚期三阶段的内容框架与页面模板
- 纳入跨阶段的通用要点，如家庭支持、情绪管理与沟通技巧
- 建立案例库入口与证据引用模板，确保匿名化与可追溯性
- 设计并落地初步医学审核流程（内部自审 + 外部顾问渐进加入）
- 制定伦理与案例 sourcing 流程（知情同意、去识别化、伦理审核）
- 确立信息架构、导航、搜索与无障碍设计的落地要点
- 设定 MVP 的上线里程碑、监控指标与迭代计划

## Verification Strategy (Agent-Executed QA)
- 每个核心内容单元均包含明确的 QA 场景：1 个 Happy-path 场景 + 1 个 Failure/Edge-case 场景
- QA 场景须指定具体选择器、精确数据、断言以及证据路径
- 证据引用、案例来源需具备可追溯性与合规证明
- 文本内容的科学性与准确性通过后续外部顾问审核验证

## Execution Strategy
- Wave 1: 基础信息架构、内容模板与 taxonomy 设计；核心页面骨架与导航草图；初步数据模型与案例匿名化工作流
- Wave 2: 三阶段内容模板填充、案例模板与证据引用体系搭建；家庭支持子模块初版设计
- Wave 3: 医学审核准备与内部/外部顾问接入；内容治理规范与伦理流程落地
- Wave 4: 可访问性、SEO、隐私与数据分析的上线准备
- Final: 合规性审查、验证通过与上线准备

---

## TODOs
- 1. 设定内容 taxonomy：孕早期/中期/晚期的子主题模板
- 2. 确立证据等级与引用模板文档
- 3. 制定案例 sourcing 与 anonymization 的流程
- 4. 设计家庭支持模块的框架（丈夫视角、沟通脚本）
- 5. 构建内容治理与医学审核的初步流程文档
- 6. 信息架构原型（站点地图、导航、标签、搜索、无障碍要点）
- 7. MVP 的上线监控指标与数据驱动目标
- 8. 明确隐私保护与数据治理的边界

---

## Final Verification Wave
- 进行跨模块的集成验证、无障碍测试、SEO 基线验证等
- 由内部/外部顾问共同完成最终审核

## Evidence Strategy & Governance
- No medical review in MVP. All content will be sourced from authoritative, evidence-based sources with transparent citation practices.
- Evidence sources and levels (Tiered)
- Evidence Entrypoints: An explicit navigation entry named Evidence & Citations, plus a separate Evidence-Guidance page/document
- Case Sourcing: Public anonymized cases (Tier 3) plus anonymized cases from Mainland China hospitals with ethics/compliance handling
- Update Cadence: Full internal review every 6-12 months; immediate updates triggered by major guideline releases
- Documentation: Evidence-Guidance.md dedicated document detailing policies, templates, and workflow
- Plan integration: Navigation should include Evidence & Citations and Evidence-Guidance as primary access points

## Plan Skeleton Adjustments (for confirmation)
- Evidence Strategy & Governance section added to plan; Evidence-Guidance.md to be created
- Ensure citation templates are defined and required for every factual claim
- Ensure domestic sources are integrated into Tier 1 list and included in citations

## Commit Strategy
- type(scope): desc

## Success Criteria
- 核心内容三阶段覆盖、案例与证据引用具备可追溯性
- 医学审核流程初步落地，外部顾问参与度达到门槛
- 用户体验基础良好（导航、搜索、可访问性达到基本要求）
- MVP 能在计划时间内上线并达到初步访问目标

## Plan Saved To
.sisyphus/plans/pregnancy-education-site.md
