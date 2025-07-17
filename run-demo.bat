@echo off
echo ==========================================
echo   Telugu Two-Stage Translation Demo
echo ==========================================
echo.
echo Starting the Node.js server...
echo.
echo You can test the translation system in two ways:
echo.
echo 1. Main Application: http://localhost:3000
echo    - Full featured app with voice input
echo    - Text input and bulk translation
echo    - Two-stage translation system
echo.
echo 2. Test Page: http://localhost:3000/test-two-stage.html
echo    - Simple test interface
echo    - Compare Raw vs Enhanced translations
echo    - Direct comparison view
echo.
echo The difference between stages:
echo   Stage 1 (Raw): Complete, meaningful translation
echo   Stage 2 (Enhanced): Professional, polished version
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

node server.js