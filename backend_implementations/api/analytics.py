# app/api/analytics.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.dependencies import get_db, get_current_user
from app.db.models.users import User
from app.db.models.influencers import Influencer
from app.services.analytics_service import InfluencerAnalyticsService
from app.schemas.analytics import (
    InfluencerUserGrowthResponse,
    InfluencerRevenueGrowthResponse,
    InfluencerAnalyticsCreate,
    InfluencerAnalyticsUpdate,
    InfluencerAnalyticsResponse
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/influencer/{influencer_id}/user-growth-by-month", response_model=InfluencerUserGrowthResponse)
async def get_influencer_user_growth_by_month(
    influencer_id: int,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly user growth data for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions - user can only access their own data unless admin
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this influencer's analytics"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get growth data
    if year is None:
        year = datetime.now().year
    
    growth_data = analytics_service.get_influencer_user_growth_by_month(influencer_id, year)
    
    return InfluencerUserGrowthResponse(
        success=True,
        year=year,
        data=growth_data
    )

@router.get("/influencer/{influencer_id}/revenue-growth-by-month", response_model=InfluencerRevenueGrowthResponse)
async def get_influencer_revenue_growth_by_month(
    influencer_id: int,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly revenue growth data for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions - user can only access their own data unless admin
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this influencer's analytics"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get revenue data
    if year is None:
        year = datetime.now().year
    
    revenue_data = analytics_service.get_influencer_revenue_growth_by_month(influencer_id, year)
    
    return InfluencerRevenueGrowthResponse(
        success=True,
        year=year,
        data=revenue_data
    )

@router.post("/influencer/{influencer_id}/analytics", response_model=InfluencerAnalyticsResponse)
async def create_influencer_analytics(
    influencer_id: int,
    analytics_data: InfluencerAnalyticsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create or update monthly analytics for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions - user can only update their own data unless admin
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this influencer's analytics"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Create or update analytics record
    analytics_record = analytics_service.create_or_update_monthly_analytics(
        influencer_id, analytics_data
    )
    
    return InfluencerAnalyticsResponse.from_orm(analytics_record)

@router.put("/influencer/{influencer_id}/analytics/{month}/{year}", response_model=InfluencerAnalyticsResponse)
async def update_influencer_analytics(
    influencer_id: int,
    month: int,
    year: int,
    analytics_data: InfluencerAnalyticsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update specific monthly analytics for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this influencer's analytics"
        )
    
    # Validate month and year
    if not (1 <= month <= 12):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Month must be between 1 and 12"
        )
    
    if not (2020 <= year <= 2030):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Year must be between 2020 and 2030"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Update analytics record
    analytics_record = analytics_service.update_influencer_analytics(
        influencer_id, month, year, analytics_data
    )
    
    if not analytics_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No analytics record found for {month}/{year}"
        )
    
    return InfluencerAnalyticsResponse.from_orm(analytics_record)

@router.get("/influencer/{influencer_id}/summary")
async def get_influencer_analytics_summary(
    influencer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive analytics summary for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this influencer's analytics"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get summary data
    summary = analytics_service.get_influencer_analytics_summary(influencer_id)
    
    return {
        "success": True,
        "influencer_id": influencer_id,
        "summary": summary
    }

@router.post("/influencer/{influencer_id}/record-campaign")
async def record_campaign_completion(
    influencer_id: int,
    campaign_value: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record a completed campaign for analytics tracking"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to record campaigns for this influencer"
        )
    
    if campaign_value < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign value must be positive"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Record campaign completion
    analytics_record = analytics_service.record_campaign_completion(influencer_id, campaign_value)
    
    return {
        "success": True,
        "message": "Campaign completion recorded successfully",
        "analytics_id": analytics_record.id,
        "new_monthly_revenue": analytics_record.monthly_revenue,
        "total_campaigns_completed": analytics_record.campaigns_completed
    }

@router.put("/influencer/{influencer_id}/followers")
async def update_follower_count(
    influencer_id: int,
    platform: str,
    followers: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update follower count for a specific platform"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this influencer's data"
        )
    
    # Validate platform
    valid_platforms = ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook', 'linkedin']
    if platform.lower() not in valid_platforms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid platform. Must be one of: {', '.join(valid_platforms)}"
        )
    
    if followers < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Follower count must be positive"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Update follower count
    analytics_record = analytics_service.update_follower_count(influencer_id, platform, followers)
    
    return {
        "success": True,
        "message": f"{platform.title()} follower count updated successfully",
        "analytics_id": analytics_record.id,
        "platform": platform,
        "new_follower_count": followers,
        "total_followers": analytics_record.total_followers
    }

@router.get("/influencer/{influencer_id}/yearly-summary/{year}")
async def get_yearly_analytics_summary(
    influencer_id: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get yearly analytics summary for an influencer"""
    
    # Verify the influencer exists
    influencer = db.query(Influencer).filter(Influencer.id == influencer_id).first()
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    # Check permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    is_owner = influencer.user_id == current_user.id
    
    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this influencer's analytics"
        )
    
    # Validate year
    if not (2020 <= year <= 2030):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Year must be between 2020 and 2030"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get yearly summary
    summary = analytics_service.get_yearly_analytics_summary(influencer_id, year)
    
    return {
        "success": True,
        "influencer_id": influencer_id,
        **summary
    }

@router.get("/top-performers")
async def get_top_performing_influencers(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get top performing influencers (admin only)"""
    
    # Check admin permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    if not (1 <= limit <= 100):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get top performers
    top_performers = analytics_service.get_top_performing_influencers(limit)
    
    return {
        "success": True,
        "data": top_performers,
        "count": len(top_performers)
    }

@router.get("/platform-summary")
async def get_platform_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get platform-wide analytics summary (admin only)"""
    
    # Check admin permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Get platform summary
    summary = analytics_service.get_platform_analytics_summary()
    
    return {
        "success": True,
        **summary
    }

@router.delete("/influencer/{influencer_id}/analytics/{month}/{year}")
async def delete_analytics_record(
    influencer_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific analytics record (admin only)"""
    
    # Check admin permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Validate parameters
    if not (1 <= month <= 12):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Month must be between 1 and 12"
        )
    
    if not (2020 <= year <= 2030):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Year must be between 2020 and 2030"
        )
    
    # Get analytics service
    analytics_service = InfluencerAnalyticsService(db)
    
    # Delete record
    deleted = analytics_service.delete_analytics_record(influencer_id, month, year)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analytics record not found"
        )
    
    return {
        "success": True,
        "message": f"Analytics record for {month}/{year} deleted successfully"
    }