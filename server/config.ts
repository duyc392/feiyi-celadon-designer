/**
 * 全局配置
 * 所有 AI 请求统一走用户的中转 API
 */
export const API_CONFIG = {
  baseUrl: 'https://grsai.dakka.com.cn',
  // API Key 通过请求动态传入（优先）或从环境变量读取
  defaultApiKey: process.env.OPENAI_API_KEY || '',
}
