import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-m", "pip", "freeze"],
    capture_output=True,
    text=True,
)
installed = set(result.stdout.strip().splitlines())

with open("requirements.txt") as f:
    recorded = set(f.read().strip().splitlines())

missing = installed - recorded
extra = recorded - installed

if missing or extra:
    if missing:
        print("Packages installed but not in requirements.txt:")
        for p in sorted(missing):
            print(f"  + {p}")
    if extra:
        print("Packages in requirements.txt but not installed:")
        for p in sorted(extra):
            print(f"  - {p}")
    print("\nRun: pip freeze > requirements.txt")
    sys.exit(1)
