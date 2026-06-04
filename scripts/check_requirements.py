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

if installed != recorded:
    with open("requirements.txt", "w", encoding="utf-8", newline="\n") as f:
        f.write(result.stdout)
    subprocess.run(["git", "add", "requirements.txt"])
    print("requirements.txt updated and staged.")
