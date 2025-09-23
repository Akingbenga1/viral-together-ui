# app/db/models/analytics.py

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class InfluencerAnalytics(Base):
    """Model to track influencer analytics over time"""
    __tablename__ = "influencer_analytics"

    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id", ondelete="CASCADE"), nullable=False)
    
    # Date tracking
    recorded_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    month = Column(Integer, nullable=False)  # 1-12
    year = Column(Integer, nullable=False)   # e.g., 2025
    
    # Social media metrics
    total_followers = Column(Integer, default=0)
    instagram_followers = Column(Integer, default=0)
    youtube_subscribers = Column(Integer, default=0)
    tiktok_followers = Column(Integer, default=0)
    twitter_followers = Column(Integer, default=0)
    
    # Engagement metrics
    average_engagement_rate = Column(Float, default=0.0)
    instagram_engagement_rate = Column(Float, default=0.0)
    youtube_engagement_rate = Column(Float, default=0.0)
    tiktok_engagement_rate = Column(Float, default=0.0)
    
    # Revenue metrics
    monthly_revenue = Column(Float, default=0.0)
    campaigns_completed = Column(Integer, default=0)
    campaigns_active = Column(Integer, default=0)
    average_campaign_value = Column(Float, default=0.0)
    
    # Performance metrics
    content_pieces_created = Column(Integer, default=0)
    total_views = Column(Integer, default=0)
    total_likes = Column(Integer, default=0)
    total_comments = Column(Integer, default=0)
    total_shares = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    influencer = relationship("Influencer", back_populates="analytics")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_influencer_analytics_date', 'influencer_id', 'year', 'month'),
        Index('idx_influencer_analytics_revenue', 'influencer_id', 'monthly_revenue'),
        Index('idx_influencer_analytics_followers', 'influencer_id', 'total_followers'),
    )

class PasswordResetToken(Base):
    """Model to store password reset tokens"""
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    
    # Token expiration (default 1 hour)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Integer, default=0)  # 0 = unused, 1 = used
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    used_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="password_reset_tokens")
    
    # Indexes
    __table_args__ = (
        Index('idx_password_reset_token', 'token'),
        Index('idx_password_reset_user_email', 'user_id', 'email'),
        Index('idx_password_reset_expires', 'expires_at'),
    )

class InfluencerGrowthMetrics(Base):
    """Model to track detailed growth metrics for influencers"""
    __tablename__ = "influencer_growth_metrics"

    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id", ondelete="CASCADE"), nullable=False)
    
    # Platform-specific tracking
    platform = Column(String(50), nullable=False)  # instagram, youtube, tiktok, etc.
    platform_username = Column(String(255))
    
    # Growth metrics
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    
    # Engagement metrics for the period
    total_likes = Column(Integer, default=0)
    total_comments = Column(Integer, default=0)
    total_shares = Column(Integer, default=0)
    total_views = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    
    # Date tracking
    recorded_date = Column(DateTime(timezone=True), server_default=func.now())
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    influencer = relationship("Influencer", back_populates="growth_metrics")
    
    # Indexes
    __table_args__ = (
        Index('idx_growth_metrics_platform_date', 'influencer_id', 'platform', 'year', 'month'),
        Index('idx_growth_metrics_followers', 'influencer_id', 'followers_count'),
    )