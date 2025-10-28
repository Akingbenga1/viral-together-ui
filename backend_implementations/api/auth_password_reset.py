# app/api/auth_password_reset.py

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.core.dependencies import get_db
from app.db.models.users import User
from app.services.password_reset_service import PasswordResetService
from app.services.email_service import EmailService, email_service
from app.schemas.analytics import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Initiate password reset process by sending email with reset link"""
    
    try:
        # Create password reset service
        password_reset_service = PasswordResetService(db, email_service)
        
        # Send password reset email (this handles all logic including user existence check)
        background_tasks.add_task(
            password_reset_service.send_password_reset_email,
            request.email
        )
        
        # Always return success for security (don't reveal if email exists)
        return ForgotPasswordResponse(
            message="If an account with that email exists, we've sent a password reset link.",
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error in forgot password process: {str(e)}")
        # Still return success for security
        return ForgotPasswordResponse(
            message="If an account with that email exists, we've sent a password reset link.",
            success=True
        )

@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset user password using a valid reset token"""
    
    try:
        # Create password reset service
        password_reset_service = PasswordResetService(db, email_service)
        
        # Validate token and reset password
        success = password_reset_service.reset_password_with_token(
            request.token, 
            request.new_password
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        return ResetPasswordResponse(
            message="Password reset successfully. You can now log in with your new password.",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in password reset process: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while resetting your password"
        )

@router.get("/validate-reset-token/{token}")
async def validate_reset_token(
    token: str,
    db: Session = Depends(get_db)
):
    """Validate a password reset token without using it"""
    
    try:
        # Create password reset service
        password_reset_service = PasswordResetService(db, email_service)
        
        # Validate token
        reset_token = password_reset_service.validate_reset_token(token)
        
        if not reset_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Get user details (without sensitive information)
        user = db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token - user not found"
            )
        
        return {
            "success": True,
            "valid": True,
            "email": reset_token.email,
            "expires_at": reset_token.expires_at.isoformat(),
            "user_exists": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating reset token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while validating the token"
        )

# Admin endpoints for token management
@router.get("/admin/password-reset-tokens")
async def get_all_password_reset_tokens(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all password reset tokens (admin only)"""
    
    # Check admin permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Get tokens with user information
    from app.db.models.analytics import PasswordResetToken
    
    tokens = (
        db.query(PasswordResetToken, User.username, User.email)
        .join(User, PasswordResetToken.user_id == User.id)
        .order_by(PasswordResetToken.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    
    return {
        "success": True,
        "tokens": [
            {
                "id": token.id,
                "user_id": token.user_id,
                "username": username,
                "email": email,
                "token": token.token[:10] + "..." if len(token.token) > 10 else token.token,  # Partial token for security
                "expires_at": token.expires_at.isoformat(),
                "used": bool(token.used),
                "used_at": token.used_at.isoformat() if token.used_at else None,
                "created_at": token.created_at.isoformat()
            }
            for token, username, email in tokens
        ],
        "count": len(tokens)
    }

@router.delete("/admin/cleanup-expired-tokens")
async def cleanup_expired_tokens(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clean up expired password reset tokens (admin only)"""
    
    # Check admin permissions
    is_admin = any(role.name in ['admin', 'super_admin'] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Create password reset service
    password_reset_service = PasswordResetService(db, email_service)
    
    # Cleanup expired tokens
    deleted_count = password_reset_service.cleanup_expired_tokens()
    
    return {
        "success": True,
        "message": f"Cleaned up {deleted_count} expired tokens",
        "deleted_count": deleted_count
    }