import { Router } from 'express'
import {
  getImageGenerator,
  initImageGenerator,
} from '../services/ai/image-generator.js'

const router = Router()

function tryGetGenerator() {
  try {
    return getImageGenerator()
  } catch {
    return null
  }
}

// POST /api/config/set-api-key
router.post('/set-api-key', (req, res) => {
  const { apiKey } = req.body
  if (!apiKey) {
    res.status(400).json({ error: '请提供 API Key' })
    return
  }
  initImageGenerator(apiKey)
  res.json({ success: true, message: 'API Key 已配置' })
})

// POST /api/generate/text-to-image
router.post('/text-to-image', async (req, res) => {
  const { prompt, apiKey } = req.body
  console.log('[Generate] text-to-image request prompt:', prompt)

  if (!tryGetGenerator() && apiKey) {
    initImageGenerator(apiKey)
  }

  if (!tryGetGenerator()) {
    res.status(400).json({ error: '请先配置 OpenAI API Key。在首页设置中填入您的 API Key。' })
    return
  }

  try {
    const gen = getImageGenerator()
    const result = await gen.textToImage(prompt)
    res.json(result)
  } catch (err: any) {
    console.error('[Generate] text-to-image error:', err.message)
    res.status(500).json({ error: err.message || '生图失败' })
  }
})

// POST /api/generate/image-to-image
router.post('/image-to-image', async (req, res) => {
  const { refImage, prompt, strength, apiKey } = req.body
  console.log('[Generate] image-to-image request prompt:', prompt)

  if (!refImage) {
    res.status(400).json({ error: '缺少参考图' })
    return
  }

  if (!tryGetGenerator() && apiKey) {
    initImageGenerator(apiKey)
  }

  if (!tryGetGenerator()) {
    res.status(400).json({ error: '请先配置 API Key' })
    return
  }

  try {
    const gen = getImageGenerator()
    const result = await gen.imageToImage(refImage, prompt, strength)
    res.json(result)
  } catch (err: any) {
    console.error('[Generate] image-to-image error:', err.message)
    res.status(500).json({ error: err.message || '生图失败' })
  }
})

// POST /api/generate/inpaint
router.post('/inpaint', async (req, res) => {
  const { image, mask, prompt, apiKey } = req.body
  console.log('[Generate] inpaint request prompt:', prompt)

  if (!tryGetGenerator() && apiKey) {
    initImageGenerator(apiKey)
  }

  try {
    const gen = getImageGenerator()
    const result = await gen.inpaint(image, mask, prompt)
    res.json(result)
  } catch (err: any) {
    console.error('[Generate] inpaint error:', err.message)
    res.status(500).json({ error: err.message || '局部重绘失败' })
  }
})

export default router
