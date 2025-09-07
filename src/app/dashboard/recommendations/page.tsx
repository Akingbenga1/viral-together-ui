'use client';

import { useEffect, useState, useRef } from 'react';
import { Brain, ChevronLeft, ChevronRight, Calendar, Target, DollarSign, TrendingUp, Users, Star, Zap, Lightbulb, X, Edit, Check } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import toast, { Toaster } from 'react-hot-toast';

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

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<InfluencerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRecommendation, setCurrentRecommendation] = useState<InfluencerRecommendation | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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
         
         let errorMessage = 'Failed to load recommendations. Please try again.';
         
         if (error.response?.status === 401) {
           errorMessage = 'Authentication required. Please log in again.';
         } else if (error.response?.status === 404) {
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
       
       // Handle different types of errors
       let errorMessage = 'Failed to save base strategy. Please try again.';
       
       if (error.response?.status === 401) {
         errorMessage = 'Authentication required. Please log in again.';
       } else if (error.response?.status === 400) {
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
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-purple-900 mb-4">AI Enhanced Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
                             <div className="flex items-center space-x-2">
                 <Brain className="w-5 h-5 text-purple-600" />
                 <span className="font-semibold">Level:</span>
                 <span className="capitalize">{typeof plan.level === 'string' ? plan.level : 'N/A'}</span>
               </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Posting Frequency:</span>
                <span>{plan.posting_frequency}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Engagement Goal:</span>
                <span>{plan.engagement_goals}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Follower Growth:</span>
                <span>{plan.follower_growth}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Pricing Strategy:</span>
                <span>{plan.pricing_strategy}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Hours/Week:</span>
                <span>{plan.estimated_hours_per_week}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">AI Enhancements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.ai_enhancements?.map((enhancement: any, index: number) => {
              const IconComponent = agentIcons[enhancement.agent_type as keyof typeof agentIcons] || Brain;
              const bgColor = agentColors[enhancement.agent_type as keyof typeof agentColors] || 'bg-purple-500';
              
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
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
                      <h5 className="font-semibold text-gray-800 capitalize text-sm">
                        {enhancement.agent_type?.replace('_', ' ')} Advisor
                      </h5>
                      <p className="text-xs text-gray-600">AI-Powered Enhancement</p>
                    </div>
                    <div className="w-full text-xs text-gray-600 overflow-hidden">
                      <div className="h-12 overflow-hidden">
                        {enhancement.insights?.substring(0, 80)}...
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-center space-y-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <span className="text-xs text-purple-600 font-medium">Click to view details</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Engagement Strategies</h4>
          <div className="flex flex-wrap gap-2">
            {plan.engagement_strategies?.map((strategy: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {strategy}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Consistency Tools</h4>
          <div className="flex flex-wrap gap-2">
            {plan.consistency_tools?.map((tool: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Pricing Optimization</h4>
          <div className="flex flex-wrap gap-2">
            {plan.pricing_optimization?.map((strategy: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
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
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-900 mb-4">Monthly Content Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{schedule.posts_per_week}</div>
              <div className="text-sm text-green-700">Posts per Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{schedule.total_posts_month}</div>
              <div className="text-sm text-green-700">Total Posts This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{schedule.content_themes?.length || 0}</div>
              <div className="text-sm text-green-700">Content Themes</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Weekly Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schedule.schedule || {}).map(([week, weekData]: [string, any]) => (
              <div key={week} className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-3">{week.replace('_', ' ').toUpperCase()}</h5>
                <div className="space-y-2">
                  {Object.entries(weekData).map(([day, dayData]: [string, any]) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-medium capitalize">{day}</span>
                      <div className="text-right">
                        <div className="text-green-700">{dayData.content_type?.replace('_', ' ')}</div>
                        <div className="text-gray-600 text-xs">{dayData.theme?.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Content Themes</h4>
          <div className="flex flex-wrap gap-2">
            {schedule.content_themes?.map((theme: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Hashtag Strategies</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schedule.hashtag_strategies || {}).map(([category, hashtags]: [string, any]) => (
              <div key={category} className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2 capitalize">{category.replace('_', ' ')}</h5>
                <div className="flex flex-wrap gap-1">
                  {hashtags?.map((hashtag: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
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
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-orange-900 mb-4">Performance Goals & Metrics</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(goals.monthly_goals || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-800 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-orange-700">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quarterly Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(goals.quarterly_goals || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-800 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-orange-700">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Success Metrics</h4>
            <div className="space-y-2">
              {goals.success_metrics?.map((metric: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{metric}</span>
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
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-red-900 mb-4">Pricing Strategy & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{pricing.current_average_rate}</div>
              <div className="text-sm text-red-700">Current Average Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{pricing.recommended_rate}</div>
              <div className="text-sm text-red-700">Recommended Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{pricing.rate_increase}</div>
              <div className="text-sm text-red-700">Rate Increase</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Pricing Tiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pricing.pricing_tiers || {}).map(([tier, price]: [string, any]) => (
              <div key={tier} className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-red-800 capitalize">
                    {tier.replace('_', ' ')}
                  </span>
                  <span className="text-xl font-bold text-red-600">{price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Pricing Strategies</h4>
          <div className="space-y-2">
            {pricing.pricing_strategies?.map((strategy: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strategy}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Negotiation Tips</h4>
          <div className="space-y-2">
            {pricing.negotiation_tips?.map((tip: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
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
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">AI Agent Insights</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{insights.length}</div>
            <div className="text-sm text-indigo-700">AI Agents Analyzed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight: any, index: number) => {
            const IconComponent = agentIcons[insight.agent_type as keyof typeof agentIcons] || Brain;
            const bgColor = agentColors[insight.agent_type as keyof typeof agentColors] || 'bg-indigo-500';
            
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => openModal(insight)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 capitalize text-sm">
                      {insight.agent_type?.replace('_', ' ')} Advisor
                    </h5>
                    <p className="text-xs text-gray-600 capitalize">
                      {insight.focus_area?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="w-full text-xs text-gray-600 overflow-hidden">
                    <div className="h-12 overflow-hidden">
                      {insight.response?.substring(0, 80)}...
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.status}
                    </span>
                    <span className="text-xs text-indigo-600 font-medium">Click to view details</span>
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
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                Your AI recommendations will appear here once generated. Please generate recommendations first.
              </p>
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

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4">
              <div className="flex flex-wrap gap-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentSection === section.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-700/30 text-slate-300 border border-slate-600/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
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
          </div>

          {/* Main Content */}
          <div 
            ref={timelineRef}
            className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 min-h-[600px]"
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
          <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
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
