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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading influencer details...</p>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Influencer Not Found</h2>
          <p className="text-slate-400 mb-6">The influencer you&apos;re looking for doesn&apos;t exist.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm shadow-lg border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-slate-300 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden mb-8 border border-slate-700/50">
            <div className="relative h-48 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
            
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16 mb-6">
                <div className="flex items-end space-x-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl border-4 border-slate-800 flex items-center justify-center ring-4 ring-slate-700/30">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {influencer.user ? `${influencer.user.first_name || ''} ${influencer.user.last_name || ''}`.trim() || influencer.user.username : 'Unknown Influencer'}
                    </h1>
                    <div className="flex items-center space-x-4 text-slate-300">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-cyan-400" />
                        <span>{influencer.base_country.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">4.8</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                        <span>{influencer.total_posts || 0} posts</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <Button
                    onClick={handleContactInfluencer}
                    isLoading={isContacting}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
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
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-cyan-400" />
                  About
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {influencer.bio || 'This influencer hasn\'t added a bio yet.'}
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
                  Performance Metrics
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Total Posts</h3>
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{influencer.total_posts || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Content created</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Growth Rate</h3>
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{influencer.growth_rate || 0}%</p>
                    <p className="text-xs text-slate-400 mt-1">Audience growth</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Successful Campaigns</h3>
                      <Star className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{influencer.successful_campaigns || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Completed projects</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Rate per Post</h3>
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-bold text-amber-400">${influencer.rate_per_post || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Average pricing</p>
                  </div>
                </div>
              </div>

              {/* Collaboration Countries */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-cyan-400" />
                  Available for Collaboration In
                </h2>
                <div className="flex flex-wrap gap-3">
                  {influencer.collaboration_countries.length > 0 ? (
                    influencer.collaboration_countries.map((country) => (
                      <span
                        key={country.id}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500/10 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-200"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {country.name}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-slate-700/50 text-slate-300 rounded-full text-sm font-medium border border-slate-600">
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
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-300">contact@influencer.com</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <Phone className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-300">+1 (555) 123-4567</span>
                  </div>
                  {influencer.website_url && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-cyan-500/50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-cyan-400" />
                      <a 
                        href={influencer.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.languages ? (
                    influencer.languages.split(',').map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600/30 hover:bg-slate-700 transition-colors"
                      >
                        {language.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Not specified</span>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                  Availability
                </h3>
                <div className={`flex items-center space-x-3 p-4 rounded-lg ${
                  influencer.availability 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${influencer.availability ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${influencer.availability ? 'text-emerald-400' : 'text-red-400'}`}>
                    {influencer.availability ? 'Available for Projects' : 'Currently Unavailable'}
                  </span>
                </div>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                  Social Media
                </h3>
                <div className="space-y-3">
                  {['Instagram', 'YouTube', 'TikTok', 'Twitter'].map((platform) => {
                    const IconComponent = getPlatformIcon(platform);
                    return (
                      <div key={platform} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-200">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                        <span className="text-slate-300">{platform}</span>
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