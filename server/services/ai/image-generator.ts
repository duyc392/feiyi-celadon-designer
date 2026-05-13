/**
 * GPT Image 2 生图 Provider
 * 通过中转 API: POST /v1/draw/completions
 * 响应格式: SSE 流 (data: {...}\n\n)
 */

import type { GeneratedImage, DesignImageProvider } from './interface.js'
import { API_CONFIG } from '../../config.js'

export class ImageGenerator implements DesignImageProvider {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor(config: { apiKey: string; model?: string; baseUrl?: string }) {
    this.apiKey = config.apiKey
    this.model = config.model || 'gpt-image-2'
    this.baseUrl = config.baseUrl || API_CONFIG.baseUrl
  }

  async textToImage(prompt: string): Promise<GeneratedImage> {
    console.log(`[Draw] 文生图 prompt: ${prompt}`)

    const response = await fetch(`${this.baseUrl}/v1/draw/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`生图失败: ${response.status} ${err}`)
    }

    return this.parseSSEResponse(response, prompt)
  }

  async imageToImage(
    refImage: string,
    prompt: string,
    strength?: number
  ): Promise<GeneratedImage> {
    console.log(`[Draw] 参考图生图 prompt: ${prompt}`)
    console.log(`[Draw] 参考图生图 strength: ${strength ?? 0.7}`)

    const response = await fetch(`${this.baseUrl}/v1/draw/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        image: refImage,              // base64 参考图
        strength: strength ?? 0.7,
        n: 1,
        size: '1024x1024',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`img2img 失败: ${response.status} ${err}`)
    }

    return this.parseSSEResponse(response, prompt)
  }

  async inpaint(
    image: string,
    mask: string,
    prompt: string
  ): Promise<GeneratedImage> {
    console.log(`[Draw] 局部重绘 prompt: ${prompt}`)

    const response = await fetch(`${this.baseUrl}/v1/draw/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        image,
        mask,
        n: 1,
        size: '1024x1024',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`局部重绘失败: ${response.status} ${err}`)
    }

    return this.parseSSEResponse(response, prompt)
  }

  /**
   * 解析 SSE 流式响应
   * 格式: data: {"id":"...","status":"running","progress":50,...}\n\n
   */
  private async parseSSEResponse(response: Response, prompt: string): Promise<GeneratedImage> {
    const text = await response.text()
    const lines = text.split('\n').filter(l => l.startsWith('data: '))

    let lastData: any = null
    for (const line of lines) {
      try {
        const json = JSON.parse(line.slice(6)) // 去掉 "data: " 前缀
        lastData = json
        const progress = json.progress || 0
        if (progress % 20 === 0) {
          console.log(`[Draw] 进度: ${progress}%`)
        }
      } catch {
        // 跳过解析失败的行
      }
    }

    if (!lastData) {
      throw new Error('SSE 响应解析失败：无有效数据')
    }

    if (lastData.status === 'succeeded' && lastData.results?.length > 0) {
      console.log(`[Draw] 生图成功 url: ${lastData.results[0].url}`)
      return {
        id: lastData.id || `gen-${Date.now()}`,
        imageUrl: lastData.results[0].url,
        prompt,
        version: 1,
      }
    }

    if (lastData.status === 'failed') {
      throw new Error(`生图失败: ${lastData.failure_reason || '未知错误'}`)
    }

    throw new Error(`生图异常状态: ${lastData.status}`)
  }
}

// 单例
let instance: ImageGenerator | null = null

export function getImageGenerator(apiKey?: string): ImageGenerator {
  if (!instance && apiKey) {
    instance = new ImageGenerator({ apiKey })
  }
  if (!instance) {
    throw new Error('图片生成器未初始化。请先设置 API Key。')
  }
  return instance
}

export function initImageGenerator(apiKey: string): void {
  instance = new ImageGenerator({ apiKey })
}
