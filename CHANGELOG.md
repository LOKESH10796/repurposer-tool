# Reframe - Change Log

## 2026-08-29 - Initial Build

### Files Created
- `src/types/voice-dna.ts` - Type system (already existed)
- `src/lib/linkedin-csv-schema.ts` - Zod schemas (already existed)
- `src/lib/csv-parser.ts` - CSV parsing (already existed)
- `src/components/voice-dna/CsvDropZone.tsx` - Upload UI (already existed)
- `src/components/voice-dna/ProcessingSpinner.tsx` - Loading UI (already existed)
- `src/app/voice-dna/upload/page.tsx` - Upload page (already existed)
- `src/app/voice-dna/preview/page.tsx` - Preview page (already existed)
- `src/app/voice-dna/cold-start/page.tsx` - Cold start page (already existed)

### Files Created (New)
- `src/components/voice-dna/VoiceDnaPreview.tsx` - Main preview component
- `src/components/voice-dna/HookBadge.tsx` - Hook type badges
- `src/components/voice-dna/PillarCard.tsx` - Content pillar cards
- `src/components/voice-dna/ToneRadar.tsx` - Tone radar chart
- `src/components/voice-dna/RhythmChart.tsx` - Posting rhythm heatmap
- `src/components/voice-dna/SuggestionCard.tsx` - Smart suggestion cards
- `src/components/voice-dna/ColdStartModal.tsx` - Cold start modal
- `src/lib/voice-dna-extractor.ts` - Core ML pipeline
- `src/lib/hook-classifier.ts` - Hook classification
- `src/lib/pillar-extractor.ts` - Topic modeling
- `src/lib/rhythm-analyzer.ts` - Temporal analysis
- `src/lib/vocabulary-analyzer.ts` - Vocabulary analysis
- `src/lib/suggestion-engine.ts` - Suggestion generation
- `src/hooks/useCsvParser.ts` - CSV parsing hook
- `src/hooks/useVoiceDna.ts` - Voice DNA state management
- `src/hooks/usePasteFile.ts` - Paste file hook
- `src/styles/globals.css` - Global styles
- `public/models/` - Model storage directory
- `tests/` - Test directory

### Changes Made
- Updated `BLUEPRINT.md` with current status
- Added version tracing to all files
- Structured project per blueprint specifications
