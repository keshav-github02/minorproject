"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function PDFResultsPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${id}`)
        if (!response.ok) throw new Error("Failed to fetch results")
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchResults()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚙</div>
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  const container: React.CSSProperties = { minHeight: "100vh", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }
  const header: React.CSSProperties = { borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 16px" }
  const mainStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }
  const card: React.CSSProperties = { background: "rgba(17,24,39,0.6)", borderRadius: 8, padding: 20, border: "1px solid rgba(255,255,255,0.04)" }
  const metricStyle: React.CSSProperties = { padding: 16, borderRadius: 8, background: "rgba(255,255,255,0.02)", textAlign: "center" }
  const btnStyle: React.CSSProperties = { padding: "10px 14px", borderRadius: 6, border: "none", color: "white", cursor: "pointer" }

  const downloadMarkdown = () => {
    if (!results) return
    const stats = results.statistics || {}
    const markdown = `# PDF Comparison Report\n\n## Summary\n- **Similarity:** ${results?.similarity?.toFixed(1) || 0}%\n- **Doc1 pages:** ${results?.doc1_pages || 0}\n- **Doc2 pages:** ${results?.doc2_pages || 0}\n`
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
    let csv = "Metric,Value\n"
    csv += `Similarity,${results?.similarity || 0}\n`
    csv += `Doc1 pages,${results?.doc1_pages || 0}\n`
    csv += `Doc2 pages,${results?.doc2_pages || 0}\n`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comparison-report.csv"
    a.click()
  }

  return (
    <div style={container}>
      <header style={header}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>PDF Comparison Results</h1>
          <p style={{ marginTop: 6, color: "#9aa7b8" }}>Detailed analysis of your PDF documents</p>
        </div>
      </header>

      <main style={mainStyle}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ ...metricStyle, flex: 1 }}>
            <div style={{ color: "#9aa7b8", marginBottom: 6 }}>Overall Similarity</div>
            <div style={{ fontSize: 28, color: "#60a5fa", fontWeight: 700 }}>{results?.similarity?.toFixed(1) || 0}%</div>
          </div>

          <div style={{ ...metricStyle, flex: 1 }}>
            <div style={{ color: "#9aa7b8", marginBottom: 6 }}>Document 1</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{results?.doc1_pages || 0} pages</div>
          </div>

          <div style={{ ...metricStyle, flex: 1 }}>
            <div style={{ color: "#9aa7b8", marginBottom: 6 }}>Document 2</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{results?.doc2_pages || 0} pages</div>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>Comparison Summary</h2>
          <div style={{ color: "#cbd5e1" }}>
            <p><strong>Similarity Score:</strong> {results?.similarity?.toFixed(1)}%</p>
            <p><strong>Common Content:</strong> {results?.common_percentage?.toFixed(1)}% of content matches</p>
            <p><strong>Unique to Document 1:</strong> {results?.unique1_percentage?.toFixed(1)}%</p>
            <p><strong>Unique to Document 2:</strong> {results?.unique2_percentage?.toFixed(1)}%</p>
          </div>
        </div>

        <div style={{ ...card, background: "linear-gradient(90deg,#02244a20,#023b4b20)", border: "1px solid rgba(3,105,161,0.1)" }}>
          <h2 style={{ marginTop: 0 }}>Download Reports</h2>
          <p style={{ color: "#9aa7b8" }}>Export your analysis results in multiple formats</p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={downloadMarkdown} style={{ ...btnStyle, background: "#2563eb" }}>Download Markdown Report</button>
            <button onClick={downloadJSON} style={{ ...btnStyle, background: "#06b6d4" }}>Download JSON Data</button>
            <button onClick={downloadCSV} style={{ ...btnStyle, background: "#374151" }}>Download CSV</button>
          </div>
        </div>
      </main>
    </div>
  )
}
