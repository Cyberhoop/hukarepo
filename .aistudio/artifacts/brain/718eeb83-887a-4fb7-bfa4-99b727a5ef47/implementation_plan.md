# WordPress-Style Bulk SEO Editor in Admin Panel

Add a dedicated **Bulk SEO Editor** view inside the Admin Panel's **SEO & Ranking (Yoast)** suite that renders a high-density, interactive spreadsheet-style table of all website pages—allowing admins to view and rapidly edit **SEO Titles**, **Meta Descriptions**, **Focus Keywords**, and **Robots Indexing Toggles** side-by-side while watching **Yoast SEO Scores** and character progress bars recalculate in real time.

## User Review & Critical Decisions

> [!IMPORTANT]
> The Bulk SEO Editor is designed around the exact preferences confirmed during clarification and integrates directly with the existing server-side and client-side SEO synchronization pipeline.

- **Confirmed Decision 1 (Inline Editable Columns)**: Each page row in the Bulk SEO Editor exposes inline editing for **SEO Title (`<title>`)**, **Meta Description**, **Focus Keyphrase**, and **Robots Index / Noindex Toggle**, alongside the page's route path and real-time **Yoast SEO Score (`0–100`)**.
- **Confirmed Decision 2 (Productivity & QA Tools)**:
  - **Live Character Counters & Length Progress Bars per Row**: Instant visual feedback for Title (`50–60` chars ideal) and Meta Description (`120–160` chars ideal) directly beneath each inline input.
  - **Filter by SEO Score Status & Search**: Client-side search bar (filtering by page name, path, title, description, or keyword) + status filter tabs (**All Pages**, **Good (`80+`)**, **Needs Work (`<80`)**, **Noindex**).
  - **Quick "Open in Full SERP Editor" Action per Row**: One-click button on every row to jump straight to that page's detailed Google SERP & Social Card preview editor.

---

## 1. Overview & Core Concept

- **What It Does**: Eliminates the need to click into individual pages one by one when auditing or updating site-wide SEO metadata. Admins can scan every route (`/`, `/packages`, `/catering`, `/shop`, `/how-it-works`, `/gallery`, `/about`, `/contact`, `/faq`, `/terms`, `/privacy`, `/refund`, `/account`) in a single unified table, edit titles, descriptions, and focus keyphrases inline, toggle search indexing, and publish all updates in one click.
- **Target Audience / Persona**: Website administrators and SEO managers optimizing search rankings and click-through rates across all Kolkata landing and policy pages.
- **Key Value**: Cuts multi-page metadata optimization time from minutes to seconds while preventing truncated titles or missing focus keywords via live per-row diagnostics.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Opening the Bulk SEO Editor**: Inside **Admin Panel → SEO & Ranking (Yoast)**, admins click the **Bulk SEO Editor (All Pages)** sub-navigation tab (or click the "Bulk Edit All Pages" shortcut from the top header / Per-Page editor).
  2. **Auditing & Filtering**: A summary KPI strip at the top of the Bulk Editor displays **Average Site SEO Score**, **Optimized Pages (`80+`)**, **Pages Needing Attention (`<80`)**, and **Indexed vs. Noindex Pages**. Admins can filter rows by status (`All`, `Good 80+`, `Needs Work`, `Noindex`) or type a search query.
  3. **Rapid Inline Editing**: As the admin types in any row's **Focus Keyword**, **SEO Title**, or **Meta Description** field—or flips the **Index / Noindex** toggle—the row's character counter, color-coded progress bar, and **Yoast Score badge (`tabular-nums`)** update instantaneously.
  4. **Deep-Dive Inspection**: Clicking **Inspect SERP** on any row switches to the Per-Page Editor with that exact page pre-selected so the admin can preview its live Google Desktop/Mobile snippet and WhatsApp card.
  5. **Publishing**: Clicking **Save & Publish SEO Live** (or the sticky unsaved-changes bar when edits are pending) persists the entire table to the backend database, immediately updating `<head>` tags, `/sitemap.xml`, and server-side HTML injection.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density enterprise SaaS spreadsheet & SEO audit console consistent with the dark obsidian (`#0c0c12` / `#12121a`) and emerald/amber luxury admin theme.
  - *Color Palette & Mood*: Deep slate/obsidian surfaces with crisp 1px structural borders (`border-neutral-800`), semantic score indicators (`emerald-400` for `80–100` Good, `amber-400` for `55–79` Needs Work, `red-400` for `<55` Critical), and high-contrast inputs.
  - *Typography & Hierarchy*: Clean sans-serif labels for scannability, paired with `font-mono tabular-nums` for character counts, route paths, and live `0–100` SEO scores to prevent layout jitter while typing.
  - *Component Styling & Layout*: Full-width responsive table layout with sticky column headers, compact vertical alignment, inline multi-line auto-sizing textareas for descriptions, and subtle row highlight states when a row has unsaved modifications.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Shared Unified Form State Between Bulk Editor & Single-Page Editor**
  - *Chosen Approach*: Both the **Per-Page SEO Editor** and the **Bulk SEO Editor** read from and mutate the same `formState.pages` state object inside the SEO Manager.
  - *Why*: Edits made in the Bulk SEO Editor are immediately reflected if the admin clicks "Inspect SERP" to view a single page's Google snippet preview, with zero risk of out-of-sync state between tabs.
