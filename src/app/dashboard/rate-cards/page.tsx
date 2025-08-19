'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
    influencer_id: '',
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
        
        // If user has influencer role, fetch their rate cards
        if (user?.roles?.some(r => r.name === 'influencer')) {
          const userInfluencer = influencersData.find(inf => inf.user.id === user.id);
          if (userInfluencer) {
            setSelectedInfluencer(userInfluencer);
            const rateCardsData = await apiClient.getInfluencerRateCards(userInfluencer.id);
            setRateCards(rateCardsData);
          }
        } else {
          // For admins, fetch all rate cards (this would need a new API endpoint)
          // For now, we'll show empty state
          setRateCards([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load rate cards data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCreateRateCard = async () => {
    try {
      const newRateCard = await apiClient.createRateCard({
        influencer_id: parseInt(formData.influencer_id),
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
      const updatedRateCard = await apiClient.updateRateCard(selectedRateCard.id, {
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

      setRateCards(rateCards.map(rc => rc.id === selectedRateCard.id ? updatedRateCard : rc));
      setShowEditModal(false);
      setSelectedRateCard(null);
      resetForm();
      toast.success('Rate card updated successfully');
    } catch (error) {
      console.error('Failed to update rate card:', error);
      toast.error('Failed to update rate card');
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
      influencer_id: '',
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
    setSelectedRateCard(rateCard);
    setFormData({
      influencer_id: rateCard.influencer_id.toString(),
      content_type: rateCard.content_type,
      base_rate: rateCard.base_rate.toString(),
      audience_size_multiplier: rateCard.audience_size_multiplier.toString(),
      engagement_rate_multiplier: rateCard.engagement_rate_multiplier.toString(),
      exclusivity_fee: rateCard.exclusivity_fee.toString(),
      usage_rights_fee: rateCard.usage_rights_fee.toString(),
      revision_fee: rateCard.revision_fee.toString(),
      rush_fee: rateCard.rush_fee.toString(),
      description: rateCard.description,
      platform_id: rateCard.platform_id.toString(),
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
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white shadow rounded-lg p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Rate Cards
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your pricing and rate cards for different content types
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Rate Card
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Rate Cards
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {rateCards.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Influencers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {influencers.filter(inf => inf.availability).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg. Base Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        £{rateCards.length > 0 
                          ? Math.round(rateCards.reduce((sum, rc) => sum + rc.base_rate, 0) / rateCards.length)
                          : 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Value
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        £{rateCards.reduce((sum, rc) => sum + calculateTotalRate(rc), 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Cards List */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rate Cards</h3>
                
                {rateCards.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No rate cards</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first rate card.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Rate Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Influencer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Platform
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Content Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Base Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rateCards.map((rateCard) => (
                          <tr key={rateCard.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {getInfluencerName(rateCard.influencer_id)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getPlatformName(rateCard.platform_id)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {rateCard.content_type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                £{rateCard.base_rate}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-primary-600">
                                £{calculateTotalRate(rateCard)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEditModal(rateCard)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRateCard(rateCard.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Rate Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Rate Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Influencer
                  </label>
                  <select
                    value={formData.influencer_id}
                    onChange={(e) => setFormData({ ...formData, influencer_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Influencer</option>
                    {influencers.map((influencer) => (
                      <option key={influencer.id} value={influencer.id}>
                        {influencer.user.first_name} {influencer.user.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={formData.platform_id}
                    onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Instagram Post, YouTube Video"
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Rate (£)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.base_rate}
                    onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the rate card..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRateCard}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rate Card Modal */}
      {showEditModal && selectedRateCard && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Rate Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={formData.platform_id}
                    onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <input
                    type="text"
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Rate (£)
                  </label>
                  <input
                    type="number"
                    value={formData.base_rate}
                    onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRateCard(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRateCard}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

