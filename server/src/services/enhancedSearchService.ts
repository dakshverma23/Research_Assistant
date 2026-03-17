import type { ResearchQuery, Source } from 'shared'
import { v4 as uuidv4 } from 'uuid'

interface SearchResult {
  title: string
  url: string
  snippet: string
  source: 'web' | 'wikipedia' | 'news' | 'academic'
  publishedDate?: string
  author?: string
}

interface SearchProvider {
  name: string
  search: (query: string, limit: number) => Promise<SearchResult[]>
  enabled: boolean
}

class EnhancedSearchService {
  private providers: SearchProvider[] = []

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Google Custom Search
    if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
      this.providers.push({
        name: 'Google',
        search: this.searchGoogle.bind(this),
        enabled: true
      })
    }

    // Bing Search
    if (process.env.BING_SEARCH_API_KEY) {
      this.providers.push({
        name: 'Bing',
        search: this.searchBing.bind(this),
        enabled: true
      })
    }

    // Brave Search
    if (process.env.BRAVE_SEARCH_API_KEY) {
      this.providers.push({
        name: 'Brave',
        search: this.searchBrave.bind(this),
        enabled: true
      })
    }

    // Always include Wikipedia
    this.providers.push({
      name: 'Wikipedia',
      search: this.searchWikipedia.bind(this),
      enabled: true
    })

    // DuckDuckGo as fallback
    this.providers.push({
      name: 'DuckDuckGo',
      search: this.searchDuckDuckGo.bind(this),
      enabled: this.providers.length === 1 // Only enable if no other providers
    })

    console.log(`📡 Initialized search providers: ${this.providers.filter(p => p.enabled).map(p => p.name).join(', ')}`)
  }

  async search(query: ResearchQuery, onProgress?: (provider: string, count: number) => void): Promise<Source[]> {
    const sources: Source[] = []
    const enabledSources = query.sources || ['web', 'wikipedia']
    const maxResults = query.maxResults || 15

    // Search with all enabled providers in parallel
    const searchPromises = this.providers
      .filter(p => p.enabled)
      .map(async provider => {
        try {
          const results = await provider.search(query.query, Math.ceil(maxResults / this.providers.length))
          if (onProgress) {
            onProgress(provider.name, results.length)
          }
          return results
        } catch (error) {
          console.error(`${provider.name} search failed:`, error)
          return []
        }
      })

    const allResults = await Promise.all(searchPromises)
    const flatResults = allResults.flat()

    // Convert to Source format
    flatResults.forEach(result => {
      // Filter by enabled source types
      if (enabledSources.includes(result.source)) {
        sources.push({
          id: uuidv4(),
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          source: result.source,
          retrievedAt: new Date()
        })
      }
    })

    // Deduplicate by URL and title similarity
    const uniqueSources = this.deduplicateSources(sources)

    // Sort by relevance (prioritize longer snippets and recent dates)
    const sortedSources = uniqueSources.sort((a, b) => {
      const scoreA = a.snippet.length
      const scoreB = b.snippet.length
      return scoreB - scoreA
    })

    return sortedSources.slice(0, maxResults)
  }

  private deduplicateSources(sources: Source[]): Source[] {
    const seen = new Set<string>()
    const unique: Source[] = []

    for (const source of sources) {
      // Normalize URL for comparison
      const normalizedUrl = source.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      
      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl)
        unique.push(source)
      }
    }

    return unique
  }

  // Google Custom Search API
  private async searchGoogle(query: string, limit: number): Promise<SearchResult[]> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cx = process.env.GOOGLE_SEARCH_CX

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=${Math.min(limit, 10)}`
    )

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`)
    }

    const data = await response.json() as any

    return (data.items || []).map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet || '',
      source: 'web' as const,
      publishedDate: item.pagemap?.metatags?.[0]?.['article:published_time']
    }))
  }

  // Bing Search API
  private async searchBing(query: string, limit: number): Promise<SearchResult[]> {
    const apiKey = process.env.BING_SEARCH_API_KEY

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${Math.min(limit, 50)}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey!
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Bing Search API error: ${response.status}`)
    }

    const data = await response.json() as any

    return (data.webPages?.value || []).map((item: any) => ({
      title: item.name,
      url: item.url,
      snippet: item.snippet || '',
      source: 'web' as const,
      publishedDate: item.dateLastCrawled
    }))
  }

  // Brave Search API
  private async searchBrave(query: string, limit: number): Promise<SearchResult[]> {
    const apiKey = process.env.BRAVE_SEARCH_API_KEY

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${Math.min(limit, 20)}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey!
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`)
    }

    const data = await response.json() as any

    return (data.web?.results || []).map((item: any) => ({
      title: item.title,
      url: item.url,
      snippet: item.description || '',
      source: 'web' as const,
      publishedDate: item.age
    }))
  }

  // Wikipedia API
  private async searchWikipedia(query: string, limit: number): Promise<SearchResult[]> {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=${Math.min(limit, 10)}`
    )

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`)
    }

    const data = await response.json() as any

    return (data.query?.search || []).map((result: any) => ({
      title: result.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
      snippet: result.snippet?.replace(/<\/?span[^>]*>/g, '') || '',
      source: 'wikipedia' as const
    }))
  }

  // DuckDuckGo fallback
  private async searchDuckDuckGo(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      )

      if (!response.ok) {
        return []
      }

      const html = await response.text()
      return this.parseDDGResults(html, limit)
    } catch (error) {
      console.error('DuckDuckGo search error:', error)
      return []
    }
  }

  private parseDDGResults(html: string, limit: number): SearchResult[] {
    const results: SearchResult[] = []
    const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi
    const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([^<]+)/gi

    let match
    const urls: string[] = []
    const titles: string[] = []

    while ((match = linkRegex.exec(html)) !== null && urls.length < limit) {
      let url = match[1]
      const urlMatch = url.match(/uddg=([^&]+)/)
      if (urlMatch) {
        url = decodeURIComponent(urlMatch[1])
      }
      urls.push(url)
      titles.push(match[2].trim())
    }

    const snippets: string[] = []
    while ((match = snippetRegex.exec(html)) !== null && snippets.length < limit) {
      snippets.push(match[1].trim())
    }

    for (let i = 0; i < Math.min(urls.length, titles.length, limit); i++) {
      results.push({
        title: titles[i],
        url: urls[i],
        snippet: snippets[i] || '',
        source: 'web'
      })
    }

    return results
  }
}

export const enhancedSearchService = new EnhancedSearchService()
