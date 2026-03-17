import type { ResearchQuery, ResearchProgress } from 'shared'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function researchQuery(query: ResearchQuery): Promise<string> {
  const response = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to start research')
  }

  const data = await response.json()
  return data.researchId
}

export async function getResearchProgress(researchId: string): Promise<ResearchProgress> {
  const response = await fetch(`${API_BASE}/research/${researchId}/progress`)

  if (!response.ok) {
    throw new Error('Failed to get research progress')
  }

  return response.json()
}

export async function getResearchReport(researchId: string): Promise<Response> {
  return fetch(`${API_BASE}/research/${researchId}/report`)
}