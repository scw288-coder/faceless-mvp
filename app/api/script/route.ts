import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const { prompt, length = 120, style = 'explanation', language = 'ko' } = await req.json()
  if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 })
  const secs = Math.min(length, 120)
  const text = language === 'ko'
    ? `오늘은 ${prompt}를 ${secs}초로 요약합니다. 첫째 핵심, 둘째 팁, 마지막으로 정리.`
    : `Today we summarize ${prompt} in ~${secs}s. Core idea, one tip, and a takeaway.`
  return NextResponse.json({ text, style, language })
}
