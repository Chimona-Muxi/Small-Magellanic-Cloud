#!/usr/bin/env bash
set -euo pipefail

REPO_ZIP="https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
WORK_DIR="${TMPDIR:-/tmp}/smc-padic-install"

echo "Installing p-adic Converter from main2.0..."
if ! xcode-select -p >/dev/null 2>&1; then
  echo "Command Line Tools are required. macOS may open the installer now."
  xcode-select --install || true
  echo "After Command Line Tools finish installing, run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"
curl -L "$REPO_ZIP" -o p-adic-main2.zip
unzip -o p-adic-main2.zip >/dev/null
cd p-adic-main2.0/p_adic_pro
bash install.sh

echo "Done. Open a new terminal and run: smc-padic"
read -r -p "Press Enter to close..."
