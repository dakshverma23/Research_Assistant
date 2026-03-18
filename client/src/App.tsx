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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
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
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 0l-.707.707m0 0l-.707-.707m0 0l.707.707m12.728 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707M4 12H3m15.364 6.364l.707.707M21 12h-1m-6 9v-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                ResearchAI
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                AI-powered research that synthesizes information from multiple sources
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={handleReset}
                className="ml-auto text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Query Input */}
        {!isResearching && !report && (
          <EnhancedQueryInput onSubmit={handleResearch} />
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
      <footer className="mt-auto py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>Powered by OpenRouter AI • Multi-source Research Synthesis</p>
      </footer>
    </div>
  )
}

export default App