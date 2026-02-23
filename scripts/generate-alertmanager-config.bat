@echo off
REM Tao file alertmanager.yml tu template
REM Chay: scripts\generate-alertmanager-config.bat
REM Can: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SMTP_USER, SMTP_PASSWORD, ALERT_EMAIL

set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
set TEMPLATE=%PROJECT_ROOT%\monitoring\alertmanager.yml.template
set OUTPUT=%PROJECT_ROOT%\monitoring\alertmanager.yml

if not exist "%TEMPLATE%" (
    echo Error: Template not found: %TEMPLATE%
    exit /b 1
)

REM Load .env neu co
if exist "%PROJECT_ROOT%\.env" (
    for /f "usebackq tokens=*" %%a in ("%PROJECT_ROOT%\.env") do (
        set "line=%%a"
        if not "!line:~0,1!"=="#" (
            set "%%a"
        )
    )
)

REM Windows khong co envsubst - su dung PowerShell
powershell -Command "$t = Get-Content '%TEMPLATE%' -Raw; $t = $t -replace '\$\{ALERT_EMAIL:-[^}]+\}', '%ALERT_EMAIL%'; $t = $t -replace '\$\{ALERT_FROM:-[^}]+\}', '%ALERT_FROM%'; $t = $t -replace '\$\{SMTP_HOST:-[^}]+\}', '%SMTP_HOST%'; $t = $t -replace '\$\{SMTP_PORT:-[^}]+\}', '%SMTP_PORT%'; $t = $t -replace '\$\{SMTP_USER\}', '%SMTP_USER%'; $t = $t -replace '\$\{SMTP_PASSWORD\}', '%SMTP_PASSWORD%'; $t = $t -replace '\$\{TELEGRAM_BOT_TOKEN\}', '%TELEGRAM_BOT_TOKEN%'; $t = $t -replace '\$\{TELEGRAM_CHAT_ID\}', '%TELEGRAM_CHAT_ID%'; $t | Set-Content '%OUTPUT%'"
echo Generated: %OUTPUT%

