# Supabase Storage Setup Guide

## Creating and Configuring Storage Bucket

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Set bucket name as: `hotel-images`
5. Set the bucket to **Public** (for serving images directly)
6. Click **Save**

### 2. Configure Bucket Policies

To allow public access for image serving, you need to set up proper RLS policies:

```sql
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hotel-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'hotel-images' AND auth.role() = 'authenticated');
```

### 3. Environment Variables

Make sure your `.env` file includes:

```env
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### 4. Folder Structure

The application will create images in the following structure:
```
hotel-images/
  └── room-images/
      ├── uuid1.jpg
      ├── uuid2.png
      └── ...
```

### 5. Image URLs

Images will be accessible via public URLs like:
```
https://your-project-ref.supabase.co/storage/v1/object/public/hotel-images/room-images/uuid.jpg
```

## Benefits of Supabase Storage

- **Integrated**: Works seamlessly with your PostgreSQL database
- **CDN**: Built-in CDN for fast image delivery
- **Scalable**: Auto-scaling storage
- **Secure**: Row Level Security (RLS) policies
- **Cost-effective**: Competitive pricing
- **Real-time**: Real-time file uploads and updates

## Migration from Cloudinary

If you have existing images in Cloudinary:

1. Download all images from Cloudinary
2. Upload them to Supabase Storage using the migration script
3. Update database URLs to point to Supabase Storage URLs

## Supported File Types

Supabase Storage supports all common image formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- SVG (.svg)
