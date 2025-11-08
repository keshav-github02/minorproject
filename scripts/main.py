"""
Main orchestrator for the version comparison analysis tool.
Runs the complete pipeline and generates all outputs.
"""

import sys
from pathlib import Path
from version_comparator import VersionComparator
from report_generator import ReportGenerator
from visualizer import VisualizationGenerator
from setup_versions import setup_demo_data

def main():
    print("\n" + "="*70)
    print(" "*15 + "VERSION COMPARISON ANALYSIS TOOL")
    print("="*70)
    
    # Step 1: Setup demo data
    print("\n[Step 1/4] Setting up demo versions...")
    setup_demo_data()
    
    # Step 2: Run comparison
    print("\n[Step 2/4] Running version comparison...")
    comparator = VersionComparator(
        "versions/demo_v1",
        "versions/demo_v2"
    )
    results = comparator.run_comparison()
    
    # Print summary
    print(comparator.get_summary())
    
    # Get modified files for testers
    modified_files = comparator.get_modified_files()
    print("\n🎯 Files Requiring Re-testing:")
    for fc in modified_files:
        if fc.status != "unchanged":
            print(f"   - {fc.filename} ({fc.status})")
    
    # Step 3: Generate reports
    print("\n[Step 3/4] Generating reports...")
    report_gen = ReportGenerator(results, comparator.file_comparisons)
    report_paths = report_gen.generate_all_reports()
    
    # Step 4: Generate visualizations
    print("\n[Step 4/4] Generating visualizations...")
    visualizer = VisualizationGenerator(results)
    chart_paths = visualizer.generate_all_visualizations()
    
    # Final summary
    print("\n" + "="*70)
    print("✅ ANALYSIS COMPLETE!")
    print("="*70)
    print("\n📋 Generated Reports:")
    for format_type, path in report_paths.items():
        print(f"   - {format_type.upper()}: {path}")
    
    print("\n📊 Generated Visualizations:")
    for chart_name, path in chart_paths.items():
        print(f"   - {chart_name.replace('_', ' ').title()}: {path}")
    
    print("\n🎯 KEY METRICS FOR GRADING:")
    print(f"   • Code Similarity: {results['average_similarity']:.1f}%")
    print(f"   • Change Percentage: {results['code_change_percentage']:.1f}%")
    print(f"   • Files to Re-test: {results['modified_count']} out of {results['total_files']} ({results['modified_percentage']:.1f}%)")
    print(f"   • Testing Time Savings: {results['unchanged_percentage']:.1f}% (skip these files)")
    
    print("\n📁 Output Directory: ./reports/")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
