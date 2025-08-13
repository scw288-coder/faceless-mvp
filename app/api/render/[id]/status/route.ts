import { NextRequest, NextResponse } from 'next/server'
import { renderQueue } from '@/lib/queue'
export const runtime = 'nodejs'
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const job = await renderQueue.getJob(params.id)
  if (!job) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const state = await job.getState()
  const progress = job.progress as number | undefined
  const result = (job as any).returnvalue
  return NextResponse.json({ state, progress, result })
}
