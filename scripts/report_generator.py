"""
Generates detailed reports and exports results to various formats.
Supports JSON, CSV, and markdown outputs.
"""

import json
import csv
from pathlib import Path
from datetime import datetime

class ReportGenerator:
    def __init__(self, comparison_results, file_comparisons):
        self.results = comparison_results
        self.file_comparisons = file_comparisons
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def generate_json_report(self, output_path="reports/comparison_report.json"):
        """Generate JSON report with all comparison details."""
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        report_data = {
            "generated_at": datetime.now().isoformat(),
            "summary": self.results,
            "file_details": [
                {
                    "filename": fc.filename,
                    "status": fc.status,
                    "similarity_score": fc.similarity_score,
                    "lines_added": fc.lines_added,
                    "lines_removed": fc.lines_removed,
                    "lines_changed": fc.lines_changed
                }
                for fc in self.file_comparisons
            ]
        }
        
        with open(output_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"✅ JSON report saved to {output_path}")
        return output_path
    
    def generate_csv_report(self, output_path="reports/file_comparison.csv"):
        """Generate CSV report with file-by-file details."""
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                "Filename", "Status", "Similarity %", 
                "Lines Added", "Lines Removed", "Lines Changed"
            ])
            
            for fc in self.file_comparisons:
                writer.writerow([
                    fc.filename,
                    fc.status,
                    f"{fc.similarity_score:.1f}" if fc.similarity_score > 0 else "-",
                    fc.lines_added,
                    fc.lines_removed,
                    fc.lines_changed
                ])
        
        print(f"✅ CSV report saved to {output_path}")
        return output_path
    
    def generate_markdown_report(self, output_path="reports/ANALYSIS.md"):
        """Generate markdown report for documentation."""
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        markdown_content = f"""# Version Comparison Analysis Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Executive Summary

This report compares two versions of the software and identifies which parts have changed, which remain the same, and provides percentages to help testers prioritize their testing efforts.

## Key Findings

| Metric | Value |
|--------|-------|
| Total Files | {self.results['total_files']} |
| Unchanged Files | {self.results['unchanged_count']} ({self.results['unchanged_percentage']:.1f}%) |
| Modified Files | {self.results['modified_count']} ({self.results['modified_percentage']:.1f}%) |
| Added Files | {self.results['added_count']} ({self.results['added_percentage']:.1f}%) |
| Deleted Files | {self.results['deleted_count']} ({self.results['deleted_percentage']:.1f}%) |
| **Average Code Similarity** | **{self.results['average_similarity']:.1f}%** |
| **Code Change Percentage** | **{self.results['code_change_percentage']:.1f}%** |

## Testing Strategy

### 🟢 Safe to Skip (Unchanged Files: {self.results['unchanged_percentage']:.1f}%)
{self.results['unchanged_count']} files remain completely unchanged. Testers can skip regression testing on these files.

### 🟡 Requires Re-testing (Modified Files: {self.results['modified_percentage']:.1f}%)
{self.results['modified_count']} files have been modified. These files need thorough testing and should be the primary focus.

### 🔵 Needs New Tests (Added Files: {self.results['added_percentage']:.1f}%)
{self.results['added_count']} new files have been added. New test cases must be created.

### 🔴 Verify Removed Features (Deleted Files: {self.results['deleted_percentage']:.1f}%)
{self.results['deleted_count']} files have been deleted. Ensure dependent tests are updated.

## Detailed File Changes

"""
        
        # Group by status
        modified = [fc for fc in self.file_comparisons if fc.status == "modified"]
        added = [fc for fc in self.file_comparisons if fc.status == "added"]
        deleted = [fc for fc in self.file_comparisons if fc.status == "deleted"]
        unchanged = [fc for fc in self.file_comparisons if fc.status == "unchanged"]
        
        if modified:
            markdown_content += "### Modified Files\n\n"
            for fc in sorted(modified, key=lambda x: x.similarity_score):
                markdown_content += f"- **{fc.filename}** - Similarity: {fc.similarity_score:.1f}% | Added: {fc.lines_added} | Removed: {fc.lines_removed}\n"
            markdown_content += "\n"
        
        if added:
            markdown_content += "### Added Files (New)\n\n"
            for fc in added:
                markdown_content += f"- {fc.filename}\n"
            markdown_content += "\n"
        
        if deleted:
            markdown_content += "### Deleted Files (Deprecated)\n\n"
            for fc in deleted:
                markdown_content += f"- ~~{fc.filename}~~\n"
            markdown_content += "\n"
        
        markdown_content += """
## Recommendations

1. **Focus Testing on Modified Files**: Allocate 70-80% of testing effort to the {count_modified} modified files.
2. **Create New Tests for Added Files**: Develop test cases for {count_added} new features/files.
3. **Skip Unchanged Files**: Save time by not re-testing {count_unchanged} unchanged files.
4. **Update Deprecated Tests**: Remove or update tests related to {count_deleted} deleted files.

## Conclusion

{change_pct:.1f}% of the codebase has changed between versions. This means testers should focus approximately {change_pct:.1f}% of their effort on changed areas and only {100-change_pct:.1f}% on regression testing of unchanged code.

---
*Report generated by Version Comparison Tool*
""".format(
            count_modified=self.results['modified_count'],
            count_added=self.results['added_count'],
            count_unchanged=self.results['unchanged_count'],
            count_deleted=self.results['deleted_count'],
            change_pct=self.results['code_change_percentage']
        )
        
        with open(output_path, 'w') as f:
            f.write(markdown_content)
        
        print(f"✅ Markdown report saved to {output_path}")
        return output_path
    
    def generate_all_reports(self):
        """Generate all report formats."""
        print("\n📄 Generating reports...")
        json_path = self.generate_json_report()
        csv_path = self.generate_csv_report()
        md_path = self.generate_markdown_report()
        return {
            "json": json_path,
            "csv": csv_path,
            "markdown": md_path
        }
