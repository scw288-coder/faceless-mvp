import fs from 'fs/promises'
export async function buildAssSubtitle(scenes: any[], assPath: string) {
  const header = `[Script Info]\nScriptType: v4.00+\nPlayResX: 720\nPlayResY: 1280\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Pretendard,36,&H00FFFFFF,&H64000000,0,0,1,3,0,2,40,40,100,0\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`
  const lines = scenes.map((s, i) => {
    const start = toAssTime(accumulate(scenes, i))
    const end = toAssTime(accumulate(scenes, i + 1))
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${s.text.replace(/\n/g, '\\N')}`
  })
  await fs.writeFile(assPath, header + lines.join('\n'))
}
function accumulate(arr:any[], idx:number){ return arr.slice(0, idx).reduce((t,s)=> t + (s.duration || 3), 0) }
function toAssTime(sec:number){
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = (sec%60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${s.toFixed(2).padStart(5,'0')}`
}
