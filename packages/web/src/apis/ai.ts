import { client } from '@/utils/client'

export async function gptChatApi(text: string): Promise<string> {
  return client.post('/ai/chat', { text }).then(res => res.answer)
}

export async function gptMultipleChatApi(text: string, num: number = 1): Promise<string[]> {
  return client.post('/ai/multiple-chat', { text, num })
}
