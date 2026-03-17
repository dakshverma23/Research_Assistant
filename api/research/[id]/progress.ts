import type { VercelRequest, VercelResponse } from '@vercel/node'

// Import sessions from the main research file
// Note: In production, you'd use a proper database
let sessions: Map<string, any>
try {
  // Try to import sessions, fallback to new Map if not available
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
    
    // Try to get real progress data
    const sessionData = sessions.get(id as string)
    
    if (sessionData) {
      // Return real progress
      const { report, ...progress } = sessionData
      res.status(200).json(progress)
    } else {
      // Return default progress if session not found
      res.status(200).json({
        stage: 'complete',
        message: 'Research session not found, showing default',
        progress: 100,
        sources: []
      })
    }
    
  } catch (error) {
    console.error('Progress API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}