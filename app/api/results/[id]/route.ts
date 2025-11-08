import { type NextRequest, NextResponse } from "next/server"

// Mock results storage (in production, use a database)
const resultsStore: Record<string, any> = {}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    const { id } = await context.params // 👈 await the params here

    // Return demo results based on ID type
    if (id.startsWith("demo-")) {
      return NextResponse.json({
        id,
        type: "software",
        statistics: {
          total_files: 5,
          unchanged_files_count: 1,
          modified_files_count: 2,
          added_files_count: 1,
          deleted_files_count: 1,
          unchanged_percentage: 20,
          modified_percentage: 40,
          added_percentage: 20,
          deleted_percentage: 20,
          average_similarity: 87.45,
          code_stability: 75.2,
        },
        unchanged_files: ["utils.py"],
        modified_files: ["main.py", "config.py"],
        added_files: ["logger.py"],
        deleted_files: ["old_module.py"],
        detailed_changes: {
          "main.py": {
            similarity: 85.3,
            added_lines: 12,
            deleted_lines: 3,
            total_lines_v1: 20,
            total_lines_v2: 29,
          },
          "config.py": {
            similarity: 89.2,
            added_lines: 2,
            deleted_lines: 0,
            total_lines_v1: 5,
            total_lines_v2: 7,
          },
        },
      })
    }

    if (id.startsWith("result-")) {
      return NextResponse.json({
        id,
        type: "software",
        statistics: {
          total_files: 8,
          unchanged_files_count: 5,
          modified_files_count: 2,
          added_files_count: 1,
          deleted_files_count: 0,
          unchanged_percentage: 62.5,
          modified_percentage: 25,
          added_percentage: 12.5,
          deleted_percentage: 0,
          average_similarity: 92.1,
          code_stability: 88.3,
        },
        unchanged_files: [
          "src/utils.ts",
          "src/types.ts",
          "package.json",
          "tsconfig.json",
          "README.md",
        ],
        modified_files: ["src/main.ts", "src/config.ts"],
        added_files: ["src/logger.ts"],
        deleted_files: [],
        detailed_changes: {
          "src/main.ts": {
            similarity: 88.5,
            added_lines: 15,
            deleted_lines: 5,
            total_lines_v1: 45,
            total_lines_v2: 55,
          },
          "src/config.ts": {
            similarity: 95.2,
            added_lines: 2,
            deleted_lines: 0,
            total_lines_v1: 12,
            total_lines_v2: 14,
          },
        },
      })
    }

    if (id.startsWith("pdf-")) {
      return NextResponse.json({
        id,
        type: "pdf",
        similarity: 78.5,
        doc1_pages: 12,
        doc2_pages: 14,
        common_percentage: 78.5,
        unique1_percentage: 12.3,
        unique2_percentage: 9.2,
      })
    }

    return NextResponse.json({ error: "Results not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
