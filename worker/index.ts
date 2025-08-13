import { Worker, QueueScheduler } from 'bullmq'
import { createWriteStream } from 'fs'
import fs from 'fs/promises'
import ffmpeg from 'fluent-ffmpeg'
import { tmpdir } from 'os'
import path from 'path'
import { fetchVisuals } from './stock'
import { buildAssSubtitle } from './subs'

new QueueScheduler('render', { connection: { url: process.env.REDIS_URL! } })

const worker = new Worker('render', async (job) => {
  const { plan, audio_url, music_url, quality, mood = 'neutral', title = '오늘의 주제' } = job.data as any
  const workDir = path.join(tmpdir(), `render_${job.id}`)

  // Download audio
  const voicePath = path.join(workDir, 'voice.mp3')
  await download(audio_url, voicePath)
  let musicPath = music_url

  // Prepare visuals
  const visuals = await fetchVisuals(plan.scenes)

  // Subtitles (optional demo using scene text)
  const assPath = path.join(workDir, 'captions.ass')
  await buildAssSubtitle(plan.scenes, assPath)

  // Concat file
  const concatTxt = path.join(workDir, 'concat.txt')
  const lines = visuals.map(v => `file '${v.path}'\nduration ${Number(v.duration).toFixed(2)}`)
  await fs.writeFile(concatTxt, lines.join('\n'))

  // Build ffmpeg
  let cmd = ffmpeg()
    .input(concatTxt)
    .inputOptions(['-f','concat','-safe','0'])      // 0:v
    .input(voicePath)                               // 1:a voice

  if (musicPath) cmd = cmd.input(musicPath)        // 2:a music

  const filters: string[] = []

  // Audio graph (ducking if music exists)
  if (musicPath) {
    filters.push('[1:a]aresample=48000,asetpts=PTS-STARTPTS[vo]')
    filters.push('[2:a]volume=0.7,aresample=48000,asetpts=PTS-STARTPTS[mu]')
    filters.push('[mu][vo]sidechaincompress=threshold=0.03:ratio=8:attack=5:release=250:makeup=0:link=average[aBg]')
    filters.push('[aBg]alimiter=limit=0.95[bg]')
    filters.push('[bg][vo]amix=inputs=2:duration=first:dropout_transition=0:weights=0.8 1.0[aout]')
  } else {
    filters.push('[1:a]aresample=48000,asetpts=PTS-STARTPTS[aout]')
  }

  // Video (subtitles; watermark omitted in minimal set)
  filters.push(`[0:v]subtitles=${assPath}[vout]`)

  cmd = cmd.complexFilter(filters)
    .outputOptions([
      '-map','[vout]','-map','[aout]',
      '-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',
      '-c:a','aac','-b:a','160k',
      '-r','30','-s', quality === '1080p' ? '1080x1920' : '720x1280'
    ])

  const outPath = path.join(workDir, 'output.mp4')
  await new Promise<void>((res, rej) => {
    cmd.output(outPath).on('progress', p => job.updateProgress(Math.round(p.percent || 0))).on('end', () => res()).on('error', rej).run()
  })

  // TODO: upload to S3 and return public URL
  const buf = await fs.readFile(outPath)
  // Here you'd call putPublicObject(...). For brevity return file:// url.
  return { mp4_url: `file://${outPath}` }
}, { connection: { url: process.env.REDIS_URL! } })

async function download(url: string, dest: string) {
  const res = await fetch(url as any)
  if (!res.ok) throw new Error('download failed')
  const file = createWriteStream(dest)
  await new Promise((r, j) => { res.body?.pipe(file); file.on('finish', r); file.on('error', j) })
}
