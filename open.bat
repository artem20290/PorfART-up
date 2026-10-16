@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"

where python >nul 2>&1
if not %errorlevel%==0 (
  echo.
  echo  Python not found. Install from https://www.python.org/downloads/
  echo.
  pause
  exit /b 1
)

REM Keep gallery images in sync (Vite uses public/, this site serves images/)
if exist "public\images\projects\" (
  if not exist "images\projects\" mkdir "images\projects" >nul 2>&1
  xcopy "public\images\projects\*" "images\projects\" /Y /Q >nul
)

REM Kill anything already using 8765-8770
for /L %%P in (8765,1,8770) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)

set PORT=8765
echo.
echo  Folder: %CD%
echo  Server: http://127.0.0.1:!PORT!/
echo  Close this window to stop the server.
echo.
start "" "http://127.0.0.1:!PORT!/"
python "%~dp0serve.py" !PORT! 127.0.0.1
