'use client';

import { useEffect, useState, useRef } from 'react';
import { Brain, ChevronLeft, ChevronRight, Calendar, Target, DollarSign, TrendingUp, Users, Star, Zap, Lightbulb, X, Edit, Check, Bot, Settings, Clock, User, MapPin, GraduationCap, Globe, ChevronDown, ExternalLink, Download } from 'lucide-react';
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
  
  // Advanced Growth Strategies state
  const [currentAdvancedTab, setCurrentAdvancedTab] = useState(0);
  const [growthStrategies, setGrowthStrategies] = useState<any>(null);
  const [isLoadingGrowthStrategies, setIsLoadingGrowthStrategies] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('idle'); // 'idle', 'processing', 'completed', 'error'
  const [processingMessage, setProcessingMessage] = useState<string>('');
  
  // Downloads state
  const [downloadFiles, setDownloadFiles] = useState<any[]>([]);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(false);
  
  // Accordion state for each tab
  const [expandedAccordions, setExpandedAccordions] = useState<{[key: string]: number | null}>({
    'more_followers': null,
    'content_ideas': null,
    'social_profiles': null,
    'influencer_collab': null,
    'business_collab': null,
    'content_scripts': null
  });
  
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

  // Helper function to toggle accordion
  const toggleAccordion = (tabKey: string, index: number) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [tabKey]: prev[tabKey] === index ? null : index
    }));
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
        console.log('No user ID available - waiting for user data to load');
        // Don't set isLoading to false here - keep waiting for user data
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

    const loadGrowthStrategiesAutomatically = async () => {
      console.log('🚀 Auto-loading growth strategies on page load with hardcoded influencer ID 13');
      await fetchGrowthStrategies();
    };

    fetchRecommendations();
    
    // Auto-load growth strategies when page loads
    setTimeout(() => {
      loadGrowthStrategiesAutomatically();
    }, 2000); // Wait 2 seconds for page to fully load
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

  // Downloads tab selection handler
  useEffect(() => {
    console.log('Downloads tab useEffect triggered - currentAdvancedTab:', currentAdvancedTab);
    if (currentAdvancedTab === 6) {
      console.log('Downloads tab selected');
      // If no files loaded, try to fetch them
      if (!downloadFiles || downloadFiles.length === 0) {
        console.log('No files loaded, fetching download files...');
        const fetchFiles = async () => {
          setIsLoadingDownloads(true);
          try {
            const response = await apiClient.get(`/non-ai-recommendations/influencer/13`);
            if (response.data?.download_links) {
              setDownloadFiles(response.data.download_links);
              console.log('Download files fetched on tab click:', response.data.download_links.length);
            } else {
              console.log('No download_links found on tab click');
            }
          } catch (error) {
            console.error('Error fetching files on tab click:', error);
          } finally {
            setIsLoadingDownloads(false);
          }
        };
        fetchFiles();
      }
    }
  }, [currentAdvancedTab, downloadFiles]);

  // Fetch download files when component mounts
  useEffect(() => {
    const fetchDownloadFiles = async () => {
      console.log('Component mounted, fetching download files...');
      setIsLoadingDownloads(true);
      try {
        const response = await apiClient.get(`/non-ai-recommendations/influencer/13`);
        console.log('Download files API response:', response.data);
        if (response.data?.download_links) {
          setDownloadFiles(response.data.download_links);
          console.log('Download files loaded successfully:', response.data.download_links.length);
        } else {
          console.log('No download_links found in response.data');
          console.log('Available keys in response.data:', Object.keys(response.data || {}));
        }
      } catch (error) {
        console.error('Error fetching download files:', error);
      } finally {
        setIsLoadingDownloads(false);
      }
    };

    fetchDownloadFiles();
  }, []);

  // Monitor downloadFiles state changes
  useEffect(() => {
    console.log('downloadFiles state changed:', downloadFiles?.length || 0, 'files:', downloadFiles);
  }, [downloadFiles]);

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

  const fetchGrowthStrategies = async () => {
    console.log('🚀 fetchGrowthStrategies called');
    
    // Hardcoded influencer ID as requested
    const influencerId = 13;
    console.log('Using hardcoded influencer ID:', influencerId);

    setIsLoadingGrowthStrategies(true);
    try {
      const response = await apiClient.getGrowthStrategies(influencerId);
      console.log('Growth strategies response:', response);
      
      if (response.status === 'completed' && response.data) {
        setGrowthStrategies(response.data);
        setProcessingStatus('completed');
        setProcessingMessage(response.message);
        toast.success('Growth strategies loaded successfully!');
      } else if (response.status === 'processing') {
        setProcessingStatus('processing');
        setProcessingMessage(response.message);
        setGrowthStrategies(null);
        // Start polling for status updates
        startPollingForStatus(13); // Hardcoded influencer ID
      } else if (response.status === 'error') {
        setProcessingStatus('error');
        setProcessingMessage(response.message || 'Unknown error occurred');
        setGrowthStrategies(null);
        
        // Show specific error messages based on error type
        if ((response as any).error_type === 'NO_RECOMMENDATIONS_FOUND') {
          toast.error('No recommendations found. Please generate influencer recommendations first.');
        } else if ((response as any).error_type === 'INFLUENCER_NOT_FOUND') {
          toast.error('Influencer not found. Please check your account setup.');
        } else if ((response as any).error_type === 'INSUFFICIENT_DATA') {
          toast.error('Recommendation data is insufficient. Please regenerate recommendations with more data.');
        } else {
          toast.error(response.message || 'An error occurred while processing your request.');
        }
      } else {
        setProcessingStatus('error');
        setProcessingMessage(response.message || 'Unknown error occurred');
        setGrowthStrategies(null);
      }
    } catch (error: any) {
      console.error('Error fetching growth strategies:', error);
      setProcessingStatus('error');
      setProcessingMessage('Failed to load growth strategies');
      if (!handleAuthError(error, 'Failed to load growth strategies. Please try again.')) {
        toast.error('Failed to load growth strategies. Please try again.');
      }
    } finally {
      setIsLoadingGrowthStrategies(false);
    }
  };

  const startPollingForStatus = (influencerId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await apiClient.getGrowthStrategiesStatus(influencerId);
        
        if (statusResponse.status === 'completed' && statusResponse.data) {
          setGrowthStrategies(statusResponse.data);
          setProcessingStatus('completed');
          setProcessingMessage(statusResponse.message);
          clearInterval(pollInterval);
          toast.success('Growth strategies are ready!');
        } else if (statusResponse.status === 'processing') {
          setProcessingStatus('processing');
          setProcessingMessage(statusResponse.message);
        } else {
          setProcessingStatus('error');
          setProcessingMessage(statusResponse.message);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (processingStatus === 'processing') {
        setProcessingStatus('error');
        setProcessingMessage('Processing timed out. Please try again.');
      }
    }, 300000); // 5 minutes
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
    
    // Ensure insights is an array before proceeding
    if (!Array.isArray(insights)) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-4">AI Agent Insights</h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-200">No AI insights data available</p>
              <p className="text-slate-400 text-sm mt-2">AI insights will appear here once generated</p>
            </div>
          </div>
        </div>
      );
    }
    
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

  // Advanced Growth Strategies Render Functions
  const renderMoreFollowers = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-slate-300">Loading growth strategies...</span>
        </div>
      );
    }

    if (processingStatus === 'processing') {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Agents Working</h3>
          <p className="text-slate-300 mb-4">{processingMessage}</p>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              Our AI agents are analyzing your recommendation data and generating personalized growth strategies. 
              This usually takes 2-5 minutes.
            </p>
          </div>
        </div>
      );
    }

    if (processingStatus === 'error') {
      return (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Processing Error</h3>
          <p className="text-slate-300 mb-4">{processingMessage}</p>
          
          {/* Show specific guidance based on error type */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-left">
            <h4 className="text-red-300 font-semibold mb-2">What to do next:</h4>
            <ul className="text-sm text-red-200 space-y-1">
              <li>• Ensure you have generated influencer recommendations first</li>
              <li>• Check that your recommendation data contains meaningful content</li>
              <li>• Verify your influencer profile is properly set up</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
          
          <button
            onClick={fetchGrowthStrategies}
            className="btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!growthStrategies?.more_followers || growthStrategies.more_followers.length === 0) {
      return (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No follower growth strategies available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.more_followers.map((strategy: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('more_followers', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{strategy.strategy || `Strategy ${index + 1}`}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Click to view details</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['more_followers'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['more_followers'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {strategy.description && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Description</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{strategy.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {strategy.expected_growth && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Expected Growth</span>
                      </div>
                      <span className="text-base text-blue-400 font-semibold">{strategy.expected_growth}</span>
                    </div>
                  )}
                  
                  {strategy.implementation && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Implementation</span>
                      </div>
                      <span className="text-sm text-slate-200">{strategy.implementation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContentIdeas = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <span className="ml-3 text-slate-300">Loading content ideas...</span>
        </div>
      );
    }

    if (!growthStrategies?.content_ideas || growthStrategies.content_ideas.length === 0) {
      return (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No content ideas available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.content_ideas.map((idea: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('content_ideas', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{idea.idea || `Content Idea ${index + 1}`}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Click to view details</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['content_ideas'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['content_ideas'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {idea.description && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Description</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{idea.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {idea.content_type && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Content Type</span>
                      </div>
                      <span className="text-base text-white font-semibold">{idea.content_type}</span>
                    </div>
                  )}
                  {idea.posting_frequency && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Frequency</span>
                      </div>
                      <span className="text-base text-white font-semibold">{idea.posting_frequency}</span>
                    </div>
                  )}
                  {idea.expected_engagement && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Expected Engagement</span>
                      </div>
                      <span className="text-base text-yellow-400 font-semibold">{idea.expected_engagement}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSocialProfiles = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="ml-3 text-slate-300">Loading social profiles...</span>
        </div>
      );
    }

    if (!growthStrategies?.social_profiles || growthStrategies.social_profiles.length === 0) {
      return (
        <div className="text-center py-8">
          <Globe className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No social profiles available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.social_profiles.map((profile: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('social_profiles', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">@{profile.name || `Profile ${index + 1}`}</h4>
                  <p className="text-xs text-purple-400 mt-0.5">{profile.platform || 'Unknown Platform'}</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['social_profiles'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['social_profiles'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {profile.relevance_reason && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Why This Profile</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{profile.relevance_reason}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.platform && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Platform</span>
                      </div>
                      <span className="text-base text-purple-400 font-semibold">{profile.platform}</span>
                    </div>
                  )}
                  {profile.followers && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Followers</span>
                      </div>
                      <span className="text-base text-white font-semibold">{profile.followers}</span>
                    </div>
                  )}
                </div>
                
                {profile.profile_url && (
                  <a
                    href={profile.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-purple-400 hover:text-purple-300 font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderInfluencerCollab = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
          <span className="ml-3 text-slate-300">Loading collaboration ideas...</span>
        </div>
      );
    }

    if (!growthStrategies?.influencer_collab || growthStrategies.influencer_collab.length === 0) {
      return (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No collaboration ideas available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.influencer_collab.map((collab: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('influencer_collab', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{collab.collaboration || `Collaboration ${index + 1}`}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Influencer partnership opportunity</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['influencer_collab'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['influencer_collab'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {collab.description && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Description</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{collab.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {collab.expected_reach && (
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Expected Reach</span>
                      </div>
                      <span className="text-base text-pink-400 font-semibold">{collab.expected_reach}</span>
                    </div>
                  )}
                  {collab.implementation && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Implementation</span>
                      </div>
                      <span className="text-sm text-slate-200">{collab.implementation}</span>
                    </div>
                  )}
                </div>
                
                {/* Real Links Section */}
                {collab.real_links && collab.real_links.length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-slate-400 uppercase">Real Collaboration Links</span>
                    </div>
                    <div className="space-y-2">
                      {collab.real_links.map((link: any, linkIndex: number) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-purple-400 hover:text-purple-300 font-semibold transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{link.name}</span>
                            {link.description && (
                              <span className="text-xs text-purple-300/70 mt-1">{link.description}</span>
                            )}
                            {link.platform && (
                              <span className="text-xs text-purple-300/50 mt-1">Platform: {link.platform}</span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBusinessCollab = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-slate-300">Loading business opportunities...</span>
        </div>
      );
    }

    if (!growthStrategies?.business_collab || growthStrategies.business_collab.length === 0) {
      return (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No business opportunities available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.business_collab.map((opportunity: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('business_collab', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{opportunity.opportunity || `Business Opportunity ${index + 1}`}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    {opportunity.type && (
                      <span className="text-xs text-slate-400">{opportunity.type}</span>
                    )}
                    {opportunity.potential_revenue && (
                      <>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-green-400 font-medium">{opportunity.potential_revenue}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['business_collab'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['business_collab'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {opportunity.description && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Description</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{opportunity.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {opportunity.type && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Type</span>
                      </div>
                      <span className="text-base text-green-400 font-semibold">{opportunity.type}</span>
                    </div>
                  )}
                  {opportunity.location && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Location</span>
                      </div>
                      <span className="text-base text-white font-semibold">{opportunity.location}</span>
                    </div>
                  )}
                  {opportunity.potential_revenue && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Revenue Potential</span>
                      </div>
                      <span className="text-base text-green-400 font-semibold">{opportunity.potential_revenue}</span>
                    </div>
                  )}
                </div>
                
                {opportunity.implementation && (
                  <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Implementation Steps</h5>
                    <p className="text-sm text-slate-200 leading-relaxed">{opportunity.implementation}</p>
                  </div>
                )}
                
                {opportunity.relevance_reason && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Why This Opportunity</h5>
                    <p className="text-sm text-green-300 leading-relaxed">{opportunity.relevance_reason}</p>
                  </div>
                )}
                
                {/* Real Links Section */}
                {opportunity.real_links && opportunity.real_links.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-slate-400 uppercase">Real Business Links</span>
                    </div>
                    <div className="space-y-2">
                      {opportunity.real_links.map((link: any, linkIndex: number) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-blue-400 hover:text-blue-300 font-semibold transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{link.name}</span>
                            {link.description && (
                              <span className="text-xs text-blue-300/70 mt-1">{link.description}</span>
                            )}
                            {link.business_type && (
                              <span className="text-xs text-blue-300/50 mt-1">Type: {link.business_type}</span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContentScripts = () => {
    if (isLoadingGrowthStrategies) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          <span className="ml-3 text-slate-300">Loading content scripts...</span>
        </div>
      );
    }

    if (!growthStrategies?.content_scripts || growthStrategies.content_scripts.length === 0) {
      return (
        <div className="text-center py-8">
          <Edit className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No content scripts available</p>
          <button
            onClick={fetchGrowthStrategies}
            className="mt-4 btn-dark-primary px-4 py-2 rounded-lg text-sm"
          >
            Load Growth Strategies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {growthStrategies.content_scripts.map((script: any, index: number) => (
          <div key={index} className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion('content_scripts', index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Edit className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{script.script || `Content Script ${index + 1}`}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ready-to-use script for content creation</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                  expandedAccordions['content_scripts'] === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {/* Accordion Content */}
            {expandedAccordions['content_scripts'] === index && (
              <div className="p-6 pt-4 space-y-4 border-t border-slate-600/30 bg-slate-800/20">
                {script.content && (
                  <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-5">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center">
                      <Edit className="w-3 h-3 mr-2" />
                      Script Content
                    </h5>
                    <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap font-medium">{script.content}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {script.platform && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Platform</span>
                      </div>
                      <span className="text-base text-orange-400 font-semibold">{script.platform}</span>
                    </div>
                  )}
                  {script.duration && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Duration</span>
                      </div>
                      <span className="text-base text-white font-semibold">{script.duration}</span>
                    </div>
                  )}
                  {script.hashtags && (
                    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase">Hashtags</span>
                      </div>
                      <span className="text-sm text-white font-medium">{script.hashtags}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDownloads = () => {
    console.log('renderDownloads called - isLoadingDownloads:', isLoadingDownloads, 'downloadFiles:', downloadFiles?.length || 0);
    console.log('Download files data:', downloadFiles);
    
    if (isLoadingDownloads) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
          <span className="ml-3 text-slate-300">Loading download files...</span>
        </div>
      );
    }

    if (!downloadFiles || downloadFiles.length === 0) {
      return (
        <div className="text-center py-12">
          <Download className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Download Files Available</h3>
          <p className="text-slate-400">Download files will appear here once they are generated.</p>
          <button 
            onClick={() => {
              console.log('Manual refresh clicked');
              const fetchFiles = async () => {
                setIsLoadingDownloads(true);
                try {
                  const response = await apiClient.get(`/non-ai-recommendations/influencer/13`);
                  if (response.data?.download_links) {
                    setDownloadFiles(response.data.download_links);
                    console.log('Files refreshed manually:', response.data.download_links.length);
                  } else {
                    console.log('No download_links found on manual refresh');
                  }
                } catch (error) {
                  console.error('Error refreshing files:', error);
                } finally {
                  setIsLoadingDownloads(false);
                }
              };
              fetchFiles();
            }}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh Files
          </button>
        </div>
      );
    }

    const handleDownload = (file: any) => {
      console.log('Download clicked for file:', file);
      console.log('Download URL from API:', file.download_url);
      
      try {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        // Use the absolute URL provided by the API
        link.href = file.download_url;
        link.download = file.filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        console.log('Using API download URL:', file.download_url);
        console.log('Download filename:', file.filename);
        
        // Add to DOM, click, then remove
        document.body.appendChild(link);
        link.click();
        
        // Remove after a short delay to ensure click is processed
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        toast.success(`Downloading ${file.title}...`);
        
      } catch (error) {
        console.error('Download error:', error);
        toast.error(`Failed to download ${file.title}`);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Implementation Guides</h3>
          <p className="text-slate-400">Download comprehensive PDF guides for all your growth strategies</p>
        </div>

        <div className="space-y-4">
          {console.log(`Total files to render: ${downloadFiles.length}`, downloadFiles)}
          {downloadFiles.map((file, index) => {
            console.log(`Rendering file ${index}:`, file);
            return (
            <div key={file.filename || index} className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4 hover:bg-slate-700/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <Download className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">{file.title}</h4>
                      <span className="text-xs text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full">
                        {file.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                      Download {file.title} - {file.size}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>{file.size}</span>
                      <span className="text-indigo-400 font-medium">PDF</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 ml-4"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {downloadFiles.length > 1 && (
          <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-white font-semibold">Download All Guides</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Get the complete package with all implementation guides in one convenient download.
            </p>
            <button
              onClick={() => {
                downloadFiles.forEach((file, index) => {
                  setTimeout(() => handleDownload(file), index * 500);
                });
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download All PDFs</span>
            </button>
          </div>
        )}
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

  const renderAdvancedTab = () => {
    switch (currentAdvancedTab) {
      case 0:
        return renderMoreFollowers();
      case 1:
        return renderContentIdeas();
      case 2:
        return renderSocialProfiles();
      case 3:
        return renderInfluencerCollab();
      case 4:
        return renderBusinessCollab();
      case 5:
        return renderContentScripts();
      case 6:
        return renderDownloads();
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

  // Removed the "if (recommendations.length === 0)" condition to always show the panels
  
  // Main return - always show the panels
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
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
              AI Recommendations 🤖
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Your personalized influencer strategy recommendations powered by AI
            </p>
          </div>

          {/* Main Content Layout - Two Column with AI Agents on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Panel - Advanced Growth Strategies */}
            <div className="space-y-6">
              {/* Navigation Tabs */}
              {/* <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-600/30">
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
              </div> */}

              {/* Progress Bar */}
              {/* <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
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
              </div> */}

              {/* Main Content */}
              {/* <div 
                ref={timelineRef}
                className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6 min-h-[600px]"
                onTouchStart={handleTouchStart}
              > */}
                {/* Desktop Navigation */}
                {/* <div className="hidden md:flex justify-between items-center mb-6">
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
                </div> */}

                {/* Mobile Navigation */}
                {/* <div className="md:hidden flex justify-between items-center mb-6">
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
                </div> */}

                {/* Section Content */}
                {/* <div className="overflow-y-auto max-h-[500px]">
                  {renderCurrentSection()}
                </div>
              </div> */}

              {/* Recommendation Info */}
              {/* <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-wrap items-center justify-between text-sm text-slate-300">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">ID:</span>
                      <span className="font-mono text-cyan-400">#{currentRecommendation?.id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Level:</span>
                      <span className="capitalize font-medium text-white">{currentRecommendation?.user_level || 'N/A'}</span>
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
                      <span className="font-mono text-cyan-400">#{user?.id || 'N/A'}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 truncate max-w-xs">{user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Advanced Growth Strategies Panel - Moved to Left */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Advanced Growth Strategies
                </h2>
                {!growthStrategies && processingStatus !== 'processing' && (
                  <button
                    onClick={fetchGrowthStrategies}
                    disabled={isLoadingGrowthStrategies}
                    className="btn-dark-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingGrowthStrategies ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load Strategies'
                    )}
                  </button>
                )}
                
                {processingStatus === 'processing' && (
                  <div className="flex items-center space-x-2 text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-sm">AI Processing...</span>
                  </div>
                )}
              </div>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: 0, name: 'More Followers', icon: Users, color: 'bg-blue-500' },
                  { id: 1, name: 'Content Ideas', icon: Lightbulb, color: 'bg-yellow-500' },
                  { id: 2, name: 'Social Profiles', icon: Globe, color: 'bg-purple-500' },
                  { id: 3, name: 'Influencer Collab', icon: Star, color: 'bg-pink-500' },
                  { id: 4, name: 'Business Collab', icon: Target, color: 'bg-green-500' },
                  { id: 5, name: 'Content Scripts', icon: Edit, color: 'bg-orange-500' },
                  { id: 6, name: 'Downloads', icon: Download, color: 'bg-indigo-500' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentAdvancedTab === tab.id
                        ? 'bg-slate-700 text-white shadow-lg'
                        : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                    onClick={() => {
                      console.log('Tab clicked:', tab.name, 'ID:', tab.id);
                      setCurrentAdvancedTab(tab.id);
                    }}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {renderAdvancedTab()}
              </div>
            </div>
          </div>

            {/* Right Panel - AI Agents */}
            <div className="space-y-6">
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
              <h3 className="text-2xl font-bold text-white">
                {selectedInsight.agent_type?.replace('_', ' ')} Advisor Insight
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
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
