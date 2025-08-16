import { Injectable } from '@nestjs/common'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI, { AzureOpenAI } from 'openai'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'

export interface IAiChatOptions extends Omit<ChatCompletionCreateParamsNonStreaming, 'messages' | 'model'> {}

@Injectable()
export class AiService {
  client =
    process.env.AI_SERVICE_TYPE === 'azure'
      ? new AzureOpenAI({
          apiKey: process.env.AI_KEY,
          endpoint: process.env.AI_ENTRYPOINT,
          httpAgent: process.env.AI_PROXY_URL ? new HttpsProxyAgent(process.env.AI_PROXY_URL) : undefined,

          apiVersion: process.env.AZURE_OPEN_AI_API_VERSION,
        })
      : new OpenAI({
          apiKey: process.env.AI_KEY,
          httpAgent: process.env.AI_PROXY_URL ? new HttpsProxyAgent(process.env.AI_PROXY_URL) : undefined,

          baseURL: process.env.AI_ENTRYPOINT || undefined,
        })

  async listAllModels() {
    return (await this.client.models.list()).data
  }

  async chat(prompt: string, options?: IAiChatOptions) {
    return this.client.chat.completions
      .create({
        ...options,
        messages: [{ role: 'user', content: prompt }],
        model: process.env.AI_MODEL!,
      })
      .then(res => res.choices[0].message.content)
  }

  async multipleChat(prompt: string, n = 1, options?: IAiChatOptions) {
    const temperatureArray = n === 1 ? [1] : n === 2 ? [1, 1.3] : [0.5, 1, 1.5]
    if (process.env.AI_PARAM_N_FALLBACK_PARALLEL) {
      return Promise.all(temperatureArray.map(temperature => this.chat(prompt, { ...options, temperature })))
    }

    return this.client.chat.completions
      .create({
        ...options,
        messages: [{ role: 'user', content: prompt }],
        n,
        model: process.env.AI_MODEL!,
      })
      .then(res => res.choices.map(choice => choice.message.content))
  }

  async weekly(text: string) {
    return this.chat(`请帮我把以下的工作内容填充为一篇完整的周报，用 markdown 格式以分点叙述的形式输出：${text}`, {
      max_tokens: 3000,
    }).then(text => text!.slice(text!.indexOf('#')))
  }
}
