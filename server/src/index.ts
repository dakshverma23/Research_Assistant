import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { researchRouter } from './routes/research'
import { config } from './services/config'

const app = express()
const PORT = config.port

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/research', researchRouter)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Intelligent Research Assistant API running on http://localhost:${PORT}`)
  console.log(`📡 OpenRouter AI Model: ${config.aiModel}`)
  console.log(`🔍 Ready to accept research queries`)
})