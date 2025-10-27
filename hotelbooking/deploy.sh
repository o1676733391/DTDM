#!/bin/bash

# Hotel Booking Deployment Script

echo "🚀 Starting Hotel Booking Deployment to Vercel..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI is not installed${NC}"
        echo "Please install it with: npm i -g vercel"
        exit 1
    fi
    echo -e "${GREEN}✅ Vercel CLI is installed${NC}"
}

# Deploy server
deploy_server() {
    echo -e "${BLUE}📡 Deploying Server...${NC}"
    cd "HotelBooking-server/server"
    
    echo "Installing dependencies..."
    npm install
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Server deployed successfully!${NC}"
    else
        echo -e "${RED}❌ Server deployment failed${NC}"
        exit 1
    fi
    
    cd ../..
}

# Deploy client
deploy_client() {
    echo -e "${BLUE}🎨 Deploying Client...${NC}"
    cd "HotelBooking-main/client"
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building project..."
    npm run build
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Client deployed successfully!${NC}"
    else
        echo -e "${RED}❌ Client deployment failed${NC}"
        exit 1
    fi
    
    cd ../..
}

# Main execution
main() {
    check_vercel_cli
    
    echo "Which would you like to deploy?"
    echo "1) Server only"
    echo "2) Client only" 
    echo "3) Both (recommended)"
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            deploy_server
            ;;
        2)
            deploy_client
            ;;
        3)
            deploy_server
            deploy_client
            ;;
        *)
            echo -e "${RED}Invalid choice. Please run the script again.${NC}"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}🎉 Deployment completed!${NC}"
    echo -e "${BLUE}📝 Don't forget to:${NC}"
    echo "1. Set environment variables in Vercel dashboard"
    echo "2. Update VITE_API_URL in client with server URL"
    echo "3. Test your deployed applications"
}

main
