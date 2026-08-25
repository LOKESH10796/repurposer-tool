import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content is required and must be at least 10 characters' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are an elite ghostwriter. The user will provide raw content. Repurpose it into two things: 1) A highly engaging, punchy Twitter thread (3-5 tweets, use hooks). 2) A professional, insightful LinkedIn post with a strong hook and line breaks. Return ONLY a valid JSON object with two keys: 'twitterThread' (an array of strings) and 'linkedinPost' (a single string). Do not include markdown code blocks like \`\`\`json.`;

    const result = await model.generateContent(systemPrompt + '\n\nContent to repurpose:\n\n' + content);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ twitterThread: parsed.twitterThread, linkedinPost: parsed.linkedinPost });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}