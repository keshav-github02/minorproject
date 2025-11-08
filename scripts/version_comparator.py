"""
Core version comparison engine that analyzes differences between two versions.
Generates detailed metrics about code changes, file modifications, and features.
"""

import os
import json
import difflib
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass, asdict

@dataclass
class FileComparison:
    filename: str
    status: str  # "unchanged", "modified", "added", "deleted"
    similarity_score: float = 0.0
    lines_added: int = 0
    lines_removed: int = 0
    lines_changed: int = 0

class VersionComparator:
    def __init__(self, version1_path, version2_path):
        self.version1_path = Path(version1_path)
        self.version2_path = Path(version2_path)
        self.file_comparisons = []
        self.results = {}
    
    def get_all_files(self, directory, extensions=None):
        """Get all files from a directory with optional extension filtering."""
        if extensions is None:
            extensions = [".py", ".java", ".js", ".cpp", ".c", ".json", ".yaml", ".yml", ".txt", ".md"]
        
        files = {}
        for root, _, filenames in os.walk(directory):
            for filename in filenames:
                if any(filename.endswith(ext) for ext in extensions) or filename == "README":
                    full_path = Path(root) / filename
                    relative_path = full_path.relative_to(directory)
                    files[str(relative_path)] = full_path
        return files
    
    def get_file_content(self, file_path):
        """Read file content safely."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.readlines()
        except Exception:
            return []
    
    def calculate_similarity(self, lines1, lines2):
        """Calculate similarity ratio between two files using difflib."""
        if not lines1 and not lines2:
            return 100.0
        if not lines1 or not lines2:
            return 0.0
        
        matcher = difflib.SequenceMatcher(None, lines1, lines2)
        return matcher.ratio() * 100
    
    def get_diff_stats(self, lines1, lines2):
        """Calculate added, removed, and changed lines."""
        diff = difflib.unified_diff(lines1, lines2, lineterm='')
        
        added = 0
        removed = 0
        
        for line in diff:
            if line.startswith('+') and not line.startswith('+++'):
                added += 1
            elif line.startswith('-') and not line.startswith('---'):
                removed += 1
        
        return added, removed, max(added, removed)
    
    def compare_files(self, file1_path, file2_path):
        """Compare two individual files."""
        lines1 = self.get_file_content(file1_path)
        lines2 = self.get_file_content(file2_path)
        
        similarity = self.calculate_similarity(lines1, lines2)
        added, removed, changed = self.get_diff_stats(lines1, lines2)
        
        return {
            "similarity": similarity,
            "added": added,
            "removed": removed,
            "changed": changed
        }
    
    def run_comparison(self):
        """Run full comparison between two versions."""
        print("\n🔍 Starting version comparison...")
        
        files_v1 = self.get_all_files(self.version1_path)
        files_v2 = self.get_all_files(self.version2_path)
        
        all_files = set(files_v1.keys()) | set(files_v2.keys())
        
        unchanged_count = 0
        modified_count = 0
        added_count = 0
        deleted_count = 0
        total_lines_v1 = 0
        total_lines_v2 = 0
        total_added = 0
        total_removed = 0
        total_similarity = 0
        
        for filename in sorted(all_files):
            if filename in files_v1 and filename in files_v2:
                # File exists in both versions
                comparison = self.compare_files(files_v1[filename], files_v2[filename])
                
                if comparison["similarity"] == 100.0:
                    status = "unchanged"
                    unchanged_count += 1
                else:
                    status = "modified"
                    modified_count += 1
                
                total_similarity += comparison["similarity"]
                total_added += comparison["added"]
                total_removed += comparison["removed"]
                
                fc = FileComparison(
                    filename=filename,
                    status=status,
                    similarity_score=comparison["similarity"],
                    lines_added=comparison["added"],
                    lines_removed=comparison["removed"],
                    lines_changed=comparison["changed"]
                )
                self.file_comparisons.append(fc)
                
            elif filename in files_v1:
                # File deleted in v2
                deleted_count += 1
                fc = FileComparison(filename=filename, status="deleted")
                self.file_comparisons.append(fc)
                
            else:
                # File added in v2
                added_count += 1
                fc = FileComparison(filename=filename, status="added")
                self.file_comparisons.append(fc)
        
        # Calculate statistics
        total_files = len(all_files)
        
        if modified_count + unchanged_count > 0:
            avg_similarity = total_similarity / (modified_count + unchanged_count)
        else:
            avg_similarity = 100.0
        
        self.results = {
            "total_files": total_files,
            "unchanged_count": unchanged_count,
            "modified_count": modified_count,
            "added_count": added_count,
            "deleted_count": deleted_count,
            "unchanged_percentage": (unchanged_count / total_files * 100) if total_files > 0 else 0,
            "modified_percentage": (modified_count / total_files * 100) if total_files > 0 else 0,
            "added_percentage": (added_count / total_files * 100) if total_files > 0 else 0,
            "deleted_percentage": (deleted_count / total_files * 100) if total_files > 0 else 0,
            "average_similarity": avg_similarity,
            "total_lines_added": total_added,
            "total_lines_removed": total_removed,
            "code_change_percentage": 100 - avg_similarity if total_files > 0 else 0
        }
        
        print("✅ Comparison completed")
        return self.results
    
    def get_summary(self):
        """Get human-readable summary of comparison."""
        if not self.results:
            return "No comparison results available. Run compare() first."
        
        summary = f"""
╔════════════════════════════════════════════════════════════╗
║           VERSION COMPARISON ANALYSIS SUMMARY              ║
╚════════════════════════════════════════════════════════════╝

📊 FILE STATISTICS:
  • Total Files: {self.results['total_files']}
  • Unchanged: {self.results['unchanged_count']} ({self.results['unchanged_percentage']:.1f}%)
  • Modified: {self.results['modified_count']} ({self.results['modified_percentage']:.1f}%)
  • Added: {self.results['added_count']} ({self.results['added_percentage']:.1f}%)
  • Deleted: {self.results['deleted_count']} ({self.results['deleted_percentage']:.1f}%)

📈 CODE ANALYSIS:
  • Average Code Similarity: {self.results['average_similarity']:.1f}%
  • Code Change Percentage: {self.results['code_change_percentage']:.1f}%
  • Total Lines Added: {self.results['total_lines_added']}
  • Total Lines Removed: {self.results['total_lines_removed']}

🎯 TESTING FOCUS:
  • Files Requiring Re-testing: {self.results['modified_count']} files
  • Files Safe to Skip: {self.results['unchanged_count']} files ({self.results['unchanged_percentage']:.1f}%)
  • New Test Cases Needed: {self.results['added_count']} new files
  • Deprecated Features: {self.results['deleted_count']} deleted files
"""
        return summary
    
    def get_modified_files(self):
        """Get list of all modified files that testers should focus on."""
        return [fc for fc in self.file_comparisons if fc.status in ["modified", "added", "deleted"]]
