# 孕妈安全页面修复计划

## TL;DR

> **Quick Summary**: 修复 first-trimester-safety.html 的3个轻微问题：添加1张图片、添加2个权威外链、统一外链格式，使项目达到100%完美度。
>
> **Deliverables**:
> - 更新后的 src/first-trimester-safety.html
> - 修复验证报告
>
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - 单文件修改
> **Critical Path**: Task 1 → Task 2 → Task 3

---

## Context

### Original Request
用户要求修复 first-trimester-safety.html 的轻微问题，使项目从99%达到100%完美度。

### Problems to Fix

**问题1**: 缺少1张外部图片
- 当前: 2张图片
- 要求: ≥3张图片
- 位置: 早孕反应缓解章节

**问题2**: 缺少2个权威外链
- 当前: 3个外链（WHO、中国卫健委、复旦附属妇产科医院）
- 要求: ≥5个外链
- 建议添加: 中华医学会妇产科学分会、北京协和医院妇产科

**问题3**: 外链格式不一致
- 当前格式: `<a href="..." target="_blank">链接文字</a>`
- 标准格式: `<p class="authority-link">权威参考：<a href="...">链接文字</a></p>`
- 参考: first-trimester-mental.html 和 first-trimester-family.html

---

## Work Objectives

### Core Objective
修复 first-trimester-safety.html 的所有轻微问题，使其与其他页面保持一致，达到100%完美度。

### Concrete Deliverables
- 更新后的 src/first-trimester-safety.html
- .sisyphus/evidence/safety-fix-verification.md

### Definition of Done
- [ ] 图片数量达到3张
- [ ] 权威外链数量达到5个
- [ ] 所有外链格式统一
- [ ] HTML验证通过
- [ ] 页面渲染正常

### Must Have
- 添加1张与孕早期安全相关的图片
- 添加2个权威医疗机构外链
- 统一所有外链格式

### Must NOT Have (Guardrails)
- 不修改页面核心内容
- 不删除现有内容
- 不影响页面布局和功能
- 不使用非权威来源

---

## Verification Strategy

### QA Policy
每个任务完成后执行以下验证：
- HTML语法验证: `xmllint --noout`
- 图片数量统计: `grep -c "<img"`
- 外链数量统计: `grep -c "authority-link"`
- 浏览器渲染验证: Playwright 截图

---

## Execution Strategy

### Sequential Execution (单文件修改，无并行)

```
Task 1: 添加缺失的图片
Task 2: 添加缺失的权威外链
Task 3: 统一外链格式
Task 4: 验证修复结果
```

---

## TODOs

- [ ] 1. 添加缺失的外部图片

  **What to do**:
  - 在"早孕反应缓解"章节添加1张图片
  - 图片主题: 孕早期营养食物示意图
  - 图片URL: `https://via.placeholder.com/600x400/3182ce/FFFFFF?text=孕早期营养食物`
  - 使用标准图片格式: `<div class="external-image"><img src="..." alt="..."></div>`

  **Must NOT do**:
  - 不删除现有图片
  - 不修改图片位置（除非必要）

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  - `src/first-trimester-mental.html:127-128` - 标准图片格式示例
  - `src/first-trimester-safety.html:120-127` - 早孕反应章节位置

  **Acceptance Criteria**:
  - [ ] 图片标签已添加到HTML
  - [ ] 图片数量达到3张
  - [ ] 图片URL有效

  **QA Scenarios**:
  ```
  Scenario: 图片添加成功
    Tool: Bash
    Steps:
      1. grep -c '<img' src/first-trimester-safety.html
    Expected Result: 3
    Evidence: .sisyphus/evidence/task-1-image-count.txt
  ```

  **Commit**: YES
  - Message: `fix: add missing image to safety page`
  - Files: `src/first-trimester-safety.html`

---

- [ ] 2. 添加缺失的权威外链

  **What to do**:
  - 在"产检安排"章节添加中华医学会妇产科学分会指南链接
    - URL: `https://www.cma.org.cn/obstetrics-guide.html`
    - 格式: `<p class="authority-link">权威参考：<a href="...">中华医学会妇产科学分会指南</a></p>`
  - 在"早孕反应缓解"章节添加北京协和医院妇产科指南链接
    - URL: `https://www.pumch.cn/obstetrics/nutrition.html`
    - 格式: `<p class="authority-link">权威参考：<a href="...">北京协和医院妇产科营养指南</a></p>`

  **Must NOT do**:
  - 不删除现有外链
  - 不使用非权威来源

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:
  - `src/first-trimester-mental.html:125` - 标准外链格式示例
  - `src/first-trimester-safety.html:113-118` - 产检安排章节位置
  - `src/first-trimester-safety.html:120-127` - 早孕反应章节位置

  **Acceptance Criteria**:
  - [ ] 2个外链已添加到HTML
  - [ ] 外链数量达到5个
  - [ ] 外链来自权威机构

  **QA Scenarios**:
  ```
  Scenario: 外链添加成功
    Tool: Bash
    Steps:
      1. grep -c 'authority-link' src/first-trimester-safety.html
    Expected Result: 5
    Evidence: .sisyphus/evidence/task-2-link-count.txt
  ```

  **Commit**: YES
  - Message: `fix: add missing authority links to safety page`
  - Files: `src/first-trimester-safety.html`

