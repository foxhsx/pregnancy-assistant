# Learnings - First Trimester Improvements

## Task 3: Content Depth Expansion (2026-03-05)

### What Worked
- Using sed command for inserting multi-line HTML blocks when Edit tool has issues with special characters
- Placing new subsections after existing content sections for natural flow
- Using `<article class="subsection">` wrapper maintains consistent styling

### Patterns Discovered
- Each new section should have:
  - H3 heading with clear, actionable title
  - Brief intro paragraph (`<p>`)
  - Unordered list with 4+ practical bullet points
- Chinese content uses full-width punctuation for consistency

### File Structure
- New sections placed inside existing `<section class="content-section">` blocks
- Before `<div class="disclaimer-box">` to maintain layout integrity

### Verification Approach
- grep for exact heading strings confirms presence
- Manual read of line ranges confirms bullet count >= 4

## Heading Locations (for future reference)
- diet.html: `一日饮食示例（可执行）` line 156, `孕吐高发时段应对策略` line 167
- safety.html: `危险信号分级处理（立即/尽快/观察）` line 175, `产检前准备清单` line 196
- mental.html: `每日10分钟情绪稳定练习` line 166, `何时需要专业心理支持` line 177
- family.html: `伴侣支持行动清单` line 147, `高频冲突沟通脚本` line 158

## Content Enrichment Learnings (Task 3)

### Approach
- Used direct file writing with bash heredoc for large HTML content blocks
- Avoided JSON parsing issues by writing complete files instead of using edit tool with embedded HTML
- Preserved existing navigation structure while adding content

### Content Strategy
- Added practical, actionable content: checklists, scenarios, scripts, step-by-step guidance
- Maintained medical-education tone with cautious disclaimers
- Organized new content under clear h3 headings within article.subsection blocks
- Added FAQ sections with common questions using details/summary for expandable Q&A

### File-by-File Changes
1. **diet.html** (216 → 305 lines, +89 lines)
   - Added: 补充剂服用指南, 水分补充要点, 不同孕周营养重点, 食品安全检查清单
   - Expanded: 营养均衡 with specific targets, 忌口食物 with alternatives
   - Enhanced: 孕吐应对 with severe case guidance
   - Added 4 FAQs

2. **safety.html** (257 → 322 lines, +65 lines)
   - Expanded: 产检安排 with detailed first visit items
   - Expanded: 早孕反应 with multiple symptoms and remedies
   - Added: 环境安全, 用药安全, 工作与生活平衡, 性生活安全
   - Enhanced: 危险信号分级处理 with 3 severity levels
   - Added 4 FAQs

3. **mental.html** (248 → 304 lines, +56 lines)
   - Added: 常见焦虑场景及应对 with 3 scenarios (health, career, finance)
   - Added: 睡眠改善策略, 夫妻关系维护
   - Enhanced: 情绪管理 with causes and monitoring
   - Enhanced: 何时需要专业支持 with specific indicators
   - Added 4 FAQs

4. **family.html** (239 → 356 lines, +117 lines)
   - Added: 夫妻沟通实用脚本 with 4 common scenarios
   - Added: 家庭成员支持分工, 孕期分阶段准备计划
   - Enhanced: 待产包清单 with categorized items
   - Added: 财务准备要点, 陪产准备指南
   - Added 4 FAQs

### Technical Notes
- Used heredoc (`cat > file << 'EOF'`) to write complete HTML files
- Preserved all CSS, navigation, breadcrumb, and article-nav structures
- All files validated: no unclosed tags, matching article open/close, valid h3 counts



## Task: Visual Beautification (2026-03-05)

### What Worked
- Appending new CSS rules to the end of stylesheet preserves existing functionality
- Using CSS custom properties (variables) for consistency with existing design system
- Subtle hover effects (translateY + shadow) enhance interactivity without being distracting

### Patterns Discovered
- Card hover effect pattern:
  - base: subtle shadow + border
  - hover: stronger shadow + slight lift (-2px) + transition
- Typography hierarchy:
  - h1: 3xl (2rem) for page title
  - h2: 2xl (1.5rem) with bottom border for section headings
  - h3: xl (1.25rem) for subsections
  - p: base with 1.8 line-height for readability

### Visual Enhancements Applied
1. **Subsection cards**: 12px border-radius, subtle teal-tinted shadow, hover lift effect
2. **Section headings**: bottom border using primary color for visual separation
3. **Article navigation**: pill-shaped buttons (20px radius), gradient background
4. **Disclaimer box**: warm gradient background, left border accent
5. **Authority links**: dashed underline that disappears on hover
6. **Mobile optimizations**: reduced padding, smaller headings, optimized list margins

### Responsive Considerations
- Under 768px: reduced card padding (xl → lg), smaller fonts, column layouts
- Touch targets remain accessible (buttons >= 44px tap area)
- Lists get reduced left margin for better mobile space utilization

## Task: First-Trimester Detail Layout Polish (2026-03-06)

### What Worked
- Moving the article nav inside a shared `.article-layout` wrapper allowed mobile-first DOM order to stay intact while enabling desktop grid layout.
- Giving the nav its own `.article-nav__inner` card made sticky behavior and spacing independent from older global `.article-nav` rules.
- Final, low-specificity override rules placed at the end of `style.css` cleanly overrode earlier overlapping card spacing styles without touching article content.

### Verification Learnings
- Browser verification is best done against one representative first-trimester page because all four now share the same wrapper structure and CSS selectors.
- Sticky verification is more reliable when comparing nav top position before and after scroll instead of checking CSS alone.

## Task 6: Image Traceability Closure (2026-03-08)

### Reusable Rule
- For pregnancy-education illustrations, mainland-priority is subordinate to provenance quality: if a mainland-domain image cannot be shown to be legal, stable, and traceable, retain the current image and document the reason instead of swapping to an unclear source.

### Verification Pattern
- For remote images, pair source review with a non-mutating `curl -I -L` reachability check; treat `HTTP 200` as availability evidence only, not as proof of copyright or institutional authority.

## Task 7: Final Regression Closure (2026-03-08)

### Reusable Regression Pattern
- For shared first-trimester detail pages, one closure suite can cover both content assertions and layout baselines if it records two machine-readable outputs: a desktop metrics JSON (sticky/image/source checks) and a mobile metrics JSON (single-column/no-overflow checks).

### Smoke-Test Maintenance Rule
- Keep legacy smoke tests aligned with the current content contract; otherwise they become false blockers during closure even when the page itself is correct.
