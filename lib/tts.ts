import crypto from 'crypto'
import { elevenlabsTTSBuffer } from '@/lib/providers/tts/elevenlabs'
import { headObject, putPublicObject } from '@/lib/storage'
export async function createTTSAndUpload({ text, voiceId }: { text: string; voiceId: string }) {
  const hash = crypto.createHash('sha1').update(`${voiceId}\n${text}`).digest('hex')
  const key = `tts/${new Date().toISOString().slice(0,10)}/${hash}.mp3`
  const exists = await headObject(key)
  if (exists) {
    const base = process.env.CDN_BASE || `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}`
    return { audioUrl: `${base}/${key}`, words: naive(text) }
  }
  const buf = await elevenlabsTTSBuffer({ text, voiceId })
  const audioUrl = await putPublicObject(key, buf, 'audio/mpeg')
  return { audioUrl, words: naive(text) }
}
function naive(text: string) {
  return text.split(/\s+/).filter(Boolean).map((w, i) => ({ word: w, start: i*0.3, end: i*0.3+0.25 }))
}
