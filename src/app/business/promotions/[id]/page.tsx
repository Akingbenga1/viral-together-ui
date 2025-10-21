'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Megaphone, 
  Calendar, 
  DollarSign,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Share2,
  BarChart3,
  User,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Copy,
  Link as LinkIcon,
  X
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import InfluencerSelect from '@/components/InfluencerSelect';

// Define the promotion type based on API response
interface Promotion {
  id: number;
  business_id: number;
  promotion_name: string;
  promotion_item: string;
  description?: string;
  start_date: string;
  end_date: string;
  discount?: number;
  budget?: number;
  spent_amount?: number;
  status?: string;
  target_audience?: string;
  social_media_platform_id: number;
  created_at: string;
  updated_at: string;
}

// Define the influencer interest type
interface InfluencerInterest {
  collaboration_id: number;
  influencer_id: number;
  influencer_name: string;
  influencer_email?: string;
  collaboration_status: string;
  collaboration_type: string;
  proposed_amount?: number;
  negotiated_amount?: number;
  deliverables?: string;
  contract_signed: boolean;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export default function PromotionDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const promotionId = params.id as string;
  
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [influencers, setInfluencers] = useState<InfluencerInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [influencersLoading, setInfluencersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddInfluencersModal, setShowAddInfluencersModal] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<number[]>([]);
  const [addingInfluencers, setAddingInfluencers] = useState(false);

