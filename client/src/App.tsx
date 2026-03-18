import { useState, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import EnhancedQueryInput from './components/EnhancedQueryInput'
import ProgressIndicator from './components/ProgressIndicator'
import ReportView from './components/ReportView'
import { researchQuery, getResearchProgress } from './api/client'
import type { ResearchQuery, ResearchProgress, ResearchReport } from 'shared'

function App() {
  const [isResearching, setIsResearching] = useState(false)
  const [progress, setProgress] = useState<ResearchProgress | null>(null)
  const [report, setReport] = useState<ResearchReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResearch = useCallback(async (query: ResearchQuery) => {
    setIsResearching(true)
    setProgress({ stage: 'analyzing', message: 'Starting research...', progress: 0 })
    setReport(null)
    setError(null)

    toast.success('Research started! 🚀')

    try {
      // Start research
      const researchId = await researchQuery(query)

      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const currentProgress = await getResearchProgress(researchId)
          setProgress(currentProgress)

          // Show toast notifications for major milestones
          if (currentProgress.stage === 'searching' && currentProgress.sources && currentProgress.sources.length > 0) {
            toast.success(`Found ${currentProgress.sources.length} sources! 📚`, { id: 'sources-found' })
          }

          if (currentProgress.stage === 'complete' || currentProgress.stage === 'error') {
            clearInterval(pollInterval)
            setIsResearching(false)

            if (currentProgress.stage === 'complete') {
              // Fetch the report
              const response = await fetch(`/api/research/${researchId}/report`)
              if (response.ok) {
                const reportData = await response.json()
                setReport(reportData)
                toast.success('Research complete! 🎉')
              }
            } else if (currentProgress.stage === 'error') {
              setError(currentProgress.error || 'An error occurred during research')
              toast.error('Research failed. Please try again.')
            }
          }
        } catch (err) {
          clearInterval(pollInterval)
          setError('Failed to get research progress')
          setIsResearching(false)
          toast.error('Connection error. Please check your server.')
        }
      }, 500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start research')
      setIsResearching(false)
      toast.error('Failed to start research')
    }
  }, [])

  const handleReset = useCallback(() => {
    setIsResearching(false)
    setProgress(null)
    setReport(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ResearchAI
                </h1>
                <p className="text-sm text-slate-600">
                  AI-powered research synthesis
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Research Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="flex-shrink-0 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Query Input */}
        {!isResearching && !report && (
          <div className="mb-8">
            <EnhancedQueryInput onSubmit={handleResearch} />
          </div>
        )}

        {/* Progress Indicator */}
        {isResearching && progress && (
          <ProgressIndicator progress={progress} />
        )}

        {/* Report View */}
        {report && !isResearching && (
          <ReportView report={report} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-indigo-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Powered by <span className="font-semibold text-indigo-600">OpenRouter AI</span> • Multi-source Research Synthesis
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App