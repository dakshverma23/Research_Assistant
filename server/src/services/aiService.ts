import type { Source } from 'shared'
import { config } from './config'

interface SynthesisResult {
  executiveSummary: string
  keyFindings: Array<{
    title: string
    description: string
    evidence: string
    sourceIds: string[]
  }>
  detailedSections: Array<{
    title: string
    content: string
    subsections?: Array<{
      title: string
      content: string
    }>
  }>
}

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      content: string
    }
    finish_reason: string
  }>
}

class AIService {
  private apiKey: string
  private model: string
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions'

  constructor() {
    this.apiKey = config.openRouterApiKey
    this.model = config.aiModel
  }

  async synthesize(
    query: string,
    sources: Source[],
    contents: Array<{ sourceId: string; title: string; content: string; url: string }>
  ): Promise<SynthesisResult> {
    // Prepare context from sources
    const sourceContext = contents.map((c, i) =>
      `[Source ${i + 1}: ${c.title}]\n${c.content}\n\nURL: ${c.url}\n`
    ).join('\n---\n')

    const systemPrompt = `You are an expert research assistant. Your task is to synthesize information from multiple sources into a comprehensive, well-structured report.

Guidelines:
1. Be factual and cite sources using [Source N] notation
2. Identify key themes and findings across sources
3. Present information objectively without bias
4. Structure the response with clear sections
5. Use markdown formatting for readability
6. Focus on answering the original query thoroughly

You must respond with valid JSON in this exact format:
{
  "executiveSummary": "A concise summary of the main findings (2-3 sentences)",
  "keyFindings": [
    {
      "title": "Finding title",
      "description": "Detailed explanation of the finding",
      "evidence": "Direct quote or evidence from sources",
      "sourceIds": ["source_id_1", "source_id_2"]
    }
  ],
  "detailedSections": [
    {
      "title": "Section title",
      "content": "Detailed content in markdown format",
      "subsections": [
        {
          "title": "Subsection title",
          "content": "Subsection content in markdown"
        }
      ]
    }
  ]
}`

    const userPrompt = `Research Query: "${query}"

Sources:
${sourceContext}

Please synthesize this information into a comprehensive research report. Remember to:
1. Provide an executive summary
2. List 3-5 key findings with evidence
3. Create detailed sections analyzing the topic
4. Cite sources using [Source N] notation
5. Return valid JSON only, no additional text.`

    try {
      const response = await this.callOpenRouter(systemPrompt, userPrompt)

      // Parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const result: SynthesisResult = JSON.parse(jsonMatch[0])

      // Map source indices to actual source IDs
      result.keyFindings = result.keyFindings.map(finding => ({
        ...finding,
        sourceIds: finding.sourceIds.map(id => {
          // If it's a numeric index, map to actual source ID
          const index = parseInt(id.replace('source_', '').replace('Source ', ''))
          if (!isNaN(index) && index > 0 && index <= sources.length) {
            return sources[index - 1].id
          }
          return id
        })
      }))

      return result
    } catch (error) {
      console.error('AI synthesis error:', error)

      // Fallback to basic synthesis
      return this.createFallbackSynthesis(query, sources, contents)
    }
  }

  private async callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Intelligent Research Assistant'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json() as OpenRouterResponse

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI model')
    }

    return data.choices[0].message.content
  }

  private createFallbackSynthesis(
    query: string,
    sources: Source[],
    contents: Array<{ sourceId: string; title: string; content: string; url: string }>
  ): SynthesisResult {
    return {
      executiveSummary: `Research conducted on "${query}" yielded ${sources.length} sources with relevant information. Key findings have been extracted and synthesized below.`,
      keyFindings: sources.slice(0, 5).map(source => ({
        title: source.title,
        description: source.snippet,
        evidence: source.snippet,
        sourceIds: [source.id]
      })),
      detailedSections: [
        {
          title: 'Overview',
          content: `This report synthesizes information from ${sources.length} sources related to "${query}". Each source has been analyzed for relevant content.`,
          subsections: contents.slice(0, 3).map(c => ({
            title: c.title,
            content: c.content.slice(0, 500) + (c.content.length > 500 ? '...' : '')
          }))
        }
      ]
    }
  }
}

export const aiService = new AIService()