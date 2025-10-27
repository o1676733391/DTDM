# 🚀 Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`

## 📱 Client Deployment (Frontend)

### Step 1: Navigate to Client Directory
```bash
cd "d:\New folder (2)\hotelbooking\HotelBooking-main\client"
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Set Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard and add these environment variables:

- `VITE_SUPABASE_URL` = `https://thlqyxugdykoactsbttt.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
- `VITE_CLERK_PUBLISHABLE_KEY` = `your_clerk_publishable_key`
- `VITE_API_URL` = `https://your-server-domain.vercel.app/api` (set this after server deployment)

## 🖥️ Server Deployment (Backend)

### Step 1: Navigate to Server Directory  
```bash
cd "d:\New folder (2)\hotelbooking\HotelBooking-server\server"
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Set Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard and add these environment variables:

- `SUPABASE_URL` = `https://thlqyxugdykoactsbttt.supabase.co`
- `SUPABASE_ANON_KEY` = `your_supabase_anon_key`
- `CLERK_PUBLISHABLE_KEY` = `your_clerk_publishable_key`
- `CLERK_SECRET_KEY` = `your_clerk_secret_key`
- `NODE_ENV` = `production`

## 🔄 Update Client with Server URL

After server deployment, update the client's `VITE_API_URL` environment variable with your server's Vercel URL.

## 📋 Quick Deployment Commands

### Deploy Client:
```bash
cd "d:\New folder (2)\hotelbooking\HotelBooking-main\client"
vercel --prod
```

### Deploy Server:
```bash
cd "d:\New folder (2)\hotelbooking\HotelBooking-server\server" 
vercel --prod
```

## 🔧 Important Notes

1. **Environment Variables**: Make sure all environment variables are set in Vercel dashboard
2. **CORS**: Server is already configured for CORS
3. **Build**: Client uses Vite build, server uses Node.js runtime
4. **Domain**: You'll get `.vercel.app` domains for both deployments
5. **Custom Domains**: You can add custom domains in Vercel dashboard if needed

## 🐛 Troubleshooting

- If client build fails, check all environment variables are set
- If server deployment fails, ensure all dependencies are in `package.json`
- For CORS issues, update the server's CORS configuration with your client domain
- Check Vercel function logs for server errors
