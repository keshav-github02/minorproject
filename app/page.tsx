"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, GitCompare, Zap, BarChart3, Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <GitCompare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center">
              Version Comparator
            </h1>
          </div>
          <p className="text-slate-400 text-lg text-center">
            Compare versions with precision and optimize your testing strategy
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">Choose Your Comparison</h2>
          <p className="text-xl text-slate-400">Select how you want to analyze differences between versions</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          {/* PDF Comparison Card */}
          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8 h-full flex flex-col">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-all group-hover:scale-110">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">PDF Documents</h3>
              <p className="text-slate-400 mb-6 flex-grow text-base">
                Upload and compare two PDF documents. Analyze content differences, extract similarities, and generate
                detailed reports.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Text content analysis
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Similarity metrics
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Detailed reports
                </li>
              </ul>
              <Button
                onClick={() => router.push("/compare/pdf")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Compare PDFs
              </Button>
            </div>
          </Card>

          {/* Software Version Card */}
          <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8 h-full flex flex-col">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30 transition-all group-hover:scale-110">
                <GitCompare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Software Versions</h3>
              <p className="text-slate-400 mb-6 flex-grow text-base">
                Compare two software versions. Analyze code changes, identify modified files, and optimize testing
                efforts with percentage breakdowns.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  File-level comparison
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Code similarity analysis
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Testing recommendations
                </li>
              </ul>
              <Button
                onClick={() => router.push("/compare/software")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                Compare Versions
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-700/50 rounded-2xl p-16 mb-24">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Choose Our Tool?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                <p className="text-slate-400">Instant analysis and comparison results in seconds</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Detailed Metrics</h4>
                <p className="text-slate-400">Comprehensive percentage breakdowns and statistics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Reliable</h4>
                <p className="text-slate-400">Accurate analysis you can trust for testing optimization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <p className="text-slate-400 text-sm">Accurate Comparison</p>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">
              Real-time
            </div>
            <p className="text-slate-400 text-sm">Instant Analysis</p>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
              Reports
            </div>
            <p className="text-slate-400 text-sm">Professional Output</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 mt-32">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <p className="text-slate-500 text-sm">Version Comparator Tool © 2025 - Compare with confidence</p>
        </div>
      </footer>
    </div>
  )
}
