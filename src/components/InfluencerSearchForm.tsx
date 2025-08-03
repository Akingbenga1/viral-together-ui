'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Users, Instagram, Youtube, Video, Twitter, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import CountrySelect from './CountrySelect';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';
import { toast } from 'react-hot-toast';

interface SearchFormData {
  location: number[];
  industry: string;
  socialMediaPlatform: string;
}

interface SearchResult {
  id: number;
  name: string;
  followers: string;
  engagement: string;
  location: string;
  niche: string;
  platforms: string[];
  rating: number;
}

const InfluencerSearchForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SearchFormData>({
    location: [],
    industry: '',
    socialMediaPlatform: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [containerHeight, setContainerHeight] = useState<string>('auto');

  // Handle height changes when step changes
  useEffect(() => {
    if (currentStep === 4) {
      // Set a fixed height for the results step to prevent layout shifts
      setContainerHeight('600px');
    } else {
      // Reset to auto for other steps
      setContainerHeight('auto');
    }
  }, [currentStep]);

  const industries = [
    'Technology',
    'Fashion & Beauty',
    'Health & Wellness',
    'Food & Beverage',
    'Travel & Tourism',
    'Education',
    'Entertainment',
    'Sports & Fitness',
    'Finance',
    'Automotive',
    'Real Estate',
    'Lifestyle',
    'Gaming',
    'Business',
    'Other'
  ];

  const socialMediaPlatforms = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'tiktok', label: 'TikTok', icon: Video },
    { value: 'twitter', label: 'Twitter/X', icon: Twitter }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLocationChange = (countryIds: number[]) => {
    setFormData(prev => ({ ...prev, location: countryIds }));
  };

  const handleIndustryChange = (industry: string) => {
    setFormData(prev => ({ ...prev, industry }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({ ...prev, socialMediaPlatform: platform }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Call the real API endpoint
      const searchCriteria = {
        country_ids: formData.location,
        industry: formData.industry,
        social_media_platform: formData.socialMediaPlatform
      };
      
      const influencers: Influencer[] = await apiClient.searchInfluencersByCriteria(searchCriteria);
      
      // Transform the API response to match our SearchResult interface
      const transformedResults: SearchResult[] = influencers.map(influencer => ({
        id: influencer.id,
        name: influencer.user ? `${influencer.user.first_name || ''} ${influencer.user.last_name || ''}`.trim() || influencer.user.username : 'Unknown Influencer',
        followers: `${Math.floor((influencer.total_posts || 0) * 1000)}K`, // Convert to display format
        engagement: `${(influencer.growth_rate || 0).toFixed(1)}%`,
        location: influencer.base_country.name,
        niche: 'Technology', // This would come from the API in a real implementation
        platforms: ['Instagram', 'YouTube'], // This would come from the API in a real implementation
        rating: 4.5 + (Math.random() * 0.5) // Mock rating, would come from API
      }));
      
      setSearchResults(transformedResults);
      toast.success(`Found ${transformedResults.length} influencers matching your criteria`);
    } catch (error) {
      console.error('Error searching influencers:', error);
      toast.error('Failed to search influencers. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setCurrentStep(4);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you looking for influencers?</h2>
        <p className="text-gray-600">Select the countries where you want to find influencers</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Location *
          </label>
          <CountrySelect
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Search and select countries..."
            multiple={true}
          />
          <p className="text-sm text-gray-500 mt-2">
            Select one or more countries where you want to find influencers
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What industry are you in?</h2>
        <p className="text-gray-600">Choose the industry or niche that matches your business</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry/Niche *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Instagram className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which social media platform?</h2>
        <p className="text-gray-600">Select your preferred platform for promotion</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Media Platform *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {socialMediaPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformChange(platform.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.socialMediaPlatform === platform.value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{platform.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h2>
        <p className="text-gray-600">Found {searchResults.length} influencers matching your criteria</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {searchResults.map((influencer) => (
          <div key={influencer.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                <p className="text-sm text-gray-600">{influencer.location}</p>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(influencer.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">{influencer.rating.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Followers</p>
                <p className="font-semibold text-gray-900">{influencer.followers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement</p>
                <p className="font-semibold text-gray-900">{influencer.engagement}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Niche</p>
              <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                {influencer.niche}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Platforms</p>
              <div className="flex flex-wrap gap-1">
                {influencer.platforms.map((platform) => (
                  <span key={platform} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            
                         <Button 
               className="w-full"
               onClick={() => router.push(`/influencer/${influencer.id}`)}
             >
               Contact Influencer
             </Button>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button
          variant="secondary"
          onClick={() => {
            setCurrentStep(1);
            setFormData({
              location: [],
              industry: '',
              socialMediaPlatform: ''
            });
            setSearchResults([]);
            setContainerHeight('auto');
          }}
        >
          Start New Search
        </Button>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.location.length > 0;
      case 2:
        return formData.industry !== '';
      case 3:
        return formData.socialMediaPlatform !== '';
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}
      
      <div className="bg-white rounded-2xl shadow-xl p-8" style={{ height: containerHeight }}>
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            <div className="w-full flex-shrink-0">
              {renderStep1()}
            </div>
            <div className="w-full flex-shrink-0">
              {renderStep2()}
            </div>
            <div className="w-full flex-shrink-0">
              {renderStep3()}
            </div>
            <div className="w-full flex-shrink-0">
              {renderStep4()}
            </div>
          </div>
        </div>
        
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === 3 ? (
              <Button
                onClick={handleSearch}
                disabled={!canProceed() || isSearching}
                isLoading={isSearching}
                className="flex items-center"
              >
                {isSearching ? 'Searching...' : 'Find Influencers'}
                <Search className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerSearchForm; 