/**
 * Search Engine Bot Detection Whitelist
 *
 * This list contains patterns for legitimate SEO/search engine crawlers
 * that should receive HTML responses even when detected as bots.
 *
 * These patterns are separate from general bot detection (isbot) to allow
 * differential content serving: search engines get HTML (for SEO),
 * while AI/other bots get markdown (optimal for LLM consumption).
 */

export const searchEngineBotPatterns = [
  /googlebot/i, // Google
  /google-structured-data-testing-tool/i, // Google SDTT
  /bingbot/i, // Microsoft Bing
  /msnbot/i, // MSN
  /duckduckbot/i, // DuckDuckGo
  /baiduspider/i, // Baidu (Chinese search)
  /yandexbot/i, // Yandex (Russian search)
  /slurp/i, // Yahoo
  /applebot/i, // Apple Search
  /teoma/i, // Ask.com
  /gigabot/i, // Gigablast
  /inktomi/i, // Inktomi (historical)
  /livebot/i, // MSN LiveBot
  /lycos/i, // Lycos
  /scooter/i, // Scooter
  /altavista/i, // AltaVista
  /crawler/i, // Generic crawler (when combined with search context)
  /spider/i, // Generic spider (when combined with search context)
]

/**
 * Check if a user-agent represents a search engine bot
 * that should receive HTML content for proper SEO indexing.
 *
 * @param userAgent - The user-agent string from the request
 * @returns true if this is a search engine bot, false otherwise
 */
export function isSearchEngineBot(
  userAgent: string | null | undefined
): boolean {
  if (!userAgent) return false

  return searchEngineBotPatterns.some((pattern) => pattern.test(userAgent))
}

/**
 * List of AI/LLM bot user-agents for documentation purposes.
 * These are detected by isbot and will NOT match the search engine patterns above,
 * so they'll receive markdown via the LLM API.
 */
export const knownAIBots = [
  'ClaudeBot', // Anthropic Claude
  'anthropic-ai', // Anthropic
  'GPTBot', // OpenAI GPT Training
  'ChatGPT-User', // ChatGPT User interaction
  'PerplexityBot', // Perplexity AI
  'cohere-ai', // Cohere
  'YouBot', // You.com
  'meta-externalagent', // Meta AI
  'Bytespider', // Byteaddance (TikTok)
]
