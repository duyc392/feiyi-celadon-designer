import { Router } from 'express'
import type { DesignContext, GuideStep, GuideOption } from '../services/ai/interface.js'

const router = Router()

// 产品类型 → 下一步映射
const stepFlow: Record<string, string[]> = {
  'coffee-cup': ['shape', 'glaze', 'pattern', 'engraving', 'relief', 'texture', 'confirm'],
  'tea-cup': ['shape', 'glaze', 'pattern', 'engraving', 'relief', 'texture', 'confirm'],
  'tea-pot': ['shape', 'glaze', 'pattern', 'engraving', 'relief', 'texture', 'confirm'],
  'gongdao-cup': ['shape', 'glaze', 'pattern', 'texture', 'confirm'],
  'vase': ['shape', 'glaze', 'pattern', 'engraving', 'relief', 'texture', 'confirm'],
  'ornament': ['shape', 'glaze', 'relief', 'texture', 'confirm'],
  'incense': ['shape', 'glaze', 'pattern', 'engraving', 'relief', 'confirm'],
  'stationery': ['shape', 'glaze', 'pattern', 'engraving', 'confirm'],
}

// 各维度的选项
const dimensionOptions: Record<string, GuideOption[]> = {
  shape: [
    { id: 'straight', label: '直身型', description: '简洁现代' },
    { id: 'douli', label: '斗笠型', description: '口大底小' },
    { id: 'mug', label: '马克杯型', description: '经典款' },
    { id: 'slim-tall', label: '瘦高型', description: '修长优雅' },
    { id: 'short-wide', label: '矮胖型', description: '敦厚稳重' },
    { id: 'waisted', label: '收腰型', description: '线条优美' },
    { id: 'flared', label: '撇口型', description: '古典韵味' },
  ],
  glaze: [
    { id: 'fenqing', label: '粉青', colorHex: '#b5cdc4' },
    { id: 'meiziqing', label: '梅子青', colorHex: '#7d9d72' },
    { id: 'douqing', label: '豆青', colorHex: '#a3b79a' },
    { id: 'yuebai', label: '月白', colorHex: '#c5d5cb' },
    { id: 'huiqing', label: '灰青', colorHex: '#8a9e8b' },
    { id: 'tianqing', label: '天青', colorHex: '#b8d4d8' },
    { id: 'mieste', label: '米黄釉', colorHex: '#e8dcc8' },
  ],
  pattern: [
    { id: 'plain', label: '素面', description: '以釉色器型取胜' },
    { id: 'lotus', label: '莲瓣纹', description: '经典青瓷纹样' },
    { id: 'interlocking', label: '缠枝纹', description: '连绵不绝' },
    { id: 'cloud', label: '云纹', description: '祥云飘逸' },
    { id: 'geometric', label: '几何纹', description: '现代简约' },
    { id: 'fret', label: '回纹', description: '简洁大方' },
    { id: 'flower', label: '花卉纹', description: '牡丹/菊/梅' },
  ],
  engraving: [
    { id: 'none', label: '不用刻花', description: '' },
    { id: 'incised-line', label: '阴刻线条', description: '细线勾勒纹样' },
    { id: 'half-knife', label: '半刀泥', description: '深浅有致，层次丰富' },
    { id: 'comb-pattern', label: '篦划纹', description: '平行细线如水波' },
  ],
  relief: [
    { id: 'none', label: '不用雕花', description: '' },
    { id: 'low-relief', label: '浅浮雕', description: '微微凸起' },
    { id: 'applied', label: '堆塑', description: '手工捏塑贴于器表' },
    { id: 'stamped', label: '印花', description: '模具压印' },
  ],
  texture: [
    { id: 'smooth', label: '光滑', description: '光洁釉面' },
    { id: 'jump-knife', label: '跳刀纹', description: '韵律纹理' },
    { id: 'string', label: '弦纹', description: '平行环绕线条' },
    { id: 'spiral', label: '旋纹', description: '拉坯自然纹理' },
    { id: 'crackle', label: '开片', description: '冰裂纹理' },
  ],
}

const dimensionLabels: Record<string, string> = {
  shape: '器型',
  glaze: '釉色',
  pattern: '纹样',
  engraving: '刻花',
  relief: '雕花',
  texture: '肌理',
}

// POST /api/guide/next-step
router.post('/next-step', (req, res) => {
  const context: DesignContext = req.body.context
  const { productType, currentStep } = context

  if (!productType) {
    // 第一步：询问产品类型
    const step: GuideStep = {
      dimension: 'product-type',
      question: '您这次想做什么产品？',
      options: [
        { id: 'coffee-cup', label: '☕ 咖啡杯', description: '日常咖啡杯/马克杯' },
        { id: 'tea-cup', label: '🍵 茶杯', description: '品茗杯/斗笠杯' },
        { id: 'tea-pot', label: '🫖 茶壶', description: '青瓷茶壶' },
        { id: 'gongdao-cup', label: '🫗 公道杯', description: '匀杯' },
        { id: 'vase', label: '🏺 花器', description: '花瓶/花插' },
        { id: 'ornament', label: '🎭 摆件', description: '装饰摆件' },
        { id: 'incense', label: '🔥 香器', description: '香炉/香插' },
        { id: 'stationery', label: '🖊️ 文房', description: '笔筒/笔洗' },
      ],
      allowSkip: false,
      allowVoice: true,
      allowSketch: false,
    }
    res.json(step)
    return
  }

  const steps = stepFlow[productType]
  if (!steps || currentStep >= steps.length) {
    res.json({ dimension: 'done', question: '', options: [], allowSkip: false, allowVoice: false, allowSketch: false })
    return
  }

  const dim = steps[currentStep]
  const step: GuideStep = {
    dimension: dim,
    question: `第 ${currentStep + 1} 步：${dimensionLabels[dim] || dim}怎么选？`,
    options: dimensionOptions[dim] || [],
    allowSkip: dim !== 'shape',
    allowVoice: true,
    allowSketch: dim === 'shape' || dim === 'pattern',
  }
  res.json(step)
})

export default router
