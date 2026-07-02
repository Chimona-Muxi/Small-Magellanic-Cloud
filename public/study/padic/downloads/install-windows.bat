@echo off
setlocal

set "REPO_ZIP=https://github.com/Chimona-Muxi/p-adic/archive/refs/heads/main2.0.zip"
set "WORK_DIR=%TEMP%\smc-padic-install"
set "DEFAULT_INSTALL_DIR=C:\p-adic"

echo Installing or reinstalling p-adic Converter from main2.0...
echo.
echo [1/4] Checking for old installation...
where smc-padic >nul 2>&1
if not errorlevel 1 echo Old smc-padic command found in PATH.
where padic_converter >nul 2>&1
if not errorlevel 1 echo Old padic_converter command found in PATH.
if exist "%DEFAULT_INSTALL_DIR%" (
  echo Removing old default installation directory: %DEFAULT_INSTALL_DIR%
  rmdir /s /q "%DEFAULT_INSTALL_DIR%"
)
if exist "%USERPROFILE%\.padic_config" del /f /q "%USERPROFILE%\.padic_config"

echo.
echo [2/4] Downloading source...
if exist "%WORK_DIR%" rmdir /s /q "%WORK_DIR%"
mkdir "%WORK_DIR%"
cd /d "%WORK_DIR%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%REPO_ZIP%' -OutFile 'p-adic-main2.zip'; Expand-Archive -Force 'p-adic-main2.zip' '.'"
if errorlevel 1 (
  echo Download or extraction failed.
  pause
  exit /b 1
)

echo.
echo [3/4] Running project installer...
cd /d "%WORK_DIR%\p-adic-main2.0\p_adic_pro"
call install.bat

echo.
echo [4/4] Finished.
echo Done. Restart Command Prompt and run: smc-padic
pause
