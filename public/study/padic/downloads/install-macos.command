#!/usr/bin/env bash
set -euo pipefail

REPO_ZIP="https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
WORK_DIR="${TMPDIR:-/tmp}/smc-padic-install"

echo "Installing or reinstalling p-adic Converter from main2.0..."
echo ""
echo "If macOS blocked this file before it opened, use Finder right-click > Open,"
echo "or run it from Terminal with: bash ~/Downloads/install-macos.command"
echo ""

if ! xcode-select -p >/dev/null 2>&1; then
  echo "Command Line Tools are required. macOS may open the installer now."
  xcode-select --install || true
  echo "After Command Line Tools finish installing, run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

echo "[1/4] Requesting administrator authorization..."
sudo -v

echo ""
echo "[2/4] Checking for old installation..."
if command -v smc-padic >/dev/null 2>&1 || command -v padic_converter >/dev/null 2>&1 || [ -f "$HOME/.padic_config" ]; then
  echo "Old p-adic files found. Removing them first."
else
  echo "No old p-adic command found. Continuing with a fresh install."
fi

sudo rm -f /usr/local/bin/smc-padic /usr/local/bin/padic_converter
rm -f "$HOME/.padic_config"

echo ""
echo "[3/4] Downloading source..."
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"
curl -L "$REPO_ZIP" -o p-adic-main2.zip
unzip -o p-adic-main2.zip >/dev/null
cd p-adic-main2.0/p_adic_pro

echo ""
echo "[4/4] Building and installing..."
bash install.sh

echo "Done. Open a new terminal and run: smc-padic"
read -r -p "Press Enter to close..."
