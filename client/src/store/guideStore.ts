import { create } from 'zustand'
import type {
  DesignContext, ProductType, DesignDimension,
  ShapeChoice, GlazeChoice, PatternChoice,
  EngravingChoice, ReliefChoice, TextureChoice,
  GuideStep,
} from '../types'

interface GuideState {
  context: DesignContext
  step: GuideStep | null
  loading: boolean
  setProductType: (type: ProductType) => void
  setSketch: (imageBase64: string) => void
  setShape: (shape: ShapeChoice) => void
  setGlaze: (glaze: GlazeChoice) => void
  setPattern: (pattern: PatternChoice) => void
  setEngraving: (engraving: EngravingChoice) => void
  setRelief: (relief: ReliefChoice) => void
  setTexture: (texture: TextureChoice) => void
  setStep: (step: GuideStep | null) => void
  setLoading: (loading: boolean) => void
  advanceStep: () => void
  reset: () => void
}

const initialContext: DesignContext = {
  productType: null,
  hasSketch: false,
  currentStep: 0,
}

export const useGuideStore = create<GuideState>((set, get) => ({
  context: initialContext,
  step: null,
  loading: false,

  setProductType: (type) => set((s) => ({
    context: { ...s.context, productType: type, currentStep: 0 },
  })),

  setSketch: (image) => set((s) => ({
    context: { ...s.context, hasSketch: true, sketchImage: image },
  })),

  setShape: (shape) => set((s) => ({
    context: { ...s.context, shape },
  })),

  setGlaze: (glaze) => set((s) => ({
    context: { ...s.context, glaze },
  })),

  setPattern: (pattern) => set((s) => ({
    context: { ...s.context, pattern },
  })),

  setEngraving: (engraving) => set((s) => ({
    context: { ...s.context, engraving },
  })),

  setRelief: (relief) => set((s) => ({
    context: { ...s.context, relief },
  })),

  setTexture: (texture) => set((s) => ({
    context: { ...s.context, texture },
  })),

  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  advanceStep: () => set((s) => ({
    context: { ...s.context, currentStep: s.context.currentStep + 1 },
  })),
  reset: () => set({ context: initialContext, step: null, loading: false }),
}))
