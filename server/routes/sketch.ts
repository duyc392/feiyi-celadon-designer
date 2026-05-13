import { Router } from 'express'
import type { SketchAnalysisResult } from '../services/ai/interface.js'
import { getVisionAnalyzer, initVisionAnalyzer } from '../services/ai/sketch-analyzer.js'

const router = Router()

// 尝试获取 Vision 分析器（可能未配置 API Key）
function tryGetVisionAnalyzer() {
  try {
    return getVisionAnalyzer()
  } catch {
    return null
  }
}

// POST /api/sketch/analyze
router.post('/analyze', async (req, res) => {
  const { image, productType, apiKey } = req.body

  if (!image) {
    res.status(400).json({ error: '缺少图片数据' })
    return
  }

  // 如果带了 apiKey，初始化分析器
  if (apiKey && !tryGetVisionAnalyzer()) {
    initVisionAnalyzer(apiKey)
  }

  const analyzer = tryGetVisionAnalyzer()

  if (analyzer) {
    // 有 AI Vision：深度分析
    try {
      const result = await analyzer.analyze(image)
      res.json(result)
      return
    } catch (err: any) {
      console.error('[Sketch] AI 分析失败，使用基础分析:', err.message)
      // 降级到基础分析
    }
  }

  // 基础分析（无需 AI API）：前端已做预处理，这里直接返回
  const result: SketchAnalysisResult = {
    cleanLineArt: image,
    recognition: {
      type: 'shape',
      shapeName: productType === 'coffee-cup' ? '咖啡杯器型' :
                 productType === 'tea-cup' ? '茶杯器型' :
                 productType === 'vase' ? '花器器型' : '手绘器型',
    },
    suggestions: [
      '线条已通过前端预处理引擎提取',
      '如需 AI 详细分析，请在设置中配置 OpenAI API Key',
      '当前线稿可直接用于生图参考',
    ],
  }
  res.json(result)
})

// POST /api/sketch/revise
router.post('/revise', async (req, res) => {
  const { lineArt, feedback, apiKey } = req.body

  if (apiKey && !tryGetVisionAnalyzer()) {
    initVisionAnalyzer(apiKey)
  }

  const analyzer = tryGetVisionAnalyzer()

  if (analyzer) {
    try {
      const revised = await analyzer.revise(lineArt, feedback)
      res.json({ revisedLineArt: revised, message: `已根据"${feedback}"调整线稿（AI）` })
      return
    } catch {
      // 降级
    }
  }

  // 无 AI：返回原图 + 确认消息
  res.json({
    revisedLineArt: lineArt,
    message: `已记录反馈："${feedback}"。请配置 API Key 以启用 AI 线稿修正。`,
  })
})

export default router
