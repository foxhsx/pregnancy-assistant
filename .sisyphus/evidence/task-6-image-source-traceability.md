# Task 6 Image Source Traceability Report

## Scope
- Target pages reviewed: `src/first-trimester-safety.html`, `src/first-trimester-family.html`
- Baseline cross-check: `src/first-trimester.html`, `.sisyphus/evidence/final-verification-report.md`
- Decision boundary: only this round's relevant first-trimester page images; no site-wide replacement

## Summary Decision
- No mainland-domain replacement was made in this task.
- All 8 reviewed images remain in place because a better mainland source was **not** proven legal, stable, and traceable within this task scope.
- Current remote image URLs were reachable during this run, but reachability alone is **not** sufficient provenance.
- Existing `alt` text on the reviewed images is already specific enough to describe page intent; no HTML correction was necessary.

## Reviewed Images And Decisions

| Page | Location | Current URL Domain | Current alt | Decision | Rationale | Risk | Follow-up |
|---|---|---|---|---|---|---|---|
| `first-trimester-safety.html` | NT 时间窗与就诊准备 | `images.unsplash.com` | `孕早期产检流程图` | Retain | Alt matches nearby NT/产检语境; no verified mainland replacement with clear license/provenance was established | Overseas CDN may be unstable in some mainland networks; provenance remains platform-level, not institution-level | If replacement is later required, prefer official mainland hospital / 妇幼 / 卫健系统公开可复用图示 with explicit attribution terms |
| `first-trimester-safety.html` | 活动建议与停止边界 | `images.unsplash.com` | `孕期适宜运动示意图` | Retain | Alt accurately reflects supporting illustration; no provably legal/stable mainland substitute identified in scope | Same cross-border access and provenance traceability risk | Replace only when a mainland source has explicit usage basis and durable URL |
| `first-trimester-safety.html` | 活动建议与停止边界 | `images.unsplash.com` | `孕早期急救流程` | Retain | Alt is action-oriented and consistent with adjacent emergency copy; no verified mainland source found | Readers may infer medical workflow authority from a generic stock image | Future replacement should prefer official emergency/产科 guidance graphics rather than lifestyle stock imagery |
| `first-trimester-family.html` | 准爸爸行动指南 | `images.unsplash.com` | `准爸爸行动清单` | Retain | Alt is concise and aligned with section purpose; no verified mainland-domain family-support image with reusable rights found | Mainland-priority goal not met at source-domain level | Future traceability work can target official maternal-health education posters or hospital公众号 assets only if reuse rights are clear |
| `first-trimester-family.html` | 夫妻沟通技巧 | `images.unsplash.com` | `夫妻沟通技巧图` | Retain | Alt remains accurate; no clearly attributable mainland replacement confirmed | Generic lifestyle image may feel less authoritative than institutional educational art | Replace only with clearly attributable educational infographic, not unverified web reposts |
| `first-trimester-family.html` | 待产准备清单 | `images.unsplash.com` | `待产准备清单模板` | Retain | Alt matches checklist context; no legal/stable mainland template image source verified | May be interpreted as a specific template while actually illustrative | If later replaced, prefer self-authored checklist graphic or official hospital downloadable checklist |
| `first-trimester-family.html` | 医院选择指南 | `images.unsplash.com` | `医院选择评估表` | Retain | Alt supports the comparison/assessment framing; no mainland-domain evaluative chart with clear provenance identified | Stock image does not itself prove hospital selection criteria | Future replacement should prefer self-authored table graphic or official public hospital service guide imagery |
| `first-trimester-family.html` | 陪产准备 | `images.unsplash.com` | `陪产流程示意图` | Retain | Alt fits surrounding陪产内容; no traceable mainland replacement confirmed in task window | Generic medical stock image may imply process authority beyond the image source | If upgraded later, use official hospital陪产流程图 with reusable/public terms or create an internal diagram |

## Accessibility And Source-Review Notes
- Reviewed image count in scope: 8
- `src/first-trimester.html` was checked for this task boundary and did not require image-source action.
- All reviewed images include non-empty `alt` text.
- Alt review outcome: current wording is sufficiently specific for supporting illustrative images; no minimal correction required.
- No `figcaption` or inline source note was added to HTML in this task because provenance could not be strengthened by adding a weak or incomplete attribution string.

## Link Accessibility Check Log
Command type: non-mutating `curl -I -L --max-time 12 --connect-timeout 5`

| Label | URL Domain | Result | Notes |
|---|---|---|---|
| safety-nt | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| safety-exercise | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| safety-emergency | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| family-dad | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| family-communication | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| family-bag | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| family-hospital | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |
| family-birth | `images.unsplash.com` | HTTP 200 | `content-type: image/jpeg` |

## Why No Mainland Replacement Was Made
1. This task prioritizes **traceability and justified retention**, not superficial replacement.
2. A mainland-domain URL alone would not prove legality, stability, or reusability.
3. Within the allowed scope, no official mainland source package was established for these exact image intents.
4. Replacing with reposted images, CDN mirrors, or unclear公众号/博客 assets would increase compliance risk.

## Recommended Next Step
- If Task 7 or later work needs stronger provenance, prefer one of these in order:
  1. self-authored diagrams/checklists for process-oriented sections;
  2. official mainland public-hospital / 妇幼 / 卫健委 graphics with explicit public-use basis;
  3. otherwise retain current stock images and keep the written rationale.
