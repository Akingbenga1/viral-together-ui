'use client';

import { useEffect, useState, useRef } from 'react';
import { Brain, ChevronLeft, ChevronRight, Calendar, Target, DollarSign, TrendingUp, Users, Star, Zap, Lightbulb, X, Edit, Check, Bot, Settings, Clock, User, MapPin, GraduationCap, Globe } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface InfluencerRecommendation {
  id: number;
  user_id: number;
  user_level: string;
  base_plan: any;
  enhanced_plan: any;
  monthly_schedule: any;
  performance_goals: any;
  pricing_recommendations: any;
  ai_insights: any[];
  created_at: string;
}

interface AIAgent {
  id: number;
  uuid: string;
  name: string;
  agent_type: string;
  capabilities: any;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface InfluencerLocation {
  id: number;
  influencer_id: number;
  city_name: string;
  region_name?: string;
  region_code?: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  postcode?: string;
  time_zone?: string;
  is_primary: boolean;
  created_at: string;
}

interface InfluencerCoachingGroup {
  id: number;
  name: string;
  description?: string;
  join_code: string;
  max_members?: number;
  current_members: number;
  created_at: string;
}

interface InfluencerCollaborationCountry {
  id: number;
  name: string;
  code: string;
}

interface UnifiedInfluencerProfile {
  influencer: any;
  locations: InfluencerLocation[];
  coaching_groups: InfluencerCoachingGroup[];
  collaboration_countries: InfluencerCollaborationCountry[];
  rate_cards: any[];
  rate_summary: any;
  influencer_targets: any;
  social_media_platforms: any[];
  total_data_points: number;
  data_gathered_at: string;
}

export default function RecommendationsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<InfluencerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRecommendation, setCurrentRecommendation] = useState<InfluencerRecommendation | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // AI Agents state
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  
  // AI Agent Settings state
  const [operationMode, setOperationMode] = useState<'manual' | 'automatic'>('manual');
  const [scheduleFrequency, setScheduleFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  
  // Profile Modal state
  const [unifiedProfile, setUnifiedProfile] = useState<UnifiedInfluencerProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Helper function to handle authentication errors
  const handleAuthError = (error: any, customMessage?: string) => {
    if (error.response?.status === 401) {
      const message = customMessage || 'Your session has expired. Please log in again.';
      toast.error(message);
      
      // Clear user state and redirect to login
      logout();
      
      // Redirect after a short delay to allow toast to show
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
      
      return true; // Indicates this was an auth error
    }
    return false; // Not an auth error
  };

  const sections = [
    { id: 0, name: 'Base Plan', icon: Target, color: 'bg-blue-500' },
    { id: 1, name: 'AI Enhanced', icon: Brain, color: 'bg-purple-500' },
    { id: 2, name: 'Monthly Schedule', icon: Calendar, color: 'bg-green-500' },
    { id: 3, name: 'Performance Goals', icon: TrendingUp, color: 'bg-orange-500' },
    { id: 4, name: 'Pricing Strategy', icon: DollarSign, color: 'bg-red-500' },
    { id: 5, name: 'AI Insights', icon: Lightbulb, color: 'bg-indigo-500' },
  ];

  // Agent type icons mapping
  const agentIcons = {
    growth_advisor: TrendingUp,
    business_advisor: DollarSign,
    content_advisor: Lightbulb,
    analytics_advisor: Target,
    collaboration_advisor: Users,
    pricing_advisor: DollarSign,
    platform_advisor: Star,
    compliance_advisor: Zap,
    engagement_advisor: Users,
    optimization_advisor: Zap,
  };

  // Agent type colors mapping
  const agentColors = {
    growth_advisor: 'bg-green-500',
    business_advisor: 'bg-blue-500',
    content_advisor: 'bg-purple-500',
    analytics_advisor: 'bg-indigo-500',
    collaboration_advisor: 'bg-pink-500',
    pricing_advisor: 'bg-yellow-500',
    platform_advisor: 'bg-teal-500',
    compliance_advisor: 'bg-red-500',
    engagement_advisor: 'bg-orange-500',
    optimization_advisor: 'bg-cyan-500',
  };

  const openModal = (insight: any) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInsight(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching recommendations for user ID:', user.id);
      
             try {
         const data = await apiClient.get(`/recommendations/user/${user.id}`);
         console.log('API Response:', data);
         
         // Ensure data is an array and has valid structure
         if (Array.isArray(data)) {
           setRecommendations(data);
           if (data.length > 0 && data[0]) {
             setCurrentRecommendation(data[0]);
           }
         } else {
           console.error('Invalid data format received:', data);
           toast.error('Invalid data format received from server');
         }
             } catch (error: any) {
         console.error('Failed to fetch recommendations:', error);
        
        // Handle authentication errors first
        if (handleAuthError(error, 'Authentication required. Please log in again.')) {
          return; // Exit early if it was an auth error
        }
         
         let errorMessage = 'Failed to load recommendations. Please try again.';
         
        if (error.response?.status === 404) {
           errorMessage = 'No recommendations found for your account.';
         } else if (error.response?.status === 500) {
           errorMessage = 'Server error. Please try again later.';
         } else if (error.message === 'Network Error') {
           errorMessage = 'Network error. Please check your connection and try again.';
         } else if (error.response?.data?.detail) {
           // Ensure we're not trying to render an object
           if (typeof error.response.data.detail === 'string') {
             errorMessage = error.response.data.detail;
           } else if (Array.isArray(error.response.data.detail)) {
             errorMessage = error.response.data.detail.map((err: any) => 
               typeof err === 'string' ? err : err.msg || 'Validation error'
             ).join(', ');
           } else {
             errorMessage = 'An unexpected error occurred. Please try again.';
           }
         } else if (error.message) {
           errorMessage = error.message;
         }
         
         // Ensure errorMessage is always a string
         if (typeof errorMessage !== 'string') {
           errorMessage = 'An unexpected error occurred. Please try again.';
         }
         
         toast.error(errorMessage);
       } finally {
         setIsLoading(false);
       }
    };

    fetchRecommendations();
  }, [user?.id]);

  // Fetch AI Agents
  useEffect(() => {
    const fetchAIAgents = async () => {
      try {
        setIsLoadingAgents(true);
        console.log('Fetching AI agents...');
        const agents = await apiClient.getAIAgents();
        console.log('AI agents response:', agents);
        setAiAgents(agents);
      } catch (error: any) {
        console.error('Failed to fetch AI agents:', error);
        console.error('Error details:', error.response?.data);
        
        // Handle authentication errors first
        if (handleAuthError(error, 'Authentication required. Please log in again.')) {
          return; // Exit early if it was an auth error
        }
        
        toast.error('Failed to load AI agents');
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAIAgents();
  }, []);

  // Fetch unified influencer profile using single API endpoint
  const fetchUnifiedProfile = async () => {
    console.log('fetchUnifiedProfile called, user:', user);
    if (!user?.id) {
      console.log('No user ID available');
      toast.error('No user ID available');
      return;
    }
    
    try {
      setIsLoadingProfile(true);
      console.log('Starting to fetch unified influencer profile for user ID:', user.id);
      console.log('Starting to fetch unified influencer profile...');
      
      // Use the new unified endpoint that fetches all data in one request
      const unifiedProfileData = await apiClient.getUnifiedInfluencerProfileByUserId(user.id);
      console.log('Unified profile data fetched:', unifiedProfileData);
      console.log('API call completed successfully');
      
      if (!unifiedProfileData) {
        console.log('No unified profile data found');
        toast.error('No influencer profile found for your account');
        return;
      }

      // Transform the API response to match the expected frontend format
      const transformedProfile = {
        influencer: unifiedProfileData.influencer,
        locations: unifiedProfileData.operational_locations || [],
        coaching_groups: [
          ...(unifiedProfileData.coaching_groups_as_coach || []),
          ...(unifiedProfileData.coaching_groups_as_member || [])
        ],
        collaboration_countries: unifiedProfileData.influencer.collaboration_countries || [],
        rate_cards: unifiedProfileData.rate_cards || [],
        rate_summary: unifiedProfileData.rate_summary,
        influencer_targets: unifiedProfileData.influencer_targets,
        social_media_platforms: unifiedProfileData.social_media_platforms || [],
        total_data_points: unifiedProfileData.total_data_points || 0,
        data_gathered_at: unifiedProfileData.data_gathered_at || new Date().toISOString()
      };

      console.log('Transformed profile data:', transformedProfile);
      console.log(`Successfully gathered ${unifiedProfileData.total_data_points} data points in single request`);

      console.log('Setting unified profile data');
      setUnifiedProfile(transformedProfile);
      console.log('Unified profile set successfully');
      
      // Show success message with data gathering info
      toast.success(`Profile loaded successfully! Gathered ${unifiedProfileData.total_data_points} data points.`);
      
    } catch (error: any) {
      console.error('Failed to fetch unified profile:', error);
      
      // Handle authentication errors first
      if (handleAuthError(error, 'Authentication required. Please log in again.')) {
        return; // Exit early if it was an auth error
      }
      
      let errorMessage = 'Failed to load influencer profile. Please try again.';
      
      if (error.response?.status === 404) {
        errorMessage = 'No influencer profile found for your account.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const goToSection = (sectionId: number) => {
    setCurrentSection(sectionId);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSection();
        } else {
          prevSection();
        }
      }
    };
    
    document.addEventListener('touchend', handleTouchEnd as any, { once: true });
  };

     const handleSaveBaseStrategy = async () => {
     if (!currentRecommendation?.base_plan) {
       toast.error('No base strategy data available to save');
       return;
     }
     
     // Validate base plan structure
     const basePlan = currentRecommendation.base_plan;
     if (typeof basePlan !== 'object' || basePlan === null) {
       toast.error('Invalid base strategy data structure');
       return;
     }
     
     setIsSaving(true);
     const loadingToast = toast.loading('Saving your base strategy...');
     
     try {
      
      // Extract numeric value from pricing strategy string
      let pricingValue: number | undefined = undefined;
      if (basePlan.pricing_strategy) {
        const numericMatch = basePlan.pricing_strategy.match(/[\d,]+\.?\d*/);
        if (numericMatch) {
          pricingValue = parseFloat(numericMatch[0].replace(/,/g, ''));
        }
      }
      
      await apiClient.saveInfluencerTargets({
        posting_frequency: basePlan.posting_frequency,
        engagement_goals: basePlan.engagement_goals,
        follower_growth: basePlan.follower_growth,
        pricing: pricingValue,
        pricing_currency: "USD", // Default to USD
        estimated_hours_per_week: basePlan.estimated_hours_per_week,
        content_types: basePlan.content_types,
        platform_recommendations: basePlan.platform_recommendations,
        content_creation_tips: basePlan.content_creation_tips,
      });
      
      toast.success('Base strategy saved successfully! Your influencer targets have been updated.', { id: loadingToast });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
         } catch (error: any) {
       console.error('Failed to save base strategy:', error);
       
       // Handle authentication errors first
       if (handleAuthError(error, 'Authentication required. Please log in again.')) {
         return; // Exit early if it was an auth error
       }
       
       // Handle different types of errors
       let errorMessage = 'Failed to save base strategy. Please try again.';
       
       if (error.response?.status === 400) {
         // Handle validation errors properly
         if (error.response.data?.detail) {
           if (Array.isArray(error.response.data.detail)) {
             // Handle multiple validation errors
             errorMessage = error.response.data.detail.map((err: any) => 
               typeof err === 'string' ? err : err.msg || 'Validation error'
             ).join(', ');
           } else if (typeof error.response.data.detail === 'string') {
             errorMessage = error.response.data.detail;
           } else {
             errorMessage = 'Invalid data provided. Please check your strategy details.';
           }
         } else {
           errorMessage = 'Invalid data provided. Please check your strategy details.';
         }
       } else if (error.response?.status === 500) {
         errorMessage = 'Server error. Please try again later.';
       } else if (error.message === 'Network Error') {
         errorMessage = 'Network error. Please check your connection and try again.';
       } else if (error.response?.data?.detail) {
         // Ensure we're not trying to render an object
         if (typeof error.response.data.detail === 'string') {
           errorMessage = error.response.data.detail;
         } else {
           errorMessage = 'An unexpected error occurred. Please try again.';
         }
       } else if (error.message) {
         errorMessage = error.message;
       }
       
       // Ensure errorMessage is always a string
       if (typeof errorMessage !== 'string') {
         errorMessage = 'An unexpected error occurred. Please try again.';
       }
       
       toast.error(errorMessage, { id: loadingToast });
     } finally {
       setIsSaving(false);
     }
  };

  const renderBasePlan = () => {
    if (!currentRecommendation?.base_plan) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Base Strategy</h3>
              <button
                disabled={true}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-600/50 text-slate-400 cursor-not-allowed"
                title="No strategy data available to save"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Save Strategy</span>
              </button>
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-200">No base strategy data available</p>
              <p className="text-slate-400 text-sm mt-2">Please generate recommendations first</p>
            </div>
          </div>
        </div>
      );
    }
    const plan = currentRecommendation.base_plan;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Base Strategy</h3>
            <button
              onClick={handleSaveBaseStrategy}
              disabled={isSaving || !currentRecommendation?.base_plan}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors font-medium ${
                saveSuccess
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : !currentRecommendation?.base_plan
                  ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                  : 'btn-dark-primary'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!currentRecommendation?.base_plan ? 'No strategy data available to save' : 'Save your base strategy'}
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Strategy'}
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Level:</span>
                <span className="capitalize text-slate-300">{typeof plan.level === 'string' ? plan.level : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Posting Frequency:</span>
                <span className="text-slate-300">{typeof plan.posting_frequency === 'string' ? plan.posting_frequency : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Engagement Goal:</span>
                <span className="text-slate-300">{typeof plan.engagement_goals === 'string' ? plan.engagement_goals : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Follower Growth:</span>
                <span className="text-slate-300">{typeof plan.follower_growth === 'string' ? plan.follower_growth : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Pricing Strategy:</span>
                <span className="text-slate-300">{typeof plan.pricing_strategy === 'string' ? plan.pricing_strategy : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Hours/Week:</span>
                <span className="text-slate-300">{typeof plan.estimated_hours_per_week === 'string' ? plan.estimated_hours_per_week : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Content Types</h4>
          <div className="flex flex-wrap gap-2">
            {plan.content_types?.map((type: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-medium">
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Platform Recommendations</h4>
          <div className="flex flex-wrap gap-2">
            {plan.platform_recommendations?.map((platform: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full text-sm font-medium">
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Content Creation Tips</h4>
          <ul className="space-y-3">
            {plan.content_creation_tips?.map((tip: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <Star className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderEnhancedPlan = () => {
    if (!currentRecommendation?.enhanced_plan) return null;
    const plan = currentRecommendation.enhanced_plan;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <h3 className="text-xl font-bold text-white mb-4">AI Enhanced Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
                             <div className="flex items-center space-x-3">
                 <Brain className="w-5 h-5 text-cyan-400" />
                 <span className="font-semibold text-white">Level:</span>
                 <span className="capitalize text-slate-300">{typeof plan.level === 'string' ? plan.level : 'N/A'}</span>
               </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Posting Frequency:</span>
                <span className="text-slate-300">{plan.posting_frequency}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Engagement Goal:</span>
                <span className="text-slate-300">{plan.engagement_goals}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Follower Growth:</span>
                <span className="text-slate-300">{plan.follower_growth}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Pricing Strategy:</span>
                <span className="text-slate-300">{plan.pricing_strategy}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Hours/Week:</span>
                <span className="text-slate-300">{plan.estimated_hours_per_week}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">AI Enhancements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.ai_enhancements?.map((enhancement: any, index: number) => {
              const IconComponent = agentIcons[enhancement.agent_type as keyof typeof agentIcons] || Brain;
              const bgColor = agentColors[enhancement.agent_type as keyof typeof agentColors] || 'bg-purple-500';
              
              return (
                <div
                  key={index}
                  className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 cursor-pointer hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
                  onClick={() => openModal({
                    agent_type: enhancement.agent_type,
                    focus_area: 'ai_enhancement',
                    response: enhancement.insights,
                    status: 'success'
                  })}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white capitalize text-sm">
                        {enhancement.agent_type?.replace('_', ' ')} Advisor
                      </h5>
                      <p className="text-xs text-slate-400">AI-Powered Enhancement</p>
                    </div>
                    <div className="w-full text-xs text-slate-400 overflow-hidden">
                      <div className="h-12 overflow-hidden">
                        {enhancement.insights?.substring(0, 80)}...
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-center space-y-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                      <span className="text-xs text-cyan-400 font-medium">Click to view details</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Engagement Strategies</h4>
          <div className="flex flex-wrap gap-2">
            {plan.engagement_strategies?.map((strategy: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-medium">
                {strategy}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Consistency Tools</h4>
          <div className="flex flex-wrap gap-2">
            {plan.consistency_tools?.map((tool: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-medium">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Pricing Optimization</h4>
          <div className="flex flex-wrap gap-2">
            {plan.pricing_optimization?.map((strategy: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-medium">
                {strategy}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlySchedule = () => {
    if (!currentRecommendation?.monthly_schedule) return null;
    const schedule = currentRecommendation.monthly_schedule;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <h3 className="text-xl font-bold text-white mb-4">Monthly Content Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{schedule.posts_per_week}</div>
              <div className="text-sm text-slate-300">Posts per Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{schedule.total_posts_month}</div>
              <div className="text-sm text-slate-300">Total Posts This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{schedule.content_themes?.length || 0}</div>
              <div className="text-sm text-slate-300">Content Themes</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Weekly Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schedule.schedule || {}).map(([week, weekData]: [string, any]) => (
              <div key={week} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                <h5 className="font-semibold text-white mb-3">{week.replace('_', ' ').toUpperCase()}</h5>
                <div className="space-y-2">
                  {Object.entries(weekData).map(([day, dayData]: [string, any]) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-medium capitalize">{day}</span>
                      <div className="text-right">
                        <div className="text-cyan-400">{dayData.content_type?.replace('_', ' ')}</div>
                        <div className="text-slate-400 text-xs">{dayData.theme?.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Content Themes</h4>
          <div className="flex flex-wrap gap-2">
            {schedule.content_themes?.map((theme: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium">
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Hashtag Strategies</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schedule.hashtag_strategies || {}).map(([category, hashtags]: [string, any]) => (
              <div key={category} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                <h5 className="font-semibold text-white mb-2 capitalize">{category.replace('_', ' ')}</h5>
                <div className="flex flex-wrap gap-1">
                  {hashtags?.map((hashtag: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceGoals = () => {
    if (!currentRecommendation?.performance_goals) return null;
    const goals = currentRecommendation.performance_goals;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <h3 className="text-xl font-bold text-white mb-4">Performance Goals & Metrics</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Monthly Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(goals.monthly_goals || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quarterly Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(goals.quarterly_goals || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Success Metrics</h4>
            <div className="space-y-2">
              {goals.success_metrics?.map((metric: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPricingStrategy = () => {
    if (!currentRecommendation?.pricing_recommendations) return null;
    const pricing = currentRecommendation.pricing_recommendations;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <h3 className="text-xl font-bold text-white mb-4">Pricing Strategy & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{pricing.current_average_rate}</div>
              <div className="text-sm text-slate-300">Current Average Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{pricing.recommended_rate}</div>
              <div className="text-sm text-slate-300">Recommended Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{pricing.rate_increase}</div>
              <div className="text-sm text-slate-300">Rate Increase</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Pricing Tiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pricing.pricing_tiers || {}).map(([tier, price]: [string, any]) => (
              <div key={tier} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white capitalize">
                    {tier.replace('_', ' ')}
                  </span>
                  <span className="text-xl font-bold text-cyan-400">{price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Pricing Strategies</h4>
          <div className="space-y-2">
            {pricing.pricing_strategies?.map((strategy: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{strategy}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Negotiation Tips</h4>
          <div className="space-y-2">
            {pricing.negotiation_tips?.map((tip: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAIInsights = () => {
    if (!currentRecommendation?.ai_insights) return null;
    const insights = currentRecommendation.ai_insights;
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
          <h3 className="text-xl font-bold text-white mb-4">AI Agent Insights</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{insights.length}</div>
            <div className="text-sm text-slate-300">AI Agents Analyzed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight: any, index: number) => {
            const IconComponent = agentIcons[insight.agent_type as keyof typeof agentIcons] || Brain;
            const bgColor = agentColors[insight.agent_type as keyof typeof agentColors] || 'bg-indigo-500';
            
            return (
              <div
                key={index}
                className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 cursor-pointer hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
                onClick={() => openModal(insight)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white capitalize text-sm">
                      {insight.agent_type?.replace('_', ' ')} Advisor
                    </h5>
                    <p className="text-xs text-slate-400 capitalize">
                      {insight.focus_area?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="w-full text-xs text-slate-400 overflow-hidden">
                    <div className="h-12 overflow-hidden">
                      {insight.response?.substring(0, 80)}...
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.status === 'success' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {insight.status}
                    </span>
                    <span className="text-xs text-cyan-400 font-medium">Click to view details</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderBasePlan();
      case 1:
        return renderEnhancedPlan();
      case 2:
        return renderMonthlySchedule();
      case 3:
        return renderPerformanceGoals();
      case 4:
        return renderPricingStrategy();
      case 5:
        return renderAIInsights();
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Loading AI Recommendations</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Analyzing your data and generating personalized insights...</p>
              </div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (recommendations.length === 0) {
    return (
      <UnifiedDashboardLayout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                AI Recommendations 🤖
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Your personalized influencer strategy recommendations powered by AI
              </p>
            </div>
            {/* Main Content Layout for No Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side - No Recommendations Content */}
              <div className="lg:col-span-2">
                {unifiedProfile ? (
                  /* Unified Influencer Profile Content */
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Unified Influencer Profile</h2>
                        <button
                          onClick={() => setUnifiedProfile(null)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {unifiedProfile.influencer?.first_name?.[0]}{unifiedProfile.influencer?.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {unifiedProfile.influencer?.first_name} {unifiedProfile.influencer?.last_name}
                          </h3>
                          <p className="text-slate-300">
                            @{unifiedProfile.influencer?.user?.username}
                          </p>
                          <p className="text-sm text-slate-400">
                            {unifiedProfile.total_data_points} data points gathered
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Basic Information</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Email:</span>
                            <span className="text-white">{unifiedProfile.influencer?.user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Phone:</span>
                            <span className="text-white">{unifiedProfile.influencer?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Base Country:</span>
                            <span className="text-white">{unifiedProfile.influencer?.base_country?.name || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Social Media */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                          </svg>
                          <span>Social Media</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.social_media_platforms?.map((platform, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-slate-400">{platform.name}:</span>
                              <span className="text-white">{platform.followers || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Operational Locations */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Operational Locations</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.locations?.length > 0 ? (
                            unifiedProfile.locations.map((location: any, index: number) => (
                              <div key={index} className="text-sm">
                                <div className="text-white font-medium">
                                  {location.city_name}, {location.region_name}
                                </div>
                                <div className="text-slate-400">
                                  {location.country_name}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No locations added</p>
                          )}
                        </div>
                      </div>

                      {/* Collaboration Countries */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Collaboration Countries</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.collaboration_countries?.length > 0 ? (
                            unifiedProfile.collaboration_countries.map((country, index) => (
                              <div key={index} className="text-white">
                                {country.name}
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No countries added</p>
                          )}
                        </div>
                      </div>

                      {/* Coaching Groups */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span>Coaching Groups</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.coaching_groups?.length > 0 ? (
                            unifiedProfile.coaching_groups.map((group, index) => (
                              <div key={index} className="text-sm">
                                <div className="text-white font-medium">{group.name}</div>
                                <div className="text-slate-400">{group.description}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No coaching groups</p>
                          )}
                        </div>
                      </div>

                      {/* Rate Cards */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>Rate Cards</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.rate_cards?.length > 0 ? (
                            unifiedProfile.rate_cards.map((rate, index) => (
                              <div key={index} className="text-sm">
                                <div className="text-white font-medium">{rate.service_type}</div>
                                <div className="text-slate-400">${rate.price}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No rate cards</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row - Full Width Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Target Audiences */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Target Audiences</span>
                        </h4>
                        <div className="space-y-2">
                          {unifiedProfile.influencer_targets?.length > 0 ? (
                            unifiedProfile.influencer_targets.map((target: any, index: number) => (
                              <div key={index} className="text-sm">
                                <div className="text-white font-medium">{target.target_audience}</div>
                                <div className="text-slate-400">{target.description}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No target audiences defined</p>
                          )}
                        </div>
                      </div>

                      {/* Profile Summary */}
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Profile Summary</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Data Points:</span>
                            <span className="text-white font-medium">{unifiedProfile.total_data_points}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Data Gathered:</span>
                            <span className="text-white">{new Date(unifiedProfile.data_gathered_at).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Profile Status:</span>
                            <span className="text-green-400 font-medium">Complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No Recommendations Content */
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Brain className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                    Your AI recommendations will appear here once generated. Please generate recommendations first.
                  </p>
                  <button
                      onClick={() => {
                        console.log('Button clicked!');
                        fetchUnifiedProfile();
                      }}
                    disabled={isLoadingProfile}
                      className="btn-dark-primary px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
                  >
                    {isLoadingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading Profile...</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                          <span>Get Unified Influencer Profile</span>
                      </>
                    )}
                  </button>
                </div>
                )}
              </div>

              {/* Right Side - Floating Panels (same as with recommendations) */}
              <div className="lg:col-span-1 space-y-6">
                {/* AI Agents Panel */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-400" />
                    AI Agents
                    <span className="ml-2 text-blue-400 font-normal">{aiAgents.length}</span>
                  </h2>
                  
                  {isLoadingAgents ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      <span className="ml-3 text-slate-300">Loading AI agents...</span>
                    </div>
                  ) : aiAgents.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {aiAgents.map((agent) => {
                        const IconComponent = agentIcons[agent.agent_type as keyof typeof agentIcons] || Bot;
                        const bgColor = agentColors[agent.agent_type as keyof typeof agentColors] || 'bg-blue-500';
                        
                        return (
                          <div key={agent.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                            <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                              <p className="text-xs text-slate-400 capitalize">
                                {agent.agent_type?.replace('_', ' ')} • {agent.status}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                agent.is_active 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                              }`}>
                                {agent.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-400">No AI agents available</p>
                    </div>
                  )}
                </div>

                {/* AI Agent Settings Panel */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-400" />
                    AI Agent Settings
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Operation Mode */}
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-3 block">Operation Mode</label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="operationMode"
                            value="manual"
                            checked={operationMode === 'manual'}
                            onChange={(e) => setOperationMode(e.target.value as 'manual' | 'automatic')}
                            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white">Operates manually</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="operationMode"
                            value="automatic"
                            checked={operationMode === 'automatic'}
                            onChange={(e) => setOperationMode(e.target.value as 'manual' | 'automatic')}
                            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white">Operates automatically</span>
                        </label>
                      </div>
                    </div>

                    {/* Schedule Frequency (only show when automatic is selected) */}
                    {operationMode === 'automatic' && (
                      <div>
                        <label className="text-sm font-medium text-slate-400 mb-3 block flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule Frequency
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((frequency) => (
                            <label key={frequency} className="flex items-center space-x-2 cursor-pointer p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                              <input
                                type="radio"
                                name="scheduleFrequency"
                                value={frequency}
                                checked={scheduleFrequency === frequency}
                                onChange={(e) => setScheduleFrequency(e.target.value as typeof frequency)}
                                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-white capitalize text-sm">{frequency}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-700/50">
                      {operationMode === 'manual' ? (
                        <button
                          onClick={async () => {
                            if (!user?.id) {
                              toast.error('No user ID available');
                              return;
                            }
                            
                            try {
                              toast.loading('Generating AI recommendations...', { id: 'ai-recommendations' });
                              const result = await apiClient.triggerRecommendationAnalysis(user.id);
                              toast.success('AI recommendations generated successfully!', { id: 'ai-recommendations' });
                              console.log('AI recommendations result:', result);
                            } catch (error: any) {
                              console.error('Error generating AI recommendations:', error);
                              toast.error('Failed to generate AI recommendations. Please try again.', { id: 'ai-recommendations' });
                            }
                          }}
                          className="w-full btn-dark-primary px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        >
                          <Bot className="h-4 w-4" />
                          <span>Generate AI Recommendation</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            toast.success('AI Agent settings saved successfully!');
                          }}
                          className="w-full btn-dark-primary px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Save Settings</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  AI Recommendations 🤖
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Your personalized influencer strategy recommendations powered by AI
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {recommendations.length} Recommendation{recommendations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Navigation Tabs */}
              <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-600/30">
                <nav className="flex overflow-x-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => goToSection(section.id)}
                      className={`relative flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                        currentSection === section.id
                          ? 'text-blue-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <section.icon className={`h-4 w-4 ${
                        currentSection === section.id ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                      <span>{section.name}</span>
                      {currentSection === section.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">Progress</span>
                  <span className="text-sm text-slate-300">{Math.round(((currentSection + 1) / sections.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-teal-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                    style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Section {currentSection + 1} of {sections.length}</span>
                  <span>{sections[currentSection].name}</span>
                </div>
              </div>

              {/* Main Content */}
              <div 
                ref={timelineRef}
                className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6 min-h-[600px]"
                onTouchStart={handleTouchStart}
              >
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <button
                    onClick={prevSection}
                    className="flex items-center space-x-2 px-4 py-3 btn-dark rounded-xl font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">{sections[currentSection].name}</h2>
                    <p className="text-slate-400">Swipe or use arrows to navigate</p>
                  </div>
                  
                  <button
                    onClick={nextSection}
                    className="flex items-center space-x-2 px-4 py-3 btn-dark rounded-xl font-medium"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-between items-center mb-6">
                  <button
                    onClick={prevSection}
                    className="p-3 btn-dark rounded-xl"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">{sections[currentSection].name}</h2>
                    <p className="text-sm text-slate-400">Swipe to navigate</p>
                  </div>
                  
                  <button
                    onClick={nextSection}
                    className="p-3 btn-dark rounded-xl"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Content */}
                <div className="overflow-y-auto max-h-[500px]">
                  {renderCurrentSection()}
                </div>
              </div>

              {/* Recommendation Info */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-wrap items-center justify-between text-sm text-slate-300">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">ID:</span>
                      <span className="font-mono text-cyan-400">#{currentRecommendation?.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Level:</span>
                      <span className="capitalize font-medium text-white">{currentRecommendation?.user_level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Created:</span>
                      <span className="font-medium text-white">
                        {currentRecommendation?.created_at ? new Date(currentRecommendation.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">User:</span>
                      <span className="font-mono text-cyan-400">#{user?.id}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 truncate max-w-xs">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Floating Panels */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Agents Panel */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-400" />
                  AI Agents
                  <span className="ml-2 text-blue-400 font-normal">{aiAgents.length}</span>
                </h2>
                
                {isLoadingAgents ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <span className="ml-3 text-slate-300">Loading AI agents...</span>
                  </div>
                ) : aiAgents.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {aiAgents.map((agent) => {
                      const IconComponent = agentIcons[agent.agent_type as keyof typeof agentIcons] || Bot;
                      const bgColor = agentColors[agent.agent_type as keyof typeof agentColors] || 'bg-blue-500';
                      
                      return (
                        <div key={agent.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                          <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                            <p className="text-xs text-slate-400 capitalize">
                              {agent.agent_type?.replace('_', ' ')} • {agent.status}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              agent.is_active 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>
                              {agent.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-400">No AI agents available</p>
                  </div>
                )}
              </div>

              {/* AI Agent Settings Panel */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  AI Agent Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Operation Mode */}
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-3 block">Operation Mode</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="operationMode"
                          value="manual"
                          checked={operationMode === 'manual'}
                          onChange={(e) => setOperationMode(e.target.value as 'manual' | 'automatic')}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-white">Operates manually</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="operationMode"
                          value="automatic"
                          checked={operationMode === 'automatic'}
                          onChange={(e) => setOperationMode(e.target.value as 'manual' | 'automatic')}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-white">Operates automatically</span>
                      </label>
                    </div>
                  </div>

                  {/* Schedule Frequency (only show when automatic is selected) */}
                  {operationMode === 'automatic' && (
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-3 block flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Frequency
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((frequency) => (
                          <label key={frequency} className="flex items-center space-x-2 cursor-pointer p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                            <input
                              type="radio"
                              name="scheduleFrequency"
                              value={frequency}
                              checked={scheduleFrequency === frequency}
                              onChange={(e) => setScheduleFrequency(e.target.value as typeof frequency)}
                              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-white capitalize text-sm">{frequency}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t border-slate-700/50">
                    {operationMode === 'manual' ? (
                      <button
                        onClick={async () => {
                          if (!user?.id) {
                            toast.error('No user ID available');
                            return;
                          }
                          
                          try {
                            toast.loading('Generating AI recommendations...', { id: 'ai-recommendations-2' });
                            const result = await apiClient.triggerRecommendationAnalysis(user.id);
                            toast.success('AI recommendations generated successfully!', { id: 'ai-recommendations-2' });
                            console.log('AI recommendations result:', result);
                          } catch (error: any) {
                            console.error('Error generating AI recommendations:', error);
                            toast.error('Failed to generate AI recommendations. Please try again.', { id: 'ai-recommendations-2' });
                          }
                        }}
                        className="w-full btn-dark-primary px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                      >
                        <Bot className="h-4 w-4" />
                        <span>Generate AI Recommendation</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toast.success('AI Agent settings saved successfully!');
                        }}
                        className="w-full btn-dark-primary px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Save Settings</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedInsight && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="form-container-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                {(() => {
                  const IconComponent = agentIcons[selectedInsight.agent_type as keyof typeof agentIcons] || Brain;
                  return (
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedInsight.agent_type?.replace('_', ' ').toUpperCase()} Advisor
                  </h3>
                  <p className="text-sm text-slate-400 capitalize">
                    {selectedInsight.focus_area?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                className="text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
              <MarkdownRenderer 
                content={selectedInsight.response} 
                className="text-slate-200 leading-relaxed"
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedInsight.status === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {selectedInsight.status}
              </span>
              <button
                onClick={closeModal}
                className="btn-dark-primary px-6 h-12 rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </UnifiedDashboardLayout>
  );
}
