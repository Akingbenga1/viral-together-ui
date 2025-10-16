#!/usr/bin/env python3
"""
Test script for influencer showing interest in a promotion
"""
import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBa2luZ2JlbmdhIiwiZXhwIjoxNzUzOTYxNDc2fQ.7bdwEsF8ZXe3CoodX-gHriykZikN4qa4xB6BdWn8KJs"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

def test_influencer_interest():
    """Test influencer showing interest in a promotion"""
    print("Testing: Influencer Interest in Promotion")
    print("=" * 50)
    
    # Test data
    promotion_id = 9
    influencer_id = 13
    
    # Request payload
    data = {
        "influencer_id": influencer_id,
        "proposed_amount": 750.0,
        "collaboration_type": "sponsored_post",
        "deliverables": "1 Instagram post, 2 Instagram stories, 1 TikTok video",
        "message": "Hi! I'm very interested in this promotion. I have 50K+ followers and high engagement rates. I can create authentic content that aligns with your brand values."
    }
    
    print(f"Promotion ID: {promotion_id}")
    print(f"Influencer ID: {influencer_id}")
    print(f"Proposed Amount: ${data['proposed_amount']}")
    print(f"Collaboration Type: {data['collaboration_type']}")
    print(f"Deliverables: {data['deliverables']}")
    print(f"Message: {data['message']}")
    print()
    
    try:
        # Make the API call
        response = requests.post(
            f"{BASE_URL}/promotions/{promotion_id}/show-interest", 
            json=data, 
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print()
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS: Collaboration interest submitted successfully!")
            print()
            print("Response Details:")
            print(f"  Collaboration ID: {result.get('collaboration_id')}")
            print(f"  Promotion Name: {result.get('promotion_name')}")
            print(f"  Promotion ID: {result.get('promotion_id')}")
            print(f"  Business Name: {result.get('business_name')}")
            print(f"  Business ID: {result.get('business_id')}")
            print(f"  Influencer Name: {result.get('influencer_name')}")
            print(f"  Influencer ID: {result.get('influencer_id')}")
            print(f"  Status: {result.get('status')}")
            print(f"  Collaboration Type: {result.get('collaboration_type')}")
            print(f"  Proposed Amount: ${result.get('proposed_amount')}")
            print(f"  Deliverables: {result.get('deliverables')}")
            print(f"  Message: {result.get('message')}")
            print(f"  Created At: {result.get('created_at')}")
            print(f"  Notification Triggered: {result.get('notification_triggered')}")
            
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Error Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR: Could not connect to the API server.")
        print("Make sure the backend server is running on http://localhost:8000")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {str(e)}")
        
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {str(e)}")

def test_get_promotion_influencers():
    """Test getting influencers for the promotion"""
    print("\n" + "=" * 50)
    print("Testing: Get Promotion Influencers")
    print("=" * 50)
    
    promotion_id = 9
    
    try:
        response = requests.get(
            f"{BASE_URL}/promotions/{promotion_id}/influencers", 
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            influencers = response.json()
            print(f"✅ SUCCESS: Found {len(influencers)} influencer(s) interested in promotion {promotion_id}")
            print()
            
            for i, influencer in enumerate(influencers, 1):
                print(f"Influencer {i}:")
                print(f"  Collaboration ID: {influencer.get('collaboration_id')}")
                print(f"  Influencer ID: {influencer.get('influencer_id')}")
                print(f"  Influencer Name: {influencer.get('influencer_name')}")
                print(f"  Influencer Email: {influencer.get('influencer_email')}")
                print(f"  Collaboration Status: {influencer.get('collaboration_status')}")
                print(f"  Collaboration Type: {influencer.get('collaboration_type')}")
                print(f"  Proposed Amount: ${influencer.get('proposed_amount')}")
                print(f"  Negotiated Amount: ${influencer.get('negotiated_amount')}")
                print(f"  Deliverables: {influencer.get('deliverables')}")
                print(f"  Contract Signed: {influencer.get('contract_signed')}")
                print(f"  Payment Status: {influencer.get('payment_status')}")
                print(f"  Created At: {influencer.get('created_at')}")
                print(f"  Updated At: {influencer.get('updated_at')}")
                print()
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def test_get_promotion_details():
    """Test getting promotion details"""
    print("\n" + "=" * 50)
    print("Testing: Get Promotion Details")
    print("=" * 50)
    
    promotion_id = 9
    
    try:
        response = requests.get(
            f"{BASE_URL}/promotions/{promotion_id}", 
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            promotion = response.json()
            print("✅ SUCCESS: Promotion details retrieved!")
            print()
            print("Promotion Details:")
            print(f"  ID: {promotion.get('id')}")
            print(f"  Business ID: {promotion.get('business_id')}")
            print(f"  Promotion Name: {promotion.get('promotion_name')}")
            print(f"  Promotion Item: {promotion.get('promotion_item')}")
            print(f"  Description: {promotion.get('description')}")
            print(f"  Start Date: {promotion.get('start_date')}")
            print(f"  End Date: {promotion.get('end_date')}")
            print(f"  Discount: {promotion.get('discount')}%")
            print(f"  Budget: ${promotion.get('budget')}")
            print(f"  Spent Amount: ${promotion.get('spent_amount')}")
            print(f"  Status: {promotion.get('status')}")
            print(f"  Target Audience: {promotion.get('target_audience')}")
            print(f"  Social Media Platform ID: {promotion.get('social_media_platform_id')}")
            print(f"  Created At: {promotion.get('created_at')}")
            print(f"  Updated At: {promotion.get('updated_at')}")
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    print("Influencer Interest API Test")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test 1: Show interest
    test_influencer_interest()
    
    # Test 2: Get promotion influencers
    test_get_promotion_influencers()
    
    # Test 3: Get promotion details
    test_get_promotion_details()
    
    print("\n" + "=" * 50)
    print("Test completed!")
