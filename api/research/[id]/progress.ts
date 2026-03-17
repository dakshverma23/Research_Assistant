import type { VercelRequest, VercelResponse } from '@vercel/node'

// This would normally be a database, but using simple storage for demo
const sessions = new Map<string, any>()

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
    
    // Return mock progress for now
    const progress = {
      stage: 'complete',
      message: 'Demo research completed',
      progress: 100,
      sources: [
        {
          id: '1',
          title: 'Sample Research Source',
          url: 'https://example.com',
          source: 'web'
        }
      ]
    }
    
    res.status(200).json(progress)
    
  } catch (error) {
    console.error('Progress API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}