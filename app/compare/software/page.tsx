"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ArrowRight, Code } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SoftwareComparePage() {
  const [step, setStep] = useState<"method" | "upload">("method")
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [useDemo, setUseDemo] = useState(false)
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
          <h1 className="text-3xl font-bold text-white">Software Version Comparison</h1>
          <p className="mt-2 text-slate-400">Compare two versions of software and analyze changes</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {step === "method" ? (
          <>
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-white mb-4">How would you like to compare?</h2>
              <p className="text-slate-400 text-lg">Choose between using demo versions or uploading your own</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* Demo Option */}
              <Card
                className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  setUseDemo(true)
                  handleCompareDemo()
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Code className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Try Demo Versions</h3>
                  <p className="text-slate-400 mb-6">
                    Compare our built-in demo versions (v1.0 vs v2.0) to see how the tool works
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Instant demo</span>
                    <ArrowRight className="h-5 w-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>

              {/* Upload Option */}
              <Card
                className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                onClick={() => setStep("upload")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Upload Your Versions</h3>
                  <p className="text-slate-400 mb-6">Upload two versions of your own software as ZIP files</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Custom versions</span>
                    <ArrowRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {loading && (
              <div className="text-center text-slate-400">
                <span className="inline-block animate-spin mr-2">⚙</span>
                Preparing demo comparison...
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* File 1 Upload */}
              <Card className="bg-slate-800/50 border-slate-700 p-8">
                <div className="text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Version 1.0</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    {file1 ? `${file1.name}` : "Upload the first version (ZIP file)"}
                  </p>
                  <input
                    type="file"
                    accept=".zip"
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
              <Card className="bg-slate-800/50 border-slate-700 p-8">
                <div className="text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Version 2.0</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    {file2 ? `${file2.name}` : "Upload the second version (ZIP file)"}
                  </p>
                  <input
                    type="file"
                    accept=".zip"
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

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setStep("method")}
                variant="outline"
                className="border-slate-600 hover:border-slate-500 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleCompareUpload}
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
                    Compare Versions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
