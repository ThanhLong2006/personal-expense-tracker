@echo off
echo Running Quan Ly Ca Nhan Backend...
echo Command: mvn spring-boot:run -Dspring-boot.run.profiles=localdocker
echo.

mvn spring-boot:run -Dspring-boot.run.profiles=localdocker

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Backend failed to start.
    pause
    exit /b %ERRORLEVEL%
)

pause
