import type { DesignContext } from '../types'
import { glazes, patterns, engravings, reliefs, textures } from '../data/celadonKb'

function findName<T extends { id: string; name: string }>(list: T[], id?: string): string {
  if (!id || id === 'none') return ''
  const item = list.find(i => i.id === id)
  return item?.name || id
}

/**
 * 将引导对话收集的上下文 → 生图 prompt（中文描述版）
 */
export function buildPrompt(context: DesignContext): string {
  const parts: string[] = []
  parts.push('龙泉青瓷产品设计')

  // 产品类型
  const typeNames: Record<string, string> = {
    'coffee-cup': '咖啡杯', 'tea-cup': '茶杯', 'tea-pot': '茶壶',
    'gongdao-cup': '公道杯', 'vase': '花瓶', 'ornament': '摆件',
    'incense': '香器', 'stationery': '文房用品',
  }
  if (context.productType) {
    parts.push(typeNames[context.productType] || context.productType)
  }

  // 器型
  if (context.shape) {
    if (context.shape.type === 'sketch') {
      parts.push('手绘定制器型')
    } else if (context.shape.description) {
      parts.push(context.shape.description)
    } else if (context.shape.presetId) {
      parts.push(findName([
        { id: 'straight', name: '直身型' }, { id: 'douli', name: '斗笠型' },
        { id: 'mug', name: '马克杯型' }, { id: 'slim-tall', name: '瘦高型' },
        { id: 'short-wide', name: '矮胖型' }, { id: 'waisted', name: '收腰型' },
        { id: 'flared', name: '撇口型' },
      ], context.shape.presetId))
    }
  }

  // 釉色
  if (context.glaze) {
    parts.push(`${context.glaze.glazeName}釉`)
  }

  // 纹样
  if (context.pattern && context.pattern.type !== 'none') {
    if (context.pattern.type === 'sketch') {
      parts.push('手绘定制纹样')
    } else if (context.pattern.description) {
      parts.push(context.pattern.description)
    } else if (context.pattern.presetId) {
      parts.push(`${findName(patterns, context.pattern.presetId)}装饰`)
    }
    if (context.pattern.position) {
      const pos: Record<string, string> = { upper: '上部', middle: '中部', lower: '下部', full: '满饰' }
      parts.push(`纹样位于${pos[context.pattern.position] || context.pattern.position}`)
    }
  } else if (context.pattern?.type === 'none') {
    parts.push('素面无纹')
  }

  // 刻花
  if (context.engraving && context.engraving.type !== 'none') {
    parts.push(`${findName(engravings, context.engraving.type)}工艺`)
  }

  // 雕花
  if (context.relief && context.relief.type !== 'none') {
    parts.push(`${findName(reliefs, context.relief.type)}装饰`)
  }

  // 肌理
  if (context.texture && context.texture.type !== 'smooth') {
    parts.push(`${findName(textures, context.texture.type)}质感`)
  }

  // 自由描述
  if (context.freeText) {
    parts.push(context.freeText)
  }

  // 现代产品生图约束，避免模型跑偏到动物、插画或场景图
  const productConstraints: Record<string, string> = {
    'coffee-cup': '单个咖啡杯主体，杯型清晰，适合量产的现代器物设计，突出杯口、杯身、杯底和把手结构',
    'tea-cup': '单个茶杯主体，器型比例准确，突出杯口、腹部和足部结构',
    'tea-pot': '单个茶壶主体，突出壶嘴、壶把、壶钮和壶身比例',
    'gongdao-cup': '单个公道杯主体，突出口沿、流口和腹部比例',
    'vase': '单个花器主体，突出口部、颈部、肩部和腹部轮廓',
    'ornament': '单个摆件主体，突出整体造型和青瓷表面效果',
    'incense': '单个香器主体，突出器型、开孔和结构细节',
    'stationery': '单个文房器物主体，突出功能结构和青瓷表面效果',
  }

  if (context.productType && productConstraints[context.productType]) {
    parts.push(productConstraints[context.productType])
  }

  // 风格限定
  parts.push('产品摄影，白底纯背景，柔和棚拍光线，高清，细节清晰，真实材质，电商产品图')
  parts.push('仅生成青瓷产品本体，不要动物，不要人物，不要手，不要桌面场景，不要多余装饰物')

  return parts.join('，')
}
