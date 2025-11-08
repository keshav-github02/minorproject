"""
Creates visual representations of comparison results.
Generates charts and graphs for better understanding of changes.
"""

import matplotlib.pyplot as plt
import json
from pathlib import Path

class VisualizationGenerator:
    def __init__(self, comparison_results):
        self.results = comparison_results
        self.output_dir = Path("reports/visualizations")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_file_status_pie_chart(self):
        """Generate pie chart showing file status distribution."""
        labels = ['Unchanged', 'Modified', 'Added', 'Deleted']
        sizes = [
            self.results['unchanged_count'],
            self.results['modified_count'],
            self.results['added_count'],
            self.results['deleted_count']
        ]
        colors = ['#2ecc71', '#f39c12', '#3498db', '#e74c3c']
        explode = (0, 0.1, 0, 0)
        
        plt.figure(figsize=(10, 8))
        plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
                shadow=True, startangle=90, textprops={'fontsize': 12})
        plt.title('File Status Distribution\n(Unchanged vs Modified vs Added vs Deleted)', 
                 fontsize=14, fontweight='bold')
        plt.tight_layout()
        
        output_path = self.output_dir / "file_status_distribution.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"✅ Pie chart saved to {output_path}")
        plt.close()
        return str(output_path)
    
    def generate_code_similarity_bar_chart(self):
        """Generate bar chart showing code similarity metrics."""
        metrics = ['Similarity', 'Changes']
        percentages = [
            self.results['average_similarity'],
            self.results['code_change_percentage']
        ]
        colors = ['#2ecc71', '#e74c3c']
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(metrics, percentages, color=colors, alpha=0.7, edgecolor='black', linewidth=2)
        
        # Add value labels on bars
        for bar, pct in zip(bars, percentages):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'{pct:.1f}%', ha='center', va='bottom', fontsize=14, fontweight='bold')
        
        plt.ylabel('Percentage (%)', fontsize=12)
        plt.title('Code Similarity vs Changes\n(Average across all files)', 
                 fontsize=14, fontweight='bold')
        plt.ylim(0, 105)
        plt.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        
        output_path = self.output_dir / "code_similarity_metric.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"✅ Bar chart saved to {output_path}")
        plt.close()
        return str(output_path)
    
    def generate_testing_focus_chart(self):
        """Generate chart showing testing focus distribution."""
        categories = ['Skip Testing\n(Unchanged)', 'Focus Testing\n(Modified)', 
                     'New Tests\n(Added)', 'Update Tests\n(Deleted)']
        percentages = [
            self.results['unchanged_percentage'],
            self.results['modified_percentage'],
            self.results['added_percentage'],
            self.results['deleted_percentage']
        ]
        colors = ['#95a5a6', '#e74c3c', '#3498db', '#e67e22']
        
        plt.figure(figsize=(12, 6))
        bars = plt.bar(categories, percentages, color=colors, alpha=0.8, edgecolor='black', linewidth=2)
        
        for bar, pct in zip(bars, percentages):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'{pct:.1f}%', ha='center', va='bottom', fontsize=12, fontweight='bold')
        
        plt.ylabel('Percentage of Files (%)', fontsize=12)
        plt.title('Testing Effort Distribution Guide', fontsize=14, fontweight='bold')
        plt.ylim(0, max(percentages) + 10)
        plt.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        
        output_path = self.output_dir / "testing_focus_distribution.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"✅ Testing focus chart saved to {output_path}")
        plt.close()
        return str(output_path)
    
    def generate_line_changes_summary(self):
        """Generate chart showing line additions and deletions."""
        metrics = ['Lines Added', 'Lines Removed']
        values = [
            self.results['total_lines_added'],
            self.results['total_lines_removed']
        ]
        colors = ['#3498db', '#e74c3c']
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(metrics, values, color=colors, alpha=0.7, edgecolor='black', linewidth=2)
        
        for bar, val in zip(bars, values):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'{int(val)}', ha='center', va='bottom', fontsize=14, fontweight='bold')
        
        plt.ylabel('Number of Lines', fontsize=12)
        plt.title('Code Line Changes Summary', fontsize=14, fontweight='bold')
        plt.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        
        output_path = self.output_dir / "line_changes_summary.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"✅ Line changes chart saved to {output_path}")
        plt.close()
        return str(output_path)
    
    def generate_all_visualizations(self):
        """Generate all visualization charts."""
        print("\n📊 Generating visualizations...")
        charts = {
            "file_distribution": self.generate_file_status_pie_chart(),
            "code_similarity": self.generate_code_similarity_bar_chart(),
            "testing_focus": self.generate_testing_focus_chart(),
            "line_changes": self.generate_line_changes_summary()
        }
        return charts
