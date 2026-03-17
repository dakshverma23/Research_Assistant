import { useState, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import EnhancedQueryInput from './components/EnhancedQueryInput'
import ProgressIndicator from './components/ProgressIndicator'
import ReportView from './components/ReportView'
import { researchQuery } from './api/client'
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
      // Show progress updates
      setProgress({ stage: 'searching', message: 'Searching for sources...', progress: 25 })
      
      setTimeout(() => {
        setProgress({ stage: 'extracting', message: 'Extracting content...', progress: 50 })
      }, 1000)
      
      setTimeout(() => {
        setProgress({ stage: 'synthesizing', message: 'Generating AI analysis...', progress: 75 })
      }, 2000)

      // Start research - this now returns the complete result
      const result = await researchQuery(query)
      
      if (result.report) {
        // Research completed immediately
        setProgress({ stage: 'complete', message: 'Research completed!', progress: 100 })
        setReport(result.report)
        setIsResearching(false)
        toast.success('Research complete! 🎉')
      } else {
        // Fallback to polling if no immediate result
        const researchId = result.researchId
        
        const pollInterval = setInterval(async () => {
          try {
            const response = await fetch(`/api/research/${researchId}/report`)
            if (response.ok) {
              const reportData = await response.json()
              setReport(reportData)
              setProgress({ stage: 'complete', message: 'Research completed!', progress: 100 })
              setIsResearching(false)
              toast.success('Research complete! 🎉')
              clearInterval(pollInterval)
            }
          } catch (err) {
            console.error('Polling error:', err)
          }
        }, 1000)
        
        // Stop polling after 30 seconds
        setTimeout(() => {
          clearInterval(pollInterval)
          if (isResearching) {
            setError('Research took too long. Please try again.')
            setIsResearching(false)
            toast.error('Research timeout. Please try again.')
          }
        }, 30000)
      }

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
                Intelligent Research Assistant
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