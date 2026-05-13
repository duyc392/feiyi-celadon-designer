import express from 'express'
import cors from 'cors'
import { initDb } from './db/index.js'
import guideRouter from './routes/guide.js'
import sketchRouter from './routes/sketch.js'
import generateRouter from './routes/generate.js'
import { API_CONFIG } from './config.js'
import { initImageGenerator } from './services/ai/image-generator.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Routes
app.use('/api/guide', guideRouter)
app.use('/api/sketch', sketchRouter)
app.use('/api/generate', generateRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

// Init
initDb()
if (API_CONFIG.defaultApiKey) {
  initImageGenerator(API_CONFIG.defaultApiKey)
  console.log('[Server] 已使用默认 API Key 初始化生图服务')
}

app.listen(PORT, () => {
  console.log(`[Server] 非遗设计助手后端已启动: http://localhost:${PORT}`)
})
