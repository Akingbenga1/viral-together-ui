'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { 
  Eye, 
  EyeOff, 
  Users, 
  Mail, 
  Lock, 
  User, 
  Star, 
  Building, 
  Plus, 
  X, 
  Instagram, 
  Youtube, 
  MapPin,
  Globe,
  Target,
  Camera,
  Hash,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';
import InteractiveMap from '@/components/InteractiveMap';
import CountrySelect from '@/components/CountrySelect';
import toast from 'react-hot-toast';

// Types for the extended registration forms
interface UserRegistrationData extends RegisterData {
  confirmPassword: string;
}

// API Response type for social media platforms
interface SocialMediaPlatformAPI {
  id: number;
  name: string;
  icon_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface SocialMediaPlatform {
  platform_id: number;
  platform_name: string;
  handle: string;
}

interface InfluencerRegistrationData extends UserRegistrationData {
  firstName: string;
  lastName: string;
  bio: string;
  socialMediaPlatforms: SocialMediaPlatform[];
  baseCountryId: number;
  baseLocation: {
    lat: number;
    lng: number;
    cityName?: string;
    countryCode?: string;
    displayName?: string;
  };
  desiredLocation: {
    lat: number;
    lng: number;
    cityName?: string;
    countryCode?: string;
    displayName?: string;
  };
}

interface BusinessRegistrationData extends UserRegistrationData {
  businessName: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  businessDescription: string;
  websiteUrl: string;
  baseCountryId: number;
  businessLocation: {
    lat: number;
    lng: number;
    cityName?: string;
    countryCode?: string;
    displayName?: string;
  };
  desiredInfluencerLocation: {
    lat: number;
    lng: number;
    cityName?: string;
    countryCode?: string;
    displayName?: string;
  };
  businessSize: string;
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'influencer' | 'business'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  // Social media platforms from API
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState<SocialMediaPlatformAPI[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);

  // Industries for business registration
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
    'E-commerce & Retail',
    'Hospitality',
    'Media & Publishing',
    'Gaming',
    'Art & Design',
    'Music',
    'Home & Garden',
    'Pets & Animals',
    'Non-profit & Charity',
    'Professional Services',
    'Manufacturing',
    'Construction',
    'Agriculture',
    'Energy & Utilities',
    'Other'
  ];

