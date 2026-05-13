import type {
  ProductTypeInfo, GlazeDefinition, PatternDefinition,
  EngravingDefinition, ReliefDefinition, TextureDefinition,
} from '../types'

// ============ 产品类型 ============
export const productTypes: ProductTypeInfo[] = [
  { id: 'coffee-cup', name: '咖啡杯', icon: '☕', description: '咖啡杯、马克杯等日常杯具', dimensions: ['shape','glaze','pattern','engraving','relief','texture'] },
  { id: 'tea-cup', name: '茶杯', icon: '🍵', description: '品茗杯、斗笠杯、罗汉杯等', dimensions: ['shape','glaze','pattern','engraving','relief','texture'] },
  { id: 'tea-pot', name: '茶壶', icon: '🫖', description: '青瓷茶壶、提梁壶等', dimensions: ['shape','glaze','pattern','engraving','relief','texture'] },
  { id: 'gongdao-cup', name: '公道杯', icon: '🫗', description: '匀杯、公道杯', dimensions: ['shape','glaze','pattern','texture'] },
  { id: 'vase', name: '花器', icon: '🏺', description: '花瓶、花插、花盆等', dimensions: ['shape','glaze','pattern','engraving','relief','texture'] },
  { id: 'ornament', name: '摆件', icon: '🎭', description: '装饰摆件、雕塑等', dimensions: ['shape','glaze','relief','texture'] },
  { id: 'incense', name: '香器', icon: '🔥', description: '香炉、香插等', dimensions: ['shape','glaze','pattern','engraving','relief'] },
  { id: 'stationery', name: '文房', icon: '🖊️', description: '笔筒、笔洗、砚台等', dimensions: ['shape','glaze','pattern','engraving'] },
]

// ============ 青瓷釉色 ============
export const glazes: GlazeDefinition[] = [
  { id: 'fenqing', name: '粉青', hex: '#b5cdc4', description: '青中泛粉，温润如玉，龙泉青瓷经典釉色', features: ['温润','柔和','如玉质感'] },
  { id: 'meiziqing', name: '梅子青', hex: '#7d9d72', description: '青翠欲滴，如青梅之色，釉色浓郁', features: ['青翠','浓郁','明亮'] },
  { id: 'douqing', name: '豆青', hex: '#a3b79a', description: '淡雅清新，如豆蔻之色', features: ['淡雅','清新','内敛'] },
  { id: 'yuebai', name: '月白', hex: '#c5d5cb', description: '淡青泛白，如月光清冷', features: ['清冷','高雅','素净'] },
  { id: 'huiqing', name: '灰青', hex: '#8a9e8b', description: '沉稳内敛，现代感强', features: ['沉稳','现代','百搭'] },
  { id: 'tianqing', name: '天青', hex: '#b8d4d8', description: '如雨后晴空，淡雅清澈', features: ['清澈','空灵','雅致'] },
  { id: 'mieste', name: '米黄釉', hex: '#e8dcc8', description: '暖黄如米色，温润古雅', features: ['温暖','古朴','柔和'] },
  { id: 'tea-dust', name: '茶叶末', hex: '#8a7d3c', description: '黄绿相间如茶末，古朴自然', features: ['古朴','自然','斑驳'] },
]

// ============ 传统纹样 ============
export const patterns: PatternDefinition[] = [
  { id: 'plain', name: '素面', category: '无纹样', description: '无纹饰，以釉色和器型取胜', suitableFor: ['coffee-cup','tea-cup','tea-pot','gongdao-cup','vase','ornament','incense','stationery'] },
  { id: 'lotus', name: '莲瓣纹', category: '植物', description: '莲花花瓣连续排列，经典青瓷纹样', suitableFor: ['coffee-cup','tea-cup','tea-pot','vase','incense'] },
  { id: 'interlocking', name: '缠枝纹', category: '植物', description: '枝蔓连绵不断，寓意生生不息', suitableFor: ['coffee-cup','tea-cup','tea-pot','vase'] },
  { id: 'cloud', name: '云纹', category: '自然', description: '祥云层层叠叠，轻盈飘逸', suitableFor: ['coffee-cup','tea-cup','tea-pot','vase','ornament'] },
  { id: 'fret', name: '回纹', category: '几何', description: '横竖短线折绕，简洁大方', suitableFor: ['coffee-cup','tea-cup','tea-pot','incense','stationery'] },
  { id: 'banana-leaf', name: '蕉叶纹', category: '植物', description: '蕉叶形状二方连续排列', suitableFor: ['tea-pot','vase'] },
  { id: 'wave', name: '波浪纹', category: '自然', description: '水波纹、波浪线，流动感强', suitableFor: ['coffee-cup','tea-cup','tea-pot','vase'] },
  { id: 'geometric', name: '几何纹', category: '几何', description: '现代几何图案，简约时尚', suitableFor: ['coffee-cup','tea-cup','vase','ornament','stationery'] },
  { id: 'flower', name: '花卉纹', category: '植物', description: '牡丹、菊花、梅花等花卉', suitableFor: ['coffee-cup','tea-cup','tea-pot','vase'] },
  { id: 'fish', name: '鱼藻纹', category: '动物', description: '游鱼水藻，生动活泼', suitableFor: ['tea-cup','vase','ornament'] },
]

