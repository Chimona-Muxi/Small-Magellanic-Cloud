#!/usr/bin/env bash
set -euo pipefail

REPO_ZIP="https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
WORK_DIR="${TMPDIR:-/tmp}/smc-padic-install"

echo "Installing p-adic Converter from main2.0..."
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

if command -v curl >/dev/null 2>&1; then
  curl -L "$REPO_ZIP" -o p-adic-main2.zip
elif command -v wget >/dev/null 2>&1; then
  wget -O p-adic-main2.zip "$REPO_ZIP"
else
  echo "curl or wget is required."
  exit 1
fi

unzip -o p-adic-main2.zip >/dev/null
cd p-adic-main2.0/p_adic_pro
bash install.sh

echo "Done. Open a new terminal and run: smc-padic"
read -r -p "Press Enter to close..."
