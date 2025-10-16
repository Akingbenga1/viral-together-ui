'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  Search, 
  Filter, 
  Plus, 
  Target, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Share2,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Mail,
  Copy,
  Link as LinkIcon
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';

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
  uuid?: string; // optional uuid on API
}

export default function BusinessPromotionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPromotions();
        setPromotions(data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Filter promotions based on search term and status
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.promotion_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.promotion_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (promotion.description && promotion.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || promotion.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSharePromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowShareModal(true);
  };

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product Launch':
        return 'from-purple-400 to-pink-500';
      case 'Product Review':
        return 'from-blue-400 to-cyan-500';
      case 'Brand Awareness':
        return 'from-emerald-400 to-teal-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Business Promotions 📢
              </h1>
              <div className="text-slate-300 text-lg leading-relaxed">
                <span>Create and manage your promotional campaigns</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300 whitespace-nowrap">Active Campaigns</span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/business/promotions/create')}
                className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                <span>New Promotion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 lg:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search promotions, campaigns, or types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button className="px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-700/70 hover:text-white transition-all duration-200">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-slate-300">Loading promotions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No promotions found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first promotion to get started.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button 
                onClick={() => router.push('/business/promotions/create')}
                className="btn-dark-primary px-6 py-3 rounded-xl font-medium"
              >
                Create Promotion
              </button>
            )}
          </div>
        )}

        {/* Promotions List */}
        {!loading && !error && filteredPromotions.length > 0 && (
          <div className="space-y-6">
            {filteredPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{promotion.promotion_name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-slate-300">UUID: {(promotion.uuid || '').slice(0,8) || '—'}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{promotion.description || 'No description provided'}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-slate-500">{promotion.promotion_item}</span>
                        <span className="text-xs text-slate-500">${promotion.budget?.toLocaleString() || 0} budget</span>
                        <span className="text-xs text-slate-500">Platform ID: {promotion.social_media_platform_id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(promotion.status || 'pending')}`}>
                      {getStatusIcon(promotion.status || 'pending')}
                      <span className="ml-1 capitalize">{promotion.status || 'pending'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Campaign Details */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Campaign Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Budget:</span>
                        <span className="text-sm text-white">${promotion.budget?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Spent:</span>
                        <span className="text-sm text-white">${promotion.spent_amount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Duration:</span>
                        <span className="text-sm text-white">{new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Target Audience</h4>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-300">
                        <span className="font-medium">Audience:</span> {promotion.target_audience || 'Not specified'}
                      </div>
                      <div className="text-sm text-slate-300">
                        <span className="font-medium">Platform ID:</span> {promotion.social_media_platform_id}
                      </div>
                      <div className="text-sm text-slate-300">
                        <span className="font-medium">Discount:</span> {promotion.discount ? `${promotion.discount}%` : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Budget Used:</span>
                        <span className="text-sm text-white">{promotion.budget ? ((promotion.spent_amount || 0) / promotion.budget * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Remaining:</span>
                        <span className="text-sm text-white">${((promotion.budget || 0) - (promotion.spent_amount || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Status:</span>
                        <span className={`text-sm ${promotion.status === 'active' ? 'text-emerald-400' : promotion.status === 'completed' ? 'text-blue-400' : 'text-amber-400'}`}>
                          {promotion.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Additional Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Created:</span>
                        <span className="text-sm text-white">{new Date(promotion.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Updated:</span>
                        <span className="text-sm text-white">{new Date(promotion.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Business ID:</span>
                        <span className="text-sm text-white">{promotion.business_id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/30">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => router.push(`/business/promotions/${promotion.id}`)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => router.push(`/business/promotions/edit/${promotion.id}`)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSharePromotion(promotion)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      title="Share Promotion"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    Created: {new Date(promotion.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedPromotion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowShareModal(false);
                setSelectedPromotion(null);
              }}
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
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedPromotion(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Promotion Preview */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-2">{selectedPromotion.promotion_name}</h4>
                <p className="text-slate-300 text-sm mb-2">{selectedPromotion.description || selectedPromotion.promotion_item}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Budget: ${selectedPromotion.budget?.toLocaleString() || 'Not specified'}</span>
                  <span>•</span>
                  <span>{new Date(selectedPromotion.start_date).toLocaleDateString()} - {new Date(selectedPromotion.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Share Options Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Facebook */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareTitle = `Check out this promotion: ${selectedPromotion.promotion_name}`;
                    const shareDescription = selectedPromotion.description || selectedPromotion.promotion_item;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareTitle = `Check out this promotion: ${selectedPromotion.promotion_name}`;
                    const shareText = `${shareTitle}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                    const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                    const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                      const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
                      const shareText = `Check out this promotion: ${selectedPromotion.promotion_name}\n\n${selectedPromotion.description || selectedPromotion.promotion_item}\n\nView details: ${shareUrl}`;
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
                      const shareUrl = `${window.location.origin}/business/promotions/${selectedPromotion.id}`;
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
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedPromotion(null);
                  }}
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
