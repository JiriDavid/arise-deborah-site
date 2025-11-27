# LiveKit Video Calling Setup Guide

## 🚨 IMPORTANT: Admin Access Issue Fixed

**Temporary admin access is enabled for testing.** You can now access `/admin/prayer-rooms` to create prayer rooms.

## 🔧 Production Setup: Admin Roles in Clerk

### Step 1: Access Clerk Dashboard

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your project

### Step 2: Set Admin Role for Users

1. Go to **Users** in the sidebar
2. Click on your user account
3. Scroll to **Public Metadata**
4. Add one of these JSON structures:

**Option A: Using role field**

```json
{
  "role": "admin"
}
```

**Option B: Using isAdmin flag**

```json
{
  "isAdmin": true
}
```

### Step 3: Save Changes

- Click **Save** to update the user metadata
- The user will now have admin access

### Step 4: Disable Temporary Access

Once admin roles are set up, disable temporary access:

1. **In `app/admin/layout.js`:**

   ```javascript
   const tempAllowAccess = false; // Change from true to false
   ```

2. **In `app/api/prayer-rooms/route.js`:**

   ```javascript
   const tempAllowAccess = false; // Change from true to false
   ```

3. **Remove debug info from `app/admin/prayer-rooms/page.js`:**
   - Delete the debug info div that shows user metadata

## Prerequisites

1. **LiveKit Account**: Sign up at [livekit.io](https://livekit.io) and create a project
2. **Server URL**: Get your LiveKit server URL (usually `wss://your-project.livekit.cloud`)
3. **API Keys**: Generate API Key and Secret from your LiveKit dashboard

## Environment Variables

Add these to your `.env` file:

```env
# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

## Features Implemented

### ✅ **Prayer Rooms Management**

- **Frontend**: `/prayer-rooms` - View all prayer rooms
- **Admin**: `/admin/prayer-rooms` - Create new prayer rooms
- **Video Calls**: `/prayer-rooms/[id]` - Join video sessions

### ✅ **Video Calling Features**

- **Zoom-like Interface**: Video conference with participant grid
- **Chat**: Real-time messaging during calls
- **Controls**: Mute/unmute, camera on/off, screen share
- **Participant Management**: See who's in the room

### ✅ **Admin Features**

- Create prayer rooms with title, description, date/time
- Set maximum participants
- Start sessions immediately
- View all prayer rooms in dashboard

### ✅ **User Features**

- Browse available prayer rooms
- Join with one click
- Real-time status updates (scheduled/live/ended)
- Authentication required via Clerk

## Database Schema

### PrayerRoom Model

```javascript
{
  title: String,
  description: String,
  date: Date,
  scheduledStartTime: String,
  scheduledEndTime: String,
  roomId: String (unique),
  isActive: Boolean,
  createdBy: String (Clerk user ID),
  participants: Array,
  maxParticipants: Number,
  tags: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- `GET /api/prayer-rooms` - List all rooms
- `POST /api/prayer-rooms` - Create room (admin)
- `GET /api/prayer-rooms/[id]` - Get room details
- `PUT /api/prayer-rooms/[id]` - Update room (admin)
- `DELETE /api/prayer-rooms/[id]` - Delete room (admin)
- `POST /api/prayer-rooms/[id]/join` - Generate LiveKit token

## Navigation Updates

- Added "Prayer Rooms" to main navigation
- Added "Prayer Rooms" to footer links
- Added prayer rooms management to admin dashboard

## Security

- Admin-only room creation/updates via Clerk roles
- Authentication required for joining rooms
- LiveKit token generation with room-specific permissions

## Next Steps

1. **Set up LiveKit account** and add credentials to `.env`
2. **Test the video calling** by creating a prayer room and joining
3. **Customize UI** styling to match your brand
4. **Add room recording** if needed (LiveKit Pro feature)
5. **Implement room moderation** features if required

## 🐛 Troubleshooting

**Can't access admin page:**

- Check if user has admin role in Clerk metadata
- Verify temporary access is enabled for testing
- Check browser console for redirect errors

**Video not working:**

- Check LiveKit credentials in `.env`
- Ensure WebSocket URL is correct
- Check browser console for WebRTC errors
- Verify HTTPS is enabled (required for LiveKit)

**API errors:**

- Verify MongoDB connection
- Check server logs for detailed error messages
- Ensure all environment variables are set

**Debug Info:**

- The admin prayer rooms page shows current user metadata
- Check the debug panel for role information
