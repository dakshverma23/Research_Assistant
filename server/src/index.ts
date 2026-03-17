import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { researchRouter } from './routes/research'
import { config } from './services/config'

const app = express()
const PORT = config.port

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from client build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')))
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/research', researchRouter)

// Serve React app for all other routes (for production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  })
}

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Intelligent Research Assistant running on port ${PORT}`)
  console.log(`📡 OpenRouter AI Model: ${config.aiModel}`)
  console.log(`🔍 Ready to accept research queries`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})