// ============ 刻花工艺（阴刻） ============
export const engravings: EngravingDefinition[] = [
  { id: 'none', name: '无刻花', description: '光素无刻花', technique: '' },
  { id: 'incised-line', name: '阴刻线条', description: '用刻刀在坯体上刻出细线纹样', technique: '半干坯时刻画，深浅一致，线条流畅' },
  { id: 'half-knife', name: '半刀泥', description: '刀锋侧入，一边深一边浅，富有层次', technique: '斜刀入坯，深浅渐变，刀法讲究提按顿挫' },
  { id: 'comb-pattern', name: '篦划纹', description: '用篦状工具划出平行细线', technique: '篦子在坯体上划出密集平行线，如水波纹' },
  { id: 'line-engraving', name: '线刻', description: '细线勾勒纹样轮廓', technique: '尖锐工具勾勒轮廓线，多用于纹样起稿' },
]

// ============ 雕花工艺（阳刻） ============
export const reliefs: ReliefDefinition[] = [
  { id: 'none', name: '无雕花', description: '光素无浮雕装饰', technique: '' },
  { id: 'low-relief', name: '浅浮雕', description: '微微凸起的浅浮雕效果', technique: '剔除纹样外坯土，使纹样微微凸起' },
  { id: 'applied', name: '堆塑', description: '捏塑造型堆贴于器表', technique: '手工捏塑零件，用泥浆粘贴于器表' },
  { id: 'stamped', name: '印花', description: '用模具压印出凸起纹样', technique: '刻好模具，在坯体上压印出纹样' },
  { id: 'sculpted', name: '镂雕', description: '镂空雕刻，通透灵动', technique: '刻穿坯体，形成镂空纹样' },
]

// ============ 肌理质感 ============
export const textures: TextureDefinition[] = [
  { id: 'smooth', name: '光滑', description: '釉面光洁平滑', technique: '修坯精细，釉面自然流淌' },
  { id: 'jump-knife', name: '跳刀纹', description: '修坯时刀具跳动留下的韵律纹理', technique: '修坯时控制刀具跳动节奏，形成规律性纹理' },
  { id: 'string', name: '弦纹', description: '平行线环绕器身', technique: '修坯时刻划出平行环绕线条' },
  { id: 'spiral', name: '旋纹', description: '拉坯时自然形成的旋转纹理', technique: '保留拉坯时的自然旋纹，修坯时不完全修平' },
  { id: 'crackle', name: '开片', description: '釉面冰裂纹，自然天成', technique: '胎釉收缩率差异形成冰裂效果' },
]

// ============ 器型预设（按产品类型） ============
export const shapePresets: Record<string, { id: string; name: string; description: string }[]> = {
  'coffee-cup': [
    { id: 'straight', name: '直身杯', description: '杯身垂直，简洁现代' },
    { id: 'douli', name: '斗笠杯', description: '口大底小，如斗笠倒置' },
    { id: 'mug', name: '马克杯型', description: '经典马克杯，带把手' },
    { id: 'slim-tall', name: '瘦高型', description: '杯身修长，优雅轻盈' },
    { id: 'short-wide', name: '矮胖型', description: '杯身宽矮，稳重敦厚' },
    { id: 'waisted', name: '收腰型', description: '中部收窄，线条优美' },
    { id: 'flared', name: '撇口型', description: '杯口外撇，古典韵味' },
  ],
  'tea-cup': [
    { id: 'douli', name: '斗笠杯', description: '口大底小，经典茶器' },
    { id: 'luohan', name: '罗汉杯', description: '圆润饱满，手感舒适' },
    { id: 'straight-rim', name: '直口杯', description: '口沿平直，线条干净' },
    { id: 'flared-rim', name: '撇口杯', description: '口沿外撇，传统器型' },
  ],
  'tea-pot': [
    { id: 'xishi', name: '西施壶', description: '圆润饱满，美人肩' },
    { id: 'shipiao', name: '石瓢壶', description: '稳重方正，石瓢造型' },
    { id: 'shuiping', name: '水平壶', description: '经典水平壶型' },
  ],
  'vase': [
    { id: 'meiping', name: '梅瓶', description: '小口短颈丰肩，经典青瓷瓶型' },
    { id: 'yuhuchun', name: '玉壶春', description: '撇口细颈圆腹，柔美典雅' },
    { id: 'garlic', name: '蒜头瓶', description: '口部如蒜头，别致有趣' },
  ],
}

// ============ 引导问题预设 ============
export const guideQuestions: Record<string, string[]> = {
  shape: '您想要什么样的器型？',
  glaze: '您想用什么釉色？',
  pattern: '杯身要加纹样吗？',
  engraving: '需要刻花工艺吗？刻什么样的？',
  relief: '需要雕花工艺吗？浮雕还是堆塑？',
  texture: '表面质感想要什么样的？',
}
