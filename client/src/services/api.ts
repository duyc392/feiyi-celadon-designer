import type { DesignContext, GuideStep, SketchAnalysisResult, GeneratedImage } from '../types'

const BASE = '/api'

function getApiKey(): string {
  return localStorage.getItem('openai_api_key') || ''
}

async function post<T>(url: string, body: any): Promise<T> {
  // 自动附带 API Key（如果有）
  const apiKey = getApiKey()
  const payload = apiKey ? { ...body, apiKey } : body

  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }))
    throw new Error(err.error || '请求失败')
  }
  return res.json()
}

// 获取引导下一步
export async function getNextStep(context: DesignContext): Promise<GuideStep> {
  return post('/guide/next-step', { context })
}

// 线稿分析
export async function analyzeSketch(image: string, productType: string): Promise<SketchAnalysisResult> {
  return post('/sketch/analyze', { image, productType })
}

// 修正线稿
export async function reviseSketch(lineArt: string, feedback: string): Promise<{ revisedLineArt: string; message: string }> {
  return post('/sketch/revise', { lineArt, feedback })
}

// 文生图
export async function textToImage(prompt: string): Promise<GeneratedImage> {
  return post('/generate/text-to-image', { prompt })
}

// 参考图生图
export async function imageToImage(refImage: string, prompt: string, strength?: number): Promise<GeneratedImage> {
  return post('/generate/image-to-image', { refImage, prompt, strength })
}

// 局部重绘
export async function inpaint(image: string, mask: string, prompt: string): Promise<GeneratedImage> {
  return post('/generate/inpaint', { image, mask, prompt })
}
