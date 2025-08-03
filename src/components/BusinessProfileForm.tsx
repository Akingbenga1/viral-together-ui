'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building, Globe, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import CountrySelect from './CountrySelect';

interface BusinessProfileFormData {
  name: string;
  description: string;
  website_url?: string;
  industry: string;
  contact_email: string;
  contact_phone: string;
  first_name: string;
  last_name: string;
  username?: string;
  base_country_id: number;
  collaboration_country_ids: number[];
  owner_id: number;
}

interface CollaborationRequestFormData {
  campaign_title: string;
  campaign_description: string;
  target_audience: string;
  target_follower_range: string;
  preferred_niches: string[];
  deliverables: string[];
  compensation_range: string;
  campaign_duration: string;
  content_requirements: string;
  brand_guidelines: string;
  deadline: string;
  target_countries: string[];
  file_format: string;
}

const BusinessProfileForm: React.FC = () => {
  const [createdBusinessId, setCreatedBusinessId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<BusinessProfileFormData>({
    defaultValues: {
      collaboration_country_ids: []
    }
  });

  // Custom handler for collaboration countries with max 4 limit
  const handleCollaborationCountriesChange = (countryIds: number[]) => {
    if (countryIds.length > 4) {
      toast.error('Maximum of 4 countries allowed here.');
      return; // Don't update the form value
    }
    setValue('collaboration_country_ids', countryIds);
  };

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    formState: { errors: modalErrors },
    reset: resetModal
  } = useForm<CollaborationRequestFormData>({
    defaultValues: {
      preferred_niches: [],
      deliverables: [],
      target_countries: [],
      file_format: 'pdf'
    }
  });

  // Countries will be loaded dynamically via API

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
    'Other'
  ];

  const niches = [
    'technology',
    'smart home',
    'gadgets',
    'lifestyle',
    'fashion',
    'beauty',
    'health',
    'fitness',
    'food',
    'travel',
    'education',
    'entertainment',
    'sports',
    'finance',
    'automotive'
  ];

  const followerRanges = [
    '1K-10K',
    '10K-50K',
    '50K-100K',
    '100K-500K',
    '500K-1M',
    '1M+'
  ];

  const fileFormats = [
    'pdf',
    'txt',
    'png',
    'html'
  ];

  const onSubmit = async (data: BusinessProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Generate username from first name, last name, and random number
      const firstName = data.first_name.toLowerCase();
      const lastName = data.last_name.toLowerCase();
      const randomNumber = Math.floor(Math.random() * 1000);
      
      // Take first 3 characters of first name and first 2 characters of last name
      const firstNamePart = firstName.substring(0, 3);
      const lastNamePart = lastName.substring(0, 2);
      const username = `${firstNamePart}${lastNamePart}${randomNumber}`;

      // Prepare data for the public endpoint - only send required fields
      const businessData = {
        name: data.name,
        description: data.description,
        website_url: data.website_url,
        industry: data.industry,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        first_name: data.first_name,
        last_name: data.last_name,
        username: username,
        base_country_id: data.base_country_id,
        collaboration_country_ids: data.collaboration_country_ids
      };
      
      const response = await apiClient.createBusinessPublic(businessData);
      setCreatedBusinessId(response.id);
      toast.success('Business profile created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCollaborationRequest = async () => {
    // Keep the original handler for backward compatibility
    setIsGeneratingDocument(true);
    try {
      const businessId = createdBusinessId || 1;
      const documentData = {
        business_id: businessId,
        campaign_title: 'Sample Campaign',
        campaign_description: 'Sample campaign description',
        target_audience: 'General audience',
        target_follower_range: '50K-500K',
        preferred_niches: ['technology', 'lifestyle'],
        deliverables: ['1 post', '1 story'],
        compensation_range: '$500-$2000',
        campaign_duration: '2 weeks',
        content_requirements: 'Authentic content',
        brand_guidelines: 'Professional content',
        deadline: '2024-08-01',
        target_countries: ['United States'],
        file_format: 'pdf'
      };

      const response = await apiClient.generateCollaborationRequestGeneral(documentData);
      
      // Poll for status
      const pollStatus = async () => {
        try {
          const statusResponse = await apiClient.checkDocumentStatus(response.document_id);
          
          if (statusResponse.status === 'completed') {
            await apiClient.downloadDocument(response.document_id);
            toast.success('Document downloaded successfully!');
            setIsGeneratingDocument(false);
          } else if (statusResponse.status === 'failed') {
            toast.error('Document generation failed');
            setIsGeneratingDocument(false);
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          toast.error('Error checking document status');
          setIsGeneratingDocument(false);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document');
      setIsGeneratingDocument(false);
    }
  };

  const handleCollaborationModalSubmit = async (data: CollaborationRequestFormData) => {
    setIsModalSubmitting(true);
    try {
      const businessId = createdBusinessId || 1;
      const documentData = {
        business_id: businessId,
        ...data
      };

      const response = await apiClient.generateCollaborationRequestGeneral(documentData);
      
      // Poll for status
      const pollStatus = async () => {
        try {
          const statusResponse = await apiClient.checkDocumentStatus(response.document_id);
          
          if (statusResponse.status === 'completed') {
            await apiClient.downloadDocument(response.document_id);
            toast.success('Collaboration request downloaded successfully!');
            setIsModalSubmitting(false);
            setShowCollaborationModal(false);
            resetModal();
          } else if (statusResponse.status === 'failed') {
            toast.error('Document generation failed');
            setIsModalSubmitting(false);
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          toast.error('Error checking document status');
          setIsModalSubmitting(false);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error generating collaboration request:', error);
      toast.error('Failed to generate collaboration request');
      setIsModalSubmitting(false);
    }
  };

  const handleDownloadMarketSituation = async () => {
    const formData = watch();
    
    // Validate required fields
    const requiredFields = {
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      first_name: formData.first_name,
      last_name: formData.last_name,
      base_country_id: formData.base_country_id,
      collaboration_country_ids: formData.collaboration_country_ids
    };

    // Check for empty or missing required fields
    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        if (key === 'collaboration_country_ids') {
          return !value || (Array.isArray(value) && value.length === 0);
        }
        if (key === 'base_country_id') {
          return !value || value === 0;
        }
        return !value || value.toString().trim() === '';
      })
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      const fieldNames = {
        name: 'Business Name',
        description: 'Business Description',
        industry: 'Industry',
        contact_email: 'Contact Email',
        contact_phone: 'Contact Phone',
        first_name: 'First Name',
        last_name: 'Last Name',
        base_country_id: 'Base Country',
        collaboration_country_ids: 'Collaboration Countries'
      };

      const missingFields = emptyFields.map(field => fieldNames[field as keyof typeof fieldNames]).join(', ');
      toast.error(`Please fill in the following required fields: ${missingFields}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.contact_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    const phoneNumber = String(formData.contact_phone);
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate collaboration countries (must have at least one and maximum 4)
    if (!formData.collaboration_country_ids || formData.collaboration_country_ids.length === 0) {
      toast.error('Please select at least one collaboration country');
      return;
    }

    if (formData.collaboration_country_ids.length > 4) {
      toast.error('Maximum of 4 countries allowed here');
      return;
    }

    setIsGeneratingDocument(true);
    try {
      // Prepare the business profile data for market analysis
      const marketAnalysisData = {
        business_profile: {
          name: formData.name,
          description: formData.description,
          website_url: formData.website_url,
          industry: formData.industry,
          owner_id: 1, // Default owner ID for public form
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          first_name: formData.first_name,
          last_name: formData.last_name,
          base_country_id: formData.base_country_id,
          collaboration_country_ids: formData.collaboration_country_ids,
          file_format: 'pdf' // Default to PDF format
        }
      };

      const response = await apiClient.generateMarketAnalysisPublic(marketAnalysisData);
      
      // Poll for status
      const pollStatus = async () => {
        try {
          const statusResponse = await apiClient.checkDocumentStatus(response.document_id);
          
          if (statusResponse.status === 'completed') {
            await apiClient.downloadDocument(response.document_id);
            toast.success('Market analysis document downloaded successfully!');
            setIsGeneratingDocument(false);
          } else if (statusResponse.status === 'failed') {
            toast.error('Market analysis document generation failed');
            setIsGeneratingDocument(false);
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          toast.error('Error checking document status');
          setIsGeneratingDocument(false);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error generating market analysis:', error);
      toast.error('Failed to generate market analysis document');
      setIsGeneratingDocument(false);
    }
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Create Your Business Profile
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our platform and connect with talented influencers. Create your business profile and start building successful partnerships!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Building className="w-6 h-6 mr-2 text-primary-600" />
                    Business Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Business name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your Business Name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <select
                        {...register('industry', { required: 'Industry is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        {...register('website_url')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Country *
                      </label>
                      <CountrySelect
                        value={watch('base_country_id') ? [watch('base_country_id')] : []}
                        onChange={(countryIds) => setValue('base_country_id', countryIds[0] || 0)}
                        placeholder="Select base country..."
                        multiple={false}
                      />
                      {errors.base_country_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.base_country_id.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Business description is required' })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe your business, mission, and what makes you unique..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Building className="w-6 h-6 mr-2 text-primary-600" />
                    Contact Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('first_name', { required: 'First name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="John"
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('last_name', { required: 'Last name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        {...register('contact_email', { 
                          required: 'Contact email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="contact@yourbusiness.com"
                      />
                      {errors.contact_email && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        {...register('contact_phone', { required: 'Contact phone is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+1234567890"
                      />
                      {errors.contact_phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collaboration Countries */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Globe className="w-6 h-6 mr-2 text-primary-600" />
                    Collaboration Countries
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Countries for Collaboration
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select countries where you want to collaborate with influencers. Start typing to search countries.
                    </p>
                    <CountrySelect
                      value={watch('collaboration_country_ids') || []}
                      onChange={handleCollaborationCountriesChange}
                      placeholder="Search and select countries..."
                      multiple={true}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      For download of the market situation, you can only choose a maximum of 4 countries allowed for collaboration
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="px-12"
                  >
                    Create Business Profile
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleDownloadMarketSituation}
                    isLoading={isGeneratingDocument}
                    className="px-12 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Download Market Situation
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowCollaborationModal(true)}
                    disabled={true}
                    className="px-12 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Collaboration Request
                  </Button>
                </div>

                {/* Market Situation Generation Status */}
                {isGeneratingDocument && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="text-lg font-medium text-gray-700">
                        Generating Market Situation document...
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                      Please wait while we analyze your business profile and generate a comprehensive market analysis for your selected countries.
                    </p>
                  </div>
                )}

                {/* Collaboration Request Generation Status */}
                {isModalSubmitting && (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="text-lg font-medium text-gray-700">
                        Generating Collaboration Request document...
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                      Please wait while we create your collaboration request document with all the campaign details.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Request Modal */}
      {showCollaborationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Collaboration Request
                </h2>
                <button
                  onClick={() => {
                    setShowCollaborationModal(false);
                    resetModal();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitModal(handleCollaborationModalSubmit)} className="space-y-6">
                {/* Campaign Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      {...registerModal('campaign_title', { required: 'Campaign title is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Tech Product Launch Campaign"
                    />
                    {modalErrors.campaign_title && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.campaign_title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Follower Range *
                    </label>
                    <select
                      {...registerModal('target_follower_range', { required: 'Target follower range is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Follower Range</option>
                      {followerRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {modalErrors.target_follower_range && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.target_follower_range.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    {...registerModal('campaign_description', { required: 'Campaign description is required' })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe your campaign goals, objectives, and what you're looking to achieve..."
                  />
                  {modalErrors.campaign_description && (
                    <p className="mt-1 text-sm text-red-600">{modalErrors.campaign_description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    {...registerModal('target_audience', { required: 'Target audience is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Tech enthusiasts, early adopters, smart home users aged 25-45"
                  />
                  {modalErrors.target_audience && (
                    <p className="mt-1 text-sm text-red-600">{modalErrors.target_audience.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Niches *
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {niches.map((niche) => (
                      <label key={niche} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={niche}
                          {...registerModal('preferred_niches')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{niche}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deliverables *
                  </label>
                  <div className="space-y-2">
                    {[
                      '1 unboxing video',
                      '1 detailed review post',
                      '3 feature demonstration stories',
                      '1 integration showcase reel',
                      '1 testimonial video',
                      '2 Instagram feed posts',
                      '5 Instagram stories',
                      '1 TikTok video'
                    ].map((deliverable) => (
                      <label key={deliverable} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={deliverable}
                          {...registerModal('deliverables')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{deliverable}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compensation Range *
                    </label>
                    <input
                      type="text"
                      {...registerModal('compensation_range', { required: 'Compensation range is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., $1000-$5000"
                    />
                    {modalErrors.compensation_range && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.compensation_range.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration *
                    </label>
                    <input
                      type="text"
                      {...registerModal('campaign_duration', { required: 'Campaign duration is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 3 weeks"
                    />
                    {modalErrors.campaign_duration && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.campaign_duration.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Requirements *
                  </label>
                  <textarea
                    {...registerModal('content_requirements', { required: 'Content requirements are required' })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Honest reviews, creative demonstrations, real-life use cases"
                  />
                  {modalErrors.content_requirements && (
                    <p className="mt-1 text-sm text-red-600">{modalErrors.content_requirements.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Guidelines
                  </label>
                  <textarea
                    {...registerModal('brand_guidelines')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Professional setup, good lighting, clear audio for videos"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      {...registerModal('deadline', { required: 'Deadline is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {modalErrors.deadline && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.deadline.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Format *
                    </label>
                    <select
                      {...registerModal('file_format', { required: 'File format is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {fileFormats.map((format) => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {modalErrors.file_format && (
                      <p className="mt-1 text-sm text-red-600">{modalErrors.file_format.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Countries *
                  </label>
                  <input
                    type="text"
                    {...registerModal('target_countries')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., United States, Canada, United Kingdom"
                  />
                  {modalErrors.target_countries && (
                    <p className="mt-1 text-sm text-red-600">{modalErrors.target_countries.message}</p>
                  )}
                </div>

                {/* Centered Download Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isModalSubmitting}
                    className="px-12 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessProfileForm; 