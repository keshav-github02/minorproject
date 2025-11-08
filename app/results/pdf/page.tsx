"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileJson, FileText } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="inline-block animate-spin text-4xl mb-4">⚙</span>
          <p className="text-white">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">PDF Comparison Results</h1>
          <p className="text-slate-400">Detailed analysis of your PDF documents</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Overall Similarity</div>
            <div className="text-3xl font-bold text-blue-400">{results?.similarity?.toFixed(1) || 0}%</div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Document 1</div>
            <div className="text-lg font-bold text-white">{results?.doc1_pages || 0} pages</div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Document 2</div>
            <div className="text-lg font-bold text-white">{results?.doc2_pages || 0} pages</div>
          </Card>
        </div>

        {/* Summary */}
        <Card className="bg-slate-800/50 border-slate-700 p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Comparison Summary</h2>
          <div className="space-y-3 text-slate-300">
            <p>
              <span className="font-semibold">Similarity Score:</span> {results?.similarity?.toFixed(1)}%
            </p>
            <p>
              <span className="font-semibold">Common Content:</span> {results?.common_percentage?.toFixed(1)}% of
              content matches
            </p>
            <p>
              <span className="font-semibold">Unique to Document 1:</span> {results?.unique1_percentage?.toFixed(1)}%
            </p>
            <p>
              <span className="font-semibold">Unique to Document 2:</span> {results?.unique2_percentage?.toFixed(1)}%
            </p>
          </div>
        </Card>

        {/* Download Reports */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700/50 p-8">
          <h2 className="text-xl font-bold text-white mb-4">Download Reports</h2>
          <p className="text-slate-400 mb-6">Export your analysis results in multiple formats</p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Download Markdown Report
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <FileJson className="h-4 w-4 mr-2" />
              Download JSON Data
            </Button>
            <Button className="bg-slate-700 hover:bg-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
