@echo off
REM ============================================
REM NPM Security Audit Script (Windows)
REM ============================================
REM Script để kiểm tra và fix các lỗ hổng bảo mật trong npm packages

cd /d "%~dp0\..\frontend"

echo ============================================
echo NPM Security Audit
echo ============================================
echo.

echo 1. Running npm audit...
call npm audit --audit-level=moderate

echo.
echo 2. Checking for outdated packages...
call npm outdated

echo.
echo 3. Running npm audit fix (dry-run)...
echo Review the following suggestions:
call npm audit fix --dry-run

echo.
echo ============================================
echo Audit completed!
echo ============================================
echo.
echo To apply fixes automatically (use with caution):
echo   npm audit fix
echo.
echo To update packages manually:
echo   npm update
echo.

pause

