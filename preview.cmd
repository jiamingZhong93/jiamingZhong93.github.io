@echo off
setlocal
cd /d "%~dp0"
set "PREVIEW_NODE=node"
"%PREVIEW_NODE%" -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>20||(major===20&&minor>=19)?0:1)" >nul 2>nul
if not errorlevel 1 goto run
set "PREVIEW_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%PREVIEW_NODE%" -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>20||(major===20&&minor>=19)?0:1)" >nul 2>nul
if not errorlevel 1 goto run
echo Install Node.js 20.19 or newer with npm, then run preview.cmd again.
exit /b 1
:run
"%PREVIEW_NODE%" "%~dp0scripts\preview.cjs" %*
exit /b %errorlevel%
