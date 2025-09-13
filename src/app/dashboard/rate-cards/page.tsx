'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { RateCard, SocialMediaPlatform, Influencer } from '@/types';
import toast from 'react-hot-toast';

export default function RateCardsPage() {
  const { user } = useAuth();
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    content_type: '',
    base_rate: '',
    audience_size_multiplier: '',
    engagement_rate_multiplier: '',
    exclusivity_fee: '',
    usage_rights_fee: '',
    revision_fee: '',
    rush_fee: '',
    description: '',
    platform_id: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformsData, influencersData] = await Promise.all([
          apiClient.getSocialMediaPlatforms(),
          apiClient.getInfluencers(),
        ]);
        setPlatforms(platformsData);
        setInfluencers(influencersData);
        
        // If user has influencer role, fetch their rate cards using influencer_id
        if (user?.roles?.some(r => r.name === 'influencer') && user.influencer_id) {
          const userInfluencer = influencersData.find(inf => inf.id === user.influencer_id);
          if (userInfluencer) {
            setSelectedInfluencer(userInfluencer);
            const rateCardsData = await apiClient.getInfluencerRateCards(user.influencer_id);
            setRateCards(rateCardsData);
          }
        } else if (user?.roles?.some(r => r.name === 'super_admin' || r.name === 'admin')) {
          // For admins, fetch all rate cards from all influencers
          const allRateCards = [];
          for (const influencer of influencersData) {
            try {
              const rateCardsData = await apiClient.getInfluencerRateCards(influencer.id);
              allRateCards.push(...rateCardsData);
            } catch (error) {
              console.log(`Failed to fetch rate cards for influencer ${influencer.id}:`, error);
            }
          }
          setRateCards(allRateCards);
        } else {
          // For other users, show empty state
          setRateCards([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 404) {
          toast.error('Social media platforms endpoint not found. Please check API configuration.');
        } else {
          toast.error('Failed to load rate cards data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCreateRateCard = async () => {
    if (!user?.influencer_id) {
      toast.error('You must have an influencer profile to create rate cards');
      return;
    }

    try {
      const newRateCard = await apiClient.createRateCard({
        influencer_id: user.influencer_id,
        content_type: formData.content_type,
        base_rate: parseFloat(formData.base_rate),
        audience_size_multiplier: parseFloat(formData.audience_size_multiplier),
        engagement_rate_multiplier: parseFloat(formData.engagement_rate_multiplier),
        exclusivity_fee: parseFloat(formData.exclusivity_fee),
        usage_rights_fee: parseFloat(formData.usage_rights_fee),
        revision_fee: parseFloat(formData.revision_fee),
        rush_fee: parseFloat(formData.rush_fee),
        description: formData.description,
        platform_id: parseInt(formData.platform_id),
      });

      setRateCards([...rateCards, newRateCard]);
      setShowCreateModal(false);
      resetForm();
      toast.success('Rate card created successfully');
    } catch (error) {
      console.error('Failed to create rate card:', error);
      toast.error('Failed to create rate card');
    }
  };

  const handleUpdateRateCard = async () => {
    if (!selectedRateCard) return;

    try {
      const updateData = {
        content_type: formData.content_type,
        base_rate: parseFloat(formData.base_rate),
        audience_size_multiplier: parseFloat(formData.audience_size_multiplier),
        engagement_rate_multiplier: parseFloat(formData.engagement_rate_multiplier),
        exclusivity_fee: parseFloat(formData.exclusivity_fee),
        usage_rights_fee: parseFloat(formData.usage_rights_fee),
        revision_fee: parseFloat(formData.revision_fee),
        rush_fee: parseFloat(formData.rush_fee),
        description: formData.description,
        platform_id: parseInt(formData.platform_id),
      };
      
      console.log('=== UPDATE RATE CARD DEBUG ===');
      console.log('Rate card ID:', selectedRateCard.id);
      console.log('Update data:', updateData);
      console.log('Form data:', formData);
      
      const updatedRateCard = await apiClient.updateRateCard(selectedRateCard.id, updateData);

      setRateCards(rateCards.map(rc => rc.id === selectedRateCard.id ? updatedRateCard : rc));
      setShowEditModal(false);
      setSelectedRateCard(null);
      resetForm();
      toast.success('Rate card updated successfully');
    } catch (error: any) {
      console.error('Failed to update rate card:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update rate card';
      toast.error(errorMessage);
    }
  };

  const handleDeleteRateCard = async (rateCardId: number) => {
    if (!confirm('Are you sure you want to delete this rate card?')) return;

    try {
      await apiClient.deleteRateCard(rateCardId);
      setRateCards(rateCards.filter(rc => rc.id !== rateCardId));
      toast.success('Rate card deleted successfully');
    } catch (error) {
      console.error('Failed to delete rate card:', error);
      toast.error('Failed to delete rate card');
    }
  };

  const resetForm = () => {
    setFormData({
      content_type: '',
      base_rate: '',
      audience_size_multiplier: '',
      engagement_rate_multiplier: '',
      exclusivity_fee: '',
      usage_rights_fee: '',
      revision_fee: '',
      rush_fee: '',
      description: '',
      platform_id: '',
    });
  };

  const openEditModal = (rateCard: RateCard) => {
    console.log('=== OPEN EDIT MODAL DEBUG ===');
    console.log('Rate card data:', rateCard);
    console.log('Platform ID:', rateCard.platform_id);
    
    setSelectedRateCard(rateCard);
    setFormData({
      content_type: rateCard.content_type,
      base_rate: rateCard.base_rate.toString(),
      audience_size_multiplier: rateCard.audience_size_multiplier.toString(),
      engagement_rate_multiplier: rateCard.engagement_rate_multiplier.toString(),
      exclusivity_fee: rateCard.exclusivity_fee.toString(),
      usage_rights_fee: rateCard.usage_rights_fee.toString(),
      revision_fee: rateCard.revision_fee.toString(),
      rush_fee: rateCard.rush_fee.toString(),
      description: rateCard.description,
      platform_id: rateCard.platform_id?.toString() || '',
    });
    setShowEditModal(true);
  };

  const calculateTotalRate = (rateCard: RateCard) => {
    return rateCard.base_rate + 
           rateCard.exclusivity_fee + 
           rateCard.usage_rights_fee + 
           rateCard.revision_fee + 
           rateCard.rush_fee;
  };

  const getPlatformName = (platformId: number) => {
    return platforms.find(p => p.id === platformId)?.name || 'Unknown Platform';
  };

  const getInfluencerName = (influencerId: number) => {
    const influencer = influencers.find(inf => inf.id === influencerId);
    return influencer ? `${influencer.user.first_name} ${influencer.user.last_name}` : 'Unknown Influencer';
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded-xl w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                    <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Rate Cards 💰
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Manage your pricing and rate cards for different content types
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {rateCards.length} Rate Cards
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Rate Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+20%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{rateCards.length}</h3>
                  <p className="text-slate-400 text-sm truncate">Total Rate Cards</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Active pricing models</p>
                </div>
              </div>
            </div>

            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+8%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                    {influencers.filter(inf => inf.availability).length}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">Active Influencers</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Available for campaigns</p>
                </div>
              </div>
            </div>

            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+15%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                    £{rateCards.length > 0 
                      ? Math.round(rateCards.reduce((sum, rc) => sum + rc.base_rate, 0) / rateCards.length)
                      : 0}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">Avg. Base Rate</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Average pricing</p>
                </div>
              </div>
            </div>

            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+25%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                    £{rateCards.reduce((sum, rc) => sum + calculateTotalRate(rc), 0).toLocaleString()}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">Total Value</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Combined portfolio value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Cards List */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 lg:p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                Rate Cards
              </h3>
              
              <div className="overflow-x-auto -mx-4 lg:-mx-6">
                <div className="inline-block min-w-full px-4 lg:px-6 align-middle">
                  <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                            Serial Number
                          </th>
                          <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                            Social Media Platform
                          </th>
                          <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                            Content Type
                          </th>
                          <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                            Rate($)
                          </th>
                          <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                            Actions
                          </th>
                        </tr>
                      </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {rateCards.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 lg:px-6 py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <DollarSign className="h-8 w-8 text-slate-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-2">No rate cards</h3>
                              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                                Get started by creating your first rate card to manage pricing.
                              </p>
                              <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-dark-primary px-6 h-10 rounded-xl font-medium flex items-center space-x-2 text-sm"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Create Rate Card</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        rateCards.map((rateCard, index) => (
                          <tr key={rateCard.id} className="hover:bg-slate-700/20 transition-colors">
                            <td className="px-3 lg:px-6 py-4">
                              <div className="text-sm font-semibold text-white">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-3 lg:px-6 py-4">
                              <div className="text-sm text-slate-300 truncate">
                                {getPlatformName(rateCard.platform_id)}
                              </div>
                            </td>
                            <td className="px-3 lg:px-6 py-4">
                              <div className="text-sm text-slate-300 truncate">
                                {rateCard.content_type}
                              </div>
                            </td>
                            <td className="px-3 lg:px-6 py-4">
                              <div className="text-sm font-bold text-emerald-400">
                                ${calculateTotalRate(rateCard)}
                              </div>
                            </td>
                            <td className="px-3 lg:px-6 py-4 text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/dashboard/influencer/${rateCard.influencer_id}/rate_card/${rateCard.id}`}
                                  className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-slate-700/30 transition-colors text-xs"
                                  title="View Rate Card"
                                >
                                  View rate card
                                </Link>
                                <button
                                  onClick={() => openEditModal(rateCard)}
                                  className="text-cyan-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-slate-700/30 transition-colors"
                                  title="Edit Rate Card"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRateCard(rateCard.id)}
                                  className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-slate-700/30 transition-colors"
                                  title="Delete Rate Card"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Rate Card Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              resetForm();
            }
          }}
        >
          <div className="form-container-dark w-full max-w-md max-h-[90vh] overflow-y-auto my-4">
            <h2 className="text-xl font-semibold text-form-text mb-6">Create Rate Card</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="label-dark">Platform</label>
                <select
                  value={formData.platform_id}
                  onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                  className="select-dark"
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label-dark">Content Type</label>
                <input
                  type="text"
                  placeholder="e.g., Instagram Post, YouTube Video"
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="space-y-2">
                <label className="label-dark">Base Rate ($)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.base_rate}
                  onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="space-y-2">
                <label className="label-dark">Description</label>
                <textarea
                  placeholder="Describe the rate card..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="textarea-dark"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCreateRateCard}
                  className="btn-dark-primary flex-1 h-12 rounded-xl font-medium"
                >
                  Create Rate Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="btn-dark flex-1 h-12 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Rate Card Modal */}
      {showEditModal && selectedRateCard && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
              setSelectedRateCard(null);
              resetForm();
            }
          }}
        >
          <div className="form-container-dark w-full max-w-md max-h-[90vh] overflow-y-auto my-4">
            <h2 className="text-xl font-semibold text-form-text mb-6">Edit Rate Card</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="label-dark">Platform</label>
                <select
                  value={formData.platform_id}
                  onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                  className="select-dark"
                >
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label-dark">Content Type</label>
                <input
                  type="text"
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="space-y-2">
                <label className="label-dark">Base Rate ($)</label>
                <input
                  type="number"
                  value={formData.base_rate}
                  onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="space-y-2">
                <label className="label-dark">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="textarea-dark"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleUpdateRateCard}
                  className="btn-dark-primary flex-1 h-12 rounded-xl font-medium"
                >
                  Update Rate Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRateCard(null);
                    resetForm();
                  }}
                  className="btn-dark flex-1 h-12 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </UnifiedDashboardLayout>
  );
}