  // Fetch promotion details
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPromotion(parseInt(promotionId));
        setPromotion(data);
      } catch (err) {
        console.error('Error fetching promotion:', err);
        setError('Failed to load promotion details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchPromotion();
    }
  }, [promotionId]);

  // Fetch influencers interested in this promotion
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setInfluencersLoading(true);
        const data = await apiClient.getPromotionInfluencers(parseInt(promotionId));
        setInfluencers(data);
      } catch (err) {
        console.error('Error fetching influencers:', err);
        // Don't set error for influencers, just log it
      } finally {
        setInfluencersLoading(false);
      }
    };

    if (promotionId) {
      fetchInfluencers();
    }
  }, [promotionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20';
      case 'pending':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCollaborationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
    }
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Action handlers for influencer interests
  const handleApproveInterest = async (collaborationId: number, influencerId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [collaborationId]: true }));
      
      // Call API to approve collaboration
      await apiClient.approveCollaboration(collaborationId, influencerId);
      
      // Update local state
      setInfluencers(prev => prev.map(inf => 
        inf.collaboration_id === collaborationId 
          ? { ...inf, collaboration_status: 'approved' }
          : inf
      ));
      
      // Show success message
      console.log('Interest approved successfully for collaboration:', collaborationId);
    } catch (err) {
      console.error('Error approving interest:', err);
      // Show error message to user
      alert('Failed to approve interest. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [collaborationId]: false }));
    }
  };

  const handleRejectInterest = async (collaborationId: number, influencerId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [collaborationId]: true }));
      
      // Call API to reject collaboration
      await apiClient.rejectCollaboration(collaborationId, influencerId);
      
      // Update local state
      setInfluencers(prev => prev.map(inf => 
        inf.collaboration_id === collaborationId 
          ? { ...inf, collaboration_status: 'rejected' }
          : inf
      ));
      
      // Show success message
      console.log('Interest rejected successfully for collaboration:', collaborationId);
    } catch (err) {
      console.error('Error rejecting interest:', err);
      // Show error message to user
      const anyErr = err as any;
      const apiMsg = anyErr?.response?.data?.detail || anyErr?.message || 'Failed to reject interest. Please try again.';
      if (typeof window !== 'undefined') {
        // Avoid blocking alerts in favor of simple console+non-blocking UI; keep fallback
        // You can integrate a toast library here if available
        // eslint-disable-next-line no-alert
        alert(apiMsg);
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [collaborationId]: false }));
    }
  };

  const handleIgnoreInterest = async (collaborationId: number, influencerId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [collaborationId]: true }));
      
      // Call API to reset collaboration status to pending
      await apiClient.resetCollaboration(collaborationId, influencerId);
      
      // Update local state to pending
      setInfluencers(prev => prev.map(inf => 
        inf.collaboration_id === collaborationId 
          ? { ...inf, collaboration_status: 'pending' }
          : inf
      ));
      
      // Show success message
      console.log('Collaboration reset to pending successfully:', collaborationId);
    } catch (err) {
      console.error('Error resetting collaboration to pending:', err);
      // Show error message to user
      const anyErr = err as any;
      const apiMsg = anyErr?.response?.data?.detail || anyErr?.message || 'Failed to reset collaboration. Please try again.';
      if (typeof window !== 'undefined') {
        alert(apiMsg);
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [collaborationId]: false }));
    }
  };

  const handleAddInfluencers = async () => {
    if (selectedInfluencers.length === 0) {
      alert('Please select at least one influencer');
      return;
    }

    try {
      setAddingInfluencers(true);
      
      // Create collaborations for selected influencers
      const collaborationPromises = selectedInfluencers.map(influencerId =>
        apiClient.createCollaboration({
          influencer_id: influencerId,
          promotion_id: parseInt(promotionId),
          collaboration_type: 'promotion',
          status: 'pending',
          proposed_amount: 0,
          contract_signed: false,
          payment_status: 'pending'
        })
      );
      
      await Promise.all(collaborationPromises);
      
      // Refresh influencers list
      const data = await apiClient.getPromotionInfluencers(parseInt(promotionId));
      setInfluencers(data);
      
      // Close modal and reset selection
      setShowAddInfluencersModal(false);
      setSelectedInfluencers([]);
      
      // Show success message
      alert(`Successfully added ${selectedInfluencers.length} influencer(s) to this promotion`);
    } catch (err) {
      console.error('Error adding influencers:', err);
      
      // Simple fallback - just show a generic message
      alert('Failed to add influencers. Please check the console for details and try again.');
    } finally {
      setAddingInfluencers(false);
    }
  };

  if (loading) {
    return (
      <UnifiedDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-slate-300">Loading promotion details...</span>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (error || !promotion) {
    return (
      <UnifiedDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">{error || 'Promotion not found'}</p>
            <button 
              onClick={() => router.push('/business/promotions')} 
              className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Back to Promotions
            </button>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/business/promotions')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {promotion.promotion_name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(promotion.status || 'pending')}`}>
                    {getStatusIcon(promotion.status || 'pending')}
                    <span className="ml-1 capitalize">{promotion.status || 'pending'}</span>
                  </span>
                  <span className="text-slate-400 text-sm">
                    Created: {new Date(promotion.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => router.push(`/business/promotions/edit/${promotion.id}`)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                title="Share Promotion"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Promotion Overview */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Promotion Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-400">Item:</span>
                  <p className="text-white font-medium">{promotion.promotion_item}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Description:</span>
                  <p className="text-white">{promotion.description || 'No description provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Target Audience:</span>
                  <p className="text-white">{promotion.target_audience || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Platform ID:</span>
                  <p className="text-white">{promotion.social_media_platform_id}</p>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Budget:</span>
                  <span className="text-white font-medium">${promotion.budget?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Spent:</span>
                  <span className="text-white font-medium">${promotion.spent_amount?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Remaining:</span>
                  <span className="text-white font-medium">${((promotion.budget || 0) - (promotion.spent_amount || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Discount:</span>
                  <span className="text-white font-medium">{promotion.discount ? `${promotion.discount}%` : 'None'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: promotion.budget ? `${((promotion.spent_amount || 0) / promotion.budget * 100)}%` : '0%' 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  {promotion.budget ? `${((promotion.spent_amount || 0) / promotion.budget * 100).toFixed(1)}%` : '0%'} budget used
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-slate-400">Start Date</p>
                    <p className="text-white">{new Date(promotion.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-slate-400">End Date</p>
                    <p className="text-white">{new Date(promotion.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="text-white">
                      {Math.ceil((new Date(promotion.end_date).getTime() - new Date(promotion.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-white">{new Date(promotion.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Influencers Interest Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Influencer Interest</h3>
                <p className="text-slate-400 text-sm">
                  {influencers.length} influencer{influencers.length !== 1 ? 's' : ''} have shown interest in this promotion
                </p>
              </div>
              <button
                onClick={() => setShowAddInfluencersModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Add Influencers to this promotion</span>
              </button>
            </div>
          </div>

          {influencersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <span className="ml-3 text-slate-300">Loading influencers...</span>
            </div>
          ) : influencers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-300 mb-2">No Interest Yet</h4>
              <p className="text-slate-400 mb-6">
                No influencers have shown interest in this promotion yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Influencer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Social Handle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Bio URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Proposed Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {influencers.map((influencer, index) => (
                    <tr key={influencer.collaboration_id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {influencer.influencer_name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {influencer.influencer_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getSocialMediaIcon('instagram')}
                          <span className="text-sm text-slate-300">@influencer_handle</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          View Bio
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCollaborationStatusColor(influencer.collaboration_status)}`}>
                          {influencer.collaboration_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {influencer.proposed_amount ? `$${influencer.proposed_amount.toLocaleString()}` : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApproveInterest(influencer.collaboration_id, influencer.influencer_id)}
                            disabled={actionLoading[influencer.collaboration_id] || influencer.collaboration_status === 'approved'}
                            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Interest"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectInterest(influencer.collaboration_id, influencer.influencer_id)}
                            disabled={actionLoading[influencer.collaboration_id] || influencer.collaboration_status === 'rejected'}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject Interest"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIgnoreInterest(influencer.collaboration_id, influencer.influencer_id)}
                            disabled={actionLoading[influencer.collaboration_id] || influencer.collaboration_status === 'pending'}
                            className="px-3 py-2 text-slate-400 hover:text-slate-300 hover:bg-slate-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reset to Pending"
                          >
                            <span className="text-xs font-medium">Reset</span>
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

        {/* Add Influencers Modal */}
        {showAddInfluencersModal && promotion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddInfluencersModal(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 w-full max-w-2xl mx-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Add Influencers to Promotion</h3>
                    <p className="text-sm text-slate-400">Select influencers to collaborate with</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddInfluencersModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Promotion Info */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-2">{promotion.promotion_name}</h4>
                <p className="text-slate-300 text-sm mb-2">{promotion.description || promotion.promotion_item}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Budget: ${promotion.budget?.toLocaleString() || 'Not specified'}</span>
                  <span>•</span>
                  <span>{new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Influencer Select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Select Influencers *
                </label>
                <InfluencerSelect
                  value={selectedInfluencers}
                  onChange={setSelectedInfluencers}
                  placeholder="Search and select influencers..."
                  multiple={true}
                />
                <p className="text-sm text-slate-400 mt-2">
                  Select one or more influencers to add to this promotion
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => setShowAddInfluencersModal(false)}
                  disabled={addingInfluencers}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInfluencers}
                  disabled={addingInfluencers || selectedInfluencers.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {addingInfluencers ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Add Influencers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && promotion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Share Promotion</h3>
                    <p className="text-sm text-slate-400">Share this promotion across social media</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Promotion Preview */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-2">{promotion.promotion_name}</h4>
                <p className="text-slate-300 text-sm mb-2">{promotion.description || promotion.promotion_item}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Budget: ${promotion.budget?.toLocaleString() || 'Not specified'}</span>
                  <span>•</span>
                  <span>{new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Share Options Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Facebook */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Facebook</span>
                </button>

                {/* Twitter */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Twitter className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareTitle = `Check out this promotion: ${promotion.promotion_name}`;
                    const shareDescription = promotion.description || promotion.promotion_item;
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Telegram</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareTitle = `Check out this promotion: ${promotion.promotion_name}`;
                    const shareText = `${shareTitle}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    const subject = encodeURIComponent(shareTitle);
                    const body = encodeURIComponent(shareText);
                    const url = `mailto:?subject=${subject}&body=${body}`;
                    window.open(url);
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Email</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    try {
                      await navigator.clipboard.writeText(shareText);
                      alert('Text copied to clipboard! You can now paste it on Instagram.');
                    } catch (err) {
                      console.error('Failed to copy to clipboard:', err);
                    }
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Instagram</span>
                </button>

                {/* YouTube */}
                <button
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                    const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                    try {
                      await navigator.clipboard.writeText(shareText);
                      alert('Text copied to clipboard! You can now paste it in your YouTube video description.');
                    } catch (err) {
                      console.error('Failed to copy to clipboard:', err);
                    }
                  }}
                  className="group flex flex-col items-center p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Youtube className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">YouTube</span>
                </button>
              </div>

              {/* Copy Options */}
              <div className="border-t border-slate-700/50 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Copy Options</h4>
                <div className="space-y-3">
                  {/* Copy Full Text */}
                  <button
                    onClick={async () => {
                      const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                      const shareText = `Check out this promotion: ${promotion.promotion_name}\n\n${promotion.description || promotion.promotion_item}\n\nView details: ${shareUrl}`;
                      try {
                        await navigator.clipboard.writeText(shareText);
                        alert('Promotion details copied to clipboard!');
                      } catch (err) {
                        console.error('Failed to copy to clipboard:', err);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                        <Copy className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">Copy Full Text</p>
                        <p className="text-sm text-slate-400">Copy promotion details with link</p>
                      </div>
                    </div>
                    <Copy className="w-5 h-5 text-slate-400" />
                  </button>

                  {/* Copy Link Only */}
                  <button
                    onClick={async () => {
                      const shareUrl = `${window.location.origin}/business/promotions/${promotion.id}`;
                      try {
                        await navigator.clipboard.writeText(shareUrl);
                        alert('Link copied to clipboard!');
                      } catch (err) {
                        console.error('Failed to copy link:', err);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-600/40 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">Copy Link</p>
                        <p className="text-sm text-slate-400">Copy just the promotion URL</p>
                      </div>
                    </div>
                    <LinkIcon className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-400">Share across all platforms</span>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:text-white transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
