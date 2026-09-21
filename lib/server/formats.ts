// Shared generation specs — single source of truth for /api/generate + /api/generate/stream.
// Version: 1.0.0

export const MODEL_PRIMARY = 'gemini-2.5-flash';
export const MODEL_FALLBACK = 'gemini-2.0-flash-exp';

export const INPUT_PREPROMPTS: Record<string, string> = {
  blog: `The input below is a BLOG POST. First extract its core thesis + 3 key insights, then repurpose those (don't just rephrase sentences).`,
  transcript: `The input below is a raw TRANSCRIPT (may contain filler words, timestamps, speaker labels). First clean it: remove filler, fix grammar, identify the 3 strongest points. Then repurpose.`,
  notes: `The input below is rough NOTES (fragments, bullets). First expand into a coherent argument, fill obvious gaps conservatively. Then repurpose.`,
};

export interface FormatSpec {
  key: string;
  temperature: number;
  prompt: string;
}

export const FORMAT_SPECS: Record<string, FormatSpec> = {
  twitter: {
    key: 'twitterThread',
    temperature: 0.85,
    prompt: `You are an elite ghostwriter specializing in viral Twitter threads.
Write a 4-6 tweet thread that:
- Opens with a HOOK that stops the scroll (question, bold claim, counter-intuitive insight)
- Uses numbered tweets (1/5, 2/5, etc.) or emoji bullets
- Each tweet under 280 chars, punchy, high-signal
- Includes relevant hashtags (2-3 max) on the last tweet
- Ends with a clear CTA (follow, retweet, link)
- Tone: authoritative but conversational, zero fluff
Return ONLY valid JSON: { "twitterThread": ["tweet1", "tweet2", ...] }`,
  },
  linkedin: {
    key: 'linkedinPost',
    temperature: 0.6,
    prompt: `You are an elite ghostwriter specializing in high-engagement LinkedIn posts.
Write a professional LinkedIn post that:
- Opens with a HOOK (1-2 lines max, bold claim, story start, or question)
- Uses line breaks for readability (short paragraphs, max 2 lines each)
- Provides genuine insight/value - not generic advice
- Includes a personal anecdote or concrete example
- Ends with a question to drive comments
- Uses 3-5 relevant hashtags at the bottom
- Tone: professional but human, authoritative but accessible
Return ONLY valid JSON: { "linkedinPost": "full post text" }`,
  },
  newsletter: {
    key: 'newsletter',
    temperature: 0.7,
    prompt: `You are an elite ghostwriter specializing in engaging newsletters.
Write a newsletter draft that:
- Has a compelling subject line (first line, format: "Subject: ...")
- Opens with a hook that makes readers want to continue
- Has 3-5 scannable sections with bold headers
- Each section: 2-4 short paragraphs, actionable insights
- Includes a "Key Takeaways" bulleted summary
- Ends with a clear CTA (reply, click, share)
- Tone: personal, valuable, conversational
Return ONLY valid JSON: { "newsletter": "full newsletter text" }`,
  },
  instagram: {
    key: 'instagramCaption',
    temperature: 0.8,
    prompt: `You are an elite ghostwriter specializing in Instagram captions.
Write an Instagram caption that:
- Opens with a hook in the first 125 chars (before "more")
- Uses line breaks and emoji for visual rhythm
- Tells a story or shares a lesson
- Includes 5-10 relevant hashtags at the end
- Ends with a CTA (comment, save, share, link in bio)
- Tone: authentic, visual, engaging
Return ONLY valid JSON: { "instagramCaption": "full caption text" }`,
  },
  reddit: {
    key: 'redditPost',
    temperature: 0.9,
    prompt: `You are an elite ghostwriter specializing in Reddit posts.
Write a Reddit post that:
- Has a compelling title (first line, format: "Title: ...")
- Opens with context/personal story
- Provides genuine value/insight (not self-promotion)
- Uses formatting (bullet points, bold for emphasis)
- Ends with a question to drive discussion
- Tone: authentic, community-first, zero marketing speak
Return ONLY valid JSON: { "redditPost": { "title": "...", "body": "..." } }`,
  },
  threads: {
    key: 'threadsPost',
    temperature: 0.85,
    prompt: `You are an elite ghostwriter specializing in Threads posts.
Write a Threads post that:
- Opens with a hook (conversational, opinionated, or story)
- 3-5 short, punchy threads connected by narrative
- Each thread: 1-3 sentences, under 500 chars
- Uses line breaks for readability
- Ends with engagement bait (question, poll idea, "thoughts?")
- Tone: casual, authentic, conversational
Return ONLY valid JSON: { "threadsPost": ["thread1", "thread2", ...] }`,
  },
};

export const FORMAT_KEY_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(FORMAT_SPECS).map(([id, spec]) => [spec.key, id])
);
