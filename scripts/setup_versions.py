"""
Setup script to download and prepare two versions of an open-source project.
This script uses Flask as an example - can be adapted for any GitHub project.
"""

import os
import subprocess
import json
from pathlib import Path

def download_version(repo_url, version_tag, target_dir):
    """
    Download a specific version of a GitHub repository.
    
    Args:
        repo_url: GitHub repository URL
        version_tag: Git tag or commit hash
        target_dir: Directory to download to
    """
    print(f"\n📥 Downloading {version_tag}...")
    
    # Clone the repo
    clone_dir = f"temp_clone_{version_tag}"
    try:
        subprocess.run(
            ["git", "clone", repo_url, clone_dir],
            check=True,
            capture_output=True
        )
        
        # Checkout specific version
        subprocess.run(
            ["git", "-C", clone_dir, "checkout", version_tag],
            check=True,
            capture_output=True
        )
        
        # Move to target directory
        os.makedirs(target_dir, exist_ok=True)
        for item in Path(clone_dir).glob("*"):
            if item.is_file():
                import shutil
                shutil.copy2(item, target_dir)
            elif item.name not in [".git", ".github"]:
                import shutil
                if Path(target_dir / item.name).exists():
                    shutil.rmtree(target_dir / item.name)
                shutil.copytree(item, target_dir / item.name)
        
        # Cleanup
        import shutil
        shutil.rmtree(clone_dir)
        
        print(f"✅ {version_tag} downloaded successfully to {target_dir}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error downloading {version_tag}: {e}")
        return False

def setup_demo_data():
    """Create demo versions for testing without cloning from GitHub."""
    print("\n📦 Setting up demo data for testing...")
    
    # Create demo version 1
    demo_v1 = "versions/demo_v1"
    os.makedirs(demo_v1, exist_ok=True)
    
    with open(f"{demo_v1}/main.py", "w") as f:
        f.write("""def greet(name):
    return f"Hello, {name}!"

def calculate_sum(a, b):
    return a + b

class Calculator:
    def multiply(self, x, y):
        return x * y
""")
    
    with open(f"{demo_v1}/utils.py", "w") as f:
        f.write("""import math

def get_average(numbers):
    return sum(numbers) / len(numbers)
""")
    
    with open(f"{demo_v1}/config.json", "w") as f:
        json.dump({"version": "1.0", "debug": False}, f)
    
    # Create demo version 2 with changes
    demo_v2 = "versions/demo_v2"
    os.makedirs(demo_v2, exist_ok=True)
    
    with open(f"{demo_v2}/main.py", "w") as f:
        f.write("""def greet(name):
    greeting = f"Hello, {name}!"
    return greeting.upper()

def calculate_sum(a, b):
    if a is None or b is None:
        return 0
    return a + b

def multiply(x, y):
    return x * y

class Calculator:
    def multiply(self, x, y):
        return x * y
    
    def divide(self, x, y):
        if y == 0:
            return None
        return x / y
""")
    
    with open(f"{demo_v2}/utils.py", "w") as f:
        f.write("""import math

def get_average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

def get_median(numbers):
    sorted_nums = sorted(numbers)
    n = len(sorted_nums)
    return sorted_nums[n//2] if n % 2 else (sorted_nums[n//2-1] + sorted_nums[n//2]) / 2
""")
    
    with open(f"{demo_v2}/config.json", "w") as f:
        json.dump({"version": "2.0", "debug": True, "features": ["logging", "metrics"]}, f)
    
    with open(f"{demo_v2}/logger.py", "w") as f:
        f.write("""class Logger:
    def log(self, message):
        print(f"[LOG] {message}")
""")
    
    print(f"✅ Demo data created in versions/demo_v1 and versions/demo_v2")

if __name__ == "__main__":
    print("=" * 60)
    print("VERSION DOWNLOADER & SETUP")
    print("=" * 60)
    
    # Use demo data for testing
    setup_demo_data()
    
    # To use real GitHub projects, uncomment below:
    # Example: Compare Flask versions
    # download_version(
    #     "https://github.com/pallets/flask.git",
    #     "2.2.0",
    #     "versions/flask_v2.2.0"
    # )
    # download_version(
    #     "https://github.com/pallets/flask.git",
    #     "3.0.0",
    #     "versions/flask_v3.0.0"
    # )
