# app/schemas/analytics.py

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class InfluencerGrowthData(BaseModel):
    """Schema for monthly influencer growth data"""
    month: str
    month_number: int = Field(..., ge=1, le=12)
    followers: int = Field(default=0, ge=0)
    engagement_rate: float = Field(default=0.0, ge=0.0, le=100.0)
    
    class Config:
        from_attributes = True

class InfluencerRevenueData(BaseModel):
    """Schema for monthly influencer revenue data"""
    month: str
    month_number: int = Field(..., ge=1, le=12)
    revenue: float = Field(default=0.0, ge=0.0)
    campaigns_completed: int = Field(default=0, ge=0)
    
    class Config:
        from_attributes = True

class InfluencerUserGrowthResponse(BaseModel):
    """Response schema for influencer user growth analytics"""
    success: bool = True
    year: int
    data: List[InfluencerGrowthData]
    
    class Config:
        from_attributes = True

class InfluencerRevenueGrowthResponse(BaseModel):
    """Response schema for influencer revenue growth analytics"""
    success: bool = True
    year: int
    data: List[InfluencerRevenueData]
    
    class Config:
        from_attributes = True

class InfluencerAnalyticsCreate(BaseModel):
    """Schema for creating influencer analytics records"""
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020, le=2030)
    total_followers: Optional[int] = Field(default=0, ge=0)
    instagram_followers: Optional[int] = Field(default=0, ge=0)
    youtube_subscribers: Optional[int] = Field(default=0, ge=0)
    tiktok_followers: Optional[int] = Field(default=0, ge=0)
    average_engagement_rate: Optional[float] = Field(default=0.0, ge=0.0, le=100.0)
    monthly_revenue: Optional[float] = Field(default=0.0, ge=0.0)
    campaigns_completed: Optional[int] = Field(default=0, ge=0)
    campaigns_active: Optional[int] = Field(default=0, ge=0)

class InfluencerAnalyticsUpdate(BaseModel):
    """Schema for updating influencer analytics records"""
    total_followers: Optional[int] = Field(None, ge=0)
    instagram_followers: Optional[int] = Field(None, ge=0)
    youtube_subscribers: Optional[int] = Field(None, ge=0)
    tiktok_followers: Optional[int] = Field(None, ge=0)
    average_engagement_rate: Optional[float] = Field(None, ge=0.0, le=100.0)
    monthly_revenue: Optional[float] = Field(None, ge=0.0)
    campaigns_completed: Optional[int] = Field(None, ge=0)
    campaigns_active: Optional[int] = Field(None, ge=0)

class InfluencerAnalyticsResponse(BaseModel):
    """Response schema for influencer analytics"""
    id: int
    influencer_id: int
    month: int
    year: int
    total_followers: int
    instagram_followers: int
    youtube_subscribers: int
    tiktok_followers: int
    average_engagement_rate: float
    monthly_revenue: float
    campaigns_completed: int
    campaigns_active: int
    recorded_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Password Reset Schemas
class ForgotPasswordRequest(BaseModel):
    """Schema for forgot password request"""
    email: str = Field(..., regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

class ForgotPasswordResponse(BaseModel):
    """Response schema for forgot password"""
    message: str
    success: bool = True

class ResetPasswordRequest(BaseModel):
    """Schema for password reset request"""
    token: str = Field(..., min_length=32)
    new_password: str = Field(..., min_length=8, max_length=128)

class ResetPasswordResponse(BaseModel):
    """Response schema for password reset"""
    message: str
    success: bool = True

class PasswordResetTokenResponse(BaseModel):
    """Response schema for password reset token info"""
    id: int
    user_id: int
    email: str
    expires_at: datetime
    used: bool
    created_at: datetime
    
    class Config:
        from_attributes = True