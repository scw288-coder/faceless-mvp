import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
export async function makeSolidClip({ color = '#111111', duration = 3, size = '720x1280', zoom = true, idx = 0 }) {
  const out = path.join(tmpdir(), `solid_${Date.now()}_${idx}.mp4`)
  await new Promise<void>((res, rej) => {
    const cmd = ffmpeg()
      .input(`color=c=${color}:s=${size}:r=30:d=${duration}`)
      .inputOptions(['-f','lavfi'])
      .videoCodec('libx264')
      .fps(30)
      .outputOptions(['-pix_fmt','yuv420p','-crf','20','-preset','veryfast'])
      .size(size)
      .output(out)
      .on('end', () => res())
      .on('error', rej)
    cmd.run()
  })
  return out
}
