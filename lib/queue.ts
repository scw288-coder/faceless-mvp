import { Queue } from 'bullmq'
export const renderQueue = new Queue('render', { connection: { url: process.env.REDIS_URL! } })
