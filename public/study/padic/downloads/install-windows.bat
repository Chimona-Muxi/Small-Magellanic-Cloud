@echo off
setlocal

set "REPO_ZIP=https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
set "WORK_DIR=%TEMP%\smc-padic-install"

echo Installing p-adic Converter from main2.0...
if exist "%WORK_DIR%" rmdir /s /q "%WORK_DIR%"
mkdir "%WORK_DIR%"
cd /d "%WORK_DIR%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%REPO_ZIP%' -OutFile 'p-adic-main2.zip'; Expand-Archive -Force 'p-adic-main2.zip' '.'"
if errorlevel 1 (
  echo Download or extraction failed.
  pause
  exit /b 1
)

cd /d "%WORK_DIR%\p-adic-main2.0\p_adic_pro"
call install.bat

echo Done. Restart Command Prompt and run: smc-padic
pause
