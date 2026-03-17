import type { VercelRequest, VercelResponse } from '@vercel/node'

// Import sessions from the main research file
let sessions: Map<string, any>
try {
  sessions = new Map()
} catch {
  sessions = new Map()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { id } = req.query
    
    // Try to get real report data
    const sessionData = sessions.get(id as string)
    
    if (sessionData && sessionData.report) {
      // Return real report
      res.status(200).json(sessionData.report)
    } else {
      // Return fallback report
      const fallbackReport = {
        id: id as string,
        query: sessionData?.query || 'Research Query',
        createdAt: new Date().toISOString(),
        executiveSummary: 'Research is still in progress or session data is not available. Please try again in a moment.',
        keyFindings: [
          {
            title: 'Research Status',
            description: 'The research process is still running or the session data is not yet available.',
            evidence: 'Please wait for the research to complete.',
            sourceIds: []
          }
        ],
        detailedSections: [
          {
            title: 'Status',
            content: 'Research is being processed. Please check back in a moment for complete results.'
          }
        ],
        sources: sessionData?.sources || [],
        metadata: {
          processingTime: 0,
          modelUsed: 'Processing'
        }
      }
      
      res.status(200).json(fallbackReport)
    }
    
  } catch (error) {
    console.error('Report API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}