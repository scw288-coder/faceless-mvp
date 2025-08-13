import { NextRequest, NextResponse } from 'next/server'
import { createTTSAndUpload } from '@/lib/tts'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const { text, voice_id, language } = await req.json()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })
  const fallback = language === 'ko' ? process.env.ELEVENLABS_VOICE_ID_KO : process.env.ELEVENLABS_VOICE_ID_EN
  const voiceId = voice_id || fallback
  const { audioUrl, words } = await createTTSAndUpload({ text, voiceId: String(voiceId) })
  return NextResponse.json({ audio_url: audioUrl, words_timestamps: words })
}
