@echo off
REM Inventory Management System - Backend Setup Script (Windows)

echo ================================================
echo   Inventory Management System - Backend Setup
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js v16 or higher.
    echo   Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo + Node.js is installed
node --version

echo.
echo Step 1: Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo + Dependencies installed
echo.

REM Check if .env exists
if not exist .env (
    echo Step 2: Creating .env file...
    copy .env.example .env
    echo + .env file created
    echo   ! Please edit .env if you need custom configuration
) else (
    echo + .env file already exists
)

echo.
set /p SEED="Step 3: Do you want to seed the database with sample data? (y/n): "
if /i "%SEED%"=="y" (
    echo Seeding database...
    call npm run seed
    if %ERRORLEVEL% EQU 0 (
        echo + Database seeded successfully
        echo.
        echo   Default credentials:
        echo   - Admin:  username=admin,  password=admin123
        echo   - Editor: username=editor, password=editor123
        echo   - Viewer: username=viewer, password=viewer123
    ) else (
        echo X Failed to seed database
        echo   Make sure MongoDB is running
    )
)

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo To start the server:
echo   Development mode: npm run dev
echo   Production mode:  npm start
echo.
echo Server will run at: http://localhost:5000
echo.
echo API Documentation: See API_DOCUMENTATION.md
echo Quick Start Guide: See QUICKSTART.md
echo ================================================
echo.
pause
