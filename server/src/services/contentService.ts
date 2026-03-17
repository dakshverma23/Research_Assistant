import type { Source } from 'shared'

interface ExtractedContent {
  sourceId: string
  title: string
  content: string
  url: string
}

class ContentService {
  async extractContents(sources: Source[]): Promise<ExtractedContent[]> {
    const contents = await Promise.all(
      sources.slice(0, 5).map(source => this.extractContent(source))
    )

    return contents.filter(c => c.content.length > 0)
  }

  private async extractContent(source: Source): Promise<ExtractedContent> {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        console.error(`Failed to fetch ${source.url}:`, response.status)
        return {
          sourceId: source.id,
          title: source.title,
          content: source.snippet,
          url: source.url
        }
      }

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('text/html')) {
        const html = await response.text()
        const content = this.extractTextFromHTML(html)
        return {
          sourceId: source.id,
          title: source.title,
          content: content.slice(0, 5000), // Limit content length
          url: source.url
        }
      } else if (contentType.includes('application/json')) {
        // Handle JSON responses (like Wikipedia API)
        const data = await response.json()
        const text = typeof data === 'object' ? JSON.stringify(data) : String(data)
        return {
          sourceId: source.id,
          title: source.title,
          content: text.slice(0, 5000),
          url: source.url
        }
      }

      // Fallback to snippet
      return {
        sourceId: source.id,
        title: source.title,
        content: source.snippet,
        url: source.url
      }
    } catch (error) {
      console.error(`Error extracting content from ${source.url}:`, error)
      // Return snippet as fallback
      return {
        sourceId: source.id,
        title: source.title,
        content: source.snippet,
        url: source.url
      }
    }
  }

  private extractTextFromHTML(html: string): string {
    // Remove script and style elements
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Extract text from common content containers
    const contentSelectors = [
      /<article[^>]*>([\s\S]*?)<\/article>/gi,
      /<main[^>]*>([\s\S]*?)<\/main>/gi,
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      /<p[^>]*>([\s\S]*?)<\/p>/gi
    ]

    let extractedText = ''

    for (const selector of contentSelectors) {
      const matches = text.match(selector)
      if (matches) {
        extractedText += matches.join(' ')
      }
    }

    // If no content found, extract all paragraph text
    if (!extractedText || extractedText.length < 100) {
      const paragraphMatches = text.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []
      extractedText = paragraphMatches.join(' ')
    }

    // Clean up HTML tags
    extractedText = extractedText
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()

    // Limit to reasonable length
    if (extractedText.length > 5000) {
      extractedText = extractedText.slice(0, 5000) + '...'
    }

    return extractedText
  }
}

export const contentService = new ContentService()