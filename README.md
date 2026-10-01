# ⚡ Reframe.ai (Repurposer Tool)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Edge-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Gumroad](https://img.shields.io/badge/Gumroad-Monetization-FF90E8?style=for-the-badge&logo=gumroad&logoColor=black)](https://gumroad.com/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

Reframe.ai is an enterprise-grade AI SaaS application that transforms articles and YouTube transcripts into hyper-optimized, platform-specific content (Twitter threads, LinkedIn posts, Newsletters). 

Unlike generic AI generators, Reframe leverages **Voice DNA**—analyzing a creator's unique tone and hooks using in-browser Machine Learning (`@huggingface/transformers`) and Google Gemini—to ensure repurposed content authentically matches the creator's voice.

## 🚀 SaaS Architecture & Integrations
This repository demonstrates a fully complete Micro-SaaS architecture ready for production deployment on Vercel Edge Networks.

* **🔐 Authentication (Clerk v7)**: End-to-end user identity management, secure route middleware, and custom User Metadata syncing.
* **💳 Monetization (Gumroad)**: Fully integrated automated webhook (`/api/webhook/gumroad`) that verifies HMAC signatures, intercepts `sale_completed` events, and permanently upgrades the purchasing Clerk user to a PRO account seamlessly.
* **🧠 AI Engine (Google Gemini)**: Deep integration with the `@google/generative-ai` SDK for multi-modal context comprehension and high-speed generation.
* **⚡ Local-First ML**: Uses ONNX Runtime and WebGPU to run localized embedding models in the browser, protecting margins and user privacy.
* **🎨 UI/UX**: Built with Tailwind CSS 4, Framer Motion 13, and Lucide React to deliver a stunning Glassmorphism aesthetic.

## 🛠️ Quick Start

### 1. Prerequisites
You will need Node.js 20+ and active accounts with Clerk, Gumroad, and Google AI Studio.

### 2. Installation
```bash
git clone https://github.com/LOKESH10796/repurposer-tool.git
cd repurposer-tool
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and populate the secrets:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini
GOOGLE_API_KEY=AIzaSy...

# Gumroad Webhook
GUMROAD_WEBHOOK_SECRET=your_gumroad_secret

# Vercel Deployment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Development & Deployment
```bash
# Start the local development server
npm run dev

# Build the production bundle
npm run build
```
This application is optimized for zero-config deployment on **Vercel**. Simply push to a GitHub repository connected to Vercel, and Edge caching/middleware will be automatically provisioned.

## 📈 Performance & Benchmarking
This repository includes a custom benchmark suite to test local LLM parsing throughput and Edge latency:
```bash
node perf-test.js
```

## 👨‍💻 Founder / Architect
Architected by **Lokesh Gounder**  
📧 [lokeshgounder@gmail.com](mailto:lokeshgounder@gmail.com)  
🔗 [GitHub Profile](https://github.com/LOKESH10796)
