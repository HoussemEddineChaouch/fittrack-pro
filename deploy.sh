#!/bin/bash

# FitTrack Pro — Automated Deploy Script
# Usage: bash deploy.sh

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "============== FitTrack Pro — Automated Deployment =============="
echo -e "${NC}"

# ── Step 1: Check requirements ──
echo -e "${YELLOW}[1/6] Checking requirements...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose found${NC}"

# ── Step 2: Check Docker is running ──
echo -e "${YELLOW}[2/6] Checking Docker daemon...${NC}"

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker daemon is running${NC}"

# ── Step 3: Stop existing containers ──
echo -e "${YELLOW}[3/6] Stopping existing containers...${NC}"

docker-compose down --remove-orphans 2>/dev/null || true

echo -e "${GREEN}✅ Old containers stopped${NC}"

# ── Step 4: Build images ──
echo -e "${YELLOW}[4/6] Building Docker images...${NC}"

docker-compose build --no-cache

echo -e "${GREEN}✅ Images built successfully${NC}"

# ── Step 5: Start containers ──
echo -e "${YELLOW}[5/6] Starting containers...${NC}"

docker-compose up -d

echo -e "${GREEN}✅ Containers started${NC}"

# ── Step 6: Health check ──
echo -e "${YELLOW}[6/6] Running health checks...${NC}"

sleep 5  # Wait for services to start

# Check backend health
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Backend health check failed (HTTP $BACKEND_STATUS)${NC}"
    echo -e "${YELLOW}Check logs: docker-compose logs backend${NC}"
    exit 1
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is healthy (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Frontend health check failed (HTTP $FRONTEND_STATUS)${NC}"
    echo -e "${YELLOW}Check logs: docker-compose logs frontend${NC}"
    exit 1
fi

# ── Done ──
echo ""
echo -e "${GREEN}"
echo "================================================"
echo "   ✅ Deployment Successful!"
echo "================================================"
echo -e "${NC}"
echo -e "  🌐 Frontend : ${BLUE}http://localhost:3000${NC}"
echo -e "  🔧 Backend  : ${BLUE}http://localhost:8000${NC}"
echo -e "  📚 API Docs : ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  docker-compose logs -f        → Live logs"
echo "  docker-compose down           → Stop all"
echo "  docker ps                     → Running containers"
echo ""