- **Decision 2: Real-Time Per-Row Yoast Score & Issue Hints**
  - *Chosen Approach*: Run `computeYoastAnalysis(page)` dynamically for every row and display both the numerical score (`tabular-nums`) and concise actionable status text (e.g., *"Keyphrase in title & desc"* or *"Missing keyphrase in title"*) right inside the score cell.
  - *Why*: Gives admins immediate clarity on *why* a page has a given score without leaving the table view.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   AdminPanelModal → AdminSeoManager                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Sub-Navigation Bar                                                   │  │
│  │ [1. Per-Page SEO] [2. Bulk SEO Editor] [3. Global] [4. Social] ...   │  │
│  └──────────────────────────────┬───────────────────────────────────────┘  │
│                                 ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Bulk SEO Editor View                                                 │  │
│  │  ├─ Summary Metrics Bar (Avg Score, Good Pages, Needs Work, Indexed) │  │
│  │  ├─ Search Input + Segmented Status Filter (All | Good | Needs Work) │  │
│  │  └─ Interactive Multi-Row SEO Table                                  │  │
│  │      ├─ Col 1: Page Name, Route Path, Dirty Indicator                │  │
│  │      ├─ Col 2: Focus Keyphrase Input + Match Status                  │  │
│  │      ├─ Col 3: SEO Title Input + Char Counter & Progress Bar         │  │
│  │      ├─ Col 4: Meta Description Textarea + Char Counter & Bar        │  │
│  │      ├─ Col 5: Robots Index / Noindex Switch                         │  │
│  │      ├─ Col 6: Live Yoast SEO Score (tabular-nums) + Top Diagnostic  │  │
│  │      └─ Col 7: Quick Actions (Reset Row | Open in Full SERP Editor)  │  │
│  └──────────────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────────┘
                                  │ Save & Publish SEO Live
                                  ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PUT /api/admin/seo-settings → SQLite / JSON Persistence (db.ts)            │
│  ├─ Updates client SeoContext + <SEOHead /> live DOM tags                  │
│  └─ Updates Server-Side HTML Head Injection + Dynamic /sitemap.xml         │
└────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & State Mapping

- **Search & Status Filtering (`bulkSearchQuery`, `bulkStatusFilter`)**:
  - Filters the array of `PageSeoConfig` items in real time by matching `pageName`, `path`, `title`, `description`, or `focusKeyword`, and by checking whether the computed Yoast score is `>= 80` (`good`), `< 80` (`needs_work`), or `robotsIndex === false` (`noindex`).
- **Per-Row Inline Handlers (`handlePageFieldChange`)**:
  - Updating `title`, `description`, `focusKeyword`, or `robotsIndex` in any row mutates `formState.pages[pageId]` immediately, recalculating that row's character length bar, keyword match indicator, Yoast score, and overall site average score.
- **Dirty Tracking & Per-Row Reset (`handleResetPageRow`)**:
  - Compares each row in `formState.pages[pageId]` against the last saved `seoConfig.pages[pageId]` so modified rows show an "Edited" indicator and a one-click **Reset Row** button alongside the global **Save & Publish SEO Live** action.
- **Deep Link to Single-Page SERP Preview (`handleOpenInSerpEditor`)**:
  - Sets `selectedPageKey = page.pageId` and switches `subTab = 'page_editor'`, smoothly scrolling to the top of the Per-Page SERP preview.
