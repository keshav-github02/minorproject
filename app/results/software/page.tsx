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
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

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

    const stats = results.statistics || {}
    const markdown = `# Version Comparison Report\n\n## Summary\n- **Total Files:** ${stats.total_files || 0}\n- **Unchanged:** ${stats.unchanged_files_count || 0} (${(stats.unchanged_percentage || 0).toFixed(1)}%)\n- **Modified:** ${stats.modified_files_count || 0} (${(stats.modified_percentage || 0).toFixed(1)}%)\n- **Added:** ${stats.added_files_count || 0} (${(stats.added_percentage || 0).toFixed(1)}%)\n- **Deleted:** ${stats.deleted_files_count || 0} (${(stats.deleted_percentage || 0).toFixed(1)}%)\n- **Average Similarity:** ${(stats.average_similarity || 0).toFixed(1)}%\n\n## Testing Recommendations\n- Skip testing ${(stats.unchanged_percentage || 0).toFixed(1)}% of unchanged code\n- Focus on ${(stats.modified_percentage || 0).toFixed(1)}% of modified code\n`

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
      const details = results.detailed_changes?.[file] || {}
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, border: "4px solid rgba(148,163,184,0.1)", borderTopColor: "#06b6d4", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 16 }}>Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !results || !results.statistics) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }}>
        <div style={{ maxWidth: 520, padding: 20, background: "rgba(17,24,39,0.7)", borderRadius: 8, border: "1px solid rgba(255,0,0,0.06)", textAlign: "center" }}>
          <p style={{ color: "#fca5a5", marginBottom: 12 }}>{error || "Failed to load analysis results"}</p>
          <button style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#e6eef8", cursor: "pointer" }} onClick={() => router.push("/")}>Go Back Home</button>
        </div>
      </div>
    )
  }

  const stats = results.statistics
  const container = { minHeight: "100vh", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }
  const header = { borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 16px", position: "sticky", top: 0, zIndex: 40 }
  const mainStyle = { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }
  const card = { background: "rgba(17,24,39,0.6)", borderRadius: 8, padding: 20, border: "1px solid rgba(255,255,255,0.04)" }

  return (
    <div style={container}>
      <header style={header}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", marginBottom: 8 }}>Back to Home</button>
          <h1 style={{ textAlign: "center", margin: 0, fontSize: 28 }}>Comparison Results</h1>
          <p style={{ textAlign: "center", marginTop: 6, color: "#9aa7b8" }}>Detailed analysis of version differences and testing recommendations</p>
        </div>
      </header>

      <main style={mainStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 16 }}>
          <div style={card}>
            <div style={{ color: "#9aa7b8", marginBottom: 6 }}>Total Files</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.total_files || 0}</div>
            <div style={{ fontSize: 12, color: "#9aa7b8" }}>Files analyzed</div>
          </div>

          <div style={{ ...card, background: "rgba(4,120,87,0.06)" }}>
            <div style={{ color: "#86efac", marginBottom: 6 }}>Unchanged</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{(stats.unchanged_percentage || 0).toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: "#9aa7b8" }}>{stats.unchanged_files_count || 0} files</div>
          </div>

          <div style={{ ...card, background: "rgba(234,179,8,0.06)" }}>
            <div style={{ color: "#facc15", marginBottom: 6 }}>Modified</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{(stats.modified_percentage || 0).toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: "#9aa7b8" }}>{stats.modified_files_count || 0} files</div>
          </div>

          <div style={{ ...card, background: "rgba(59,130,246,0.06)" }}>
            <div style={{ color: "#60a5fa", marginBottom: 6 }}>Avg Similarity</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{(stats.average_similarity || 0).toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: "#9aa7b8" }}>Code similarity</div>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>File Status Breakdown</h2>
          <p style={{ color: "#cbd5e1" }}>A concise breakdown of unchanged, modified, added and deleted files.</p>
          {/* A more detailed breakdown can be re-added here using results.* arrays if needed */}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ ...card }}>
            <h3 style={{ marginTop: 0 }}>Testing Recommendations</h3>
            <p style={{ color: "#cbd5e1" }}>Skip testing {(stats.unchanged_percentage || 0).toFixed(1)}% of unchanged code. Focus on {(stats.modified_percentage || 0).toFixed(1)}% of modified code.</p>
          </div>
          <div style={{ ...card }}>
            <h3 style={{ marginTop: 0 }}>Risk Summary</h3>
            <p style={{ color: "#cbd5e1" }}>Files added: {stats.added_files_count || 0} • Files deleted: {stats.deleted_files_count || 0}</p>
          </div>
        </div>

        {results.modified_files && results.modified_files.length > 0 && (
          <div style={{ ...card, marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Modified Files</h3>
            <ul style={{ color: "#cbd5e1" }}>
              {results.modified_files.map((f: string) => (
                <li key={f} style={{ padding: "6px 0" }}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ ...card, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>Export Results</h2>
          <p style={{ color: "#9aa7b8" }}>Download your analysis results in multiple formats for sharing and documentation</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button onClick={downloadMarkdown} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "white" }}>Download Markdown</button>
            <button onClick={downloadJSON} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#06b6d4", color: "white" }}>Download JSON</button>
            <button onClick={downloadCSV} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#374151", color: "white" }}>Download CSV</button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", paddingBottom: 24 }}>
          <button onClick={() => router.push("/compare/software")} style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "linear-gradient(90deg,#2563eb,#06b6d4)", color: "white" }}>New Comparison</button>
          <button onClick={() => router.push("/")} style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#e6eef8" }}>Home</button>
        </div>
      </main>
    </div>
  )
}
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
