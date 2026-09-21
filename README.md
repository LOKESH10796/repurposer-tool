# Repurposer Tool

A modern Next.js CLI application for content repurposing powered by AI. Transform articles, transcripts, and text into multiple formats (Twitter threads, LinkedIn posts, YouTube scripts, and more) with a single click.

## Features

- **Multi-format output**: Generate Twitter threads, LinkedIn posts, YouTube scripts, blog outlines, and more
- **AI-powered analysis**: Automatic sentiment detection, tone analysis, and content categorization
- **CSV batch processing**: Upload and process multiple articles simultaneously
- **Performance optimized**: Built with Next.js 16, React 19, and TypeScript strict mode
- **Mobile-first design**: Fully responsive interface with Tailwind CSS
- **Glassmorphism UI**: Modern frosted-glass aesthetic with fluid animations (Framer Motion)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.3.2 (App Router) |
| Runtime | React 19.2.8 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + tailwind-merge |
| Animations | Framer Motion 13 |
| AI Provider | Google Generative AI (@google/generative-ai) |
| Auth | Clerk Next.js SDK 7 |
| Icons | Lucide React |
| CSV Parsing | Papaparse |
| Form Validation | Zod |
| Testing | Vitest (unit) + custom perf-test.js (benchmarks) |
| Linting | ESLint 9 + eslint-config-next |
| Build | Vite-powered Next.js build pipeline |

## Getting Started

### Prerequisites

- Node.js 18+ (tested on 20.x)
- npm or pnpm (npm used in CI)

### Installation

```bash
git clone https://github.com/LOKESH10796/repurposer-tool.git
cd repurposer-tool
npm install
```

### Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk auth publishable key
- `CLERK_SECRET_KEY` — Clerk auth secret key
- `GOOGLE_API_KEY` — Google Generative AI API key
- `NEXT_PUBLIC_APP_URL` — Application URL for CORS

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Deploy

```bash
npm run build
npm start
```

## Testing

### Unit Tests

```bash
npm test           # Run all tests once
npm run test:watch # Watch mode for development
```

### Performance Benchmarks

```bash
node perf-test.js
```

Runs 1,000 iterations (100 warmup) of content parsing, AI analysis, and content generation, reporting average/min/max durations and throughput.

## Architecture Overview

```
repurposer-tool/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Landing page
│   ├── api/          # API routes
│   └── lib/          # Shared utilities
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── tests/            # Unit & integration tests (Vitest)
├── public/           # Static assets
├── styles/           # Global CSS (Tailwind)
├── eslint.config.mjs # ESLint configuration
├── tsconfig.json     # TypeScript strict config
└── next.config.ts    # Next.js configuration
```

View the interactive architecture diagram: [ARCHITECTURE.html](./ARCHITECTURE.html)

## CI/CD Pipeline

GitHub Actions run on every push and PR:
- **Lint**: ESLint code quality checks
- **Type Check**: TypeScript strict compilation
- **Test**: Vitest test suite
- **Build**: Production build verification

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Security

See [SECURITY.md](./SECURITY.md) for the security policy and vulnerability reporting.

## License

MIT License — see [LICENSE](./LICENSE) for details.

## Contact

- **Author**: Lokesh Gounder (LOKESH10796)
- **GitHub**: [@LOKESH10796](https://github.com/LOKESH10796)
