# Vercel Environment Variables Setup Guide

## Problem
Your deployed application is getting 401 errors because the environment variables are not properly configured in Vercel.

## Solution

### 1. Client Environment Variables (Frontend)
You need to add these environment variables in your Vercel dashboard for the CLIENT deployment:

**Go to:** Vercel Dashboard → Your Client Project → Settings → Environment Variables

Add these variables:

```
VITE_SUPABASE_URL = https://thlqyxugdykoactsbttt.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRobHF5eHVnZHlrb2FjdHNidHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzM1MzQsImV4cCI6MjA3NzEwOTUzNH0.dUGeTTm84iEMNR0qVJvtzL8I_mGxtakyUg8-YFN5OYg
VITE_CLERK_PUBLISHABLE_KEY = pk_test_Y2FyZWZ1bC10dW5hLTEzLmNsZXJrLmFjY291bnRzLmRldiQ
VITE_API_URL = https://YOUR_SERVER_DEPLOYMENT_URL.vercel.app/api
```

**IMPORTANT:** Replace `YOUR_SERVER_DEPLOYMENT_URL` with the actual URL of your deployed server.

### 2. Server Environment Variables (Backend)
You need to add these environment variables in your Vercel dashboard for the SERVER deployment:

**Go to:** Vercel Dashboard → Your Server Project → Settings → Environment Variables

Add these variables:

```
SUPABASE_URL = https://thlqyxugdykoactsbttt.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRobHF5eHVnZHlrb2FjdHNidHR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUzMzUzNCwiZXhwIjoyMDc3MTA5NTM0fQ.yllwBFBUMLk4TLIHpAUpWpopsNxf_A3GxkqsDLsEYvU
CLERK_PUBLISHABLE_KEY = pk_test_Y2FyZWZ1bC10dW5hLTEzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY = YOUR_CLERK_SECRET_KEY_HERE
```

### 3. Steps to Fix:

1. **Deploy Server First:**
   - Go to Vercel
   - Deploy your `HotelBooking-server/server` folder as a new project
   - Note the deployment URL (e.g., `https://hotel-booking-server-abc123.vercel.app`)

2. **Update Client API URL:**
   - Update the client's `VITE_API_URL` to point to your deployed server
   - Redeploy the client

3. **Set Environment Variables:**
   - Add all the variables listed above in their respective Vercel projects

4. **Redeploy Both Projects:**
   - After setting environment variables, trigger a new deployment for both projects

### 4. Quick Fix for Current Issue:
The immediate issue is that your client is trying to connect to `localhost:3000` in production. We need to:

1. Deploy the server separately
2. Update the client's API URL
3. Set proper environment variables

### 5. Verification:
After fixing:
- Check that both deployments work
- Test the room loading functionality
- Verify authentication works properly

## Next Steps:
1. Deploy server to Vercel
2. Update client environment variables
3. Redeploy client with correct API URL
4. Test the complete application
