"use client"

import { useRouter } from "next/navigation"
import React from "react"
import "./globals.css"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">VC</div>
        <h1 className="title">Version Comparator</h1>
        <p className="subtitle">Compare software versions and PDF files easily</p>
      </header>

      <main className="app-main">
        <section className="hero">
          <h2>Choose Your Comparison</h2>
          <p>Select how you want to analyze differences between versions</p>
        </section>

        <section className="options">
          <div className="card" onClick={() => router.push("/compare/pdf")}> 
            <div className="card-icon">📄</div>
            <h3>PDF Documents</h3>
            <p>Upload and compare two PDF documents and generate detailed reports.</p>
            <button className="btn">Compare PDFs</button>
          </div>

          <div className="card" onClick={() => router.push("/compare/software")}>
            <div className="card-icon">🧾</div>
            <h3>Software Versions</h3>
            <p>Compare two software versions and optimize testing efforts.</p>
            <button className="btn">Compare Versions</button>
          </div>
        </section>

        <section className="features">
          <h3>Why Choose Our Tool?</h3>
          <div className="feature-list">
            <div className="feature">Lightning Fast</div>
            <div className="feature">Detailed Metrics</div>
            <div className="feature">Reliable</div>
          </div>
        </section>
      </main>

      <footer className="app-footer">Version Comparator Tool © 2025</footer>
    </div>
  )
}
