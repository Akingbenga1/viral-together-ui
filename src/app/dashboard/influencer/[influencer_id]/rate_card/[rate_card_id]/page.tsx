'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Calendar, User, Globe, FileText, Edit, Trash2 } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { RateCard, SocialMediaPlatform, Influencer } from '@/types';
import toast from 'react-hot-toast';

export default function RateCardDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [rateCard, setRateCard] = useState<RateCard | null>(null);
  const [platform, setPlatform] = useState<SocialMediaPlatform | null>(null);
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const influencerId = parseInt(params.influencer_id as string);
  const rateCardId = parseInt(params.rate_card_id as string);
  
  console.log('=== RATE CARD DETAIL PAGE DEBUG ===');
  console.log('Params:', params);
  console.log('Influencer ID:', influencerId);
  console.log('Rate Card ID:', rateCardId);

  useEffect(() => {
    const fetchRateCardDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all rate cards for the influencer
        console.log('Fetching rate cards for influencer ID:', influencerId);
        const rateCardsData = await apiClient.getInfluencerRateCards(influencerId);
        console.log('Rate cards data:', rateCardsData);
        
        // Find the specific rate card
        const rateCardData = rateCardsData.find(rc => rc.id === rateCardId);
        console.log('Found rate card:', rateCardData);
        
        if (!rateCardData) {
          throw new Error('Rate card not found');
        }
        
        setRateCard(rateCardData);

        // Fetch platform details from the list
        const platformsData = await apiClient.getSocialMediaPlatforms();
        if (rateCardData.platform_id) {
          const platformData = platformsData.find(p => p.id === rateCardData.platform_id);
          setPlatform(platformData || null);
        }

        // Fetch influencer details directly by ID for more complete data
        try {
          const influencerData = await apiClient.getInfluencer(influencerId);
          setInfluencer(influencerData);
        } catch (influencerError) {
          console.warn('Failed to fetch influencer directly, falling back to list:', influencerError);
          // Fallback to list method
          const influencersData = await apiClient.getInfluencers();
          const influencerData = influencersData.find(inf => inf.id === influencerId);
          setInfluencer(influencerData || null);
        }

      } catch (error: any) {
        console.error('Failed to fetch rate card details:', error);
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to load rate card details';
        toast.error(errorMessage);
        router.push('/dashboard/rate-cards');
      } finally {
        setIsLoading(false);
      }
    };

    if (influencerId && rateCardId) {
      fetchRateCardDetails();
    }
  }, [influencerId, rateCardId, router]);

  const calculateTotalRate = (rateCard: RateCard) => {
    return rateCard.base_rate + 
           rateCard.exclusivity_fee + 
           rateCard.usage_rights_fee + 
           rateCard.revision_fee + 
           rateCard.rush_fee;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading rate card details...</p>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (!rateCard) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rate Card Not Found</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
              The rate card you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <button
              onClick={() => router.push('/dashboard/rate-cards')}
              className="btn-dark-primary px-6 h-10 rounded-xl font-medium"
            >
              Back to Rate Cards
            </button>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard/rate-cards')}
              className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rate Cards
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Rate Card Details</h1>
                <p className="text-slate-400">
                  {platform?.name} • {rateCard.content_type}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push(`/dashboard/rate-cards`)}
                  className="btn-dark-secondary px-4 h-10 rounded-xl font-medium flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rate Card Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Platform</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span className="text-white">{platform?.name || 'Unknown Platform'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Content Type</label>
                    <span className="text-white capitalize">{rateCard.content_type}</span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Base Rate</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-white font-semibold">{rateCard.base_rate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Total Rate</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-lg">{calculateTotalRate(rateCard)}</span>
                    </div>
                  </div>
                </div>
                
                {rateCard.description && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Description</label>
                    <p className="text-slate-300 leading-relaxed">{rateCard.description}</p>
                  </div>
                )}
              </div>

              {/* Rate Breakdown */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
                  Rate Breakdown
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Base Rate</span>
                    <span className="text-white font-semibold">${rateCard.base_rate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Audience Size Multiplier</span>
                    <span className="text-white">×{rateCard.audience_size_multiplier}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Engagement Rate Multiplier</span>
                    <span className="text-white">×{rateCard.engagement_rate_multiplier}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Exclusivity Fee</span>
                    <span className="text-white">${rateCard.exclusivity_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Usage Rights Fee</span>
                    <span className="text-white">${rateCard.usage_rights_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Revision Fee</span>
                    <span className="text-white">${rateCard.revision_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-300">Rush Fee</span>
                    <span className="text-white">${rateCard.rush_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-t border-slate-600/50 bg-slate-700/30 rounded-lg px-4">
                    <span className="text-white font-semibold text-lg">Total Rate</span>
                    <span className="text-emerald-400 font-bold text-xl">${calculateTotalRate(rateCard)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Influencer Information */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                  Influencer
                </h2>
                
                {influencer && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-2 block">Name</label>
                      <span className="text-white">
                        {influencer.user?.first_name && influencer.user?.last_name 
                          ? `${influencer.user.first_name} ${influencer.user.last_name}`
                          : influencer.user?.first_name || influencer.user?.last_name || 'N/A'
                        }
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-2 block">Username</label>
                      <span className="text-white">@{influencer.user?.username}</span>
                    </div>
                    
                    {/* Email not available in current user type */}
                  </div>
                )}
              </div>

              {/* Rate Card Metadata */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  Metadata
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Rate Card ID</label>
                    <span className="text-white font-mono text-sm">#{rateCard.id}</span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Created</label>
                    <span className="text-white">{rateCard.created_at ? formatDate(rateCard.created_at) : 'N/A'}</span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Last Updated</label>
                    <span className="text-white">{rateCard.updated_at ? formatDate(rateCard.updated_at) : 'N/A'}</span>
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
