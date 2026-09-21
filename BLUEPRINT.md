# Repurposer.ai — Project Blueprint

> **Single Source of Truth** — Read this first. Update this when decisions change. Prevents context loss across sessions/models.

---

## 🎯 Vision & Core Thesis

**Repurposer.ai** is an AI-powered content repurposing platform that transforms blog posts into multi-platform content (Twitter, LinkedIn, Newsletter, Instagram, Reddit, Threads) while optionally leveraging **Voice DNA** to maintain each creator's unique tone, hooks, and style.

**Differentiator:** Not "AI writes for you" → **"AI repurposes your content while preserving YOUR voice."**

**Voice DNA** (Reframe Intelligence) is the learning layer that captures a creator's authentic voice from their existing posts, then injects that voice into repurposed content for maximum authenticity and engagement.

---

## 🏗️ Current Architecture Decisions (Locked In)

| Decision | Rationale | Status |
|----------|-----------|--------|
| **Name: Reframe** | Verb + noun, professional, memorable, implies transformation | ✅ Final |
| **CSV-first ingestion** | Bypasses LinkedIn API gatekeeping; privacy-first marketing angle | ✅ Final |
| **Local-first processing (WASM)** | $0 marginal cost; protects $9/mo margins; privacy moat | ✅ Final |
| **Next.js 14 + React 18 + TypeScript** | Vercel-native, great DX, edge-ready | ✅ Final |
| **PapaParse for CSV** | Robust, streaming, handles large files | ✅ Final |
| **Transformers.js (ONNX Runtime)** | Browser ML, quantized models, WebGPU support | ✅ Final |
| **Models: all-MiniLM-L6-v2 (embeddings) + nli-deberta-v3-xsmall (zero-shot)** | Small, fast, proven in browser | ✅ Final |
| **Zod for validation** | Type-safe runtime validation | ✅ Final |
| **Lucide icons + Tailwind CSS** | Lightweight, accessible, consistent | ✅ Final |

---

## 📁 File Structure (Unified)

```
repurposer-tool/ (Single App — Repurposer.ai + Voice DNA)
├── BLUEPRINT.md                    # ← THIS FILE
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── .env.example
├── .env.local
├── public/
├── app/                            # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page (Repurposer.ai)
│   ├── globals.css
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts            # Core generation API (Gemini + Voice DNA)
│   │   └── webhook/
│   │       └── route.ts            # Gumroad webhook
│   ├── voice-dna/                  # Voice DNA pages
│   │   ├── upload/
│   │   │   └── page.tsx            # Voice DNA upload (CSV → Voice DNA)
│   │   ├── preview/
│   │   │   └── page.tsx            # Voice DNA preview (radar, charts, suggestions)
│   │   └── cold-start/
│   │       └── page.tsx            # Cold start flow (aspirational DNA)
│   ├── welcome/
│   │   └── page.tsx
│   └── elite-landing.tsx
├── components/
│   ├── voice-dna/                  # Voice DNA UI components
│   │   ├── ColdStartModal.tsx
│   │   ├── CsvDropZone.tsx
│   │   ├── HookBadge.tsx
│   │   ├── PillarCard.tsx
│   │   ├── ProcessingSpinner.tsx
│   │   ├── RhythmChart.tsx
│   │   ├── SuggestionCard.tsx
│   │   ├── ToneRadar.tsx
│   │   ├── VocabularyCloud.tsx
│   │   └── VoiceDNAPreview.tsx
│   ├── ResultsDisplay.tsx
│   ├── NavbarModals.tsx
│   ├── PricingCard.tsx
│   ├── HeroSection.tsx
│   ├── ParticleBackground.tsx
│   ├── StatsBar.tsx
│   ├── Testimonials.tsx
│   ├── FeatureGrid.tsx
│   ├── HowItWorks.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   └── LiveDemo.tsx
├── hooks/
│   ├── useCsvParser.ts
│   ├── usePasteFile.ts
│   └── useVoiceDna.ts
├── lib/
│   ├── utils.ts
│   ├── csv-parser.ts
│   ├── linkedin-csv-schema.ts
│   ├── mock-voice-dna.ts
│   ├── pillar-extractor.ts
│   ├── rhythm-analyzer.ts
│   ├── suggestion-engine.ts
│   ├── vocabulary-analyzer.ts
│   └── voice-dna-extractor.ts
├── types/
│   └── voice-dna.ts
└── tests/
```

