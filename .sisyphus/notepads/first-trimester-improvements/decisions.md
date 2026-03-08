# Decisions - First Trimester Improvements

## Task 3: Content Depth Expansion (2026-03-05)

### Decision: Use sed for HTML Insertion
**Rationale:** Edit tool encounters JSON parsing issues with quotes and special characters in multi-line HTML. sed with proper escaping is more reliable for bulk HTML insertion.

### Decision: Practical, Actionable Content
**Rationale:** Users benefit from concrete, executable guidance rather than abstract advice. Each bullet point provides a specific action or example they can follow.

### Decision: Maintain Medical Caution Tone
**Rationale:** Content must remain educational, not diagnostic. All health-related content includes disclaimer reminders and suggests consulting professionals for serious concerns.


## Task: Visual Beautification (2026-03-05)

### Decision: CSS-Only Enhancements
**Rationale:** Task specified no JS changes. All visual improvements achieved through pure CSS, maintaining existing functionality and reducing potential for bugs.

### Decision: Subtle Healthcare Aesthetic
**Rationale:** Medical/education content should feel trustworthy and calm, not flashy. Used:
- Teal/cyan color family (trust, healthcare)
- Subtle shadows (depth without distraction)
- Gentle hover effects (interactivity without overstimulation)
- Generous whitespace (readability, calmness)

### Decision: Preserve Inline Styles Hierarchy
**Rationale:** HTML files have page-specific inline styles for header gradients (different colors per page). Added base styles in main CSS that can be overridden by inline styles where needed. This allows page-specific branding while sharing common card/typography patterns.

### Decision: Mobile-First Readability
**Rationale:** Healthcare content is often accessed on mobile. Prioritized:
- Comfortable line-height (1.7-1.8)
- Adequate spacing between list items
- Readable font sizes (no smaller than 14px equivalent)
- Touch-friendly navigation buttons


## Task: First-Trimester Detail Layout Polish (2026-03-06)

### Decision: Use shared `.article-layout` wrapper inside `<main>`
**Rationale:** This preserves the top-first reading order on smaller viewports while enabling a consistent desktop two-column layout across all four detail pages with minimal HTML churn.

### Decision: Make `.article-nav` sticky only at `min-width: 1024px`
**Rationale:** Sticky sidebar behavior improves long-form scanning on desktop, but static top placement remains the expected and safest behavior for tablet/mobile layouts.

### Decision: Introduce final authoritative spacing overrides near the end of `style.css`
**Rationale:** The stylesheet already contains overlapping `.content-section`, `.subsection`, and `.article-nav` rules. Appending the final layout rules avoids risky rewrites and clearly defines the responsive article-detail presentation that should win in cascade order.
