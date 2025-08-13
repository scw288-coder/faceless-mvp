export async function pexelsSearch({ q, type = 'video' }: { q: string; type?: 'video'|'image' }) {
  const base = type === 'video' ? 'https://api.pexels.com/videos/search' : 'https://api.pexels.com/v1/search'
  const url = `${base}?query=${encodeURIComponent(q)}&per_page=1&orientation=portrait`
  const res = await fetch(url, { headers: { Authorization: process.env.PEXELS_KEY! } as any })
  if (!res.ok) return null
  const j = await res.json()
  if (type === 'video') {
    const v = j.videos?.[0]
    const file = v?.video_files?.find((f:any)=> /720|1080/.test(String(f.height))) || v?.video_files?.[0]
    return file ? { type:'video' as const, url: file.link, duration: v?.duration || 3 } : null
  } else {
    const p = j.photos?.[0]
    return p ? { type:'image' as const, url: p.src?.portrait, duration: 3 } : null
  }
}
