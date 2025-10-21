'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Handshake, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Collaboration, Business } from '@/types';

export default function BusinessCollaborationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [promotions, setPromotions] = useState<Array<{
    id: number;
    business_id: number;
    promotion_name: string;
    promotion_item: string;
    start_date: string;
    end_date: string;
    budget?: number;
    uuid?: string;
    collaboration_stats?: {
      total: number;
      active: number;
      approved: number;
      pending: number;
      rejected: number;
    };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userBusinessId, setUserBusinessId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPromotionsForBusiness = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) {
          console.log('[DEBUG] No user ID available');
          setPromotions([]);
          setLoading(false);
          return;
        }

        console.log('[DEBUG] Fetching promotions for user owner_id:', user.id);
        
        // Call the new endpoint with business_owner_id (user.id)
        // This will fetch promotions for ALL businesses owned by this user
        const promotionsWithStats = await apiClient.getBusinessPromotionsWithCollaborations(user.id);
        console.log('[DEBUG] Promotions with stats received:', promotionsWithStats.length);
        console.log('[DEBUG] Promotions data:', promotionsWithStats);
        setPromotions(promotionsWithStats);
        
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load collaborations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPromotionsForBusiness();
    }
  }, [user?.id]);

  // Navigation functions for action buttons
  const handleViewDetails = (collaborationId: number) => {
    router.push(`/business/collaborations/${collaborationId}`);
  };

  const handleViewMessages = (collaborationId: number) => {
    router.push(`/business/collaborations/${collaborationId}/messages`);
  };

  const handleViewAnalytics = (collaborationId: number) => {
    router.push(`/business/collaborations/${collaborationId}/analytics`);
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

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Business Collaborations 🤝
              </h1>
              <div className="text-slate-300 text-lg leading-relaxed">
                <span>Manage your influencer collaborations and partnerships</span>
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
                  <span className="text-sm text-slate-300 whitespace-nowrap">Active Collaborations</span>
                </div>
              </div>
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
                  placeholder="Search collaborations, influencers, or campaigns..."
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
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-slate-300">Loading collaborations...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Collaborations</h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-dark-primary px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Promotions List */}
        {!loading && !error && (
          <div className="space-y-6">
            {promotions.length === 0 ? (
              <div className="text-center py-12">
                <Handshake className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Promotions Found</h3>
                <p className="text-slate-400">No promotions available for your business yet.</p>
              </div>
            ) : (
              promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">{promo.promotion_name}</h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-slate-300">
                              UUID: {(promo.uuid || '').slice(0, 8) || '—'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm">{promo.promotion_item}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                            <span>Start: {new Date(promo.start_date).toLocaleDateString()}</span>
                            <span>End: {new Date(promo.end_date).toLocaleDateString()}</span>
                            {typeof promo.budget === 'number' && (
                              <span>Budget: ${promo.budget.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm text-center">
                          <div className="text-xs uppercase tracking-wide">Active</div>
                          <div className="text-lg font-semibold">{promo.collaboration_stats?.active ?? 0}</div>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm text-center">
                          <div className="text-xs uppercase tracking-wide">Approved</div>
                          <div className="text-lg font-semibold">{promo.collaboration_stats?.approved ?? 0}</div>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm text-center">
                          <div className="text-xs uppercase tracking-wide">Pending</div>
                          <div className="text-lg font-semibold">{promo.collaboration_stats?.pending ?? 0}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/business/collaborations/${promo.id}`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/business/collaborations/${promo.id}/messages`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                          title="View Messages"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/business/collaborations/${promo.id}/analytics`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                          title="View Analytics"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}

