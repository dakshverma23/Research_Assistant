import { DEFAULT_MODEL } from 'shared'

interface Config {
  port: number
  openRouterApiKey: string
  aiModel: string
  nodeEnv: string
}

function getConfig(): Config {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.warn('⚠️  OPENROUTER_API_KEY not set. AI features will use fallback mode.')
    console.warn('   Set it in .env file: OPENROUTER_API_KEY=your_key_here')
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    openRouterApiKey: apiKey || '',
    aiModel: process.env.AI_MODEL || DEFAULT_MODEL,
    nodeEnv: process.env.NODE_ENV || 'development'
  }
}

export const config = getConfig()