## 🔗 Product Relationship (Unified)

**Single app, two features:**

| Feature | Purpose | URL | Status |
|---------|---------|-----|--------|
| **Repurposer.ai** | Content repurposing (blog → multi-platform) | `/` | ✅ Live |
| **Voice DNA** (Reframe Intelligence) | Voice learning & preservation | `/voice-dna/*` | ✅ Built |
| **Integration** | Voice DNA injected into repurposed content | `POST /api/generate` | ✅ Connected |

**Voice DNA is NOT a separate product.** It is the "Smart Learning / Pro Mode" feature of Repurposer.ai.

**Flow:**
1. User uploads LinkedIn CSV → `/voice-dna/upload`
2. Voice DNA extracted → stored in `sessionStorage`
3. User generates content → Voice DNA injected into `POST /api/generate`
4. Repurposed content generated with creator's authentic voice

---

## ✅ What's Built (Verified)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `types/voice-dna.ts` | Complete type system | `VoiceDNA`, `NormalizedPost`, `HookType`, `Pillar`, `SmartSuggestion`, etc. |
| `lib/linkedin-csv-schema.ts` | Zod schemas + validation | `validateHeaders`, `parsePostRow`, `parseLinkedInDate`, `matchColumnName` |
| `lib/csv-parser.ts` | PapaParse wrapper + normalization | `parseCSVSync`, `createStreamingParser`, `parseLinkedInExport`, `generateTemplateCSV` |
| `app/components/voice-dna/CsvDropZone.tsx` | Drag-drop upload UI | `CsvDropZone`, `usePasteFile` |
| `app/components/voice-dna/ProcessingSpinner.tsx` | Multi-stage loading UI | `ProcessingSpinner`, `InlineProcessingSpinner` |
| `app/api/generate/route.ts` | Core generation API | Accepts `voiceDna` in request body, injects into system prompt |

**All files compile. Types are strict. No `any` leaks.**

---

## 🔄 Next Build Sequence (In Order)

### Phase 1: Upload Page + Integration (This Session)
```
src/app/voice-dna/upload/page.tsx
├── CsvDropZone → onFileSelect → parseCSVSync
├── ProcessingSpinner (shows stages)
├── On complete → redirect to /voice-dna/preview with VoiceDNA in sessionStorage
└── Error handling + retry
```

### Phase 2: Voice DNA Extractor (Core ML)
```
src/lib/voice-dna-extractor.ts
├── loadModels() → feature-extraction + zero-shot pipelines
├── extractVoiceDna(posts: NormalizedPost[]): Promise<VoiceDNA>
│   ├── embeddings = await embedder(posts.map(p => p.text))
│   ├── pillars = clusterEmbeddings(embeddings) + label via zero-shot
│   ├── hooks = classifyHooks(posts) via zero-shot + rules
│   ├── tone = analyzeTone(embeddings, posts)
│   ├── rhythm = analyzeRhythm(posts)
│   ├── vocabulary = analyzeVocabulary(posts)
│   ├── ctaStyle = analyzeCTAs(posts)
│   ├── formatPreference = analyzeFormats(posts)
│   └── benchmarks = computeBenchmarks(posts)
└── Confidence scoring based on post count + variance
```

**Model Pipeline (Transformers.js):**
```typescript
// Embeddings: 384-dim, ~23MB (q4)
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q4' });

// Zero-shot for hook/pillar labeling: ~67MB (q4)
const classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall', { dtype: 'q4' });
```

