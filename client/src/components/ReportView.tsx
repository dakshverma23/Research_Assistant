import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import type { ResearchReport } from 'shared'

interface ReportViewProps {
  report: ResearchReport
  onReset: () => void
}

export default function ReportView({ report, onReset }: ReportViewProps) {
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])) // First section expanded by default

  const toggleFinding = (index: number) => {
    const newExpanded = new Set(expandedFindings)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedFindings(newExpanded)
  }

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Research Report
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generated in {Math.round(report.metadata.processingTime / 1000)}s using {report.metadata.modelUsed}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const markdown = generateMarkdown(report)
              const blob = new Blob([markdown], { type: 'text/markdown' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `research-${report.id}.md`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Research
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {report.executiveSummary}
        </p>
      </div>

      {/* Key Findings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 0l-.707.707m0 0l-.707-.707m0 0l.707.707m12.728 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707M4 12H3m15.364 6.364l.707.707M21 12h-1m-6 9v-1" />
          </svg>
          Key Findings
          <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
            Click to expand
          </span>
        </h3>
        <div className="space-y-3">
          {report.keyFindings.map((finding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600"
            >
              <button
                onClick={() => toggleFinding(index)}
                className="w-full p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {finding.title}
                      </h4>
                    </div>
                    {!expandedFindings.has(index) && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                        {finding.description}
                      </p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFindings.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-slate-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {expandedFindings.has(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-600">
                      {/* Description */}
                      <div className="mb-4">
                        <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Description
                        </h5>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {finding.description}
                        </p>
                      </div>

                      {/* Evidence */}
                      {finding.evidence && (
                        <div className="mb-4">
                          <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                            Evidence
                          </h5>
                          <div className="pl-4 border-l-2 border-accent-300 dark:border-accent-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                              "{finding.evidence}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Sources */}
                      {finding.sourceIds && finding.sourceIds.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                            Sources ({finding.sourceIds.length})
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {finding.sourceIds.map((sourceId) => {
                              const source = report.sources.find(s => s.id === sourceId)
                              return source ? (
                                <a
                                  key={sourceId}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-xs text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  {source.title.slice(0, 40)}...
                                </a>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}

                      {/* Expand/Collapse hint */}
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                          Click to collapse
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Expand/Collapse All */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setExpandedFindings(new Set(report.keyFindings.map((_, i) => i)))}
            className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedFindings(new Set())}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Detailed Sections */}
      {report.detailedSections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <button
            onClick={() => toggleSection(index)}
            className="w-full p-6 sm:p-8 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold">
                  {index + 1}
                </span>
                {section.title}
              </h3>
              <motion.div
                animate={{ rotate: expandedSections.has(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 text-slate-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {expandedSections.has(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700">
                  <div className="markdown-content prose prose-slate dark:prose-invert max-w-none mt-4">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="pl-4 border-l-2 border-primary-200 dark:border-primary-700">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                            {subsection.title}
                          </h4>
                          <div className="markdown-content prose prose-slate dark:prose-invert max-w-none text-sm">
                            <ReactMarkdown>{subsection.content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Sources */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Sources ({report.sources.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {report.sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  source.source === 'wikipedia'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    : source.source === 'news'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {source.source === 'wikipedia' ? (
                    <span className="text-xs font-bold">W</span>
                  ) : source.source === 'news' ? (
                    <span className="text-xs font-bold">N</span>
                  ) : (
                    <span className="text-xs font-bold">W</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                    {source.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {new URL(source.url).hostname}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function generateMarkdown(report: ResearchReport): string {
  let markdown = `# ${report.query}\n\n`
  markdown += `_Generated on ${new Date(report.createdAt).toLocaleString()}_\n\n`
  markdown += `---\n\n`

  markdown += `## Executive Summary\n\n${report.executiveSummary}\n\n`

  markdown += `## Key Findings\n\n`
  report.keyFindings.forEach(finding => {
    markdown += `### ${finding.title}\n\n${finding.description}\n\n`
    if (finding.evidence) {
      markdown += `> ${finding.evidence}\n\n`
    }
  })

  markdown += `## Detailed Analysis\n\n`
  report.detailedSections.forEach(section => {
    markdown += `### ${section.title}\n\n${section.content}\n\n`
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        markdown += `#### ${subsection.title}\n\n${subsection.content}\n\n`
      })
    }
  })

  markdown += `## Sources\n\n`
  report.sources.forEach(source => {
    markdown += `- [${source.title}](${source.url}) (${source.source})\n`
  })

  return markdown
}