"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PDFComparePage() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileUpload = (file: File, isFile1: boolean) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file")
      return
    }
    isFile1 ? setFile1(file) : setFile2(file)
  }

  const handleCompare = async () => {
    if (!file1 || !file2) {
      alert("Please upload both PDF files")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file1", file1)
    formData.append("file2", file2)

    try {
      const response = await fetch("/api/compare-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Comparison failed")

      const result = await response.json()
      router.push(`/results/pdf?id=${result.id}`)
    } catch (error) {
      console.error("Error comparing PDFs:", error)
      alert("Failed to compare PDFs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0f1724,#111827)",
    color: "#e6eef8",
    paddingBottom: 48,
  }

  const headerStyle: React.CSSProperties = { padding: "28px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }
  const mainStyle: React.CSSProperties = { maxWidth: 900, margin: "24px auto", padding: "0 16px" }
  const cardStyle: React.CSSProperties = {
    background: "rgba(17,24,39,0.6)",
    border: "1px solid rgba(255,255,255,0.04)",
    padding: 24,
    borderRadius: 8,
    textAlign: "center",
  }
  const btnPrimary: React.CSSProperties = {
    display: "inline-block",
    padding: "12px 20px",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
  }
  const btnOutline: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    background: "transparent",
    color: "#e6eef8",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    cursor: "pointer",
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", marginBottom: 8 }}>
            ← Back to Home
          </button>
          <h1 style={{ margin: 0, fontSize: 28 }}>PDF Comparison</h1>
          <p style={{ marginTop: 6, color: "#9aa7b8" }}>Upload two PDF documents to compare their content</p>
        </div>
      </header>

      <main style={mainStyle}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ ...cardStyle, flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ height: 56, width: 56, borderRadius: 8, margin: "0 auto 8px", background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>PDF</div>
              <h3 style={{ margin: "8px 0" }}>First PDF</h3>
              <p style={{ color: "#9aa7b8" }}>{file1 ? file1.name : "Upload the first PDF file to compare"}</p>
              <input id="file1-input" type="file" accept=".pdf" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], true)} style={{ display: "none" }} />
              <div style={{ marginTop: 12 }}>
                <button onClick={() => (document.getElementById("file1-input") as HTMLInputElement | null)?.click()} style={btnOutline}>
                  Choose File
                </button>
              </div>
              {file1 && <div style={{ marginTop: 12, padding: 8, borderRadius: 6, color: "#60a5fa", background: "rgba(96,165,250,0.06)" }}>✓ Ready</div>}
            </div>
          </div>

          <div style={{ ...cardStyle, flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ height: 56, width: 56, borderRadius: 8, margin: "0 auto 8px", background: "rgba(6,182,212,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#67e8f9" }}>PDF</div>
              <h3 style={{ margin: "8px 0" }}>Second PDF</h3>
              <p style={{ color: "#9aa7b8" }}>{file2 ? file2.name : "Upload the second PDF file to compare"}</p>
              <input id="file2-input" type="file" accept=".pdf" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], false)} style={{ display: "none" }} />
              <div style={{ marginTop: 12 }}>
                <button onClick={() => (document.getElementById("file2-input") as HTMLInputElement | null)?.click()} style={btnOutline}>
                  Choose File
                </button>
              </div>
              {file2 && <div style={{ marginTop: 12, padding: 8, borderRadius: 6, color: "#67e8f9", background: "rgba(103,232,249,0.04)" }}>✓ Ready</div>}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={handleCompare} disabled={!file1 || !file2 || loading} style={{ ...btnPrimary, opacity: !file1 || !file2 || loading ? 0.6 : 1 }}>
            {loading ? (
              <>
                <span style={{ marginRight: 8 }}>⚙</span>
                Comparing...
              </>
            ) : (
              "Compare PDFs"
            )}
          </button>
        </div>

        <div style={{ ...cardStyle }}>
          <h3 style={{ marginTop: 0 }}>How it works</h3>
          <ul style={{ color: "#9aa7b8", paddingLeft: 18 }}>
            <li style={{ margin: "8px 0" }}><strong style={{ color: "#c7e3ff" }}>1.</strong> Upload two PDF files you want to compare</li>
            <li style={{ margin: "8px 0" }}><strong style={{ color: "#c7e3ff" }}>2.</strong> Our system extracts and analyzes the text content</li>
            <li style={{ margin: "8px 0" }}><strong style={{ color: "#c7e3ff" }}>3.</strong> Get detailed comparison metrics and similarity scores</li>
            <li style={{ margin: "8px 0" }}><strong style={{ color: "#c7e3ff" }}>4.</strong> View side-by-side differences and generate reports</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
