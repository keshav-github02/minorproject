"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileJson, FileText, ArrowLeft, CheckCircle2, AlertCircle, Plus, Trash2 } from "lucide-react"

export default function SoftwareResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!id) {
          setError("No comparison ID provided")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/results/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.status}`)
        }

        const data = await response.json()
        setResults(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching results:", error)
        setError(error instanceof Error ? error.message : "Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchResults()
    }
  }, [id])

  const downloadMarkdown = () => {
    if (!results) return

    const stats = results.statistics
    const markdown = `# Version Comparison Report

## Summary
- **Total Files:** ${stats.total_files}
- **Unchanged:** ${stats.unchanged_files_count} (${(stats.unchanged_percentage || 0).toFixed(1)}%)
- **Modified:** ${stats.modified_files_count} (${(stats.modified_percentage || 0).toFixed(1)}%)
- **Added:** ${stats.added_files_count} (${(stats.added_percentage || 0).toFixed(1)}%)
- **Deleted:** ${stats.deleted_files_count} (${(stats.deleted_percentage || 0).toFixed(1)}%)
- **Average Similarity:** ${(stats.average_similarity || 0).toFixed(1)}%

## Testing Recommendations
- Skip testing ${(stats.unchanged_percentage || 0).toFixed(1)}% of unchanged code
- Focus on ${(stats.modified_percentage || 0).toFixed(1)}% of modified code
`

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comparison-report.md"
    a.click()
  }

  const downloadJSON = () => {
    if (!results) return

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comparison-report.json"
    a.click()
  }

  const downloadCSV = () => {
    if (!results) return

    let csv = "Filename,Status,Similarity %,Lines Added,Lines Deleted\n"

    results.unchanged_files?.forEach((file: string) => {
      csv += `"${file}",Unchanged,100,0,0\n`
    })

    results.modified_files?.forEach((file: string) => {
      const details = results.detailed_changes[file] || {}
      csv += `"${file}",Modified,${(details.similarity || 0).toFixed(1)},${details.added_lines || 0},${details.deleted_lines || 0}\n`
    })

    results.added_files?.forEach((file: string) => {
      csv += `"${file}",Added,,\n`
    })

    results.deleted_files?.forEach((file: string) => {
      csv += `"${file}",Deleted,,\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comparison-report.csv"
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-cyan-400" />
          </div>
          <p className="text-white text-lg">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !results || !results.statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-red-500/50 p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error || "Failed to load analysis results"}</p>
          <Button onClick={() => router.push("/")}>Go Back Home</Button>
        </Card>
      </div>
    )
  }

  const stats = results.statistics

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-white text-center">Comparison Results</h1>
          <p className="mt-3 text-slate-400 text-center">
            Detailed analysis of version differences and testing recommendations
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-700 p-8 hover:border-blue-500/30 transition-colors">
            <div className="text-sm font-medium text-slate-400 mb-3">Total Files</div>
            <div className="text-4xl font-bold text-white mb-2">{stats.total_files || 0}</div>
            <div className="text-xs text-slate-500">Files analyzed</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50 p-8 hover:border-green-500/30 transition-colors">
            <div className="text-sm font-medium text-green-400 mb-3">Unchanged</div>
            <div className="text-4xl font-bold text-green-300 mb-2">
              {(stats.unchanged_percentage || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-green-400/60">{stats.unchanged_files_count || 0} files</div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700/50 p-8 hover:border-yellow-500/30 transition-colors">
            <div className="text-sm font-medium text-yellow-400 mb-3">Modified</div>
            <div className="text-4xl font-bold text-yellow-300 mb-2">
              {(stats.modified_percentage || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-yellow-400/60">{stats.modified_files_count} files</div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50 p-8 hover:border-blue-500/30 transition-colors">
            <div className="text-sm font-medium text-blue-400 mb-3">Avg Similarity</div>
            <div className="text-4xl font-bold text-blue-300 mb-2">{(stats.average_similarity || 0).toFixed(1)}%</div>
            <div className="text-xs text-blue-400/60">Code similarity</div>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <Card className="bg-slate-800/50 border-slate-700 p-10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-10">File Status Breakdown</h2>

          <div className="space-y-8">
            {/* Unchanged Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300 font-semibold">Unchanged Files (Skip Testing)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-bold text-lg">
                    {(stats.unchanged_percentage || 0).toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-sm">{stats.unchanged_files_count} files</span>
                </div>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${stats.unchanged_percentage || 0}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">These files haven't changed and don't need re-testing</p>
            </div>

            {/* Modified Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-slate-300 font-semibold">Modified Files (Focus Testing)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-lg">
                    {(stats.modified_percentage || 0).toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-sm">{stats.modified_files_count} files</span>
                </div>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500"
                  style={{ width: `${stats.modified_percentage || 0}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Focus your testing efforts on these modified files</p>
            </div>

            {/* Added Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300 font-semibold">Added Files (New Tests)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-bold text-lg">{(stats.added_percentage || 0).toFixed(1)}%</span>
                  <span className="text-slate-500 text-sm">{stats.added_files_count} files</span>
                </div>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${stats.added_percentage || 0}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Create new test cases for these added files</p>
            </div>

            {/* Deleted Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-red-400" />
                  <span className="text-slate-300 font-semibold">Deleted Files (Remove Tests)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red-400 font-bold text-lg">{(stats.deleted_percentage || 0).toFixed(1)}%</span>
                  <span className="text-slate-500 text-sm">{stats.deleted_files_count} files</span>
                </div>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                  style={{ width: `${stats.deleted_percentage || 0}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Remove test cases for these deleted files</p>
            </div>
          </div>
        </Card>

        {/* Testing Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-700/50 p-8 hover:border-green-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-400 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-400 mb-3">Testing Optimization</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Skip re-testing {(stats.unchanged_percentage || 0).toFixed(1)}% of unchanged code. This saves
                  approximately{" "}
                  <span className="text-green-300 font-semibold">{(stats.unchanged_percentage || 0).toFixed(1)}%</span>{" "}
                  of your testing time.
                </p>
                <p className="text-xs text-slate-500">
                  {stats.unchanged_files_count} unchanged files are safe to skip in regression testing.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border-yellow-700/50 p-8 hover:border-yellow-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-400 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Priority Testing</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Focus {(stats.modified_percentage || 0).toFixed(1)}% of your testing resources on modified code.
                  Allocate testers to thoroughly test these{" "}
                  <span className="text-yellow-300 font-semibold">{stats.modified_files_count} files</span>.
                </p>
                <p className="text-xs text-slate-500">These files require comprehensive regression testing.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modified Files List */}
        {results.modified_files && results.modified_files.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-10 mb-12">
            <h2 className="text-2xl font-bold text-white mb-8">Modified Files Details</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
              {results.modified_files.map((file: string, idx: number) => {
                const changes = results.detailed_changes?.[file] || {}
                const similarity = changes.similarity || 0

                return (
                  <div
                    key={idx}
                    className="bg-slate-700/30 p-5 rounded-lg border border-slate-600 hover:border-slate-500 transition-all hover:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-blue-300 truncate mb-2">{file}</div>
                        <div className="flex gap-4 flex-wrap text-xs text-slate-400">
                          <span>
                            Similarity:{" "}
                            <span
                              className={`font-semibold ${similarity >= 90 ? "text-green-400" : similarity >= 70 ? "text-yellow-400" : "text-red-400"}`}
                            >
                              {similarity.toFixed(1)}%
                            </span>
                          </span>
                          <span>
                            <span className="text-green-400">+{changes.added_lines || 0}</span> lines
                          </span>
                          <span>
                            <span className="text-red-400">-{changes.deleted_lines || 0}</span> lines
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-20 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              similarity >= 90 ? "bg-green-500" : similarity >= 70 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${similarity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Download Reports */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700/50 p-10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Export Results</h2>
          <p className="text-slate-400 mb-8">
            Download your analysis results in multiple formats for sharing and documentation
          </p>

          <div className="flex flex-wrap gap-4">
            <Button onClick={downloadMarkdown} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              <FileText className="h-4 w-4 mr-2" />
              Download Markdown
            </Button>
            <Button onClick={downloadJSON} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3">
              <FileJson className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={downloadCSV} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="mt-12 flex gap-4 justify-center pb-8">
          <Button
            onClick={() => router.push("/compare/software")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3"
          >
            New Comparison
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3"
          >
            Home
          </Button>
        </div>
      </main>
    </div>
  )
}
