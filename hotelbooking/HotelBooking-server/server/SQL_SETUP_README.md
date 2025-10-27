# 🗄️ Supabase SQL Setup Guide

## 📋 Quick Setup Instructions

### Step 1: Create Tables
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content from `01_create_tables.sql`
4. Click **Run** to create all tables, indexes, and policies

### Step 2: Insert Sample Data
1. In the same SQL Editor
2. Copy and paste the content from `02_insert_sample_data.sql`
3. Click **Run** to populate tables with fake data

### Step 3: Test with Queries
1. Use queries from `03_test_queries.sql` to verify everything works
2. These queries help you understand the data structure

## 📊 Sample Data Overview

### Users (8 total)
- **4 Regular Users**: John Smith, Emma Johnson, David Wilson, James Miller
- **4 Hotel Owners**: Michael Brown, Sarah Davis, Lisa Garcia, Amanda Taylor

### Hotels (8 total)
- **New York**: Grand Plaza Hotel
- **Miami**: Ocean View Resort  
- **Denver**: Mountain Peak Lodge
- **San Francisco**: City Center Inn
- **Los Angeles**: Sunset Paradise Hotel
- **Boston**: Historic Downtown Hotel
- **Seattle**: Tech Valley Suites
- **Las Vegas**: Desert Oasis Resort

### Rooms (16 total)
- **2 rooms per hotel** with different types and prices
- **Price range**: $179.99 - $499.99 per night
- **Room types**: Standard, Deluxe, Suite, Cabin, Business, etc.
- **High-quality stock images** from Unsplash

### Bookings (8 total)
- **5 Confirmed bookings** (with revenue)
- **2 Pending bookings**
- **1 Cancelled booking**
- **Total confirmed revenue**: ~$6,329.79

## 🔧 Testing Your API

After running the SQL scripts, you can test these API endpoints:

### Get All Available Rooms
```bash
GET /api/rooms
```

### Get Hotel Owner's Rooms
```bash
GET /api/rooms/owner
# Headers: Authorization with Clerk token for hotel owner
```

### Create New Booking
```bash
POST /api/bookings/book
{
  "room": "room_uuid_here",
  "checkInDate": "2024-12-20",
  "checkOutDate": "2024-12-22", 
  "guests": 2
}
```

### Get User's Bookings
```bash
GET /api/bookings/user
# Headers: Authorization with Clerk token
```

### Get Hotel Dashboard Data
```bash
GET /api/bookings/hotel
# Headers: Authorization with Clerk token for hotel owner
```

## 🔍 Important Notes

1. **User IDs**: The sample users use Clerk-style IDs (`user_2abc123def456`)
2. **Images**: All room images use Unsplash URLs (800px wide, high quality)  
3. **RLS Policies**: Row Level Security is enabled - users can only see their own data
4. **Realistic Data**: Bookings include past, current, and future dates
5. **Revenue Tracking**: Confirmed bookings generate revenue for hotel owners

## 🚀 Next Steps

1. **Create Storage Bucket**: Create `hotel-images` bucket in Supabase Storage
2. **Test Clerk Integration**: Make sure your Clerk webhook creates users properly
3. **Test File Uploads**: Try uploading room images via your API
4. **Verify RLS**: Test that users can only access their own data

## 🔑 Sample Clerk User IDs for Testing

When testing with Clerk authentication, you can use these sample user IDs:

- **Regular User**: `user_2abc123def456` (John Smith)
- **Hotel Owner**: `user_2ghi789jkl012` (Michael Brown - owns Grand Plaza Hotel & Desert Oasis Resort)
- **Hotel Owner**: `user_2jkl012mno345` (Sarah Davis - owns Mountain Peak Lodge & City Center Inn)

Your hotel booking system is now ready with realistic sample data! 🎉