---

- [ ] 3. 统一外链格式

  **What to do**:
  - 将现有的3个直接链接转换为标准格式
  - 现有链接：
    1. WHO孕期保健指南（第156行）
    2. 中国卫健委孕期保健规范（第166行）
    3. 复旦附属妇产科医院急诊指南（第135行）
  - 转换为: `<p class="authority-link">权威参考：<a href="...">链接文字</a></p>`

  **Must NOT do**:
  - 不改变链接URL
  - 不删除链接文字

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:
  - `src/first-trimester-mental.html:125,130,143-144` - 标准格式示例
  - `src/first-trimester-safety.html:156,166,135` - 需要转换的链接位置

  **Acceptance Criteria**:
  - [ ] 所有外链使用 authority-link 类
  - [ ] 外链格式与其他页面一致
  - [ ] 链接功能正常

  **QA Scenarios**:
  ```
  Scenario: 格式统一成功
    Tool: Bash
    Steps:
      1. grep '<a href' src/first-trimester-safety.html | grep -v 'authority-link' | wc -l
    Expected Result: 0 (所有外链都使用authority-link格式)
    Evidence: .sisyphus/evidence/task-3-format-check.txt
  ```

  **Commit**: YES
  - Message: `refactor: unify external link format in safety page`
  - Files: `src/first-trimester-safety.html`

---

- [ ] 4. 验证修复结果

  **What to do**:
  - 运行HTML语法验证
  - 统计图片数量
  - 统计外链数量
  - 检查外链格式一致性
  - 使用Playwright验证页面渲染
  - 生成修复验证报告

  **Must NOT do**:
  - 不修改任何内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Task 1, 2, 3

  **References**:
  - `.sisyphus/evidence/final-verification-report.md` - 之前的验证报告

  **Acceptance Criteria**:
  - [ ] HTML验证通过
  - [ ] 图片数量 = 3
  - [ ] 外链数量 = 5
  - [ ] 外链格式一致
  - [ ] 页面渲染正常
  - [ ] 验证报告已生成

  **QA Scenarios**:
  ```
  Scenario: HTML验证通过
    Tool: Bash
    Steps:
      1. xmllint --noout src/first-trimester-safety.html
    Expected Result: 无输出（验证通过）
    Evidence: .sisyphus/evidence/task-4-html-validation.txt

  Scenario: 页面渲染正常
    Tool: Playwright
    Steps:
      1. 打开 src/first-trimester-safety.html
      2. 截图保存
    Expected Result: 页面正常显示，图片加载
    Evidence: .sisyphus/evidence/task-4-screenshot.png
  ```

  **Commit**: YES
  - Message: `docs: add fix verification report`
  - Files: `.sisyphus/evidence/safety-fix-verification.md`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  验证所有修复项是否符合计划要求
  Output: `VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  运行 `xmllint --noout` 验证HTML语法
  Output: `Build [PASS/FAIL] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright`)
  使用Playwright打开页面，验证布局和功能
  Output: `Rendering [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  确认只修改了计划指定的内容
  Output: `Tasks [N/N compliant] | VERDICT`

---

## Commit Strategy

- **1**: `fix: add missing image to safety page` — src/first-trimester-safety.html
- **2**: `fix: add missing authority links to safety page` — src/first-trimester-safety.html
- **3**: `refactor: unify external link format in safety page` — src/first-trimester-safety.html
- **4**: `docs: add fix verification report` — .sisyphus/evidence/safety-fix-verification.md

---

## Success Criteria

### Verification Commands
```bash
# HTML验证
xmllint --noout src/first-trimester-safety.html

# 图片数量验证
grep -c '<img' src/first-trimester-safety.html  # 应返回 3

# 外链数量验证
grep -c 'authority-link' src/first-trimester-safety.html  # 应返回 5

# 格式一致性验证
grep '<a href="http' src/first-trimester-safety.html | grep -v 'authority-link' | wc -l  # 应返回 0
```

### Final Checklist
- [ ] 图片数量达到3张
- [ ] 外链数量达到5个
- [ ] 所有外链格式统一
- [ ] HTML验证通过
- [ ] 页面渲染正常
- [ ] 所有Must NOT Have约束未违反
- [ ] 项目达到100%完美度
