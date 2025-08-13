import { pexelsSearch } from '@/lib/providers/stock/pexels'
import { pixabaySearch } from '@/lib/providers/stock/pixabay'
type Asset = { type: 'video'|'image'; url: string; duration: number }
export async function pickAssetForSentence(sentence: string): Promise<Asset|null> {
  const q = pickKeywords(sentence)
  const first = await pexelsSearch({ q, type: 'video' }) || await pexelsSearch({ q, type: 'image' })
  if (first) return first
  const second = await pixabaySearch({ q, type: 'video' }) || await pixabaySearch({ q, type: 'image' })
  return second || null
}
export async function findAssetsForText(text: string) {
  const sentences = text.split(/[。！？.!?\n]/).map(s => s.trim()).filter(Boolean)
  const items: Asset[] = []
  for (const s of sentences) {
    const a = await pickAssetForSentence(s)
    items.push(a || { type: 'image', url: 'about:blank', duration: 3 })
  }
  return items
}
function pickKeywords(s: string) {
  return s.replace(/[^A-Za-z0-9가-힣\s]/g, ' ').trim().split(/\s+/).slice(0,3).join(' ')
}
