'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Plus, X, DollarSign, User, Mail, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { SocialMediaPlatform } from '@/types';
import toast from 'react-hot-toast';

interface SocialMediaAccount {
  platform_id: number;
  username: string;
}

interface InfluencerRateFormData {
  email: string;
  bio?: string;
  location?: string;
  languages?: string;
  website_url?: string;
  social_accounts: SocialMediaAccount[];
  content_type: string;
  base_rate: number;
  description?: string;
}

const InfluencerRateForm: React.FC = () => {
  const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([
    { platform_id: 0, username: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<InfluencerRateFormData>({
    defaultValues: {
      base_rate: 0,
    }
  });

  // Fetch social media platforms
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setIsLoading(true);
        const platforms = await apiClient.getSocialMediaPlatforms();
        setPlatforms(platforms);
      } catch (error) {
        console.error('Failed to fetch platforms:', error);
        toast.error('Failed to load social media platforms');
        // Fallback platforms if API fails
        setPlatforms([
          { id: 1, name: 'Instagram' },
          { id: 2, name: 'TikTok' },
          { id: 3, name: 'Twitter' },
          { id: 4, name: 'Facebook' },
          { id: 5, name: 'YouTube' },
          { id: 6, name: 'LinkedIn' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const addSocialAccount = () => {
    setSocialAccounts([...socialAccounts, { platform_id: 0, username: '' }]);
  };

  const removeSocialAccount = (index: number) => {
    if (socialAccounts.length > 1) {
      setSocialAccounts(socialAccounts.filter((_, i) => i !== index));
    }
  };

  const updateSocialAccount = (index: number, field: keyof SocialMediaAccount, value: string | number) => {
    const updated = socialAccounts.map((account, i) => 
      i === index ? { ...account, [field]: value } : account
    );
    setSocialAccounts(updated);
  };

  const handleGenerateBusinessProposal = () => {
    console.log('Generate Business Proposal clicked');
    toast.success('Business Proposal generation feature coming soon!');
  };

  const handleGenerateSocialMediaPlan = () => {
    console.log('Generate Social Media Plan clicked');
    toast.success('Social Media Plan generation feature coming soon!');
  };

  const onSubmit = async (data: InfluencerRateFormData) => {
    try {
      setIsSubmitting(true);

      // Validate social accounts
      const validSocialAccounts = socialAccounts.filter(
        account => account.platform_id > 0 && account.username.trim() !== ''
      );

      if (validSocialAccounts.length === 0) {
        toast.error('Please add at least one social media account');
        return;
      }

      // Create user account (simplified - in real app, this would be more complex)
      const userData = {
        email: data.email,
        password: 'temp_password', // In real app, this would be handled differently
        full_name: 'Influencer User', // This would come from the form
      };

      // Create influencer profile
      const influencerData = {
        bio: data.bio || '',
        location: data.location || '',
        languages: data.languages || '',
        website_url: data.website_url || '',
        availability: true,
        rate_per_post: data.base_rate,
        user_id: 1, // This would come from the created user
      };

      // Create rate card for the first platform (in real app, you might create multiple)
      const rateCardData = {
        influencer_id: 1, // This would come from the created influencer
        platform_id: validSocialAccounts[0].platform_id,
        content_type: data.content_type,
        base_rate: data.base_rate,
        description: data.description || '',
      };

      // For demo purposes, we'll just show success message
      // In real implementation, you'd make actual API calls
      console.log('Form data:', { userData, influencerData, rateCardData, socialAccounts: validSocialAccounts });
      
      toast.success('Rate card submitted successfully! We will contact you soon.');
      
      // Reset form
      reset();
      setSocialAccounts([{ platform_id: 0, username: '' }]);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit rate card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentTypes = [
    'Instagram Post',
    'Instagram Story',
    'Instagram Reel',
    'TikTok Video',
    'YouTube Video',
    'YouTube Short',
    'Twitter Post',
    'Facebook Post',
    'LinkedIn Post',
    'Blog Post',
    'Product Review',
    'Unboxing Video',
    'Tutorial',
    'Brand Mention',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Set Your Influencer Rates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our platform and connect with brands. Set your rates and let businesses find you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-2 text-primary-600" />
                  Basic Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <input
                      type="text"
                      {...register('languages')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="English, Spanish, French"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      {...register('website_url')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself and your content..."
                  />
                </div>
              </div>

              {/* Social Media Accounts */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-primary-600" />
                  Social Media Accounts *
                </h3>
                
                {socialAccounts.map((account, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform
                      </label>
                      <select
                        value={account.platform_id}
                        onChange={(e) => updateSocialAccount(index, 'platform_id', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value={0}>Select Platform</option>
                        {platforms.map((platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={account.username}
                        onChange={(e) => updateSocialAccount(index, 'username', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@yourusername"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {socialAccounts.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => removeSocialAccount(index)}
                          className="p-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {index === socialAccounts.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={addSocialAccount}
                          className="p-3"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <p className="text-sm text-gray-500">
                  Add at least one social media account. You can add multiple platforms.
                </p>
              </div>

              {/* Rate Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                  Rate Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type *
                    </label>
                    <select
                      {...register('content_type', { required: 'Content type is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Content Type</option>
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.content_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.content_type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Rate (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('base_rate', { 
                        required: 'Base rate is required',
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="100.00"
                    />
                    {errors.base_rate && (
                      <p className="mt-1 text-sm text-red-600">{errors.base_rate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any additional details about your rates or services..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleGenerateBusinessProposal}
                  className="px-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Business Proposal
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleGenerateSocialMediaPlan}
                  className="px-12 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Social Media Plan
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="px-12"
                >
                  Submit Rate Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerRateForm; 