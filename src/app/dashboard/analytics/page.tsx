'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Eye, BarChart3, Activity, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Influencer, Business, UserSubscription } from '@/types';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const { user, userRoles } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [influencerAnalytics, setInfluencerAnalytics] = useState({
    userGrowth: [],
    revenueGrowth: []
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Check if user is an influencer
  const isInfluencer = userRoles?.some(role => 
    ['influencer', 'professional_influencer', 'business_influencer'].includes(role.name)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isInfluencer && user?.id) {
          // Fetch influencer-specific analytics
          const [userGrowthData, revenueGrowthData] = await Promise.all([
            apiClient.getInfluencerUserGrowthByMonth(user.id),
            apiClient.getInfluencerRevenueGrowthByMonth(user.id),
          ]);
          
          setInfluencerAnalytics({
            userGrowth: userGrowthData.data || [],
            revenueGrowth: revenueGrowthData.data || []
          });
        } else {
          // Fetch general analytics for non-influencers
          const [influencersData, businessesData, subscriptionsData] = await Promise.all([
            apiClient.getInfluencers(),
            apiClient.getAllBusinesses(),
            apiClient.getAllSubscriptions(),
          ]);
          
          setInfluencers(influencersData);
          setBusinesses(businessesData);
          setSubscriptions(subscriptionsData);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        toast.error('Failed to load analytics data');
        
        // Fallback to mock data for influencer charts
        if (isInfluencer) {
          setInfluencerAnalytics({
            userGrowth: [
              { month: 'Jan', month_number: 1, followers: 98000, engagement_rate: 3.8 },
              { month: 'Feb', month_number: 2, followers: 105000, engagement_rate: 4.1 },
              { month: 'Mar', month_number: 3, followers: 112000, engagement_rate: 4.3 },
              { month: 'Apr', month_number: 4, followers: 118000, engagement_rate: 4.2 },
              { month: 'May', month_number: 5, followers: 125000, engagement_rate: 4.4 },
              { month: 'Jun', month_number: 6, followers: 132000, engagement_rate: 4.6 },
            ],
            revenueGrowth: [
              { month: 'Jan', month_number: 1, revenue: 2800, campaigns_completed: 4 },
              { month: 'Feb', month_number: 2, revenue: 3200, campaigns_completed: 5 },
              { month: 'Mar', month_number: 3, revenue: 3600, campaigns_completed: 6 },
              { month: 'Apr', month_number: 4, revenue: 4100, campaigns_completed: 7 },
              { month: 'May', month_number: 5, revenue: 4500, campaigns_completed: 8 },
              { month: 'Jun', month_number: 6, revenue: 5200, campaigns_completed: 9 },
            ]
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isInfluencer, user?.id]);

  // Calculate metrics for non-influencer users
  const totalInfluencers = influencers.length;
  const activeInfluencers = influencers.filter(inf => inf.availability).length;
  const totalBusinesses = businesses.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + 50, 0); // Assuming $50 average subscription

  // Mock data for general charts (for non-influencer users)
  const mockChartData = {
    userGrowth: [
      { month: 'Jan', users: 120, influencers: 45, businesses: 25 },
      { month: 'Feb', users: 150, influencers: 52, businesses: 30 },
      { month: 'Mar', users: 180, influencers: 58, businesses: 35 },
      { month: 'Apr', users: 220, influencers: 65, businesses: 40 },
      { month: 'May', users: 250, influencers: 72, businesses: 45 },
      { month: 'Jun', users: 280, influencers: 78, businesses: 50 },
    ],
    revenue: [
      { month: 'Jan', revenue: 2500 },
      { month: 'Feb', revenue: 3200 },
      { month: 'Mar', revenue: 3800 },
      { month: 'Apr', revenue: 4200 },
      { month: 'May', revenue: 4800 },
      { month: 'Jun', revenue: 5200 },
    ],
    engagement: [
      { platform: 'Instagram', engagement: 4.2 },
      { platform: 'YouTube', engagement: 3.8 },
      { platform: 'TikTok', engagement: 5.1 },
      { platform: 'Twitter', engagement: 2.9 },
      { platform: 'LinkedIn', engagement: 3.5 },
    ],
  };

  // Stats for influencer vs general users
  const stats = isInfluencer ? [
    {
      name: 'Total Followers',
      value: influencerAnalytics.userGrowth.length > 0 
        ? influencerAnalytics.userGrowth[influencerAnalytics.userGrowth.length - 1].followers?.toLocaleString() || '0'
        : '125,000',
      icon: Users,
      gradient: 'from-cyan-400 to-teal-500',
      description: 'Across all platforms',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Engagement Rate',
      value: `${influencerAnalytics.userGrowth.length > 0 
        ? influencerAnalytics.userGrowth[influencerAnalytics.userGrowth.length - 1].engagement_rate?.toFixed(1) || '4.2'
        : '4.2'}%`,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Average engagement',
      change: '+0.4%',
      changeType: 'increase',
    },
    {
      name: 'Monthly Revenue',
      value: `$${influencerAnalytics.revenueGrowth.length > 0 
        ? influencerAnalytics.revenueGrowth[influencerAnalytics.revenueGrowth.length - 1].revenue?.toLocaleString() || '5,200'
        : '5,200'}`,
      icon: DollarSign,
      gradient: 'from-amber-400 to-orange-500',
      description: 'From collaborations',
      change: '+18%',
      changeType: 'increase',
    },
    {
      name: 'Campaigns',
      value: influencerAnalytics.revenueGrowth.length > 0 
        ? influencerAnalytics.revenueGrowth[influencerAnalytics.revenueGrowth.length - 1].campaigns_completed || 9
        : 9,
      icon: Target,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Completed this month',
      change: '+3',
      changeType: 'increase',
    },
  ] : [
    {
      name: 'Total Users',
      value: totalInfluencers + totalBusinesses,
      icon: Users,
      gradient: 'from-cyan-400 to-teal-500',
      description: 'All registered users',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Active Influencers',
      value: activeInfluencers,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Available for campaigns',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Monthly recurring revenue',
      change: '+15%',
      changeType: 'increase',
    },
    {
      name: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: Target,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Current subscribers',
      change: '+5%',
      changeType: 'increase',
    },
  ];

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
                  Analytics Dashboard 📊
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Platform performance and user insights
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">Real-time Data</span>
                  </div>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                  className="select-dark px-4 py-2 rounded-xl font-medium whitespace-nowrap"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.name}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 ${
                      stat.changeType === 'increase' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                      <span className="font-medium whitespace-nowrap">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{stat.value}</h3>
                    <p className="text-slate-400 text-sm truncate">{stat.name}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {isInfluencer ? (
              <>
                {/* Monthly User Growth Chart for Influencer */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-cyan-400" />
                    Monthly User Growth
                  </h3>
                  <div className="space-y-3">
                    {influencerAnalytics.userGrowth.map((data, index) => {
                      const maxFollowers = Math.max(...influencerAnalytics.userGrowth.map(d => d.followers || 0));
                      const barWidth = ((data.followers || 0) / maxFollowers) * 100;
                      
                      return (
                        <div key={data.month} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{data.month}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-semibold text-cyan-400">
                                {data.followers?.toLocaleString() || '0'} followers
                              </span>
                              <span className="text-xs text-slate-400">
                                {data.engagement_rate?.toFixed(1) || '0'}% engagement
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${barWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Revenue Growth Chart for Influencer */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                    Monthly Revenue Growth
                  </h3>
                  <div className="space-y-3">
                    {influencerAnalytics.revenueGrowth.map((data, index) => {
                      const maxRevenue = Math.max(...influencerAnalytics.revenueGrowth.map(d => d.revenue || 0));
                      const barWidth = ((data.revenue || 0) / maxRevenue) * 100;
                      
                      return (
                        <div key={data.month} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{data.month}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-semibold text-emerald-400">
                                ${data.revenue?.toLocaleString() || '0'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {data.campaigns_completed || 0} campaigns
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${barWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* General User Growth Chart */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                    User Growth
                  </h3>
                  <div className="space-y-4">
                    {mockChartData.userGrowth.map((data) => (
                      <div key={data.month} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <span className="text-sm font-medium text-white">{data.month}</span>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                            <span className="text-xs text-slate-300">{data.users} users</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs text-slate-300">{data.influencers} influencers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-slate-300">{data.businesses} businesses</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Revenue Chart */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                    Monthly Revenue
                  </h3>
                  <div className="space-y-4">
                    {mockChartData.revenue.map((data) => (
                      <div key={data.month} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <span className="text-sm font-medium text-white">{data.month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-emerald-400">${data.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Platform Engagement */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyan-400" />
              Platform Engagement Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {mockChartData.engagement.map((data) => (
                <div key={data.platform} className="text-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2">{data.engagement}%</div>
                  <div className="text-sm text-slate-300 font-medium">{data.platform}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Top Influencers */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-cyan-400" />
                Top Performing Influencers
              </h3>
              <div className="space-y-4">
                {influencers
                  .sort((a, b) => (b.successful_campaigns || 0) - (a.successful_campaigns || 0))
                  .slice(0, 5)
                  .map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">
                            {influencer.user.first_name?.[0]?.toUpperCase() || influencer.user.username[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {influencer.user.first_name} {influencer.user.last_name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {influencer.successful_campaigns || 0} campaigns
                          </div>
                        </div>
                      </div>
                        <div className="text-sm font-bold text-emerald-400">
                        ${influencer.rate_per_post || 0}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <div className="text-sm text-slate-300 flex-1">
                    New influencer joined the platform
                  </div>
                  <div className="text-xs text-slate-500">2h ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  <div className="text-sm text-slate-300 flex-1">
                    Business created a new campaign
                  </div>
                  <div className="text-xs text-slate-500">4h ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <div className="text-sm text-slate-300 flex-1">
                    New subscription activated
                  </div>
                  <div className="text-xs text-slate-500">6h ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <div className="text-sm text-slate-300 flex-1">
                    Rate card updated
                  </div>
                  <div className="text-xs text-slate-500">8h ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <div className="text-sm text-slate-300 flex-1">
                    Collaboration completed
                  </div>
                  <div className="text-xs text-slate-500">12h ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}

