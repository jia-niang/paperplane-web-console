import { client } from '@/utils/client'

/**
 * 输出周报的格式
 * `"normal"` = 通常
 * `"career"` = 科锐国际
 * `"career-fe"` = 科锐国际+前端
 */
export type weeklyModeType = 'normal' | 'career' | 'career-fe'

export async function gptChatApi(text: string): Promise<string> {
  return client.post('/ai/chat', { text }).then(res => res.answer)
}

export async function gptMultipleChatApi(text: string, num: number = 1): Promise<string[]> {
  return client.post('/ai/multiple-chat', { text, num })
}

export async function aiWeeklyApi(text: string, mode: weeklyModeType): Promise<string> {
  return client.post('/ai/weekly', { text, mode }).then(res => res.answer)
}
