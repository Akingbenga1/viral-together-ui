'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  MapPin, 
  Globe, 
  Users, 
  TrendingUp, 
  Star, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  ArrowLeft,
  Instagram,
  Youtube,
  Video,
  Twitter,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const InfluencerDetailsPage: React.FC = () => {
  const params = useParams();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    const fetchInfluencerDetails = async () => {
      try {
        setIsLoading(true);
        const influencerId = parseInt(params.id as string);
        const data = await apiClient.getInfluencerById(influencerId);
        setInfluencer(data);
      } catch (error) {
        console.error('Error fetching influencer details:', error);
        toast.error('Failed to load influencer details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchInfluencerDetails();
    }
  }, [params.id]);

  const handleContactInfluencer = async () => {
    setIsContacting(true);
    try {
      // Simulate contact action
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contact request sent! The influencer will get back to you soon.');
    } catch (error) {
      toast.error('Failed to send contact request');
    } finally {
      setIsContacting(false);
    }
  };

  const getPlatformIcon = (platformName: string) => {
    const platform = platformName.toLowerCase();
    if (platform.includes('instagram')) return Instagram;
    if (platform.includes('youtube')) return Youtube;
    if (platform.includes('tiktok')) return Video;
    if (platform.includes('twitter')) return Twitter;
    return Globe;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading influencer details...</p>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Influencer Not Found</h2>
          <p className="text-gray-600 mb-6">The influencer you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="relative h-48 bg-gradient-to-r from-primary-600 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16 mb-6">
                <div className="flex items-end space-x-6">
                  <div className="w-32 h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center">
                    <Users className="w-16 h-16 text-primary-600" />
                  </div>
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {influencer.user ? `${influencer.user.first_name || ''} ${influencer.user.last_name || ''}`.trim() || influencer.user.username : 'Unknown Influencer'}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{influencer.base_country.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{influencer.total_posts || 0} posts</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleContactInfluencer}
                    isLoading={isContacting}
                    size="lg"
                    className="px-8"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Influencer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {influencer.bio || 'This influencer hasn\'t added a bio yet.'}
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Total Posts</h3>
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-primary-600">{influencer.total_posts || 0}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Growth Rate</h3>
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{influencer.growth_rate || 0}%</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Successful Campaigns</h3>
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{influencer.successful_campaigns || 0}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Rate per Post</h3>
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">${influencer.rate_per_post || 0}</p>
                  </div>
                </div>
              </div>

              {/* Collaboration Countries */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available for Collaboration In</h2>
                <div className="flex flex-wrap gap-3">
                  {influencer.collaboration_countries.length > 0 ? (
                    influencer.collaboration_countries.map((country) => (
                      <span
                        key={country.id}
                        className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {country.name}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      <Globe className="w-4 h-4 mr-2" />
                      Available Globally
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">contact@influencer.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">+1 (555) 123-4567</span>
                  </div>
                  {influencer.website_url && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                      <a 
                        href={influencer.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.languages ? (
                    influencer.languages.split(',').map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {language.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Availability</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${influencer.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${influencer.availability ? 'text-green-700' : 'text-red-700'}`}>
                    {influencer.availability ? 'Available for Projects' : 'Currently Unavailable'}
                  </span>
                </div>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
                <div className="space-y-3">
                  {['Instagram', 'YouTube', 'TikTok', 'Twitter'].map((platform) => {
                    const IconComponent = getPlatformIcon(platform);
                    return (
                      <div key={platform} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetailsPage; 