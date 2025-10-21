'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface PromotionAnalytics {
  promotion_id: number;
  promotion_name: string;
  business_name: string;
  statistics: {
    total_collaborations: number;
    approved_collaborations: number;
    pending_collaborations: number;
    active_collaborations: number;
    rejected_collaborations: number;
    total_amount: number;
  };
  charts: {
    approved_influencers_per_month: Array<{
      month: string;
      approved_influencers: number;
    }>;
    influencer_amount_distribution: Array<{
      influencer_id: number;
      influencer_name: string;
      amount: number;
      percentage: number;
    }>;
  };
}

export default function PromotionAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const promotionId = useMemo(() => Number(params?.id), [params]);

  const [analytics, setAnalytics] = useState<PromotionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId || Number.isNaN(promotionId)) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPromotionAnalytics(promotionId);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [promotionId]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getBarHeight = (value: number, maxValue: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const getPieColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-emerald-500', 
      'bg-purple-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-cyan-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/business/collaborations')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Collaborations</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Promotion Analytics</h1>
              <p className="text-slate-400 text-sm">
                {analytics ? `${analytics.promotion_name} - ${analytics.business_name}` : `Promotion #${promotionId}`}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-slate-300">Loading analytics...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to load</h3>
            <p className="text-slate-300">{error}</p>
          </div>
        )}

        {!loading && !error && analytics && (
          <div className="space-y-6">
            {/* Statistics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.statistics.total_collaborations}</div>
                <div className="text-slate-400 text-sm">Total</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{analytics.statistics.approved_collaborations}</div>
                <div className="text-slate-400 text-sm">Approved</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{analytics.statistics.active_collaborations}</div>
                <div className="text-slate-400 text-sm">Active</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 bg-amber-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">{analytics.statistics.pending_collaborations}</div>
                <div className="text-slate-400 text-sm">Pending</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✗</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{analytics.statistics.rejected_collaborations}</div>
                <div className="text-slate-400 text-sm">Rejected</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">${analytics.statistics.total_amount.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Total Amount</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Approved Influencers per Month */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-cyan-300" />
                  <h2 className="text-white font-semibold text-lg">Approved Influencers per Month</h2>
                </div>
                
                {analytics.charts.approved_influencers_per_month.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No approved influencers data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                      {analytics.charts.approved_influencers_per_month.map((item, index) => {
                        const maxValue = Math.max(...analytics.charts.approved_influencers_per_month.map(d => d.approved_influencers));
                        const height = getBarHeight(item.approved_influencers, maxValue);
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg w-full min-h-[4px] transition-all duration-500 ease-out"
                              style={{ height: `${Math.max(height, 4)}px` }}
                            />
                            <div className="mt-2 text-xs text-slate-400 text-center">
                              <div className="font-semibold text-white">{item.approved_influencers}</div>
                              <div className="text-[10px]">{formatMonth(item.month)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Pie Chart - Influencer vs Amount Distribution */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-cyan-300" />
                  <h2 className="text-white font-semibold text-lg">Influencer vs Amount Distribution</h2>
                </div>
                
                {analytics.charts.influencer_amount_distribution.length === 0 ? (
                  <div className="text-center py-8">
                    <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No amount distribution data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {analytics.charts.influencer_amount_distribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${getPieColor(index)}`} />
                            <div>
                              <div className="text-white font-medium text-sm">{item.influencer_name}</div>
                              <div className="text-slate-400 text-xs">ID: {item.influencer_id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-cyan-400 font-semibold">${item.amount.toLocaleString()}</div>
                            <div className="text-slate-400 text-xs">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary */}
                    <div className="mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Total Amount</span>
                        <span className="text-white font-semibold">${analytics.statistics.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-400 text-sm">Active Collaborations</span>
                        <span className="text-emerald-400 font-semibold">{analytics.charts.influencer_amount_distribution.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-300" />
                <h2 className="text-white font-semibold text-lg">Key Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="text-slate-400 text-sm mb-1">Approval Rate</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {analytics.statistics.total_collaborations > 0 
                      ? Math.round((analytics.statistics.approved_collaborations / analytics.statistics.total_collaborations) * 100)
                      : 0}%
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="text-slate-400 text-sm mb-1">Average Amount per Influencer</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    ${analytics.charts.influencer_amount_distribution.length > 0 
                      ? Math.round(analytics.statistics.total_amount / analytics.charts.influencer_amount_distribution.length)
                      : 0}
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="text-slate-400 text-sm mb-1">Active Collaboration Rate</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics.statistics.total_collaborations > 0 
                      ? Math.round((analytics.statistics.active_collaborations / analytics.statistics.total_collaborations) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}