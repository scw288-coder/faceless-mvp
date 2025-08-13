import path from 'path'
import { tmpdir } from 'os'
import { makeSolidClip } from './solid'
const SOLID_COLORS = ['#0F172A','#111827','#1F2937','#0C4A6E','#134E4A','#1E3A8A']
export async function fetchVisuals(scenes: any[]) {
  const files: { path: string; duration: number }[] = []
  for (let i=0;i<scenes.length;i++){
    const s = scenes[i]
    if (s.visual && s.visual.localPath){
      files.push({ path: s.visual.localPath, duration: s.duration })
    } else {
      const color = SOLID_COLORS[i % SOLID_COLORS.length]
      const clip = await makeSolidClip({ color, duration: s.duration, size: '720x1280', zoom: true, idx: i })
      files.push({ path: clip, duration: s.duration })
    }
  }
  return files
}
