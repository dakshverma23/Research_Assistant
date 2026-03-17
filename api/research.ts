import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory storage for demo
const sessions = new Map<string, any>()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'POST') {
      // Start new research
      const researchId = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store initial progress
      sessions.set(researchId, {
        stage: 'analyzing',
        message: 'Starting research...',
        progress: 0
      })
      
      // Simulate research process
      setTimeout(() => {
        sessions.set(researchId, {
          stage: 'complete',
          message: 'Research completed successfully',
          progress: 100,
          sources: [
            {
              id: '1',
              title: 'Sample Research Result',
              url: 'https://example.com',
              source: 'web'
            }
          ]
        })
      }, 2000)
      
      res.status(200).json({ researchId })
      
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
    
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}