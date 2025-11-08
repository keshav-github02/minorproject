"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SoftwareComparePage() {
  const [step, setStep] = useState<"method" | "upload">("method")
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCompareDemo = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/compare-software", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useDemo: true }),
      })

      if (!response.ok) throw new Error("Comparison failed")

      const result = await response.json()
      router.push(`/results/software?id=${result.id}`)
    } catch (error) {
      console.error("Error comparing software versions:", error)
      alert("Failed to compare software versions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (file: File, isFile1: boolean) => {
    isFile1 ? setFile1(file) : setFile2(file)
  }

  const handleCompareUpload = async () => {
    if (!file1 || !file2) {
      alert("Please upload both files")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file1", file1)
    formData.append("file2", file2)

    try {
      const response = await fetch("/api/compare-software", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Comparison failed")

      const result = await response.json()
      router.push(`/results/software?id=${result.id}`)
    } catch (error) {
      console.error("Error comparing software versions:", error)
      alert("Failed to compare software versions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const container: React.CSSProperties = { minHeight: "100vh", background: "linear-gradient(180deg,#0f1724,#111827)", color: "#e6eef8" }
  const header: React.CSSProperties = { padding: 28, borderBottom: "1px solid rgba(255,255,255,0.06)" }
  const mainStyle: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "24px 16px" }
  const card: React.CSSProperties = { background: "rgba(17,24,39,0.6)", borderRadius: 8, padding: 20, border: "1px solid rgba(255,255,255,0.04)" }
  const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#e6eef8", cursor: "pointer" }
  const btnPrimary: React.CSSProperties = { padding: "12px 18px", borderRadius: 8, border: "none", background: "linear-gradient(90deg,#2563eb,#06b6d4)", color: "white", cursor: "pointer" }

  return (
    <div style={container}>
      <header style={header}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button onClick={() => router.push("/") } style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", marginBottom: 8 }}>← Back to Home</button>
          <h1 style={{ margin: 0, fontSize: 28 }}>Software Version Comparison</h1>
          <p style={{ color: "#9aa7b8", marginTop: 6 }}>Compare two versions of software and analyze changes</p>
        </div>
      </header>

      <main style={mainStyle}>
        {step === "method" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>How would you like to compare?</h2>
              <p style={{ color: "#9aa7b8" }}>Choose between using demo versions or uploading your own</p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ ...card, flex: 1, minWidth: 260, cursor: "pointer" }} onClick={() => { handleCompareDemo(); }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ height: 56, width: 56, borderRadius: 10, background: "rgba(6,182,212,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: "#67e8f9" }}>Demo</div>
                  <h3 style={{ margin: 0 }}>Try Demo Versions</h3>
                  <p style={{ color: "#9aa7b8" }}>Compare our built-in demo versions (v1.0 vs v2.0)</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ color: "#9aa7b8", fontSize: 13 }}>Instant demo</span>
                    <span style={{ color: "#67e8f9" }}>→</span>
                  </div>
                </div>
              </div>

              <div style={{ ...card, flex: 1, minWidth: 260, cursor: "pointer" }} onClick={() => setStep("upload")}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ height: 56, width: 56, borderRadius: 10, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: "#60a5fa" }}>ZIP</div>
                  <h3 style={{ margin: 0 }}>Upload Your Versions</h3>
                  <p style={{ color: "#9aa7b8" }}>Upload two versions of your own software as ZIP files</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ color: "#9aa7b8", fontSize: 13 }}>Custom versions</span>
                    <span style={{ color: "#60a5fa" }}>→</span>
                  </div>
                </div>
              </div>
            </div>

            {loading && <div style={{ textAlign: "center", color: "#9aa7b8" }}>⚙ Preparing demo comparison...</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ ...card, flex: 1, minWidth: 260 }}>
                <h3>Version 1.0</h3>
                <p style={{ color: "#9aa7b8" }}>{file1 ? file1.name : "Upload the first version (ZIP file)"}</p>
                <input id="file1-input" type="file" accept=".zip" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], true)} style={{ display: "none" }} />
                <div style={{ marginTop: 10 }}>
                  <button style={btn} onClick={() => (document.getElementById("file1-input") as HTMLInputElement | null)?.click()}>Choose File</button>
                </div>
                {file1 && <div style={{ marginTop: 10, color: "#60a5fa" }}>✓ Ready</div>}
              </div>

              <div style={{ ...card, flex: 1, minWidth: 260 }}>
                <h3>Version 2.0</h3>
                <p style={{ color: "#9aa7b8" }}>{file2 ? file2.name : "Upload the second version (ZIP file)"}</p>
                <input id="file2-input" type="file" accept=".zip" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], false)} style={{ display: "none" }} />
                <div style={{ marginTop: 10 }}>
                  <button style={btn} onClick={() => (document.getElementById("file2-input") as HTMLInputElement | null)?.click()}>Choose File</button>
                </div>
                {file2 && <div style={{ marginTop: 10, color: "#67e8f9" }}>✓ Ready</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={{ ...btn, background: "transparent" }} onClick={() => setStep("method")}>Back</button>
              <button style={{ ...btnPrimary, opacity: !file1 || !file2 || loading ? 0.6 : 1 }} onClick={handleCompareUpload} disabled={!file1 || !file2 || loading}>
                {loading ? "⚙ Comparing..." : "Compare Versions"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
