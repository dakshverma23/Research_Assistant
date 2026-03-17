import type { VercelRequest, VercelResponse } from '@vercel/node'

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
    
    // Return mock report for demo
    const report = {
      id: id as string,
      query: 'Demo Research Query',
      createdAt: new Date().toISOString(),
      executiveSummary: 'This is a demo research report showing the structure and functionality of the Intelligent Research Assistant.',
      keyFindings: [
        {
          title: 'Demo Finding 1',
          description: 'This is a sample finding to demonstrate the collapsible functionality.',
          evidence: 'Sample evidence text',
          sourceIds: ['1']
        },
        {
          title: 'Demo Finding 2', 
          description: 'Another sample finding with interactive features.',
          evidence: 'More sample evidence',
          sourceIds: ['1']
        }
      ],
      detailedSections: [
        {
          title: 'Introduction',
          content: 'This is a demo section showing how the research report is structured with collapsible sections and interactive elements.'
        },
        {
          title: 'Analysis',
          content: 'This section demonstrates the detailed analysis capabilities of the research assistant.'
        }
      ],
      sources: [
        {
          id: '1',
          title: 'Demo Source',
          url: 'https://example.com',
          source: 'web'
        }
      ],
      metadata: {
        processingTime: 5000,
        modelUsed: 'Demo Mode'
      }
    }
    
    res.status(200).json(report)
    
  } catch (error) {
    console.error('Report API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}