# Alembic migration file - place this in alembic/versions/
# File name should be: YYYYMMDD_HHMMSS_add_analytics_and_password_reset.py

"""Add analytics tracking and password reset functionality

Revision ID: add_analytics_password_reset
Revises: [previous_revision_id]
Create Date: 2025-01-23 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func

# revision identifiers, used by Alembic.
revision = 'add_analytics_password_reset'
down_revision = '[previous_revision_id]'  # Replace with actual previous revision
branch_labels = None
depends_on = None

def upgrade():
    # Create influencer_analytics table
    op.create_table('influencer_analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('influencer_id', sa.Integer(), nullable=False),
        sa.Column('recorded_date', sa.DateTime(timezone=True), server_default=func.now(), nullable=False),
        sa.Column('month', sa.Integer(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        
        # Social media metrics
        sa.Column('total_followers', sa.Integer(), default=0),
        sa.Column('instagram_followers', sa.Integer(), default=0),
        sa.Column('youtube_subscribers', sa.Integer(), default=0),
        sa.Column('tiktok_followers', sa.Integer(), default=0),
        sa.Column('twitter_followers', sa.Integer(), default=0),
        
        # Engagement metrics
        sa.Column('average_engagement_rate', sa.Float(), default=0.0),
        sa.Column('instagram_engagement_rate', sa.Float(), default=0.0),
        sa.Column('youtube_engagement_rate', sa.Float(), default=0.0),
        sa.Column('tiktok_engagement_rate', sa.Float(), default=0.0),
        
        # Revenue metrics
        sa.Column('monthly_revenue', sa.Float(), default=0.0),
        sa.Column('campaigns_completed', sa.Integer(), default=0),
        sa.Column('campaigns_active', sa.Integer(), default=0),
        sa.Column('average_campaign_value', sa.Float(), default=0.0),
        
        # Performance metrics
        sa.Column('content_pieces_created', sa.Integer(), default=0),
        sa.Column('total_views', sa.Integer(), default=0),
        sa.Column('total_likes', sa.Integer(), default=0),
        sa.Column('total_comments', sa.Integer(), default=0),
        sa.Column('total_shares', sa.Integer(), default=0),
        
        # Metadata
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=func.now()),
        
        sa.ForeignKeyConstraint(['influencer_id'], ['influencers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for influencer_analytics
    op.create_index('idx_influencer_analytics_date', 'influencer_analytics', ['influencer_id', 'year', 'month'])
    op.create_index('idx_influencer_analytics_revenue', 'influencer_analytics', ['influencer_id', 'monthly_revenue'])
    op.create_index('idx_influencer_analytics_followers', 'influencer_analytics', ['influencer_id', 'total_followers'])
    op.create_index(op.f('ix_influencer_analytics_id'), 'influencer_analytics', ['id'])

    # Create password_reset_tokens table
    op.create_table('password_reset_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('used', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=func.now()),
        sa.Column('used_at', sa.DateTime(timezone=True), nullable=True),
        
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token')
    )
    
    # Create indexes for password_reset_tokens
    op.create_index('idx_password_reset_token', 'password_reset_tokens', ['token'])
    op.create_index('idx_password_reset_user_email', 'password_reset_tokens', ['user_id', 'email'])
    op.create_index('idx_password_reset_expires', 'password_reset_tokens', ['expires_at'])
    op.create_index(op.f('ix_password_reset_tokens_id'), 'password_reset_tokens', ['id'])

    # Create influencer_growth_metrics table
    op.create_table('influencer_growth_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('influencer_id', sa.Integer(), nullable=False),
        sa.Column('platform', sa.String(length=50), nullable=False),
        sa.Column('platform_username', sa.String(length=255), nullable=True),
        
        # Growth metrics
        sa.Column('followers_count', sa.Integer(), default=0),
        sa.Column('following_count', sa.Integer(), default=0),
        sa.Column('posts_count', sa.Integer(), default=0),
        
        # Engagement metrics
        sa.Column('total_likes', sa.Integer(), default=0),
        sa.Column('total_comments', sa.Integer(), default=0),
        sa.Column('total_shares', sa.Integer(), default=0),
        sa.Column('total_views', sa.Integer(), default=0),
        sa.Column('engagement_rate', sa.Float(), default=0.0),
        
        # Date tracking
        sa.Column('recorded_date', sa.DateTime(timezone=True), server_default=func.now()),
        sa.Column('month', sa.Integer(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        
        # Metadata
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=func.now()),
        
        sa.ForeignKeyConstraint(['influencer_id'], ['influencers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for influencer_growth_metrics
    op.create_index('idx_growth_metrics_platform_date', 'influencer_growth_metrics', ['influencer_id', 'platform', 'year', 'month'])
    op.create_index('idx_growth_metrics_followers', 'influencer_growth_metrics', ['influencer_id', 'followers_count'])
    op.create_index(op.f('ix_influencer_growth_metrics_id'), 'influencer_growth_metrics', ['id'])

def downgrade():
    # Drop indexes first
    op.drop_index('idx_growth_metrics_followers', table_name='influencer_growth_metrics')
    op.drop_index('idx_growth_metrics_platform_date', table_name='influencer_growth_metrics')
    op.drop_index(op.f('ix_influencer_growth_metrics_id'), table_name='influencer_growth_metrics')
    
    op.drop_index('idx_password_reset_expires', table_name='password_reset_tokens')
    op.drop_index('idx_password_reset_user_email', table_name='password_reset_tokens')
    op.drop_index('idx_password_reset_token', table_name='password_reset_tokens')
    op.drop_index(op.f('ix_password_reset_tokens_id'), table_name='password_reset_tokens')
    
    op.drop_index('idx_influencer_analytics_followers', table_name='influencer_analytics')
    op.drop_index('idx_influencer_analytics_revenue', table_name='influencer_analytics')
    op.drop_index('idx_influencer_analytics_date', table_name='influencer_analytics')
    op.drop_index(op.f('ix_influencer_analytics_id'), table_name='influencer_analytics')
    
    # Drop tables
    op.drop_table('influencer_growth_metrics')
    op.drop_table('password_reset_tokens')
    op.drop_table('influencer_analytics')