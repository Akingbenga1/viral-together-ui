# Model relationship updates - Add these to your existing model files

"""
Add these relationships to your existing models:

1. In app/db/models/influencers.py - Add to Influencer model:
"""

# Add this import at the top
from sqlalchemy.orm import relationship

# Add these relationships to the Influencer class:
class Influencer(Base):
    # ... existing fields ...
    
    # NEW RELATIONSHIPS
    analytics = relationship("InfluencerAnalytics", back_populates="influencer", cascade="all, delete-orphan")
    growth_metrics = relationship("InfluencerGrowthMetrics", back_populates="influencer", cascade="all, delete-orphan")

"""
2. In app/db/models/users.py - Add to User model:
"""

# Add this relationship to the User class:
class User(Base):
    # ... existing fields ...
    
    # NEW RELATIONSHIP
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")

"""
3. Environment Variables - Add these to your .env file or environment configuration:
"""

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@viraltogether.com
FROM_NAME=Viral Together

# Frontend URL for password reset links
FRONTEND_URL=http://localhost:3000  # or https://your-production-domain.com

"""
4. Add imports to app/db/models/__init__.py:
"""

from .analytics import InfluencerAnalytics, PasswordResetToken, InfluencerGrowthMetrics

"""
5. Database Session Dependencies - Update app/core/dependencies.py if needed:
"""

# Make sure your get_db dependency is properly configured to handle the new models
# The existing dependency should work fine, but verify it includes all tables

"""
6. Requirements.txt additions - Add these packages if not already present:
"""

# Email functionality (if not using built-in smtplib)
# emails>=0.6.0
# jinja2>=3.1.0  # for email templating

"""
7. Background Tasks Configuration - Add to your main.py:
"""

from fastapi import BackgroundTasks

# The background tasks are already handled in the endpoints
# Just ensure your FastAPI app supports background tasks (it does by default)

"""
8. Database Initialization - Add to your database init script:
"""

# In your database initialization file (likely app/db/database.py or similar):
# Make sure the new models are imported and included in Base.metadata.create_all()

from app.db.models.analytics import InfluencerAnalytics, PasswordResetToken, InfluencerGrowthMetrics

# These should be automatically included when you run:
# Base.metadata.create_all(bind=engine)
# or when you run alembic migrations

"""
9. API Documentation Tags - Add to your OpenAPI config if you want organized docs:
"""

# In your FastAPI app configuration:
tags_metadata = [
    {
        "name": "analytics",
        "description": "Influencer analytics and performance tracking endpoints",
    },
    {
        "name": "authentication", 
        "description": "Authentication endpoints including password reset",
    },
    # ... other existing tags
]

app = FastAPI(
    title="Viral Together API",
    version="1.0.0",
    openapi_tags=tags_metadata
)