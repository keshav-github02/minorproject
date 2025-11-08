"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ArrowRight } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-white">PDF Comparison</h1>
          <p className="mt-2 text-slate-400">Upload two PDF documents to compare their content</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* File 1 Upload */}
          <Card className="bg-slate-800/50 border-slate-700 p-10">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">First PDF</h3>
              <p className="text-sm text-slate-400 mb-6">
                {file1 ? `${file1.name}` : "Upload the first PDF file to compare"}
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], true)}
                className="hidden"
                id="file1-input"
              />
              <Button
                onClick={() => document.getElementById("file1-input")?.click()}
                variant="outline"
                className="w-full border-slate-600 hover:border-blue-500 text-white"
              >
                Choose File
              </Button>
              {file1 && <div className="mt-4 p-3 bg-blue-500/10 rounded-lg text-blue-400 text-sm">✓ Ready</div>}
            </div>
          </Card>

          {/* File 2 Upload */}
          <Card className="bg-slate-800/50 border-slate-700 p-10">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Second PDF</h3>
              <p className="text-sm text-slate-400 mb-6">
                {file2 ? `${file2.name}` : "Upload the second PDF file to compare"}
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], false)}
                className="hidden"
                id="file2-input"
              />
              <Button
                onClick={() => document.getElementById("file2-input")?.click()}
                variant="outline"
                className="w-full border-slate-600 hover:border-cyan-500 text-white"
              >
                Choose File
              </Button>
              {file2 && <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg text-cyan-400 text-sm">✓ Ready</div>}
            </div>
          </Card>
        </div>

        {/* Compare Button */}
        <div className="flex justify-center mb-20">
          <Button
            onClick={handleCompare}
            disabled={!file1 || !file2 || loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 text-lg"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙</span>
                Comparing...
              </>
            ) : (
              <>
                Compare PDFs
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-24 bg-slate-800/30 border border-slate-700 rounded-lg p-10">
          <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Upload two PDF files you want to compare</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Our system extracts and analyzes the text content</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Get detailed comparison metrics and similarity scores</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">4.</span>
              <span>View side-by-side differences and generate reports</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
