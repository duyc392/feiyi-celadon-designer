// ============ 线稿分析接口 ============
export interface SketchAnalysisResult {
  cleanLineArt: string        // base64 干净线稿
  recognition: {
    type: 'shape' | 'pattern' | 'mixed'
    shapeName?: string
    patternType?: string
    symmetryAxis?: number
    keyPoints?: { x: number; y: number }[]
  }
  suggestions: string[]
}

export interface SketchAnalyzer {
  analyze(rawImage: string): Promise<SketchAnalysisResult>
  revise(currentLineArt: string, feedback: string): Promise<string>
}

// ============ 生图接口 ============
export interface GeneratedImage {
  id: string
  imageUrl: string
  prompt: string
  version: number
}

export interface DesignImageProvider {
  textToImage(prompt: string, negativePrompt?: string): Promise<GeneratedImage>
  imageToImage(refImage: string, prompt: string, strength?: number): Promise<GeneratedImage>
  inpaint(image: string, mask: string, prompt: string): Promise<GeneratedImage>
}

// ============ 对话引导接口 ============
export interface GuideStep {
  dimension: string
  question: string
  options: GuideOption[]
  allowSkip: boolean
  allowVoice: boolean
  allowSketch: boolean
}

export interface GuideOption {
  id: string
  label: string
  description?: string
  imageUrl?: string
  colorHex?: string
}

export interface GuideProvider {
  getNextStep(context: DesignContext): Promise<GuideStep>
}

// ============ 共享上下文 ============
export interface DesignContext {
  productType: string | null
  hasSketch: boolean
  sketchImage?: string
  shape?: { type: string; presetId?: string; description?: string; sketchImage?: string }
  glaze?: { glazeId: string; glazeName: string; hex: string }
  pattern?: { type: string; presetId?: string; description?: string; position?: string; sketchImage?: string }
  engraving?: { type: string; position?: string; description?: string }
  relief?: { type: string; position?: string; description?: string }
  texture?: { type: string; description?: string }
  freeText?: string
  currentStep: number
}