### Phase 3: Voice DNA Preview Page
```
src/app/voice-dna/preview/page.tsx
├── Read VoiceDNA from sessionStorage
├── VoiceDnaPreview component (radar, badges, charts)
├── SmartSuggestion cards (3 initial)
├── CTA: "Generate First Video" → /studio
└── "Refine Voice DNA" → re-upload or cold-start
```

### Phase 4: Cold Start Flow
```
src/app/voice-dna/cold-start/page.tsx
├── Creator search (typeahead from curated list)
├── Pick 3 → fetch public posts (RSS/scraper) → aspirational DNA
├── Paste raw ideas → blend with aspirational (70/30 slider)
├── Generate starter VoiceDNA → redirect to preview
```

### Phase 5: Suggestion Engine
```
src/lib/suggestion-engine.ts
├── suggestRepurpose(sourceUrl, voiceDna) → SmartSuggestion
├── detectWhitespace(voiceDna) → WhitespaceGap[]
├── detectReactiveTrends(voiceDna, networkPosts) → ReactiveSuggestion
├── detectSeriesOpportunities(voiceDna) → SeriesSuggestion
└── crossPlatformStrategy(voiceDna, platforms) → CrossPlatformPlan
```

---

## 🧠 Voice DNA Extraction — Technical Spec

### Input: `NormalizedPost[]` (from CSV parser)

### Output: `VoiceDNA` (complete profile)

### Pipeline Steps:

```
1. EMBEDDINGS
   ├─ Batch posts (32 at a time) through all-MiniLM-L6-v2
   ├─ Mean-pool token embeddings → [N, 384]
   └─ Store for similarity search

2. PILLARS (Topic Modeling - Simplified)
   ├─ K-means on embeddings (k=5-7, based on post count)
   ├─ For each cluster: zero-shot classify with candidate labels
   │   Labels: ["Strategy", "Leadership", "AI/Tech", "Productivity", "Sales", "Marketing", "Personal Growth", "Industry News", "Career", "Entrepreneurship"]
   ├─ Top 3 posts per cluster as exemplars
   ├─ Trend: compare last 30d vs prior 60d frequency
   └─ Output: Pillar[]

3. HOOKS (Zero-Shot + Rules)
   ├─ Candidate labels: ["framework", "contrarian", "story", "data-driven", "question", "bold-claim", "listicle", "how-to", "case-study", "prediction"]
   ├─ Classify each post → distribution
   ├─ Rule-based fallback for short posts
   └─ Output: HookDistribution + topHooks[3]

4. TONE (Embedding Archetypes)
   ├─ Reference embeddings for 8 tone dimensions
   ├─ Cosine similarity of user's mean embedding to each
   ├─ Normalize to sum=1
   ├─ Primary/secondary labels
   └─ Output: ToneProfile

5. RHYTHM (Temporal Analysis)
   ├─ Day-of-week histogram (0-6)
   ├─ Hour-of-day histogram (0-23)
   ├─ Posts/week, consistency score (streak detection)
   ├─ Top 3 slots by engagement
   └─ Next optimal slot (timezone-aware)

6. VOCABULARY (Statistical)
   ├─ TF-IDF on user's posts vs. background corpus
   ├─ Signature terms (high TF-IDF)
   ├─ Avg sentence length, Flesch-Kincaid
   ├─ Emoji freq, top emojis
   ├─ Hashtag patterns
   └─ Formatting markers (bullets, lists, line breaks)

7. CTA STYLE (Pattern Matching)
   ├─ Regex patterns for 5 CTA types in last 50 posts
   ├─ Frequency distribution
   └─ Example extraction

8. FORMAT PREFERENCE
   ├─ Group by post type → engagement rate
   ├─ Primary = highest engagement format
   └─ Multipliers vs. average

9. BENCHMARKS
   ├─ Mean/median impressions, engagement rate
   ├─ Top post metrics
   └─ Percentile (if cohort data available)

10. CONFIDENCE
    ├─ Base: min(1.0, postCount / 50)
    ├─ Penalty: high variance in embeddings
    ├─ Bonus: consistent posting rhythm
    └─ Clamped 0-1
```

