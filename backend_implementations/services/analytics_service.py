# app/services/analytics_service.py

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, and_, desc
from datetime import datetime, timedelta
import calendar

from app.db.models.analytics import InfluencerAnalytics, InfluencerGrowthMetrics
from app.db.models.influencers import Influencer
from app.db.models.users import User
from app.schemas.analytics import (
    InfluencerAnalyticsCreate,
    InfluencerAnalyticsUpdate,
    InfluencerGrowthData,
    InfluencerRevenueData
)

class InfluencerAnalyticsService:
    """Service for managing influencer analytics and growth tracking"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_influencer_user_growth_by_month(self, influencer_id: int, year: Optional[int] = None) -> List[InfluencerGrowthData]:
        """Get monthly user growth data for an influencer"""
        if year is None:
            year = datetime.now().year
            
        # Query analytics data for the specified year
        analytics_data = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.year == year
                )
            )
            .order_by(InfluencerAnalytics.month)
            .all()
        )
        
        # If no data exists, create mock progressive data
        if not analytics_data:
            return self._generate_mock_user_growth_data(year)
        
        # Convert to response format
        growth_data = []
        for record in analytics_data:
            month_name = calendar.month_abbr[record.month]
            growth_data.append(InfluencerGrowthData(
                month=month_name,
                month_number=record.month,
                followers=record.total_followers,
                engagement_rate=record.average_engagement_rate
            ))
        
        return growth_data
    
    def get_influencer_revenue_growth_by_month(self, influencer_id: int, year: Optional[int] = None) -> List[InfluencerRevenueData]:
        """Get monthly revenue growth data for an influencer"""
        if year is None:
            year = datetime.now().year
            
        # Query analytics data for the specified year
        analytics_data = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.year == year
                )
            )
            .order_by(InfluencerAnalytics.month)
            .all()
        )
        
        # If no data exists, create mock progressive data
        if not analytics_data:
            return self._generate_mock_revenue_growth_data(year)
        
        # Convert to response format
        revenue_data = []
        for record in analytics_data:
            month_name = calendar.month_abbr[record.month]
            revenue_data.append(InfluencerRevenueData(
                month=month_name,
                month_number=record.month,
                revenue=record.monthly_revenue,
                campaigns_completed=record.campaigns_completed
            ))
        
        return revenue_data
    
    def create_or_update_monthly_analytics(
        self, 
        influencer_id: int, 
        analytics_data: InfluencerAnalyticsCreate
    ) -> InfluencerAnalytics:
        """Create or update monthly analytics record for an influencer"""
        
        # Check if record already exists for this month/year
        existing_record = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == analytics_data.month,
                    InfluencerAnalytics.year == analytics_data.year
                )
            )
            .first()
        )
        
        if existing_record:
            # Update existing record
            for field, value in analytics_data.dict(exclude_unset=True).items():
                setattr(existing_record, field, value)
            existing_record.updated_at = func.now()
            self.db.commit()
            self.db.refresh(existing_record)
            return existing_record
        else:
            # Create new record
            new_record = InfluencerAnalytics(
                influencer_id=influencer_id,
                **analytics_data.dict()
            )
            self.db.add(new_record)
            self.db.commit()
            self.db.refresh(new_record)
            return new_record
    
    def get_influencer_analytics_summary(self, influencer_id: int) -> Dict[str, Any]:
        """Get comprehensive analytics summary for an influencer"""
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        # Get current month data
        current_data = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == current_month,
                    InfluencerAnalytics.year == current_year
                )
            )
            .first()
        )
        
        # Get previous month for comparison
        prev_month = current_month - 1 if current_month > 1 else 12
        prev_year = current_year if current_month > 1 else current_year - 1
        
        previous_data = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == prev_month,
                    InfluencerAnalytics.year == prev_year
                )
            )
            .first()
        )
        
        # Calculate growth percentages
        follower_growth = 0.0
        revenue_growth = 0.0
        engagement_growth = 0.0
        
        if current_data and previous_data:
            if previous_data.total_followers > 0:
                follower_growth = ((current_data.total_followers - previous_data.total_followers) / previous_data.total_followers) * 100
            
            if previous_data.monthly_revenue > 0:
                revenue_growth = ((current_data.monthly_revenue - previous_data.monthly_revenue) / previous_data.monthly_revenue) * 100
            
            if previous_data.average_engagement_rate > 0:
                engagement_growth = ((current_data.average_engagement_rate - previous_data.average_engagement_rate) / previous_data.average_engagement_rate) * 100
        
        return {
            "current_month": {
                "followers": current_data.total_followers if current_data else 0,
                "revenue": current_data.monthly_revenue if current_data else 0.0,
                "engagement_rate": current_data.average_engagement_rate if current_data else 0.0,
                "campaigns_completed": current_data.campaigns_completed if current_data else 0,
            },
            "growth": {
                "follower_growth_percentage": round(follower_growth, 2),
                "revenue_growth_percentage": round(revenue_growth, 2),
                "engagement_growth_percentage": round(engagement_growth, 2),
            },
            "period": f"{calendar.month_name[current_month]} {current_year}"
        }
    
    def record_campaign_completion(self, influencer_id: int, campaign_value: float):
        """Record a completed campaign for analytics tracking"""
        current_date = datetime.now()
        month = current_date.month
        year = current_date.year
        
        # Get or create current month record
        analytics_record = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == month,
                    InfluencerAnalytics.year == year
                )
            )
            .first()
        )
        
        if not analytics_record:
            analytics_record = InfluencerAnalytics(
                influencer_id=influencer_id,
                month=month,
                year=year,
                monthly_revenue=campaign_value,
                campaigns_completed=1
            )
            self.db.add(analytics_record)
        else:
            analytics_record.monthly_revenue += campaign_value
            analytics_record.campaigns_completed += 1
            analytics_record.updated_at = func.now()
        
        self.db.commit()
        self.db.refresh(analytics_record)
        return analytics_record
    
    def update_follower_count(self, influencer_id: int, platform: str, followers: int):
        """Update follower count for a specific platform"""
        current_date = datetime.now()
        month = current_date.month
        year = current_date.year
        
        # Get or create current month record
        analytics_record = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == month,
                    InfluencerAnalytics.year == year
                )
            )
            .first()
        )
        
        if not analytics_record:
            analytics_record = InfluencerAnalytics(
                influencer_id=influencer_id,
                month=month,
                year=year
            )
            self.db.add(analytics_record)
        
        # Update platform-specific followers
        if platform.lower() == 'instagram':
            analytics_record.instagram_followers = followers
        elif platform.lower() == 'youtube':
            analytics_record.youtube_subscribers = followers
        elif platform.lower() == 'tiktok':
            analytics_record.tiktok_followers = followers
        elif platform.lower() == 'twitter':
            analytics_record.twitter_followers = followers
        
        # Update total followers (sum of all platforms)
        analytics_record.total_followers = (
            (analytics_record.instagram_followers or 0) +
            (analytics_record.youtube_subscribers or 0) +
            (analytics_record.tiktok_followers or 0) +
            (analytics_record.twitter_followers or 0)
        )
        
        analytics_record.updated_at = func.now()
        self.db.commit()
        self.db.refresh(analytics_record)
        return analytics_record
    
    def _generate_mock_user_growth_data(self, year: int) -> List[InfluencerGrowthData]:
        """Generate mock progressive growth data for demonstration"""
        base_followers = 95000
        base_engagement = 3.5
        
        growth_data = []
        for month in range(1, 13):
            # Progressive growth with some realistic variation
            followers = int(base_followers + (month * 5000) + (month * month * 200))
            engagement = round(base_engagement + (month * 0.1) + (0.05 * (month % 3)), 1)
            
            growth_data.append(InfluencerGrowthData(
                month=calendar.month_abbr[month],
                month_number=month,
                followers=followers,
                engagement_rate=engagement
            ))
        
        return growth_data
    
    def _generate_mock_revenue_growth_data(self, year: int) -> List[InfluencerRevenueData]:
        """Generate mock progressive revenue data for demonstration"""
        base_revenue = 2500
        base_campaigns = 3
        
        revenue_data = []
        for month in range(1, 13):
            # Progressive revenue growth with seasonal variations
            seasonal_multiplier = 1.2 if month in [11, 12, 3, 4] else 1.0  # Higher in holiday/spring seasons
            revenue = int((base_revenue + (month * 300)) * seasonal_multiplier)
            campaigns = base_campaigns + (month // 3)  # Gradually increase campaigns
            
            revenue_data.append(InfluencerRevenueData(
                month=calendar.month_abbr[month],
                month_number=month,
                revenue=revenue,
                campaigns_completed=campaigns
            ))
        
        return revenue_data
    
    def get_top_performing_influencers(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get top performing influencers based on recent analytics"""
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        # Get top influencers by revenue for current month
        top_influencers = (
            self.db.query(
                InfluencerAnalytics.influencer_id,
                InfluencerAnalytics.monthly_revenue,
                InfluencerAnalytics.total_followers,
                InfluencerAnalytics.average_engagement_rate,
                InfluencerAnalytics.campaigns_completed,
                User.username,
                User.first_name,
                User.last_name
            )
            .join(Influencer, InfluencerAnalytics.influencer_id == Influencer.id)
            .join(User, Influencer.user_id == User.id)
            .filter(
                and_(
                    InfluencerAnalytics.year == current_year,
                    InfluencerAnalytics.month == current_month
                )
            )
            .order_by(desc(InfluencerAnalytics.monthly_revenue))
            .limit(limit)
            .all()
        )
        
        return [
            {
                "influencer_id": row.influencer_id,
                "username": row.username,
                "first_name": row.first_name,
                "last_name": row.last_name,
                "monthly_revenue": row.monthly_revenue,
                "total_followers": row.total_followers,
                "engagement_rate": row.average_engagement_rate,
                "campaigns_completed": row.campaigns_completed
            }
            for row in top_influencers
        ]
    
    def get_platform_analytics_summary(self) -> Dict[str, Any]:
        """Get platform-wide analytics summary"""
        current_date = datetime.now()
        current_month = current_date.month
        current_year = current_date.year
        
        # Current month totals
        current_month_data = (
            self.db.query(
                func.sum(InfluencerAnalytics.total_followers).label('total_followers'),
                func.avg(InfluencerAnalytics.average_engagement_rate).label('avg_engagement'),
                func.sum(InfluencerAnalytics.monthly_revenue).label('total_revenue'),
                func.sum(InfluencerAnalytics.campaigns_completed).label('total_campaigns'),
                func.count(InfluencerAnalytics.id).label('active_influencers')
            )
            .filter(
                and_(
                    InfluencerAnalytics.month == current_month,
                    InfluencerAnalytics.year == current_year
                )
            )
            .first()
        )
        
        # Previous month for comparison
        prev_month = current_month - 1 if current_month > 1 else 12
        prev_year = current_year if current_month > 1 else current_year - 1
        
        previous_month_data = (
            self.db.query(
                func.sum(InfluencerAnalytics.total_followers).label('total_followers'),
                func.avg(InfluencerAnalytics.average_engagement_rate).label('avg_engagement'),
                func.sum(InfluencerAnalytics.monthly_revenue).label('total_revenue'),
                func.sum(InfluencerAnalytics.campaigns_completed).label('total_campaigns')
            )
            .filter(
                and_(
                    InfluencerAnalytics.month == prev_month,
                    InfluencerAnalytics.year == prev_year
                )
            )
            .first()
        )
        
        # Calculate growth percentages
        def calculate_growth(current, previous):
            if previous and previous > 0:
                return round(((current - previous) / previous) * 100, 2)
            return 0.0
        
        return {
            "current_month": {
                "total_followers": current_month_data.total_followers or 0,
                "average_engagement_rate": round(current_month_data.avg_engagement or 0, 2),
                "total_revenue": current_month_data.total_revenue or 0,
                "total_campaigns": current_month_data.total_campaigns or 0,
                "active_influencers": current_month_data.active_influencers or 0
            },
            "growth": {
                "follower_growth": calculate_growth(
                    current_month_data.total_followers or 0,
                    previous_month_data.total_followers or 0
                ),
                "revenue_growth": calculate_growth(
                    current_month_data.total_revenue or 0,
                    previous_month_data.total_revenue or 0
                ),
                "campaign_growth": calculate_growth(
                    current_month_data.total_campaigns or 0,
                    previous_month_data.total_campaigns or 0
                )
            },
            "period": f"{calendar.month_name[current_month]} {current_year}"
        }
    
    def update_influencer_analytics(
        self, 
        influencer_id: int, 
        month: int, 
        year: int, 
        update_data: InfluencerAnalyticsUpdate
    ) -> Optional[InfluencerAnalytics]:
        """Update existing analytics record"""
        
        analytics_record = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == month,
                    InfluencerAnalytics.year == year
                )
            )
            .first()
        )
        
        if not analytics_record:
            return None
        
        # Update fields
        for field, value in update_data.dict(exclude_unset=True).items():
            if value is not None:
                setattr(analytics_record, field, value)
        
        analytics_record.updated_at = func.now()
        self.db.commit()
        self.db.refresh(analytics_record)
        return analytics_record
    
    def delete_analytics_record(self, influencer_id: int, month: int, year: int) -> bool:
        """Delete an analytics record"""
        
        analytics_record = (
            self.db.query(InfluencerAnalytics)
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.month == month,
                    InfluencerAnalytics.year == year
                )
            )
            .first()
        )
        
        if analytics_record:
            self.db.delete(analytics_record)
            self.db.commit()
            return True
        return False
    
    def get_yearly_analytics_summary(self, influencer_id: int, year: int) -> Dict[str, Any]:
        """Get yearly summary for an influencer"""
        
        yearly_data = (
            self.db.query(
                func.avg(InfluencerAnalytics.total_followers).label('avg_followers'),
                func.max(InfluencerAnalytics.total_followers).label('max_followers'),
                func.min(InfluencerAnalytics.total_followers).label('min_followers'),
                func.sum(InfluencerAnalytics.monthly_revenue).label('total_revenue'),
                func.avg(InfluencerAnalytics.average_engagement_rate).label('avg_engagement'),
                func.sum(InfluencerAnalytics.campaigns_completed).label('total_campaigns')
            )
            .filter(
                and_(
                    InfluencerAnalytics.influencer_id == influencer_id,
                    InfluencerAnalytics.year == year
                )
            )
            .first()
        )
        
        return {
            "year": year,
            "summary": {
                "average_followers": int(yearly_data.avg_followers or 0),
                "max_followers": int(yearly_data.max_followers or 0),
                "min_followers": int(yearly_data.min_followers or 0),
                "total_revenue": float(yearly_data.total_revenue or 0),
                "average_engagement_rate": round(yearly_data.avg_engagement or 0, 2),
                "total_campaigns": int(yearly_data.total_campaigns or 0)
            }
        }