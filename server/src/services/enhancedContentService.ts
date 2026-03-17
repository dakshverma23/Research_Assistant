import type { Source } from 'shared'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import * as cheerio from 'cheerio'

interface ExtractedContent {
  sourceId: string
  title: string
  content: string
  url: string
  author?: string
  publishedDate?: string
  excerpt?: string
  wordCount?: number
  readingTime?: number
}

class EnhancedContentService {
  async extractContents(
    sources: Source[],
    onProgress?: (sourceId: string, success: boolean) => void
  ): Promise<ExtractedContent[]> {
    const contents = await Promise.all(
      sources.slice(0, 8).map(async source => {
        const content = await this.extractContent(source)
        if (onProgress) {
          onProgress(source.id, content.content.length > 100)
        }
        return content
      })
    )

    return contents.filter(c => c.content.length > 100)
  }

  private async extractContent(source: Source): Promise<ExtractedContent> {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      })

      if (!response.ok) {
        console.error(`Failed to fetch ${source.url}:`, response.status)
        return this.createFallbackContent(source)
      }

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('text/html')) {
        const html = await response.text()
        return await this.extractFromHTML(source, html)
      } else if (contentType.includes('application/json')) {
        const data = await response.json()
        return this.extractFromJSON(source, data)
      }

      return this.createFallbackContent(source)
    } catch (error) {
      console.error(`Error extracting content from ${source.url}:`, error)
      return this.createFallbackContent(source)
    }
  }

  private async extractFromHTML(source: Source, html: string): Promise<ExtractedContent> {
    try {
      // Try Mozilla Readability first (best for articles)
      const dom = new JSDOM(html, { url: source.url })
      const reader = new Readability(dom.window.document)
      const article = reader.parse()

      if (article && article.textContent && article.textContent.length > 200) {
        const wordCount = article.textContent.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words/min

        return {
          sourceId: source.id,
          title: article.title || source.title,
          content: article.textContent.slice(0, 8000),
          url: source.url,
          author: article.byline || undefined,
          excerpt: article.excerpt || source.snippet,
          wordCount,
          readingTime
        }
      }

      // Fallback to Cheerio extraction
      return this.extractWithCheerio(source, html)
    } catch (error) {
      console.error('Readability extraction failed:', error)
      return this.extractWithCheerio(source, html)
    }
  }

  private extractWithCheerio(source: Source, html: string): ExtractedContent {
    const $ = cheerio.load(html)

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, iframe, noscript').remove()

    // Try to find main content
    let content = ''
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      '#content'
    ]

    for (const selector of contentSelectors) {
      const element = $(selector).first()
      if (element.length) {
        content = element.text()
        if (content.length > 200) break
      }
    }

    // If no content found, extract all paragraphs
    if (!content || content.length < 200) {
      content = $('p').map((_, el) => $(el).text()).get().join('\n\n')
    }

    // Clean up whitespace
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim()

    // Extract metadata
    const author = $('meta[name="author"]').attr('content') || 
                   $('meta[property="article:author"]').attr('content') ||
                   $('.author').first().text().trim()

    const publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                          $('time').first().attr('datetime')

    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return {
      sourceId: source.id,
      title: $('title').text() || source.title,
      content: content.slice(0, 8000),
      url: source.url,
      author: author || undefined,
      publishedDate: publishedDate || undefined,
      excerpt: content.slice(0, 200) + '...',
      wordCount,
      readingTime
    }
  }

  private extractFromJSON(source: Source, data: any): ExtractedContent {
    const text = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
    const wordCount = text.split(/\s+/).length

    return {
      sourceId: source.id,
      title: source.title,
      content: text.slice(0, 8000),
      url: source.url,
      wordCount,
      readingTime: Math.ceil(wordCount / 200)
    }
  }

  private createFallbackContent(source: Source): ExtractedContent {
    return {
      sourceId: source.id,
      title: source.title,
      content: source.snippet,
      url: source.url,
      excerpt: source.snippet,
      wordCount: source.snippet.split(/\s+/).length,
      readingTime: 1
    }
  }

  // Extract key information from content
  extractKeyInfo(content: string): {
    keywords: string[]
    entities: string[]
    summary: string
  } {
    // Simple keyword extraction (can be enhanced with NLP)
    const words = content.toLowerCase().split(/\W+/)
    const wordFreq = new Map<string, number>()

    // Count word frequency (excluding common words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their'])

    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
      }
    })

    // Get top keywords
    const keywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)

    // Extract potential entities (capitalized words)
    const entityRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
    const entities = Array.from(new Set(content.match(entityRegex) || []))
      .slice(0, 10)

    // Create simple summary (first few sentences)
    const sentences = content.match(/[^.!?]+[.!?]+/g) || []
    const summary = sentences.slice(0, 3).join(' ').slice(0, 300) + '...'

    return { keywords, entities, summary }
  }
}

export const enhancedContentService = new EnhancedContentService()
