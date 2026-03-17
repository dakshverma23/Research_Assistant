import { v4 as uuidv4 } from 'uuid'
import type { ResearchReport, Source, Finding, Section } from 'shared'

interface SynthesisResult {
  executiveSummary: string
  keyFindings: Array<{
    title: string
    description: string
    evidence: string
    sourceIds: string[]
  }>
  detailedSections: Array<{
    title: string
    content: string
    subsections?: Array<{
      title: string
      content: string
    }>
  }>
}

class ReportService {
  generate(
    researchId: string,
    query: string,
    synthesis: SynthesisResult,
    sources: Source[]
  ): ResearchReport {
    // Convert synthesis to report format
    const keyFindings: Finding[] = synthesis.keyFindings.map(finding => ({
      title: finding.title,
      description: finding.description,
      evidence: finding.evidence,
      sourceIds: finding.sourceIds
    }))

    const detailedSections: Section[] = synthesis.detailedSections.map(section => ({
      title: section.title,
      content: section.content,
      subsections: section.subsections?.map(sub => ({
        title: sub.title,
        content: sub.content
      }))
    }))

    const report: ResearchReport = {
      id: researchId,
      query,
      createdAt: new Date(),
      executiveSummary: synthesis.executiveSummary,
      keyFindings,
      detailedSections,
      sources,
      metadata: {
        totalSources: sources.length,
        processingTime: 0, // Will be updated by caller
        modelUsed: 'claude-sonnet-4'
      }
    }

    return report
  }
}

export const reportService = new ReportService()