  const businessSizes = [
    'Startup (1-10 employees)',
    'Small Business (11-50 employees)',
    'Medium Business (51-200 employees)',
    'Large Business (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<any>();

  const password = watch('password');

  // State for dynamic fields
  const [socialMediaFields, setSocialMediaFields] = useState<SocialMediaPlatform[]>([]);
  const [baseLocation, setBaseLocation] = useState<any>(null);
  const [desiredLocation, setDesiredLocation] = useState<any>(null);
  const [businessLocation, setBusinessLocation] = useState<any>(null);
  const [desiredInfluencerLocation, setDesiredInfluencerLocation] = useState<any>(null);

  // Fetch social media platforms from API on component mount
  useEffect(() => {
    const fetchSocialMediaPlatforms = async () => {
      try {
        setLoadingPlatforms(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-media-platforms/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch social media platforms');
        }
        const data: SocialMediaPlatformAPI[] = await response.json();
        setSocialMediaPlatforms(data);
      } catch (error) {
        console.error('Error fetching social media platforms:', error);
        toast.error('Failed to load social media platforms');
      } finally {
        setLoadingPlatforms(false);
      }
    };

    fetchSocialMediaPlatforms();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (activeTab === 'user') {
        const { confirmPassword, ...registerData } = data;
        await registerUser(registerData);
      } else if (activeTab === 'influencer') {
        // Validate social media platforms
        if (!socialMediaFields || socialMediaFields.length === 0) {
          toast.error('Please add at least one social media platform');
          return;
        }
        
        // Validate at least one platform has both platform_id and handle
        const validPlatforms = socialMediaFields.filter(p => p.platform_id && p.handle);
        if (validPlatforms.length === 0) {
          toast.error('Please complete at least one social media platform with platform and handle');
          return;
        }
        
        // Validate base location
        if (!baseLocation || !baseLocation.latitude || !baseLocation.longitude) {
          toast.error('Please select your base location on the map');
          return;
        }
        
        // Prepare influencer registration data
        const influencerData = {
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
          bio: data.bio,
          profile_image_url: data.profile_image_url,
          website_url: data.website_url,
          languages: data.languages,
          base_country_id: baseLocation.countryId || 1, // Use selected country from CountrySelect
          collaboration_country_ids: [],
          
          social_media_platforms: validPlatforms.map(platform => ({
            social_media_platform_id: platform.platform_id,
            handle: platform.handle,
            bio_url: null,
            follower_count: null,
            is_verified: false
          })),
          
          base_location: {
            latitude: baseLocation.latitude,
            longitude: baseLocation.longitude,
            city_name: baseLocation.cityName,
            country_code: baseLocation.countryCode,
            country_name: baseLocation.countryName,
            region_name: baseLocation.region_name,
            region_code: baseLocation.region_code
          },
          
          desired_location: desiredLocation ? {
            latitude: desiredLocation.latitude,
            longitude: desiredLocation.longitude,
            city_name: desiredLocation.cityName,
            country_code: desiredLocation.countryCode,
            country_name: desiredLocation.countryName,
            region_name: desiredLocation.region_name,
            region_code: desiredLocation.region_code
          } : null
        };
        
        // Remove null desired_location if not set
        if (!influencerData.desired_location) {
          delete influencerData.desired_location;
        }
        
        toast.loading('Creating your influencer profile...');
        
        // Import apiClient
        const { apiClient } = await import('@/lib/api');
        
        // Call the API
        await apiClient.createInfluencerPublic(influencerData);
        
        toast.dismiss();
        toast.success('Influencer profile created successfully! Please login to continue.');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
        
      } else if (activeTab === 'business') {
        // Validate business location
        if (!businessLocation || !businessLocation.latitude || !businessLocation.longitude) {
          toast.error('Please select your business location on the map');
          return;
        }
        
        // Prepare business registration data
        const businessData = {
          name: data.businessName,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone,
          industry: data.industry,
          description: data.businessDescription,
          website_url: data.websiteUrl,
          base_country_id: businessLocation.countryId || 1,
          collaboration_country_ids: [],
          
          // User creation fields
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          password: data.password,
          
          // Location fields
          business_location: {
            latitude: businessLocation.latitude,
            longitude: businessLocation.longitude,
            city_name: businessLocation.cityName,
            country_code: businessLocation.countryCode,
            country_name: businessLocation.countryName,
            region_name: businessLocation.region_name,
            region_code: businessLocation.region_code
          },
          
          desired_influencer_location: desiredInfluencerLocation ? {
            latitude: desiredInfluencerLocation.latitude,
            longitude: desiredInfluencerLocation.longitude,
            city_name: desiredInfluencerLocation.cityName,
            country_code: desiredInfluencerLocation.countryCode,
            country_name: desiredInfluencerLocation.countryName,
            region_name: desiredInfluencerLocation.region_name,
            region_code: desiredInfluencerLocation.region_code
          } : undefined
        };
        
        // Remove undefined desired_influencer_location if not set
        if (!businessData.desired_influencer_location) {
          delete businessData.desired_influencer_location;
        }
        
        toast.loading('Creating your business profile...');
        
        // Import apiClient
        const { apiClient } = await import('@/lib/api');
        
        // Call the API
        await apiClient.createBusinessPublic(businessData);
        
        toast.dismiss();
        toast.success('Business profile created successfully! Please login to continue.');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    } catch (error: any) {
      toast.dismiss();
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    }
  };

  const addSocialMediaField = () => {
    setSocialMediaFields([...socialMediaFields, { platform_id: 0, platform_name: '', handle: '' }]);
  };

  const removeSocialMediaField = (index: number) => {
    setSocialMediaFields(socialMediaFields.filter((_, i) => i !== index));
  };

  const updateSocialMediaField = (index: number, field: 'platform_id' | 'platform_name' | 'handle', value: string | number) => {
    const updated = [...socialMediaFields];
    if (field === 'platform_id') {
      const platformId = value as number;
      const platform = socialMediaPlatforms.find(p => p.id === platformId);
      updated[index].platform_id = platformId;
      updated[index].platform_name = platform?.name || '';
    } else if (field === 'handle') {
      updated[index].handle = value as string;
    }
    setSocialMediaFields(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 form-bg-pattern">
      <div className="form-container-dark w-full max-w-6xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-200">
              <Users className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-form-text mb-2">
            Create your account
          </h1>
          <p className="text-form-text-muted text-sm">
            Or{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Registration Type Tabs */}
        <div className="mb-8">
          <div className="bg-slate-800/50 rounded-xl p-2 backdrop-blur-sm border border-slate-700/50">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('user');
                  reset();
                  setSocialMediaFields([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <User className="w-5 h-5" />
                <span>User</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('influencer');
                  reset();
                  setSocialMediaFields([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'influencer'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Influencer</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('business');
                  reset();
                  setSocialMediaFields([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Business</span>
              </button>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* User Registration Tab */}
          {activeTab === 'user' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="label-dark">
                  Username
                </label>
                <div className="relative">
                  <input
                    {...register('username', { 
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' }
                    })}
                    type="text"
                    className={`input-dark pl-10 ${errors.username ? 'input-error' : ''}`}
                    placeholder="Enter your username"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                </div>
                {errors.username && (
                  <p className="form-error">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="label-dark">
                  Email
                </label>
                <div className="relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className={`input-dark pl-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                </div>
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="label-dark">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={`input-dark pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="label-dark">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    type="password"
                    className={`input-dark pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Influencer Registration Tab */}
          {activeTab === 'influencer' && (
            <div className="space-y-8">
              {/* Basic Account Information */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-cyan-400" />
                  Account Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-dark">Username</label>
                    <div className="relative">
                      <input
                        {...register('username', { 
                          required: 'Username is required',
                          minLength: { value: 3, message: 'Username must be at least 3 characters' }
                        })}
                        type="text"
                        className={`input-dark pl-10 ${errors.username ? 'input-error' : ''}`}
                        placeholder="Enter your username"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.username && (
                      <p className="form-error">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Email</label>
                    <div className="relative">
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className={`input-dark pl-10 ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">First Name</label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className={`input-dark ${errors.firstName ? 'input-error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="form-error">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Last Name</label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className={`input-dark ${errors.lastName ? 'input-error' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="form-error">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Password</label>
                    <div className="relative">
                      <input
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`input-dark pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
                        placeholder="Enter your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="form-error">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type="password"
                        className={`input-dark pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="form-error">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label-dark">Bio</label>
                  <textarea
                    {...register('bio', { required: 'Bio is required' })}
                    className={`input-dark resize-none ${errors.bio ? 'input-error' : ''}`}
                    placeholder="Tell us about yourself and your content..."
                    rows={3}
                  />
                  {errors.bio && (
                    <p className="form-error">{errors.bio.message}</p>
                  )}
                </div>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-cyan-400" />
                    Social Media Platforms
                  </h3>
                  <button
                    type="button"
                    onClick={addSocialMediaField}
                    className="btn-dark-primary px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Platform</span>
                  </button>
                </div>

                {socialMediaFields.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-slate-600/50 rounded-lg">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No social media platforms added yet</p>
                    <button
                      type="button"
                      onClick={addSocialMediaField}
                      className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    >
                      Add your first platform
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {socialMediaFields.map((field, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">Platform {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeSocialMediaField(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="label-dark text-sm">Platform</label>
                          <select
                            value={field.platform_id}
                            onChange={(e) => updateSocialMediaField(index, 'platform_id', parseInt(e.target.value))}
                            className="input-dark text-sm"
                            disabled={loadingPlatforms}
                          >
                            <option value="">
                              {loadingPlatforms ? 'Loading platforms...' : 'Select platform'}
                            </option>
                            {socialMediaPlatforms.map((platform) => (
                              <option key={platform.id} value={platform.id}>
                                {platform.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="label-dark text-sm">Handle/Channel ID</label>
                          <input
                            type="text"
                            value={field.handle}
                            onChange={(e) => updateSocialMediaField(index, 'handle', e.target.value)}
                            className="input-dark text-sm"
                            placeholder={`Enter your @username or profile URL`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Base Location */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                    Base Location
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">Where do you currently live?</p>
                  
                  <div className="mb-4">
                    <label className="label-dark">Country</label>
                    <CountrySelect
                      value={baseLocation?.countryId ? [baseLocation.countryId] : []}
                      onChange={(countryIds) => setBaseLocation({ ...baseLocation, countryId: countryIds[0] })}
                      placeholder="Select your country..."
                      multiple={false}
                    />
                  </div>

                  <div className="space-y-4">
                    <InteractiveMap
                      onLocationSelect={(lat, lng, cityName, countryCode, countryName, displayName) => {
                        setBaseLocation({
                          lat,
                          lng,
                          cityName,
                          countryCode,
                          countryName,
                          displayName
                        });
                      }}
                      initialLat={40.7128}
                      initialLng={-74.0060}
                    />
                    
                    {baseLocation && (
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <p className="text-white text-sm font-medium">Selected Location:</p>
                        <p className="text-slate-300 text-xs">
                          {baseLocation.displayName || baseLocation.cityName}, {baseLocation.countryName}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {baseLocation.lat?.toFixed(4)}, {baseLocation.lng?.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desired Location */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    Desired Location
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">Where would you like to start influencing?</p>
                  
                  <div className="space-y-4">
                    <InteractiveMap
                      onLocationSelect={(lat, lng, cityName, countryCode, countryName, displayName) => {
                        setDesiredLocation({
                          lat,
                          lng,
                          cityName,
                          countryCode,
                          countryName,
                          displayName
                        });
                      }}
                      initialLat={40.7128}
                      initialLng={-74.0060}
                    />
                    
                    {desiredLocation && (
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <p className="text-white text-sm font-medium">Target Location:</p>
                        <p className="text-slate-300 text-xs">
                          {desiredLocation.displayName || desiredLocation.cityName}, {desiredLocation.countryName}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {desiredLocation.lat?.toFixed(4)}, {desiredLocation.lng?.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Registration Tab */}
          {activeTab === 'business' && (
            <div className="space-y-8">
              {/* Account Information */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-cyan-400" />
                  Account Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-dark">Username</label>
                    <div className="relative">
                      <input
                        {...register('username', { 
                          required: 'Username is required',
                          minLength: { value: 3, message: 'Username must be at least 3 characters' }
                        })}
                        type="text"
                        className={`input-dark pl-10 ${errors.username ? 'input-error' : ''}`}
                        placeholder="Enter your username"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.username && (
                      <p className="form-error">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Email</label>
                    <div className="relative">
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className={`input-dark pl-10 ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Password</label>
                    <div className="relative">
                      <input
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`input-dark pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
                        placeholder="Enter your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="form-error">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type="password"
                        className={`input-dark pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="form-error">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-cyan-400" />
                  Business Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-dark">Business Name</label>
                    <input
                      {...register('businessName', { required: 'Business name is required' })}
                      type="text"
                      className={`input-dark ${errors.businessName ? 'input-error' : ''}`}
                      placeholder="Enter your business name"
                    />
                    {errors.businessName && (
                      <p className="form-error">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Industry</label>
                    <select
                      {...register('industry', { required: 'Industry is required' })}
                      className={`input-dark ${errors.industry ? 'input-error' : ''}`}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="form-error">{errors.industry.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">First Name</label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className={`input-dark ${errors.firstName ? 'input-error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="form-error">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Last Name</label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className={`input-dark ${errors.lastName ? 'input-error' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="form-error">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Contact Email</label>
                    <input
                      {...register('contactEmail', {
                        required: 'Contact email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className={`input-dark ${errors.contactEmail ? 'input-error' : ''}`}
                      placeholder="contact@business.com"
                    />
                    {errors.contactEmail && (
                      <p className="form-error">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Contact Phone</label>
                    <input
                      {...register('contactPhone', { required: 'Contact phone is required' })}
                      type="tel"
                      className={`input-dark ${errors.contactPhone ? 'input-error' : ''}`}
                      placeholder="+1234567890"
                    />
                    {errors.contactPhone && (
                      <p className="form-error">{errors.contactPhone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Website URL</label>
                    <input
                      {...register('websiteUrl')}
                      type="url"
                      className="input-dark"
                      placeholder="https://yourbusiness.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="label-dark">Business Size</label>
                    <select
                      {...register('businessSize', { required: 'Business size is required' })}
                      className={`input-dark ${errors.businessSize ? 'input-error' : ''}`}
                    >
                      <option value="">Select business size</option>
                      {businessSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    {errors.businessSize && (
                      <p className="form-error">{errors.businessSize.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label-dark">Business Description</label>
                  <textarea
                    {...register('businessDescription', { required: 'Business description is required' })}
                    className={`input-dark resize-none ${errors.businessDescription ? 'input-error' : ''}`}
                    placeholder="Describe your business, mission, and what makes you unique..."
                    rows={4}
                  />
                  {errors.businessDescription && (
                    <p className="form-error">{errors.businessDescription.message}</p>
                  )}
                </div>
              </div>

              {/* Business Locations */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Business Location */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-cyan-400" />
                    Business Location
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">Where is your business located?</p>
                  
                  <div className="space-y-4">
                    <InteractiveMap
                      onLocationSelect={(lat, lng, cityName, countryCode, countryName, displayName) => {
                        setBusinessLocation({
                          lat,
                          lng,
                          cityName,
                          countryCode,
                          countryName,
                          displayName
                        });
                      }}
                      initialLat={40.7128}
                      initialLng={-74.0060}
                    />
                    
                    {businessLocation && (
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <p className="text-white text-sm font-medium">Business Location:</p>
                        <p className="text-slate-300 text-xs">
                          {businessLocation.displayName || businessLocation.cityName}, {businessLocation.countryName}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {businessLocation.lat?.toFixed(4)}, {businessLocation.lng?.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desired Influencer Location */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    Desired Influencer Location
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">Where would you like to find influencers?</p>
                  
                  <div className="space-y-4">
                    <InteractiveMap
                      onLocationSelect={(lat, lng, cityName, countryCode, countryName, displayName) => {
                        setDesiredInfluencerLocation({
                          lat,
                          lng,
                          cityName,
                          countryCode,
                          countryName,
                          displayName
                        });
                      }}
                      initialLat={40.7128}
                      initialLng={-74.0060}
                    />
                    
                    {desiredInfluencerLocation && (
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <p className="text-white text-sm font-medium">Influencer Target Location:</p>
                        <p className="text-slate-300 text-xs">
                          {desiredInfluencerLocation.displayName || desiredInfluencerLocation.cityName}, {desiredInfluencerLocation.countryName}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {desiredInfluencerLocation.lat?.toFixed(4)}, {desiredInfluencerLocation.lng?.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Submit */}
          <div className="flex items-start space-x-3">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="checkbox-dark mt-0.5"
            />
            <label htmlFor="agree-terms" className="text-sm text-form-text leading-5 cursor-pointer">
              I agree to the{' '}
              <Link href="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-dark-primary w-full h-12 rounded-xl font-medium transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              `Create ${activeTab} account`
            )}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-form-border/20 mt-8">
          <p className="text-form-text-muted text-sm">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}