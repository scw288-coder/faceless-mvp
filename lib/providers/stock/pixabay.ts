export async function pixabaySearch({ q, type = 'video' }: { q: string; type?: 'video'|'image' }) {
  const key = process.env.PIXABAY_KEY
  const base = type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/'
  const url = `${base}?key=${key}&q=${encodeURIComponent(q)}&per_page=1&orientation=vertical`
  const res = await fetch(url)
  if (!res.ok) return null
  const j = await res.json()
  if (type === 'video') {
    const v = j.hits?.[0]
    const f = v?.videos?.medium || v?.videos?.large || v?.videos?.small
    return f ? { type:'video' as const, url: f.url, duration: v?.duration || 3 } : null
  } else {
    const p = j.hits?.[0]
    return p ? { type:'image' as const, url: p.largeImageURL, duration: 3 } : null
  }
}
