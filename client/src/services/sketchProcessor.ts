/**
 * 免费线稿预处理引擎
 * 基于 Canvas API 实现，纯前端运行，无需任何外部 API
 * 功能：灰度化 → 边缘检测(Sobel) → 线条增强 → 平滑去噪
 */

export interface ProcessOptions {
  edgeStrength?: number    // 边缘检测强度 0-1，默认 0.5
  lineThickness?: number   // 线条增强程度 0-1，默认 0.4
  smoothing?: number       // 平滑程度 0-1，默认 0.3
  simplify?: boolean       // 是否简化线条（去杂线）
}

const defaults: ProcessOptions = {
  edgeStrength: 0.5,
  lineThickness: 0.4,
  smoothing: 0.3,
  simplify: true,
}

/**
 * 将图片加载到 Canvas 并预处理
 */
export async function processSketch(
  imageBase64: string,
  options: ProcessOptions = {}
): Promise<string> {
  const opts = { ...defaults, ...options }
  const img = await loadImage(imageBase64)

  const canvas = document.createElement('canvas')
  const w = canvas.width = img.width
  const h = canvas.height = img.height
  const ctx = canvas.getContext('2d')!

  // 1. 绘制原图
  ctx.drawImage(img, 0, 0, w, h)
  const srcData = ctx.getImageData(0, 0, w, h)

  // 2. 灰度化 + 增强对比度
  const gray = toGrayscale(srcData)

  // 3. 边缘检测 (Sobel)
  const edges = sobelEdgeDetection(gray, w, h, opts.edgeStrength!)

  // 4. 线条增强（膨胀）
  const enhanced = enhanceLines(edges, w, h, opts.lineThickness!)

  // 5. 平滑去噪
  const smoothed = opts.simplify
    ? removeNoise(enhanced, w, h, opts.smoothing!)
    : enhanced

  // 6. 输出干净线稿
  const outData = ctx.createImageData(w, h)
  for (let i = 0; i < w * h; i++) {
    const val = smoothed[i]
    const idx = i * 4
    outData.data[idx] = val        // R
    outData.data[idx + 1] = val    // G
    outData.data[idx + 2] = val    // B
    outData.data[idx + 3] = 255    // A
  }
  ctx.putImageData(outData, 0, 0)

  return canvas.toDataURL('image/png')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 灰度化：加权平均法（人眼感知权重）
 */
function toGrayscale(imageData: ImageData): Uint8ClampedArray {
  const { data, width, height } = imageData
  const gray = new Uint8ClampedArray(width * height)
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    // 人眼对绿色最敏感，红次之，蓝最弱
    gray[i] = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
  }
  return gray
}

/**
 * Sobel 边缘检测
 */
function sobelEdgeDetection(
  gray: Uint8ClampedArray,
  w: number, h: number,
  strength: number
): Uint8ClampedArray {
  const edges = new Uint8ClampedArray(w * h)
  const kernelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
  const kernelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0, gy = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = gray[(y + ky) * w + (x + kx)]
          gx += pixel * kernelX[ky + 1][kx + 1]
          gy += pixel * kernelY[ky + 1][kx + 1]
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const threshold = 50 + (1 - strength) * 80  // strength越大，阈值越低，保留更多边缘
      edges[y * w + x] = magnitude > threshold ? 0 : 255  // 黑线白底
    }
  }
  return edges
}

/**
 * 线条增强：形态学膨胀
 */
function enhanceLines(
  edges: Uint8ClampedArray,
  w: number, h: number,
  thickness: number
): Uint8ClampedArray {
  const radius = Math.round(thickness * 3)  // 膨胀半径
  if (radius === 0) return edges

  const result = new Uint8ClampedArray(edges)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (edges[y * w + x] < 128) {
        // 黑像素，向周围膨胀
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy, nx = x + dx
            if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
              result[ny * w + nx] = 0
            }
          }
        }
      }
    }
  }
  return result
}

/**
 * 去噪：移除孤立的杂点
 */
function removeNoise(
  edges: Uint8ClampedArray,
  w: number, h: number,
  strength: number
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(edges)
  const windowSize = 2 + Math.round(strength * 4)  // 窗口大小

  for (let y = windowSize; y < h - windowSize; y++) {
    for (let x = windowSize; x < w - windowSize; x++) {
      if (edges[y * w + x] === 0) {
        // 统计周围黑像素数量
        let count = 0
        for (let dy = -windowSize; dy <= windowSize; dy++) {
          for (let dx = -windowSize; dx <= windowSize; dx++) {
            if (edges[(y + dy) * w + (x + dx)] < 128) count++
          }
        }
        const total = (2 * windowSize + 1) ** 2
        // 如果周围黑像素太少，视为噪点，移除
        if (count < total * 0.15) {
          result[y * w + x] = 255
        }
      }
    }
  }
  return result
}
