import type { ResearchQuery, Source } from 'shared'
import { v4 as uuidv4 } from 'uuid'

interface SearchResult {
  title: string
  url: string
  snippet: string
  source: 'web' | 'wikipedia' | 'news'
}

class SearchService {
  async search(query: ResearchQuery): Promise<Source[]> {
    const sources: Source[] = []
    const enabledSources = query.sources || ['web', 'wikipedia']

    // Run searches in parallel
    const searchPromises: Promise<SearchResult[]>[] = []

    if (enabledSources.includes('web')) {
      searchPromises.push(this.searchWeb(query.query))
    }
    if (enabledSources.includes('wikipedia')) {
      searchPromises.push(this.searchWikipedia(query.query))
    }
    if (enabledSources.includes('news')) {
      searchPromises.push(this.searchNews(query.query))
    }

    const results = await Promise.all(searchPromises)

    // Flatten and convert to Source format
    results.flat().forEach(result => {
      sources.push({
        id: uuidv4(),
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        source: result.source,
        retrievedAt: new Date()
      })
    })

    // Deduplicate by URL
    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    )

    return uniqueSources.slice(0, query.maxResults || 10)
  }

  private async searchWeb(query: string): Promise<SearchResult[]> {
    try {
      // Use DuckDuckGo HTML search (no API key required)
      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      )

      if (!response.ok) {
        console.error('Web search failed:', response.status)
        return []
      }

      const html = await response.text()
      return this.parseDDGResults(html, 'web')
    } catch (error) {
      console.error('Web search error:', error)
      return []
    }
  }

  private async searchWikipedia(query: string): Promise<SearchResult[]> {
    try {
      // Wikipedia API search
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
      )

      if (!response.ok) {
        console.error('Wikipedia search failed:', response.status)
        return []
      }

      const data = await response.json() as { query?: { search?: Array<{ title: string; snippet?: string }> } }

      return (data.query?.search || []).slice(0, 5).map((result) => ({
        title: result.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
        snippet: result.snippet?.replace(/<\/?span[^>]*>/g, '') || '',
        source: 'wikipedia' as const
      }))
    } catch (error) {
      console.error('Wikipedia search error:', error)
      return []
    }
  }

  private async searchNews(query: string): Promise<SearchResult[]> {
    try {
      // Note: News API requires an API key for full access
      // Using DuckDuckGo for news as fallback
      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' news')}&kl=us-en`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      )

      if (!response.ok) {
        console.error('News search failed:', response.status)
        return []
      }

      const html = await response.text()
      return this.parseDDGResults(html, 'news').slice(0, 3)
    } catch (error) {
      console.error('News search error:', error)
      return []
    }
  }

  private parseDDGResults(html: string, sourceType: 'web' | 'news'): SearchResult[] {
    const results: SearchResult[] = []

    // Simple regex-based parsing of DuckDuckGo HTML results
    const resultRegex = /<a[^>]*class="result__a"[^>]*>([^<]+)<\/a>[\s\S]*?<a[^>]*class="result__url"[^>]*>([^<]+)<\/a>/gi
    const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/a>/gi

    let match
    const titles: string[] = []
    const urls: string[] = []
    const snippets: string[] = []

    // Extract titles and URLs
    const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi
    while ((match = linkRegex.exec(html)) !== null) {
      urls.push(match[1])
      titles.push(match[2].trim())
    }

    // Extract snippets
    const snippetMatch = html.match(/<a[^>]*class="result__snippet"[^>]*>([^<]+)/gi)
    if (snippetMatch) {
      snippetMatch.forEach(s => {
        const cleaned = s.replace(/<[^>]+>/g, '').trim()
        if (cleaned) snippets.push(cleaned)
      })
    }

    // Combine into results
    const count = Math.min(titles.length, urls.length, 5)
    for (let i = 0; i < count; i++) {
      // Clean DDG redirect URLs
      let url = urls[i]
      const urlMatch = url.match(/uddg=([^&]+)/)
      if (urlMatch) {
        url = decodeURIComponent(urlMatch[1])
      }

      results.push({
        title: titles[i],
        url: url,
        snippet: snippets[i] || '',
        source: sourceType
      })
    }

    return results
  }
}

export const searchService = new SearchService()