---

## 🎨 UI/UX Specifications

### Upload Page (`/voice-dna/upload`)
```
Hero: "Make Reframe sound like YOU."
Sub: "Upload your LinkedIn Posts.csv — we'll analyze your voice locally in your browser."

[CsvDropZone]
  - Drag/drop, click, paste (Ctrl+V)
  - Privacy badges: "🔒 Never leaves browser" "🔒 100% local"
  - Instructions accordion (4 steps)
  - Template CSV download link

[ProcessingSpinner] (replaces drop zone on submit)
  - Stage pills: Parsing → Validating → Extracting → Modeling → Ready
  - Animated brain icon with pulse rings
  - Post counter: "Processed 147 / 147 posts"
  - Fun facts during modeling stage

[Complete] → Auto-redirect to /voice-dna/preview
```

### Preview Page (`/voice-dna/preview`)
```
Header: "Your Voice DNA" + confidence badge (High/Medium/Learning)

Grid:
├── Tone Profile (Radar chart + primary/secondary badges)
├── Top Hooks (Horizontal bar chart with %)
├── Content Pillars (Cards: label, %, trend, top post preview)
├── Format Preference (Donut chart + "Your best: Carousel 3.2x")
├── Posting Rhythm (Heatmap: day × hour)
└── Vocabulary (Tag cloud of signature terms + stats)

Smart Suggestions (3 cards):
  1. Repurpose suggestion (high confidence)
  2. Whitespace gap (if detected)
  3. Reactive/Series (if applicable)

CTA Row:
  [Generate First Video] → /studio?suggestion=id
  [Refine Voice DNA] → back to upload
  [Cold Start] → /voice-dna/cold-start (if confidence < 0.4)
```

---

## 🔑 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MODEL_CACHE_PATH=/models  # Optional local model path
```

---

## 📦 Package.json Dependencies (Planned)

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.3.x",
    "react-dom": "18.3.x",
    "papaparse": "^5.4.x",
    "zod": "^3.23.x",
    "@huggingface/transformers": "^3.0.x",
    "lucide-react": "^0.400.x",
    "clsx": "^2.1.x",
    "tailwind-merge": "^2.3.x"
  },
  "devDependencies": {
    "@types/react": "18.3.x",
    "@types/react-dom": "18.3.x",
    "@types/papaparse": "^5.3.x",
    "typescript": "5.5.x",
    "tailwindcss": "3.4.x",
    "postcss": "8.4.x",
    "autoprefixer": "10.4.x",
    "eslint": "8.57.x",
    "eslint-config-next": "14.2.x"
  }
}
```

---

## 🧪 Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit (lib) | Vitest | 80%+ |
| Component | React Testing Library | Key flows |
| E2E | Playwright | Critical paths |
| Type | tsc --noEmit | Zero errors |

---

## 🚀 Deployment Targets

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | `localhost:3000` | Dev |
| Production | `repurposer.ai` (live on Vercel) | Live |

---

## 📝 Decision Log (Append-Only)

