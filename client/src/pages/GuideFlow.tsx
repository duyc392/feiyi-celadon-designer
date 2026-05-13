import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatGuide from '../components/ChatGuide'
import StepIndicator from '../components/StepIndicator'
import SketchUploader from '../components/SketchUploader'
import LineArtViewer from '../components/LineArtViewer'
import DesignResult from '../components/DesignResult'
import { useGuideStore } from '../store/guideStore'
import { getNextStep, analyzeSketch, textToImage, imageToImage } from '../services/api'
import { buildPrompt } from '../services/promptBuilder'
import { processSketch } from '../services/sketchProcessor'
import type { GuideOption, ProductType, SketchAnalysisResult, GeneratedImage } from '../types'

const dimLabels = ['产品', '器型', '釉色', '纹样', '刻花', '雕花', '肌理', '生成']

type ViewState = 'guide' | 'sketch-upload' | 'sketch-process' | 'lineart-review' | 'generating' | 'result'

export default function GuideFlow() {
  const navigate = useNavigate()
  const {
    context, step, loading,
    setProductType, setSketch, setShape, setGlaze,
    setPattern, setEngraving, setRelief, setTexture,
    setStep, setLoading, advanceStep, reset,
  } = useGuideStore()

  const [viewState, setViewState] = useState<ViewState>('guide')
  const [sketchAnalysis, setSketchAnalysis] = useState<SketchAnalysisResult | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')

  // 请求下一步引导
  const fetchNextStep = useCallback(async () => {
    setLoading(true)
    try {
      const next = await getNextStep(context)
      setStep(next)
      setViewState('guide')
    } catch {
      // continue with current step
    } finally {
      setLoading(false)
    }
  }, [context])

  useEffect(() => {
    fetchNextStep()
  }, [context.productType, context.currentStep])

  // ============ 手绘上传处理 ============
  const handleSketchUpload = useCallback(async (imageBase64: string) => {
    if (!imageBase64) return
    setViewState('sketch-process')
    setLoading(true)

    try {
      // 1. 免费 Canvas 预处理（边缘检测、线条增强、去噪）
      const processed = await processSketch(imageBase64, {
        edgeStrength: 0.5,
        lineThickness: 0.4,
        smoothing: 0.3,
        simplify: true,
      })

      // 2. 发送给服务端分析（有 API Key 则 AI 深度分析，否则基础分析）
      const result = await analyzeSketch(processed, context.productType || 'coffee-cup')
      setSketchAnalysis(result)
      setSketch(processed)
      setShape({ type: 'sketch', sketchImage: processed })
      setViewState('lineart-review')
    } catch {
      // 即使服务端分析失败，也继续用预处理后的图
      setSketch(imageBase64)
      setShape({ type: 'sketch', sketchImage: imageBase64 })
      advanceStep()
    } finally {
      setLoading(false)
    }
  }, [context.productType, setSketch, setShape, advanceStep])

  // ============ 线稿确认 → 继续引导 ============
  const handleLineArtConfirm = useCallback((lineArt: string) => {
    setSketch(lineArt)
    setShape({ type: 'sketch', sketchImage: lineArt })
    setViewState('guide')
    advanceStep()
  }, [setSketch, setShape, advanceStep])

  // ============ 生成设计 ============
  const handleGenerate = useCallback(async () => {
    setViewState('generating')
    const prompt = buildPrompt(context)
    setCurrentPrompt(prompt)

    try {
      let result: GeneratedImage
      if (context.sketchImage) {
        // 有手绘参考图 → img2img
        result = await imageToImage(context.sketchImage, prompt, 0.7)
      } else {
        // 纯文本 → 文生图
        result = await textToImage(prompt)
      }
      setGeneratedImages([result])
      setViewState('result')
    } catch (err: any) {
      console.error('生图失败:', err.message)
      // 显示错误后回退
      setViewState('guide')
    }
  }, [context])

  // 迭代修改
  const handleRefine = useCallback(async (feedback: string) => {
    setViewState('generating')
    const newPrompt = `${currentPrompt}。修改要求：${feedback}`
    setCurrentPrompt(newPrompt)

    try {
      const result = context.sketchImage
        ? await imageToImage(context.sketchImage, newPrompt, 0.6)
        : await textToImage(newPrompt)
      setGeneratedImages(prev => [...prev, result])
      setViewState('result')
    } catch {
      setViewState('result')
    }
  }, [currentPrompt, context.sketchImage])

  // ============ 用户选择处理 ============
  const handleSelect = useCallback(async (option: GuideOption) => {
    const dim = step?.dimension

    if (dim === 'product-type') {
      setProductType(option.id as ProductType)
      return
    }

    // 手绘上传触发
    if (option.imageBase64) {
      handleSketchUpload(option.imageBase64)
      return
    }

    if (dim === 'shape') {
      if (option.id === 'custom') {
        setShape({ type: 'custom', description: option.label })
      } else {
        setShape({ type: 'preset', presetId: option.id })
      }
    }
    if (dim === 'glaze') {
      setGlaze({ glazeId: option.id, glazeName: option.label, hex: option.colorHex || '#b5cdc4' })
    }
    if (dim === 'pattern') {
      if (option.id === 'custom') setPattern({ type: 'custom', description: option.label })
      else if (option.id === 'plain') setPattern({ type: 'none' })
      else setPattern({ type: 'preset', presetId: option.id })
    }
    if (dim === 'engraving') {
      setEngraving({ type: option.id as any, description: option.id === 'none' ? undefined : option.label })
    }
    if (dim === 'relief') {
      setRelief({ type: option.id as any, description: option.id === 'none' ? undefined : option.label })
    }
    if (dim === 'texture') {
      setTexture({ type: option.id as any, description: option.id === 'smooth' ? undefined : option.label })
    }

    advanceStep()
  }, [step, handleSketchUpload, setProductType, setShape, setGlaze, setPattern, setEngraving, setRelief, setTexture, advanceStep])

  const handleSkip = useCallback(() => advanceStep(), [advanceStep])

  // ============ 线稿评审视图 ============
  if (viewState === 'lineart-review' && sketchAnalysis) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
        <div className="px-4 pt-4 pb-2">
          <button onClick={() => setViewState('guide')}
            className="text-[#5b7a6f] text-lg touch-target">← 返回</button>
        </div>
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          <LineArtViewer analysis={sketchAnalysis} onConfirm={handleLineArtConfirm} />
        </div>
      </div>
    )
  }

  // ============ 生图结果视图 ============
  if (viewState === 'result') {
    return (
      <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <button onClick={() => { reset(); navigate('/') }}
            className="text-[#5b7a6f] text-lg touch-target">← 首页</button>
          <span className="text-sm text-[#8a7e6b]">设计结果</span>
        </div>
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          <DesignResult
            images={generatedImages}
            prompt={currentPrompt}
            onRefine={handleRefine}
            onRegenerate={handleGenerate}
            loading={viewState === 'generating'}
          />
        </div>
      </div>
    )
  }

  // ============ 产品选择页 ============
  if (!context.productType && step) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
        <div className="px-4 pt-4 pb-2">
          <button onClick={() => { reset(); navigate('/') }}
            className="text-[#5b7a6f] text-lg touch-target flex items-center gap-1">← 返回</button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-4 pb-6">
          <h2 className="text-xl font-bold text-[#2c2416] mb-4 text-center">您想设计什么产品？</h2>
          <ChatGuide step={step} onSelect={handleSelect} onSkip={handleSkip} />
        </div>
      </div>
    )
  }

  // ============ 引导流程 ============
  if (step && step.dimension !== 'done') {
    return (
      <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
        <div className="px-4 pt-4 pb-2">
          <button onClick={() => { reset(); navigate('/') }}
            className="text-[#5b7a6f] text-lg touch-target flex items-center gap-1">← 返回</button>
        </div>
        <StepIndicator current={context.currentStep} total={7} labels={dimLabels} />
        <div className="flex-1 flex flex-col">
          <ChatGuide step={step} onSelect={handleSelect} onSkip={handleSkip} />
        </div>
      </div>
    )
  }

  // ============ 引导完成 → 触发生图 ============
  if (step?.dimension === 'done' && viewState !== 'generating') {
    handleGenerate()
  }

  // ============ 生图中 ============
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#f5f0e8] gap-4 px-6">
      <div className="text-6xl">✨</div>
      <h2 className="text-2xl font-bold text-[#2c2416]">AI 正在生成设计</h2>
      <p className="text-[#8a7e6b] text-center">{currentPrompt.slice(0, 50)}...</p>
      <div className="w-12 h-12 border-4 border-[#5b7a6f] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
