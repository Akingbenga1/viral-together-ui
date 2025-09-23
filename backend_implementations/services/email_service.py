# app/services/email_service.py

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending emails using SMTP"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
        self.from_name = os.getenv("FROM_NAME", "Viral Together")
        
        # Validate configuration
        if not self.smtp_username or not self.smtp_password:
            logger.warning("SMTP credentials not configured. Email functionality will be disabled.")
    
    def send_html_email(
        self, 
        to_email: str, 
        subject: str, 
        html_content: str,
        to_name: Optional[str] = None
    ) -> bool:
        """Send an HTML email"""
        
        if not self._is_configured():
            logger.error("Email service not properly configured")
            return False
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = f"{to_name} <{to_email}>" if to_name else to_email
            
            # Create HTML part
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Create plain text version
            plain_text = self._html_to_text(html_content)
            text_part = MIMEText(plain_text, 'plain')
            msg.attach(text_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_plain_email(
        self, 
        to_email: str, 
        subject: str, 
        content: str,
        to_name: Optional[str] = None
    ) -> bool:
        """Send a plain text email"""
        
        if not self._is_configured():
            logger.error("Email service not properly configured")
            return False
        
        try:
            # Create message
            msg = MIMEText(content)
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = f"{to_name} <{to_email}>" if to_name else to_email
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Plain text email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send plain text email to {to_email}: {str(e)}")
            return False
    
    def send_bulk_emails(
        self, 
        recipients: List[dict], 
        subject: str, 
        html_content: str
    ) -> dict:
        """Send bulk emails to multiple recipients"""
        
        if not self._is_configured():
            logger.error("Email service not properly configured")
            return {"success": False, "sent": 0, "failed": len(recipients)}
        
        sent_count = 0
        failed_count = 0
        failed_emails = []
        
        for recipient in recipients:
            email = recipient.get('email')
            name = recipient.get('name')
            
            if not email:
                failed_count += 1
                continue
            
            # Personalize content if needed
            personalized_content = html_content.replace("{{name}}", name or "")
            
            if self.send_html_email(email, subject, personalized_content, name):
                sent_count += 1
            else:
                failed_count += 1
                failed_emails.append(email)
        
        return {
            "success": failed_count == 0,
            "sent": sent_count,
            "failed": failed_count,
            "failed_emails": failed_emails
        }
    
    def _is_configured(self) -> bool:
        """Check if email service is properly configured"""
        return bool(self.smtp_username and self.smtp_password)
    
    def _html_to_text(self, html_content: str) -> str:
        """Convert HTML content to plain text (basic implementation)"""
        import re
        
        # Remove HTML tags
        text = re.sub('<[^<]+?>', '', html_content)
        # Clean up multiple whitespaces
        text = re.sub(r'\s+', ' ', text)
        # Clean up multiple newlines
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        return text.strip()

# Email templates
class EmailTemplates:
    """Collection of email templates"""
    
    @staticmethod
    def welcome_email(user_name: str, login_url: str) -> str:
        """Welcome email template"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0891b2;">Welcome to Viral Together!</h1>
            </div>
            
            <p>Hello {user_name},</p>
            
            <p>Welcome to Viral Together, the ultimate platform for influencer marketing and brand partnerships!</p>
            
            <p>Your account has been successfully created. You can now:</p>
            <ul>
                <li>Connect with brands and influencers</li>
                <li>Create and manage campaigns</li>
                <li>Track your performance with detailed analytics</li>
                <li>Access powerful collaboration tools</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{login_url}" 
                   style="background-color: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    Get Started
                </a>
            </div>
            
            <p>If you have any questions, don't hesitate to reach out to our support team.</p>
            
            <p>Best regards,<br>The Viral Together Team</p>
        </body>
        </html>
        """
    
    @staticmethod
    def campaign_notification_email(user_name: str, campaign_title: str, campaign_url: str) -> str:
        """Campaign notification email template"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0891b2;">New Campaign Opportunity</h1>
            </div>
            
            <p>Hello {user_name},</p>
            
            <p>You have a new campaign opportunity: <strong>{campaign_title}</strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{campaign_url}" 
                   style="background-color: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    View Campaign
                </a>
            </div>
            
            <p>Don't miss out on this opportunity to grow your influence and earnings!</p>
            
            <p>Best regards,<br>The Viral Together Team</p>
        </body>
        </html>
        """

# Singleton instance
email_service = EmailService()