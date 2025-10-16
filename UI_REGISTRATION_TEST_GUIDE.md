# UI Influencer Registration Testing Guide

## Prerequisites

### 1. Backend Server Running
Ensure your backend API is running on `http://localhost:8000`:
```bash
cd C:\Users\user\projects\viral-together
# Start your backend server (uvicorn, gunicorn, etc.)
```

### 2. Frontend Dev Server Running
Start the Next.js development server:
```bash
cd C:\Users\user\projects\viral-together-ui
npm run dev
```

The UI should be available at `http://localhost:3000`

---

## Testing Steps

### Step 1: Navigate to Registration Page
1. Open browser: `http://localhost:3000/auth/register`
2. You should see three tabs: **User**, **Influencer**, **Business**
3. Click on the **Influencer** tab

### Step 2: Fill Account Information
In the "Account Information" section:
- **Username:** Enter a unique username (e.g., `testinfluencer001`)
- **Email:** Enter a valid email (e.g., `test@example.com`)
- **First Name:** Enter first name (e.g., `John`)
- **Last Name:** Enter last name (e.g., `Doe`)
- **Password:** Enter a password (min 6 characters)
- **Confirm Password:** Re-enter the same password
- **Bio:** Enter a brief bio describing yourself

### Step 3: Add Social Media Platforms (REQUIRED)
1. Click **"Add Platform"** button
2. For each platform:
   - **Platform:** Select from dropdown (Instagram, YouTube, TikTok, etc.)
   - **Handle/Channel ID:** Enter your handle (e.g., `@johndoe`)
3. Add at least ONE platform (required)
4. You can add multiple platforms

### Step 4: Set Base Location (REQUIRED)
1. Under "Base Location" section:
   - **Country:** Select your country from dropdown
   - **Map:** Click on the map to set your current location
   - You should see "Selected Location" details appear below the map
   - **Latitude and Longitude are REQUIRED**

### Step 5: Set Desired Location (OPTIONAL)
1. Under "Desired Location" section:
   - Click on the map to set where you want to work/expand
   - This is optional but recommended

### Step 6: Submit Form
1. Check the "I agree to Terms of Service and Privacy Policy" checkbox
2. Click **"Create influencer account"** button
3. Wait for the loading indicator

---

## Expected Results

### ✅ Success
If registration is successful, you should see:
1. A success toast message: **"Influencer profile created successfully! Please login to continue."**
2. Automatic redirect to login page after 2 seconds

### ❌ Possible Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Please add at least one social media platform" | No platforms added | Add at least one social media platform |
| "Please complete at least one social media platform..." | Platform or handle missing | Complete all fields for at least one platform |
| "Please select your base location on the map" | No base location selected | Click on the map to select your location |
| "This username is already taken..." | Username exists | Choose a different username |
| "This email address is already registered..." | Email exists | Use a different email or login |
| "Failed to load social media platforms" | Backend not running | Start the backend server |

---

## Verification Steps

### 1. Check Backend Logs
Look for successful creation logs in your backend console

### 2. Check Database Tables
Run these queries to verify data was saved:

```sql
-- Check influencer was created
SELECT * FROM influencers ORDER BY id DESC LIMIT 1;

-- Check social media accounts
SELECT * FROM influencer_social_media ORDER BY id DESC LIMIT 5;

-- Check locations
SELECT * FROM influencer_operational_locations ORDER BY id DESC LIMIT 5;

-- Check user and role
SELECT u.*, r.name as role_name 
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
LEFT JOIN roles r ON ur.role_id = r.id 
ORDER BY u.id DESC LIMIT 1;
```

### 3. Test Login
After successful registration:
1. Go to `http://localhost:3000/auth/login`
2. Login with the created username and password
3. You should be redirected to the appropriate dashboard

---

## Test Data Examples

### Minimal Test (Required Fields Only)
```
Username: testuser123
Email: test@example.com
First Name: Test
Last Name: User
Password: password123
Bio: Test influencer account

Social Media:
- Platform: Instagram
- Handle: @testuser123

Base Location:
- Click anywhere on the map (this will fill lat/lng)
```

### Full Test (All Fields)
```
Username: johndoe_creator
Email: johndoe@example.com
First Name: John
Last Name: Doe
Password: SecurePass123
Bio: Content creator focused on tech and lifestyle

Social Media:
- Platform: Instagram, Handle: @johndoe
- Platform: YouTube, Handle: JohnDoeVlogs
- Platform: TikTok, Handle: @johndoe_tt

Base Location:
- Country: United States
- Click on New York area on map

Desired Location:
- Click on Los Angeles area on map
```

---

## Troubleshooting

### Platform Dropdown Empty
**Problem:** Social media platforms not loading  
**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Test endpoint manually: `curl http://localhost:8000/social-media-platforms/list`
4. Ensure platforms exist in database

### Map Not Working
**Problem:** Map not responding to clicks  
**Solution:**
1. Check browser console for JavaScript errors
2. Ensure InteractiveMap component is loaded
3. Try clicking directly on the map canvas

### Form Not Submitting
**Problem:** Submit button doesn't work  
**Solution:**
1. Open browser DevTools → Console tab
2. Check for validation errors
3. Ensure all required fields are filled
4. Check Network tab for API call details

---

## Important Notes

1. **At least ONE social media platform is mandatory**
2. **Base location latitude/longitude is required**
3. **Password is optional in API but form requires it for UX**
4. **Username and email must be unique**
5. **Rate limiting: 3 registrations per hour per IP**

---

## Success Checklist

- [ ] Backend API running on port 8000
- [ ] Frontend UI running on port 3000
- [ ] Social media platforms loaded in dropdown
- [ ] Form filled with all required fields
- [ ] At least one social media platform added
- [ ] Base location selected on map
- [ ] Form submitted successfully
- [ ] Success toast message shown
- [ ] Redirected to login page
- [ ] Can login with created credentials
- [ ] Data verified in database tables

---

## Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check backend logs for API errors
3. Verify environment variables are set correctly
4. Ensure all migrations have been run
5. Check that social_media_platforms table has data

