import Anthropic from '@anthropic-ai/sdk'
import store from '../store'
import { getHardcodedTips } from '../../shared/hardcodedTips'

function getCacheKey(myCiv: string, opponentCiv: string, gameMode: string): string {
  return `${myCiv.toLowerCase()}_vs_${opponentCiv.toLowerCase()}_${gameMode}`
}

export async function getTips(
  myCiv: string,
  opponentCiv: string,
  gameMode: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const key = getCacheKey(myCiv, opponentCiv, gameMode)
  const cached = store.get(`tipsCache.${key}` as any)
  if (cached) {
    return (cached as { tips: string }).tips
  }

  const apiKey = store.get('settings.claudeApiKey')

  // Fall back to hardcoded tips if no API key
  if (!apiKey) {
    const tips = getHardcodedTips(myCiv, opponentCiv)
    const formatted = tips.map((t) => `• ${t}`).join('\n')
    store.set(`tipsCache.${key}` as any, {
      tips: formatted,
      myCiv,
      opponentCiv,
      gameMode,
      generatedAt: Date.now()
    })
    return formatted
  }

  const anthropic = new Anthropic({ apiKey })

  const civDisplay = (civ: string) =>
    civ.charAt(0).toUpperCase() + civ.slice(1).toLowerCase()

  const prompt = `You are an Age of Empires IV expert coach. Give exactly 4 concise matchup tips for playing ${civDisplay(myCiv)} against ${civDisplay(opponentCiv)} in ${gameMode} mode.

Format: one bullet point per line starting with •, max 15 words each.
Be specific to this matchup: key unit counters, timing windows, economic priorities.
Do not give generic tips.`

  let fullText = ''

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullText += event.delta.text
        if (onChunk) onChunk(event.delta.text)
      }
    }

    store.set(`tipsCache.${key}` as any, {
      tips: fullText,
      myCiv,
      opponentCiv,
      gameMode,
      generatedAt: Date.now()
    })

    return fullText
  } catch {
    // API call failed — fall back to hardcoded
    const tips = getHardcodedTips(myCiv, opponentCiv)
    const formatted = tips.map((t) => `• ${t}`).join('\n')
    store.set(`tipsCache.${key}` as any, {
      tips: formatted,
      myCiv,
      opponentCiv,
      gameMode,
      generatedAt: Date.now()
    })
    return formatted
  }
}
