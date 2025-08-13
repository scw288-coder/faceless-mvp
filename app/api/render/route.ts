import { NextRequest, NextResponse } from 'next/server'
import { renderQueue } from '@/lib/queue'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { project_id, quality = '720p', plan, audio_url, music_url, captions, mood, title } = body
  if (!project_id || !audio_url || !plan) return NextResponse.json({ error: 'project_id, audio_url, plan required' }, { status: 400 })
  const job = await renderQueue.add('render', { project_id, quality, plan, audio_url, music_url, captions, mood, title }, { removeOnComplete: true, attempts: 2 })
  return NextResponse.json({ job_id: job.id })
}
