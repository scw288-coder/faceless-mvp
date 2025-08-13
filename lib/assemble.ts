export async function planScenes({ text, strategy }: { text: string; strategy: 'stock'|'image' }) {
  const sentences = text.split(/[。！？.!?\n]/).map(s => s.trim()).filter(Boolean)
  const scenes = sentences.map((s, i) => ({
    id: i,
    text: s,
    duration: Math.min(6, Math.max(2, Math.round(s.split(/\s+/).length / 3))),
    visual: { type: strategy === 'stock' ? 'stock' : 'image', query: pickKeywords(s) }
  }))
  return { scenes }
}
function pickKeywords(s: string) {
  return s.replace(/[^A-Za-z0-9가-힣\s]/g, ' ').trim().split(/\s+/).slice(0,3).join(' ')
}
