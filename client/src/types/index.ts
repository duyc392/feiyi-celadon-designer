// ============ 产品类型 ============
export type ProductType = 'coffee-cup' | 'tea-cup' | 'tea-pot' | 'gongdao-cup' | 'vase' | 'ornament' | 'incense' | 'stationery' | 'other'

export interface ProductTypeInfo {
  id: ProductType
  name: string
  icon: string
  description: string
  dimensions: DesignDimension[]
}

// ============ 设计维度 ============
export type DesignDimension = 'shape' | 'glaze' | 'pattern' | 'engraving' | 'relief' | 'texture'

export interface DesignContext {
  productType: ProductType | null
  hasSketch: boolean
  sketchImage?: string          // base64 手绘稿
  shape?: ShapeChoice
  glaze?: GlazeChoice
  pattern?: PatternChoice
  engraving?: EngravingChoice
  relief?: ReliefChoice
  texture?: TextureChoice
  freeText?: string              // 匠人自由描述
  currentStep: number
}

// ============ 设计选项 ============
export interface ShapeChoice {
  type: 'preset' | 'custom' | 'sketch'
  presetId?: string
  description?: string
  sketchImage?: string
}

export interface GlazeChoice {
  glazeId: string
  glazeName: string
  hex: string
}

export interface PatternChoice {
  type: 'none' | 'preset' | 'custom' | 'sketch'
  presetId?: string
  description?: string
  position?: 'upper' | 'middle' | 'lower' | 'full'
  sketchImage?: string
}

export interface EngravingChoice {
  type: 'none' | 'incised-line' | 'half-knife' | 'comb-pattern' | 'line-engraving'
  position?: string
  description?: string
}

export interface ReliefChoice {
  type: 'none' | 'low-relief' | 'applied' | 'stamped' | 'sculpted'
  position?: string
  description?: string
}

export interface TextureChoice {
  type: 'smooth' | 'jump-knife' | 'string' | 'spiral'
  description?: string
}

// ============ AI 相关类型 ============
export interface GuideStep {
  dimension: DesignDimension | 'product-type' | 'sketch' | 'confirm' | 'done'
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

export interface SketchAnalysisResult {
  cleanLineArt: string       // base64 干净线稿
  recognition: {
    type: 'shape' | 'pattern' | 'mixed'
    shapeName?: string
    patternType?: string
    symmetryAxis?: number
    keyPoints?: { x: number; y: number }[]
  }
  suggestions: string[]
}

export interface GeneratedImage {
  id: string
  imageUrl: string
  prompt: string
  version: number
}

// ============ 项目类型 ============
export interface DesignProject {
  id: string
  title: string
  context: DesignContext
  sketchAnalysis?: SketchAnalysisResult
  generatedImages: GeneratedImage[]
  finalImage?: string
  status: 'draft' | 'analyzing' | 'generating' | 'done'
  createdAt: string
}

// ============ 青瓷知识库类型 ============
export interface GlazeDefinition {
  id: string
  name: string
  hex: string
  description: string
  features: string[]
}

export interface PatternDefinition {
  id: string
  name: string
  category: string
  description: string
  suitableFor: ProductType[]
}

export interface EngravingDefinition {
  id: string
  name: string
  description: string
  technique: string
}

export interface ReliefDefinition {
  id: string
  name: string
  description: string
  technique: string
}

export interface TextureDefinition {
  id: string
  name: string
  description: string
  technique: string
}
