'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle,
  Megaphone
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface UpdatePromotionData {
  promotion_name: string;
  promotion_item: string;
  description: string;
  start_date: string;
  end_date: string;
  discount: number;
  budget: number;
  target_audience: string;
  social_media_platform_id: number;
}

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const promotionId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [businessId, setBusinessId] = useState<number>(1);
  const [formData, setFormData] = useState<UpdatePromotionData>({
    promotion_name: '',
    promotion_item: '',
    description: '',
    start_date: '',
    end_date: '',
    discount: 0,
    budget: 0,
    target_audience: '',
    social_media_platform_id: 1
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePromotionData, string>>>({});

  // Load promotion data
  useEffect(() => {
    const loadPromotionData = async () => {
      try {
        setIsLoadingData(true);
        const promotion = await apiClient.getPromotion(parseInt(promotionId));
        
        setBusinessId((promotion as any).business_id || 1);
        setFormData({
          promotion_name: promotion.promotion_name,
          promotion_item: promotion.promotion_item,
          description: promotion.description || '',
          start_date: promotion.start_date.split('T')[0], // Convert ISO to date input format
          end_date: promotion.end_date.split('T')[0], // Convert ISO to date input format
          discount: promotion.discount || 0,
          budget: promotion.budget || 0,
          target_audience: promotion.target_audience || '',
          social_media_platform_id: promotion.social_media_platform_id
        });
      } catch (error: any) {
        console.error('Failed to load promotion:', error);
        
        // Handle different error response formats
        let errorMessage = 'Failed to load promotion data';
        
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Handle Pydantic validation errors (array format)
          if (Array.isArray(errorData)) {
            errorMessage = errorData.map(err => err.msg || err.message || 'Validation error').join(', ');
          }
          // Handle single error object
          else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
          // Handle error object with msg field
          else if (errorData.msg) {
            errorMessage = errorData.msg;
          }
          // Handle error object with message field
          else if (errorData.message) {
            errorMessage = errorData.message;
          }
          // Handle string error
          else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Ensure errorMessage is a string and not an object
        if (typeof errorMessage === 'object') {
          errorMessage = 'Failed to load promotion data';
        }
        
        toast.error(errorMessage);
        router.push('/business/promotions');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (promotionId) {
      loadPromotionData();
    }
  }, [promotionId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' || name === 'budget' ? parseFloat(value) || 0 : 
              name === 'social_media_platform_id' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof UpdatePromotionData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdatePromotionData, string>> = {};

    if (!formData.promotion_name.trim()) {
      newErrors.promotion_name = 'Promotion name is required';
    }

    if (!formData.promotion_item.trim()) {
      newErrors.promotion_item = 'Promotion item is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!formData.target_audience.trim()) {
      newErrors.target_audience = 'Target audience is required';
    }

    if (!formData.social_media_platform_id || formData.social_media_platform_id === 0) {
      newErrors.social_media_platform_id = 'Social media platform is required';
    }

    // Validate date logic
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate and prepare the promotion data for API submission
      const promotionData = {
        business_id: businessId, // Add required business_id field
        promotion_name: formData.promotion_name?.trim() || '',
        promotion_item: formData.promotion_item?.trim() || '',
        description: formData.description?.trim() || undefined,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        discount: formData.discount && formData.discount > 0 ? formData.discount : undefined,
        budget: formData.budget && formData.budget > 0 ? formData.budget : undefined,
        target_audience: formData.target_audience?.trim() || undefined,
        social_media_platform_id: parseInt(formData.social_media_platform_id.toString()) || 1
      };

      // Additional validation before API call
      if (!promotionData.promotion_name) {
        throw new Error('Promotion name is required');
      }
      if (!promotionData.promotion_item) {
        throw new Error('Promotion item is required');
      }
      if (!promotionData.start_date || !promotionData.end_date) {
        throw new Error('Start and end dates are required');
      }
      if (!promotionData.social_media_platform_id || promotionData.social_media_platform_id < 1) {
        throw new Error('Valid social media platform is required');
      }

      // Call the API to update the promotion
      const response = await apiClient.updatePromotion(parseInt(promotionId), promotionData);
      
      console.log('Promotion updated successfully:', response);
      toast.success('Promotion updated successfully!');
      router.push('/business/promotions');
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      
      // Handle different error response formats
      let errorMessage = 'Failed to update promotion. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle Pydantic validation errors (array format)
        if (Array.isArray(errorData)) {
          errorMessage = errorData.map(err => err.msg || err.message || 'Validation error').join(', ');
        }
        // Handle single error object
        else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        // Handle error object with msg field
        else if (errorData.msg) {
          errorMessage = errorData.msg;
        }
        // Handle error object with message field
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Handle string error
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Ensure errorMessage is a string and not an object
      if (typeof errorMessage === 'object') {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/business/promotions');
  };

  if (isLoadingData) {
    return (
      <UnifiedDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Megaphone className="w-8 h-8 mr-3 text-purple-400" />
                  Edit Promotion
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Update your promotion details and settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 lg:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Promotion Name *
                    </label>
                    <input
                      type="text"
                      name="promotion_name"
                      value={formData.promotion_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.promotion_name ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                      placeholder="Enter promotion name"
                    />
                    {errors.promotion_name && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.promotion_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Promotion Type *
                    </label>
                    <input
                      type="text"
                      name="promotion_item"
                      value={formData.promotion_item}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.promotion_item ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                      placeholder="e.g., Product Launch, Brand Awareness"
                    />
                    {errors.promotion_item && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.promotion_item}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
                    placeholder="Describe your promotion goals and content"
                  />
                </div>
              </div>

              {/* Dates and Budget */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Dates & Budget
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.start_date ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                    />
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.start_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.end_date ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.end_date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Budget *
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.budget ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                      placeholder="Enter budget amount"
                    />
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
                      placeholder="Enter discount percentage"
                    />
                  </div>
                </div>
              </div>

              {/* Target Audience and Platform */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Target & Platform
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Audience *
                    </label>
                    <input
                      type="text"
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.target_audience ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                      placeholder="e.g., Young Adults, Tech Enthusiasts, Fashion Lovers"
                    />
                    {errors.target_audience && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.target_audience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Primary Social Media Platform *
                    </label>
                    <select
                      name="social_media_platform_id"
                      value={formData.social_media_platform_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.social_media_platform_id ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                    >
                      <option value="">Select a platform</option>
                      <option value="1">Instagram</option>
                      <option value="2">TikTok</option>
                      <option value="3">YouTube</option>
                      <option value="4">Facebook</option>
                      <option value="5">Twitter</option>
                      <option value="6">LinkedIn</option>
                      <option value="7">Snapchat</option>
                      <option value="8">Pinterest</option>
                      <option value="9">Twitch</option>
                      <option value="10">Discord</option>
                    </select>
                    {errors.social_media_platform_id && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.social_media_platform_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-slate-300 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Promotion</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
