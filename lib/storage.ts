import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! }
})
export async function headObject(key: string) {
  try { await s3.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key })); return true }
  catch { return false }
}
export async function putPublicObject(key: string, body: Buffer|Uint8Array, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, Body: body, ContentType: contentType, ACL: 'public-read' as any }))
  const base = process.env.CDN_BASE || `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}`
  return `${base}/${key}`
}
