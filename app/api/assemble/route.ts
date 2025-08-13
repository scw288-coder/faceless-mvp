import { NextRequest, NextResponse } from 'next/server'
import { findAssetsForText } from '@/lib/stock'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })
  const assets = await findAssetsForText(text)
  return NextResponse.json({ assets })
}