| Date | Decision | Context | Reversible? |
|------|----------|---------|-------------|
| 2026-08-29 | CSV-first over LinkedIn API | API gated, slow approval; CSV = instant value + privacy moat | No (core strategy) |
| 2026-08-29 | Transformers.js (WASM) over server ML | Margin protection at $9/mo; privacy; offline-capable | No (core economics) |
| 2026-08-29 | all-MiniLM-L6-v2 for embeddings | 384-dim, 23MB q4, fast, proven in browser | Yes (if better small model emerges) |
| 2026-08-29 | nli-deberta-v3-xsmall for zero-shot | 67MB q4, strong NLI, good for hook/pillar labels | Yes |
| 2026-08-29 | Simplified k-means pillars (not BERTopic) | BERTopic too heavy for browser; k-means + zero-shot labels works | Yes (upgrade later) |
| 2026-09-08 | Generate engine v2: parallel per-format + voice constraints | Mega-prompt was all-or-nothing 502; per-format Promise.allSettled tolerates partial failure, per-platform temps | Yes |
| 2026-09-08 | VoiceDNA validation accepts toneProfile+legacy tone | v1 checked vd.tone, real type is toneProfile — every real DNA 400'd | Yes |
| 2026-09-08 | Cache read enabled (sha256 key incl. voice hash) | v1 wrote cache, never read — 0% hit rate | Yes |
| 2026-09-08 | Zod body validation + IP rate limit (30/10min) on /api/generate | No validation, no rate limit, client-only Pro gate | Yes |
| 2026-09-08 | Stack confirmed: Next 16.3.2 + React 19 + lucide-react 1.34 | Blueprint still says Next 14 / React 18 — drift | — |
| 2026-09-08 | Omni-input: YouTube transcript + Jina Reader URL extraction | New endpoints /api/extract/youtube & /api/extract/url; client auto-detects kind | Yes |
| 2026-09-08 | SSE streaming generation (/api/generate/stream) | Per-format streaming, partial failure tolerance, JSON fallback | Yes |
| 2026-09-08 | Hook Laboratory (/api/hooks) | 5 viral hooks pitched before generation; selected hook = hard constraint | Yes |
| 2026-09-08 | Delta refine (/api/refine) | Humanize buttons (punchier/metric/contrarian) stream replacement inline | Yes |
| 2026-09-08 | Frontend state machine: idle → extracting → hooks → streaming → done | ResultsDisplay shows live streaming dots, refine bar under each format | Yes |

---

## 🎯 Current Sprint Goal

> **Build the complete upload → preview flow with mocked Voice DNA, then swap in real extraction.**

**Definition of Done:**
1. `/voice-dna/upload` page works end-to-end with real CSV parsing
2. ProcessingSpinner shows all stages with realistic timing
3. `/voice-dna/preview` displays mocked Voice DNA beautifully
4. "Generate First Video" button navigates to studio (placeholder)
5. Cold start link works for low-confidence users
6. All TypeScript strict, no console errors, responsive

---

## 🔗 Key References

- **Transformers.js docs:** https://huggingface.co/docs/transformers.js
- **Model cards:** Xenova/all-MiniLM-L6-v2, Xenova/nli-deberta-v3-xsmall
- **LinkedIn CSV format:** Verified against actual export (Posts.csv columns)
- **PapaParse config:** Header=true, skipEmptyLines='greedy', dynamicTyping=false

---

## ⚠️ Known Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WASM model download slow on first visit | High | User drop-off | Service Worker caching; engaging loading UI; progress indicator |
| Browser memory with 5000+ posts | Medium | Crash/lag | Streaming parse; batch embeddings; web worker for ML |
| Zero-shot classification accuracy | Medium | Poor hook/pillar labels | Curated candidate labels; rule-based fallbacks; user correction UI |
| Cold start UX friction | Medium | Low activation | Pre-seeded creator list; one-click aspirational profiles |
| Mobile performance | Medium | Poor UX | Test early; reduce model size (q4); lazy-load ML |

---

## 📌 For Future Sessions / Models

**If you're reading this, you're up to speed. Do not re-research decided items.**

**Start here:**
1. Read `BLUEPRINT.md` (this file) — you are here
2. Check `types/voice-dna.ts` for types
3. Check `lib/csv-parser.ts` for parsing API
4. Check `app/voice-dna/upload/page.tsx` for upload flow
5. Check `app/api/generate/route.ts` for generation API
6. Update this file when you make decisions

**Do NOT:**
- Re-evaluate CSV vs API (decided)
- Re-evaluate local vs cloud ML (decided)
- Change model choices without updating Decision Log
- Add dependencies without updating package.json section
- Treat `src/` and `app/` as separate apps (unified codebase)

---

*Last updated: 2026-08-29 12:57 IST*
*Next review: After upload page complete*