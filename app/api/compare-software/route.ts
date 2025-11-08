import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""

    // Demo comparison
    if (contentType.includes("application/json")) {
      const body = await request.json()

      if (body.useDemo) {
        // Return demo results
        const demoResults = {
          id: "demo-" + Date.now(),
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
        }

        return NextResponse.json(demoResults)
      }
    }

    // File upload comparison
    const formData = await request.formData()
    const file1 = formData.get("file1") as File
    const file2 = formData.get("file2") as File

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Both files are required" }, { status: 400 })
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), "temp")
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    const resultId = "result-" + Date.now()
    const tempResultDir = path.join(tempDir, resultId)
    await mkdir(tempResultDir, { recursive: true })

    // Save files (simplified - in production you'd extract and process)
    const filePath1 = path.join(tempResultDir, file1.name)
    const filePath2 = path.join(tempResultDir, file2.name)

    const buffer1 = await file1.arrayBuffer()
    const buffer2 = await file2.arrayBuffer()

    await writeFile(filePath1, Buffer.from(buffer1))
    await writeFile(filePath2, Buffer.from(buffer2))

    // Return placeholder results
    const results = {
      id: resultId,
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
      unchanged_files: ["src/utils.ts", "src/types.ts", "package.json", "tsconfig.json", "README.md"],
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
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in compare-software:", error)
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 })
  }
}
