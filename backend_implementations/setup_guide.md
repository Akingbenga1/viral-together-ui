# Backend Implementation Setup Guide

## 📋 Files to Add to Your Viral Together Backend Repository

### 1. **Database Models**
- Copy `models/analytics.py` to `app/db/models/analytics.py`

### 2. **Schemas** 
- Copy `schemas/analytics.py` to `app/schemas/analytics.py`

### 3. **Services**
- Copy `services/analytics_service.py` to `app/services/analytics_service.py`
- Copy `services/password_reset_service.py` to `app/services/password_reset_service.py`
- Copy `services/email_service.py` to `app/services/email_service.py`

### 4. **API Endpoints**
- Copy `api/analytics.py` to `app/api/analytics.py`
- Copy `api/auth_password_reset.py` to `app/api/auth_password_reset.py`

### 5. **Database Migration**
- Copy `alembic_migration.py` content to a new migration file in `alembic/versions/`
- Name it: `YYYYMMDD_HHMMSS_add_analytics_and_password_reset.py`

## 🔧 Setup Instructions

### Step 1: Install Dependencies
```bash
# If using additional email packages (optional)
pip install emails jinja2
```

### Step 2: Environment Variables
Add these to your `.env` file:
```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@viraltogether.com
FROM_NAME=Viral Together

# Frontend URL for password reset links
FRONTEND_URL=http://localhost:3000
```

### Step 3: Update Existing Models
Add the relationships specified in `model_updates.py` to your existing model files:

**In `app/db/models/influencers.py`:**
```python
# Add to Influencer class
analytics = relationship("InfluencerAnalytics", back_populates="influencer", cascade="all, delete-orphan")
growth_metrics = relationship("InfluencerGrowthMetrics", back_populates="influencer", cascade="all, delete-orphan")
```

**In `app/db/models/users.py`:**
```python
# Add to User class  
password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
```

### Step 4: Update Imports
**In `app/db/models/__init__.py`:**
```python
from .analytics import InfluencerAnalytics, PasswordResetToken, InfluencerGrowthMetrics
```

### Step 5: Update Main Application
**In `app/main.py`:**
```python
from app.api import analytics, auth_password_reset

# Add to your router includes
app.include_router(analytics.router)
app.include_router(auth_password_reset.router)
```

### Step 6: Run Database Migration
```bash
# Generate migration (if using alembic auto-generate)
alembic revision --autogenerate -m "Add analytics and password reset functionality"

# Or copy the provided migration file and run:
alembic upgrade head
```

### Step 7: Test the Implementation
Use the provided test script or test manually with the API endpoints.

## 📊 New API Endpoints Added

### **Influencer Analytics Endpoints:**
- `GET /api/analytics/influencer/{id}/user-growth-by-month` - Monthly user growth data
- `GET /api/analytics/influencer/{id}/revenue-growth-by-month` - Monthly revenue growth data  
- `POST /api/analytics/influencer/{id}/analytics` - Create/update monthly analytics
- `PUT /api/analytics/influencer/{id}/analytics/{month}/{year}` - Update specific month
- `GET /api/analytics/influencer/{id}/summary` - Get analytics summary
- `POST /api/analytics/influencer/{id}/record-campaign` - Record campaign completion
- `PUT /api/analytics/influencer/{id}/followers` - Update follower counts
- `GET /api/analytics/top-performers` - Get top performing influencers (admin)
- `GET /api/analytics/platform-summary` - Platform analytics summary (admin)

### **Password Reset Endpoints:**
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/validate-reset-token/{token}` - Validate reset token
- `GET /auth/admin/password-reset-tokens` - View all tokens (admin)
- `DELETE /auth/admin/cleanup-expired-tokens` - Cleanup expired tokens (admin)

## 🔒 Security Features

### **Password Reset Security:**
- Tokens expire after 1 hour
- Tokens are single-use only
- Secure random token generation
- Email verification required
- Old tokens invalidated when new ones are created
- No user enumeration (same response regardless of email existence)

### **Analytics Security:**
- Users can only access their own analytics
- Admin users can access all analytics
- Proper input validation and sanitization
- Rate limiting should be implemented at the FastAPI level

## 📧 Email Configuration

### **Gmail Setup (Recommended for Development):**
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" in your Google Account settings
3. Use your Gmail address as `SMTP_USERNAME`
4. Use the app password as `SMTP_PASSWORD`

### **Production Email Services:**
- **SendGrid**: Professional email service with high deliverability
- **Amazon SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly with good APIs
- **Postmark**: Excellent for transactional emails

## 🧪 Testing

After implementation, test these endpoints:

```bash
# Test forgot password
curl -X POST "http://localhost:8000/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test analytics (requires authentication token)
curl -X GET "http://localhost:8000/api/analytics/influencer/1/user-growth-by-month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Deployment Notes

### **Environment Variables for Production:**
- Set `FRONTEND_URL` to your production domain
- Configure production email service credentials
- Ensure database connections are properly configured
- Set up proper logging for email failures

### **Background Task Configuration:**
- The password reset emails are sent as background tasks
- Consider setting up a proper job queue (Celery, RQ) for production
- Monitor email delivery success rates

### **Security Considerations:**
- Implement rate limiting on password reset endpoints
- Monitor for abuse (multiple reset requests)
- Set up proper logging and monitoring
- Consider implementing CAPTCHA for password reset requests

## 📈 Monitoring

Monitor these metrics:
- Password reset request frequency
- Email delivery success rates
- Analytics data collection completeness
- API endpoint response times
- Error rates for new endpoints

The implementation is now ready for integration into your viral-together backend repository!