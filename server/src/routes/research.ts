import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { enhancedSearchService } from '../services/enhancedSearchService'
import { enhancedContentService } from '../services/enhancedContentService'
import { aiService } from '../services/aiService'
import { reportService } from '../services/reportService'
import type { ResearchQuery, ResearchProgress, Source } from 'shared'

const router = Router()

// In-memory store for research progress
const researchStore = new Map<string, {
  progress: ResearchProgress
  report?: any
}>()

// POST /api/research - Start a new research
router.post('/', async (req, res): Promise<void> => {
  try {
    const query: ResearchQuery = req.body

    if (!query.query || query.query.trim().length === 0) {
      res.status(400).json({ error: 'Query is required' })
      return
    }

    const researchId = uuidv4()

    // Initialize progress
    researchStore.set(researchId, {
      progress: {
        stage: 'analyzing',
        message: 'Starting research...',
        progress: 0
      }
    })

    // Start research asynchronously
    runResearch(researchId, query).catch(err => {
      console.error('Research error:', err)
      const current = researchStore.get(researchId)
      if (current) {
        current.progress = {
          stage: 'error',
          message: 'An error occurred during research',
          progress: 100,
          error: err.message
        }
      }
    })

    res.json({ researchId })
  } catch (error) {
    res.status(500).json({ error: 'Failed to start research' })
  }
})

// GET /api/research/:id/progress - Get research progress
router.get('/:id/progress', (req, res): void => {
  const { id } = req.params
  const research = researchStore.get(id)

  if (!research) {
    res.status(404).json({ error: 'Research not found' })
    return
  }

  res.json(research.progress)
})

// GET /api/research/:id/report - Get research report
router.get('/:id/report', (req, res): void => {
  const { id } = req.params
  const research = researchStore.get(id)

  if (!research) {
    res.status(404).json({ error: 'Research not found' })
    return
  }

  if (!research.report) {
    res.status(404).json({ error: 'Report not ready' })
    return
  }

  res.json(research.report)
})

async function runResearch(researchId: string, query: ResearchQuery): Promise<void> {
  const startTime = Date.now()

  try {
    // Stage 1: Analyzing
    updateProgress(researchId, 'analyzing', 'Analyzing your research query...', 10)
    await delay(500)

    // Stage 2: Searching
    updateProgress(researchId, 'searching', 'Searching multiple sources...', 20)
    
    let sourcesFound = 0
    const sources = await enhancedSearchService.search(query, (provider, count) => {
      sourcesFound += count
      updateProgress(researchId, 'searching', `Found ${sourcesFound} sources from ${provider}...`, 25)
    })
    
    updateProgress(researchId, 'searching', `Found ${sources.length} unique sources`, 30, sources)

    // Stage 3: Extracting
    updateProgress(researchId, 'extracting', 'Extracting content from sources...', 40)
    
    let extractedCount = 0
    const contents = await enhancedContentService.extractContents(sources, (sourceId, success) => {
      if (success) extractedCount++
      updateProgress(researchId, 'extracting', `Extracted ${extractedCount}/${sources.length} sources...`, 40 + (extractedCount / sources.length) * 10, sources)
    })
    
    updateProgress(researchId, 'extracting', `Successfully extracted ${contents.length} sources`, 50, sources)

    // Stage 4: Synthesizing
    updateProgress(researchId, 'synthesizing', 'Synthesizing findings with AI...', 60)
    const synthesis = await aiService.synthesize(query.query, sources, contents)
    updateProgress(researchId, 'synthesizing', 'AI synthesis complete', 80, sources)

    // Stage 5: Generating
    updateProgress(researchId, 'generating', 'Generating structured report...', 90)
    const report = await reportService.generate(researchId, query.query, synthesis, sources)

    // Complete
    const processingTime = Date.now() - startTime
    report.metadata.processingTime = processingTime

    researchStore.set(researchId, {
      progress: {
        stage: 'complete',
        message: 'Research complete!',
        progress: 100,
        sources
      },
      report
    })

    console.log(`Research ${researchId} completed in ${processingTime}ms`)
  } catch (error) {
    console.error(`Research ${researchId} failed:`, error)
    updateProgress(researchId, 'error', 'An error occurred during research', 100, undefined, error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

function updateProgress(
  researchId: string,
  stage: ResearchProgress['stage'],
  message: string,
  progress: number,
  sources?: Source[],
  error?: string
): void {
  const current = researchStore.get(researchId)
  if (current) {
    current.progress = {
      stage,
      message,
      progress,
      ...(sources && { sources }),
      ...(error && { error })
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { router as researchRouter }