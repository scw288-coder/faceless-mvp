import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
export async function makeTitleCard({ text = '오늘의 주제', size = '720x1280', duration = 1, bg = '#0F172A', font = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' }: any) {
  const out = path.join(tmpdir(), `title_${Date.now()}.mp4`)
  const safe = text.replace(/:/g,'\\:').replace(/'/g,"\\'")
  await new Promise<void>((res, rej) => {
    ffmpeg()
      .input(`color=c=${bg}:s=${size}:r=30:d=${duration}`)
      .inputOptions(['-f','lavfi'])
      .videoFilter(`drawtext=fontfile=${font}:text='${safe}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2`)
      .videoCodec('libx264')
      .outputOptions(['-pix_fmt','yuv420p','-crf','20','-preset','veryfast'])
      .fps(30)
      .output(out)
      .on('end', () => res())
      .on('error', rej)
      .run()
  })
  return out
}
