import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import type { ResearchQuery, ResearchProgress, ResearchReport } from '../shared/src/index'

// In-memory storage for demo (in production, use a database)
const researchSessions = new Map<string, {
  query: ResearchQuery
  progress: ResearchProgress
  report?: ResearchReport
}>()

// Import server services
import { AIService } from '../server/src/services/aiService'
import { EnhancedSearchService } from '../server/src/services/enhancedSearchService'
import { EnhancedContentService } from '../server/src/services/enhancedContentService'
import { ReportService } from '../server/src/services/reportService'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { method, url } = req
  const urlPath = new URL(url!, `http://${req.headers.host}`).pathname

  try {
    if (method === 'POST' && urlPath === '/api/research') {
      // Start new research
      const query: ResearchQuery = req.body
      const researchId = uuidv4()
      
      // Initialize progress
      const progress: ResearchProgress = {
        stage: 'analyzing',
        message: 'Starting research...',
        progress: 0
      }
      
      researchSessions.set(researchId, { query, progress })
      
      // Start research in background (simplified for serverless)
      runResearch(researchId, query).catch(console.error)
      
      res.status(200).json({ researchId })
      
    } else if (method === 'GET' && urlPath.includes('/progress')) {
      // Get research progress
      const researchId = urlPath.split('/')[3]
      const session = researchSessions.get(researchId)
      
      if (!session) {
        res.status(404).json({ error: 'Research session not found' })
        return
      }
      
      res.status(200).json(session.progress)
      
    } else if (method === 'GET' && urlPath.includes('/report')) {
      // Get research report
      const researchId = urlPath.split('/')[3]
      const session = researchSessions.get(researchId)
      
      if (!session || !session.report) {
        res.status(404).json({ error: 'Report not found' })
        return
      }
      
      res.status(200).json(session.report)
      
    } else {
      res.status(404).json({ error: 'Not found' })
    }
    
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function runResearch(researchId: string, query: ResearchQuery) {
  const session = researchSessions.get(researchId)
  if (!session) return

  try {
    // Initialize services
    const searchService = new EnhancedSearchService()
    const contentService = new EnhancedContentService()
    const aiService = new AIService()
    const reportService = new ReportService(aiService)

    // Update progress: Searching
    session.progress = {
      stage: 'searching',
      message: 'Searching for sources...',
      progress: 20
    }

    // Search for sources
    const sources = await searchService.search(query.query, {
      maxResults: query.maxSources || 10,
      mode: query.mode || 'general'
    })

    session.progress = {
      stage: 'searching',
      message: `Found ${sources.length} sources`,
      progress: 40,
      sources
    }

    // Extract content
    session.progress = {
      stage: 'extracting',
      message: 'Extracting content from sources...',
      progress: 60,
      sources
    }

    const extractedSources = await Promise.all(
      sources.map(async (source) => {
        try {
          const content = await contentService.extractContent(source.url)
          return { ...source, content }
        } catch (error) {
          console.error(`Failed to extract content from ${source.url}:`, error)
          return { ...source, content: '' }
        }
      })
    )

    // Generate report
    session.progress = {
      stage: 'synthesizing',
      message: 'Generating research report...',
      progress: 80,
      sources: extractedSources
    }

    const report = await reportService.generateReport(query, extractedSources)
    
    // Complete
    session.report = report
    session.progress = {
      stage: 'complete',
      message: 'Research completed successfully',
      progress: 100,
      sources: extractedSources
    }

  } catch (error) {
    console.error('Research error:', error)
    session.progress = {
      stage: 'error',
      message: 'Research failed',
      progress: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}