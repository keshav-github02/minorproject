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
  // Make header flow with page (not fixed/sticky) so it doesn't stay pinned at the top
  const header = { borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 16px" }
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