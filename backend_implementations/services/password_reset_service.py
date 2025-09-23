# app/services/password_reset_service.py

import secrets
import string
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.db.models.analytics import PasswordResetToken
from app.db.models.users import User
from app.core.security import get_password_hash, verify_password
from app.services.email_service import EmailService

class PasswordResetService:
    """Service for handling password reset functionality"""
    
    def __init__(self, db: Session, email_service: EmailService):
        self.db = db
        self.email_service = email_service
    
    def generate_reset_token(self, length: int = 64) -> str:
        """Generate a secure random token for password reset"""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    def create_password_reset_token(self, email: str) -> Optional[PasswordResetToken]:
        """Create a password reset token for the given email"""
        
        # Find user by email
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            # For security, don't reveal if email exists
            return None
        
        # Invalidate any existing tokens for this user
        self._invalidate_existing_tokens(user.id)
        
        # Generate new token
        token = self.generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
        
        # Create token record
        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            email=email,
            expires_at=expires_at,
            used=0
        )
        
        self.db.add(reset_token)
        self.db.commit()
        self.db.refresh(reset_token)
        
        return reset_token
    
    def send_password_reset_email(self, email: str) -> bool:
        """Send password reset email to user"""
        
        # Create reset token
        reset_token = self.create_password_reset_token(email)
        if not reset_token:
            # Return True for security (don't reveal if email exists)
            return True
        
        # Get user details
        user = self.db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            return False
        
        # Prepare email content
        reset_url = f"{self._get_frontend_url()}/auth/reset-password?token={reset_token.token}"
        
        email_subject = "Reset Your Viral Together Password"
        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0891b2;">Viral Together</h1>
            </div>
            
            <h2 style="color: #333;">Password Reset Request</h2>
            
            <p>Hello {user.first_name or user.username},</p>
            
            <p>We received a request to reset your password for your Viral Together account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" 
                   style="background-color: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    Reset My Password
                </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0891b2;">{reset_url}</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This link will expire in 1 hour for security reasons.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
                If you're having trouble clicking the button, copy and paste the URL above into your web browser.
                <br><br>
                This email was sent by Viral Together. If you received this email in error, please ignore it.
            </p>
        </body>
        </html>
        """
        
        # Send email
        try:
            return self.email_service.send_html_email(
                to_email=email,
                subject=email_subject,
                html_content=email_body
            )
        except Exception as e:
            print(f"Failed to send password reset email: {e}")
            return False
    
    def validate_reset_token(self, token: str) -> Optional[PasswordResetToken]:
        """Validate a password reset token"""
        
        reset_token = (
            self.db.query(PasswordResetToken)
            .filter(
                and_(
                    PasswordResetToken.token == token,
                    PasswordResetToken.used == 0,
                    PasswordResetToken.expires_at > datetime.utcnow()
                )
            )
            .first()
        )
        
        return reset_token
    
    def reset_password_with_token(self, token: str, new_password: str) -> bool:
        """Reset user password using a valid token"""
        
        # Validate token
        reset_token = self.validate_reset_token(token)
        if not reset_token:
            return False
        
        # Get user
        user = self.db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            return False
        
        # Update user password
        user.hashed_password = get_password_hash(new_password)
        
        # Mark token as used
        reset_token.used = 1
        reset_token.used_at = datetime.utcnow()
        
        self.db.commit()
        
        # Send confirmation email
        self._send_password_reset_confirmation_email(user.email, user.first_name or user.username)
        
        return True
    
    def _invalidate_existing_tokens(self, user_id: int):
        """Invalidate all existing password reset tokens for a user"""
        
        existing_tokens = (
            self.db.query(PasswordResetToken)
            .filter(
                and_(
                    PasswordResetToken.user_id == user_id,
                    PasswordResetToken.used == 0
                )
            )
            .all()
        )
        
        for token in existing_tokens:
            token.used = 1
            token.used_at = datetime.utcnow()
        
        self.db.commit()
    
    def _get_frontend_url(self) -> str:
        """Get the frontend URL for creating reset links"""
        # This should be configured in your environment variables
        # For development: http://localhost:3000
        # For production: https://your-domain.com
        import os
        return os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    def _send_password_reset_confirmation_email(self, email: str, name: str):
        """Send confirmation email after successful password reset"""
        
        email_subject = "Password Successfully Reset - Viral Together"
        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0891b2;">Viral Together</h1>
            </div>
            
            <h2 style="color: #333;">Password Successfully Reset</h2>
            
            <p>Hello {name},</p>
            
            <p>Your password has been successfully reset for your Viral Together account.</p>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{self._get_frontend_url()}/auth/login" 
                   style="background-color: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    Sign In to Your Account
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                For your security, we recommend using a strong, unique password.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
                This email was sent by Viral Together.
                <br>
                If you have any questions, contact support at support@viraltogether.com
            </p>
        </body>
        </html>
        """
        
        try:
            self.email_service.send_html_email(
                to_email=email,
                subject=email_subject,
                html_content=email_body
            )
        except Exception as e:
            print(f"Failed to send password reset confirmation email: {e}")
    
    def cleanup_expired_tokens(self):
        """Clean up expired password reset tokens (should be run periodically)"""
        
        expired_tokens = (
            self.db.query(PasswordResetToken)
            .filter(PasswordResetToken.expires_at < datetime.utcnow())
            .all()
        )
        
        for token in expired_tokens:
            self.db.delete(token)
        
        self.db.commit()
        return len(expired_tokens)
    
    def get_user_reset_tokens(self, user_id: int) -> list[PasswordResetToken]:
        """Get all reset tokens for a user (for admin purposes)"""
        
        return (
            self.db.query(PasswordResetToken)
            .filter(PasswordResetToken.user_id == user_id)
            .order_by(PasswordResetToken.created_at.desc())
            .all()
        )