# Additions to app/main.py - Add these imports and router includes

from app.api import analytics, auth_password_reset

# Add these lines to your existing FastAPI app setup:

# Include the new routers
app.include_router(analytics.router)
app.include_router(auth_password_reset.router)

# If you want to group them under /api prefix, use:
# app.include_router(analytics.router, prefix="/api")
# app.include_router(auth_password_reset.router, prefix="/api")

"""
Your main.py should look something like this after adding the new routes:

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    auth, 
    influencer, 
    business, 
    rate_card, 
    subscription,
    analytics,           # <- NEW
    auth_password_reset  # <- NEW
)

app = FastAPI(title="Viral Together API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(influencer.router)
app.include_router(business.router)
app.include_router(rate_card.router)
app.include_router(subscription.router)
app.include_router(analytics.router)           # <- NEW
app.include_router(auth_password_reset.router) # <- NEW

@app.get("/")
async def root():
    return {"message": "Viral Together API is running!"}
"""