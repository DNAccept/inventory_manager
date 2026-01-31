#!/bin/bash

# Inventory Management System - Backend Setup Script
# This script automates the setup process

echo "================================================"
echo "  Inventory Management System - Backend Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB: https://www.mongodb.com/try/download/community"
    echo "   Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB found"
fi

echo ""
echo "Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "Step 2: Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "   ⚠️  Please edit .env if you need custom configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "Step 3: Checking MongoDB connection..."

# Try to connect to MongoDB
if command -v mongosh &> /dev/null; then
    mongosh --eval "db.version()" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Please start MongoDB before seeding the database"
    fi
elif command -v mongo &> /dev/null; then
    mongo --eval "db.version()" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Please start MongoDB before seeding the database"
    fi
fi

echo ""
read -p "Step 4: Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npm run seed
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
        echo ""
        echo "   Default credentials:"
        echo "   - Admin:  username=admin,  password=admin123"
        echo "   - Editor: username=editor, password=editor123"
        echo "   - Viewer: username=viewer, password=viewer123"
    else
        echo "❌ Failed to seed database"
        echo "   Make sure MongoDB is running"
    fi
fi

echo ""
echo "================================================"
echo "  🎉 Setup Complete!"
echo "================================================"
echo ""
echo "To start the server:"
echo "  Development mode: npm run dev"
echo "  Production mode:  npm start"
echo ""
echo "Server will run at: http://localhost:5000"
echo ""
echo "API Documentation: See API_DOCUMENTATION.md"
echo "Quick Start Guide: See QUICKSTART.md"
echo "================================================"
