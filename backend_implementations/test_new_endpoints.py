# test_new_endpoints.py - Testing script for new API endpoints

import requests
import json
import time
from datetime import datetime

class APITester:
    def __init__(self, base_url="http://localhost:8000", auth_token=None):
        self.base_url = base_url
        self.auth_token = auth_token
        self.headers = {
            "Content-Type": "application/json"
        }
        if auth_token:
            self.headers["Authorization"] = f"Bearer {auth_token}"
    
    def test_forgot_password(self, email="test@example.com"):
        """Test forgot password endpoint"""
        print("\n🔐 Testing Forgot Password Endpoint...")
        
        url = f"{self.base_url}/auth/forgot-password"
        data = {"email": email}
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Forgot password endpoint working correctly")
            else:
                print("❌ Forgot password endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing forgot password: {e}")
    
    def test_reset_password(self, token, new_password="newpassword123"):
        """Test password reset endpoint"""
        print("\n🔐 Testing Reset Password Endpoint...")
        
        url = f"{self.base_url}/auth/reset-password"
        data = {
            "token": token,
            "new_password": new_password
        }
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Reset password endpoint working correctly")
            else:
                print("❌ Reset password endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing reset password: {e}")
    
    def test_validate_reset_token(self, token):
        """Test token validation endpoint"""
        print("\n🔐 Testing Token Validation Endpoint...")
        
        url = f"{self.base_url}/auth/validate-reset-token/{token}"
        
        try:
            response = requests.get(url, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Token validation endpoint working correctly")
            else:
                print("❌ Token validation endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing token validation: {e}")
    
    def test_influencer_user_growth(self, influencer_id=1, year=None):
        """Test influencer user growth analytics endpoint"""
        print("\n📊 Testing Influencer User Growth Analytics...")
        
        if year is None:
            year = datetime.now().year
            
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/user-growth-by-month"
        params = {"year": year} if year else {}
        
        try:
            response = requests.get(url, params=params, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ User growth analytics endpoint working correctly")
            else:
                print("❌ User growth analytics endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing user growth analytics: {e}")
    
    def test_influencer_revenue_growth(self, influencer_id=1, year=None):
        """Test influencer revenue growth analytics endpoint"""
        print("\n📊 Testing Influencer Revenue Growth Analytics...")
        
        if year is None:
            year = datetime.now().year
            
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/revenue-growth-by-month"
        params = {"year": year} if year else {}
        
        try:
            response = requests.get(url, params=params, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ Revenue growth analytics endpoint working correctly")
            else:
                print("❌ Revenue growth analytics endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing revenue growth analytics: {e}")
    
    def test_create_analytics_record(self, influencer_id=1):
        """Test creating analytics record"""
        print("\n📊 Testing Create Analytics Record...")
        
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/analytics"
        data = {
            "month": datetime.now().month,
            "year": datetime.now().year,
            "total_followers": 125000,
            "instagram_followers": 85000,
            "youtube_subscribers": 40000,
            "average_engagement_rate": 4.2,
            "monthly_revenue": 5200.00,
            "campaigns_completed": 8,
            "campaigns_active": 3
        }
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ Create analytics record endpoint working correctly")
            else:
                print("❌ Create analytics record endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing create analytics record: {e}")
    
    def test_record_campaign_completion(self, influencer_id=1):
        """Test recording campaign completion"""
        print("\n📊 Testing Record Campaign Completion...")
        
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/record-campaign"
        params = {"campaign_value": 1500.00}
        
        try:
            response = requests.post(url, params=params, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ Record campaign completion endpoint working correctly")
            else:
                print("❌ Record campaign completion endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing record campaign completion: {e}")
    
    def test_update_follower_count(self, influencer_id=1):
        """Test updating follower count"""
        print("\n📊 Testing Update Follower Count...")
        
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/followers"
        params = {
            "platform": "instagram",
            "followers": 87500
        }
        
        try:
            response = requests.put(url, params=params, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ Update follower count endpoint working correctly")
            else:
                print("❌ Update follower count endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing update follower count: {e}")
    
    def test_analytics_summary(self, influencer_id=1):
        """Test analytics summary endpoint"""
        print("\n📊 Testing Analytics Summary...")
        
        url = f"{self.base_url}/api/analytics/influencer/{influencer_id}/summary"
        
        try:
            response = requests.get(url, headers=self.headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("✅ Analytics summary endpoint working correctly")
            else:
                print("❌ Analytics summary endpoint failed")
                
        except Exception as e:
            print(f"❌ Error testing analytics summary: {e}")
    
    def run_all_tests(self, influencer_id=1):
        """Run all tests"""
        print("🚀 Starting API Endpoint Tests...")
        print("=" * 50)
        
        # Test password reset endpoints
        self.test_forgot_password()
        
        # Only test other reset endpoints if you have a valid token
        # self.test_validate_reset_token("sample_token_here")
        # self.test_reset_password("sample_token_here")
        
        # Test analytics endpoints (requires authentication)
        if self.auth_token:
            self.test_influencer_user_growth(influencer_id)
            self.test_influencer_revenue_growth(influencer_id)
            self.test_analytics_summary(influencer_id)
            self.test_create_analytics_record(influencer_id)
            self.test_record_campaign_completion(influencer_id)
            self.test_update_follower_count(influencer_id)
        else:
            print("\n⚠️  Skipping authenticated endpoints - no auth token provided")
        
        print("\n" + "=" * 50)
        print("🏁 All tests completed!")

def main():
    """Main testing function"""
    
    # Configuration
    BASE_URL = "http://localhost:8000"  # Update this to your API URL
    AUTH_TOKEN = None  # Add your JWT token here for authenticated tests
    INFLUENCER_ID = 1  # Update this to a valid influencer ID
    
    # Initialize tester
    tester = APITester(BASE_URL, AUTH_TOKEN)
    
    # Run tests
    tester.run_all_tests(INFLUENCER_ID)

if __name__ == "__main__":
    main()

"""
Usage Instructions:

1. Update the BASE_URL to match your API server
2. Get an authentication token by logging in to your API
3. Update AUTH_TOKEN with your JWT token
4. Update INFLUENCER_ID to a valid influencer ID in your database
5. Run the script: python test_new_endpoints.py

Expected Results:
- Forgot password should return 200 with success message
- Analytics endpoints should return 200 with data (when authenticated)
- Unauthorized requests should return 401/403 as appropriate
- Invalid data should return 400 with error messages

Note: Make sure your API server is running before executing tests!
"""