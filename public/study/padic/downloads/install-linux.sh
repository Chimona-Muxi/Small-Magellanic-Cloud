#!/usr/bin/env bash
set -euo pipefail

REPO_ZIP="https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
WORK_DIR="${TMPDIR:-/tmp}/smc-padic-install"

echo "Installing or reinstalling p-adic Converter from main2.0..."

echo ""
echo "[1/4] Checking for old installation..."
if command -v smc-padic >/dev/null 2>&1 || command -v padic_converter >/dev/null 2>&1 || [ -f "$HOME/.padic_config" ]; then
  echo "Old p-adic files found. Removing them first."
else
  echo "No old p-adic command found. Continuing with a fresh install."
fi

sudo rm -f /usr/local/bin/smc-padic /usr/local/bin/padic_converter
rm -f "$HOME/.padic_config"

echo ""
echo "[2/4] Downloading source..."
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

echo ""
echo "[3/4] Preparing installer..."
unzip -o p-adic-main2.zip >/dev/null
cd p-adic-main2.0/p_adic_pro

echo ""
echo "[4/4] Building and installing..."
bash install.sh

echo "Done. Open a new terminal and run: smc-padic"
read -r -p "Press Enter to close..."
