/**
 * 线稿分析 Provider
 * 当前中转 API 已确认可用于 draw/completions 生图，
 * 但 chat/completions 上的 gpt-image-2 会直接返回图片而不是稳定的结构化分析。
 * 因此这里默认走安全的基础分析，避免把分析步骤误触发成生图步骤。
 */

import type { SketchAnalyzer, SketchAnalysisResult } from './interface.js'

export class SafeSketchAnalyzer implements SketchAnalyzer {
  async analyze(rawImage: string): Promise<SketchAnalysisResult> {
    return this.fallbackAnalysis(rawImage)
  }

  async revise(currentLineArt: string, _feedback: string): Promise<string> {
    return currentLineArt
  }

  private fallbackAnalysis(imageBase64: string): SketchAnalysisResult {
    return {
      cleanLineArt: imageBase64,
      recognition: {
        type: 'shape',
        shapeName: '手绘器型',
      },
      suggestions: [
        '已通过前端预处理提取线条',
        '当前版本默认使用安全分析模式，避免误触发生图接口',
        '线稿确认后会直接进入正式生图流程',
      ],
    }
  }
}

let analyzerInstance: SafeSketchAnalyzer | null = null

export function getVisionAnalyzer(_apiKey?: string): SafeSketchAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new SafeSketchAnalyzer()
  }
  return analyzerInstance
}

export function initVisionAnalyzer(_apiKey: string): void {
  analyzerInstance = new SafeSketchAnalyzer()
}
