'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Plus, X, DollarSign, User, Mail, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { SocialMediaPlatform, Country } from '@/types';
import toast from 'react-hot-toast';
import CountrySelect from './CountrySelect';



interface SocialMediaAccount {
  platform_id: number;
  username: string;
}

interface InfluencerRateFormData {
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  base_country_id?: number;
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
  const [isGeneratingSocialMediaPlan, setIsGeneratingSocialMediaPlan] = useState(false);

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

  const handleGenerateSocialMediaPlan = async () => {
    const formData = watch();
    
    // Validate required fields
    const requiredFields = {
      email: formData.email,
      content_type: formData.content_type,
      base_rate: formData.base_rate
    };

    // Check for empty or missing required fields
    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        if (key === 'base_rate') {
          return !value || (typeof value === 'number' && value <= 0);
        }
        return !value || value.toString().trim() === '';
      })
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      const fieldNames = {
        email: 'Email Address',
        content_type: 'Content Type',
        base_rate: 'Base Rate'
      };

      const missingFields = emptyFields.map(field => fieldNames[field as keyof typeof fieldNames]).join(', ');
      toast.error(`Please fill in the following required fields: ${missingFields}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate base rate
    if (typeof formData.base_rate === 'number' && formData.base_rate <= 0) {
      toast.error('Please enter a valid base rate greater than 0');
      return;
    }

    setIsGeneratingSocialMediaPlan(true);
    try {
      // Prepare the influencer profile data for social media plan generation
      const socialMediaPlanData = {
        influencer_profile: {
          email: formData.email,
          first_name: formData.first_name || 'Anonymous',
          last_name: formData.last_name || 'User',
          bio: formData.bio || '',
          website_url: formData.website_url || '',
          languages: formData.languages || 'English',
          base_country_id: formData.base_country_id || 1,
          content_type: formData.content_type,
          base_rate: formData.base_rate,
          description: formData.description || '',
          file_format: 'pdf' // Default to PDF format
        }
      };

      const response = await apiClient.generateSocialMediaPlanPublic(socialMediaPlanData);
      
      // Poll for status
      const pollStatus = async () => {
        try {
          const statusResponse = await apiClient.checkDocumentStatus(response.document_id);
          
          if (statusResponse.status === 'completed') {
            await apiClient.downloadDocument(response.document_id);
            toast.success('Social media plan document downloaded successfully!');
            setIsGeneratingSocialMediaPlan(false);
          } else if (statusResponse.status === 'failed') {
            toast.error('Social media plan document generation failed');
            setIsGeneratingSocialMediaPlan(false);
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          toast.error('Error checking document status');
          setIsGeneratingSocialMediaPlan(false);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error generating social media plan:', error);
      toast.error('Failed to generate social media plan document');
      setIsGeneratingSocialMediaPlan(false);
    }
  };

  const generateUsername = (firstName?: string, lastName?: string): string => {
    if (firstName && lastName) {
      const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomNumber = Math.floor(Math.random() * 1000);
      return `${cleanFirstName}${cleanLastName}${randomNumber}`;
    } else {
      const randomString = Math.random().toString(36).substring(2, 8);
      const randomNumber = Math.floor(Math.random() * 1000);
      return `influencer_${randomString}${randomNumber}`;
    }
  };

  const handleCreateProfile = async () => {
    try {
      setIsSubmitting(true);
      const formData = watch();
      
      // Generate username
      const username = generateUsername(formData.first_name, formData.last_name);
      
      // Prepare data for the API
      const influencerData = {
        first_name: formData.first_name || 'Anonymous',
        last_name: formData.last_name || 'User',
        username: username,
        email: formData.email,
        bio: formData.bio || '',
        profile_image_url: '',
        website_url: formData.website_url || '',
        languages: formData.languages || '',
        availability: true,
        rate_per_post: formData.base_rate || 0,
        total_posts: 0,
        growth_rate: 0,
        successful_campaigns: 0,
        base_country_id: formData.base_country_id || 1, // Default to first country if not selected
        collaboration_country_ids: []
      };

      // Call the API
      const response = await apiClient.createInfluencerPublic(influencerData);
      
      toast.success('Influencer profile created successfully!');
      console.log('Created influencer:', response);
      
      // Reset form
      reset();
      setSocialAccounts([{ platform_id: 0, username: '' }]);
      
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            Create Your Influencer or Professional Influencer Profile
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
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register('first_name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('last_name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Country
                    </label>
                    <CountrySelect
                      value={(() => {
                        const countryId = watch('base_country_id');
                        return countryId && countryId > 0 ? [countryId] : [];
                      })()}
                      onChange={(countryIds) => setValue('base_country_id', countryIds.length > 0 ? countryIds[0] : undefined)}
                      placeholder="Select base country..."
                      multiple={false}
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

              {/* Social Media Accounts - Temporarily Hidden */}
              {/* <div className="space-y-6">
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
              </div> */}

              {/* Rate Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                  How much will you be charging for promoting for brands?
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
                  onClick={handleCreateProfile}
                  isLoading={isSubmitting}
                  className="px-12 bg-green-600 hover:bg-green-700 text-white"
                >
                  Create Profile
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleGenerateSocialMediaPlan}
                  isLoading={isGeneratingSocialMediaPlan}
                  className="px-12 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Social Media Plan
                </Button>
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
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="px-12"
                >
                  Submit Rate Card
                </Button>
              </div>
            </form>

            {/* Social Media Plan Generation Status */}
            {isGeneratingSocialMediaPlan && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="text-lg font-medium text-gray-700">
                    Generating Social Media Plan document...
                  </span>
                </div>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Please wait while we analyze your influencer profile and generate a comprehensive 1-month social media plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerRateForm; 