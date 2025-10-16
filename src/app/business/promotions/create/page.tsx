'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Calendar,
  DollarSign,
  Target,
  Users,
  FileText,
  AlertCircle,
  Building2
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface Business {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
}

interface CreatePromotionData {
  business_id: number;
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

export default function CreatePromotionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [formData, setFormData] = useState<CreatePromotionData>({
    business_id: 0,
    promotion_name: '',
    promotion_item: '',
    description: '',
    start_date: '',
    end_date: '',
    discount: 0,
    budget: 0,
    target_audience: '',
    social_media_platform_id: 9
  });

  const [errors, setErrors] = useState<Partial<CreatePromotionData & { social_media_platform_id?: string; business_id?: string }>>({});

  // Fetch businesses owned by the user
  useEffect(() => {
    const fetchUserBusinesses = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingBusinesses(true);
        const allBusinesses = await apiClient.getAllBusinesses();
        
        // Filter businesses owned by the logged-in user
        const userBusinesses = allBusinesses.filter((b: Business) => b.owner_id === user.id);
        setBusinesses(userBusinesses);
        
        // Auto-select the first business if there's only one
        if (userBusinesses.length === 1) {
          setFormData(prev => ({
            ...prev,
            business_id: userBusinesses[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        toast.error('Failed to load your businesses');
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchUserBusinesses();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' || name === 'budget' ? parseFloat(value) || 0 : 
              name === 'social_media_platform_id' || name === 'business_id' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreatePromotionData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePromotionData> = {};

    if (!formData.business_id || formData.business_id === 0) {
      newErrors.business_id = 'Business is required';
    }
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
    
    // Prevent submission if no business is selected
    if (!formData.business_id || formData.business_id === 0) {
      toast.error('Please select a business first');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare the promotion data for API submission
      const promotionData = {
        business_id: formData.business_id,
        promotion_name: formData.promotion_name,
        promotion_item: formData.promotion_item,
        description: formData.description || null,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        discount: formData.discount ? parseFloat(formData.discount) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        spent_amount: 0, // Default to 0 for new promotions
        status: 'pending', // Default status for new promotions
        target_audience: formData.target_audience || null,
        social_media_platform_id: parseInt(formData.social_media_platform_id)
      };

      // Call the API to create the promotion
      const response = await apiClient.createPromotion(promotionData);
      
      console.log('Promotion created successfully:', response);
      toast.success('Promotion created successfully!');
      router.push('/business/promotions');
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create promotion. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/business/promotions');
  };

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
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create New Promotion
                </h1>
                <p className="text-slate-300 text-lg">
                  Set up a new promotional campaign for your business
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Selection */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                Business Selection
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Business *
                </label>
                {loadingBusinesses ? (
                  <div className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-400 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
                    Loading your businesses...
                  </div>
                ) : businesses.length === 0 ? (
                  <div className="w-full px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    No businesses found. Please create a business first.
                  </div>
                ) : (
                  <>
                    <select
                      name="business_id"
                      value={formData.business_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                        errors.business_id ? 'border-red-500' : 'border-slate-600/30'
                      }`}
                    >
                      <option value="0">Select a business</option>
                      {businesses.map((business) => (
                        <option key={business.id} value={business.id}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                    {errors.business_id && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.business_id}
                      </p>
                    )}
                    {businesses.length > 0 && formData.business_id === 0 && (
                      <p className="mt-2 text-sm text-slate-400">
                        You have {businesses.length} business{businesses.length > 1 ? 'es' : ''} available
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-cyan-400" />
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
                    Promotion Item *
                  </label>
                  <input
                    type="text"
                    name="promotion_item"
                    value={formData.promotion_item}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200 ${
                      errors.promotion_item ? 'border-red-500' : 'border-slate-600/30'
                    }`}
                    placeholder="e.g., Product, Service, Event"
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
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
                  placeholder="Describe your promotion campaign..."
                />
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Campaign Details
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
            </div>

            {/* Budget & Target */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-400" />
                Budget & Target
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="mt-6">
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

              <div className="mt-6">
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
                  <option value="9">Instagram</option>
                  <option value="10">TikTok</option>
                  <option value="11">YouTube</option>
                  <option value="12">Twitter</option>
                  <option value="13">Facebook</option>
                </select>
                {errors.social_media_platform_id && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.social_media_platform_id}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-slate-300 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.business_id || formData.business_id === 0 || businesses.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Promotion</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Validation Message */}
            {!formData.business_id || formData.business_id === 0 ? (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Please select a business before creating a promotion</span>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
