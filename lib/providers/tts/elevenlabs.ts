export async function elevenlabsTTSBuffer({ text, voiceId }: { text: string; voiceId: string }) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'accept': 'audio/mpeg',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.4, similarity_boost: 0.7 }
    })
  })
  if (!res.ok) throw new Error('TTS request failed')
  const buf = Buffer.from(await res.arrayBuffer())
  return buf
}
