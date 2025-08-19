'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Eye, BarChart3, Activity, Target } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Influencer, Business, UserSubscription } from '@/types';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [influencersData, businessesData, subscriptionsData] = await Promise.all([
          apiClient.getInfluencers(),
          apiClient.getAllBusinesses(),
          apiClient.getAllSubscriptions(),
        ]);
        
        setInfluencers(influencersData);
        setBusinesses(businessesData);
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalInfluencers = influencers.length;
  const activeInfluencers = influencers.filter(inf => inf.availability).length;
  const totalBusinesses = businesses.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + 50, 0); // Assuming £50 average subscription

  const avgInfluencerRate = influencers.length > 0 
    ? Math.round(influencers.reduce((sum, inf) => sum + (inf.rate_per_post || 0), 0) / influencers.length)
    : 0;

  const avgGrowthRate = influencers.length > 0
    ? Math.round(influencers.reduce((sum, inf) => sum + (inf.growth_rate || 0), 0) / influencers.length)
    : 0;

  const avgSuccessfulCampaigns = influencers.length > 0
    ? Math.round(influencers.reduce((sum, inf) => sum + (inf.successful_campaigns || 0), 0) / influencers.length)
    : 0;

  // Mock data for charts (in a real app, this would come from the API)
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

  const stats = [
    {
      name: 'Total Users',
      value: totalInfluencers + totalBusinesses,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Influencers',
      value: activeInfluencers,
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Total Revenue',
      value: `£${totalRevenue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Subscriptions',
      value: activeSubscriptions,
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-orange-500',
    },
  ];

  const metrics = [
    {
      name: 'Average Influencer Rate',
      value: `£${avgInfluencerRate}`,
      description: 'Per post across all influencers',
      icon: DollarSign,
    },
    {
      name: 'Average Growth Rate',
      value: `${avgGrowthRate}%`,
      description: 'Monthly follower growth',
      icon: TrendingUp,
    },
    {
      name: 'Average Campaigns',
      value: avgSuccessfulCampaigns,
      description: 'Successful campaigns per influencer',
      icon: Target,
    },
    {
      name: 'Platform Engagement',
      value: '4.2%',
      description: 'Average engagement rate',
      icon: Activity,
    },
  ];

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
                Analytics
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Platform performance and user insights
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className={`${stat.color} px-5 py-3`}>
                  <div className="text-sm">
                    <span className="text-white">
                      {stat.change} from last month
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <metric.icon className="h-6 w-6 text-primary-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {metric.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {metric.value}
                        </dd>
                        <dd className="text-sm text-gray-500">
                          {metric.description}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
              <div className="space-y-4">
                {mockChartData.userGrowth.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{data.users} users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{data.influencers} influencers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{data.businesses} businesses</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
              <div className="space-y-4">
                {mockChartData.revenue.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">£{data.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Engagement */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Engagement Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {mockChartData.engagement.map((data) => (
                  <div key={data.platform} className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{data.engagement}%</div>
                    <div className="text-sm text-gray-600">{data.platform}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Influencers */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Influencers</h3>
              <div className="space-y-4">
                {influencers
                  .sort((a, b) => (b.successful_campaigns || 0) - (a.successful_campaigns || 0))
                  .slice(0, 5)
                  .map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {influencer.user.first_name?.[0] || influencer.user.username[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {influencer.user.first_name} {influencer.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {influencer.successful_campaigns || 0} campaigns
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-primary-600">
                        £{influencer.rate_per_post || 0}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    New influencer joined the platform
                  </div>
                  <div className="text-xs text-gray-400">2h ago</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    Business created a new campaign
                  </div>
                  <div className="text-xs text-gray-400">4h ago</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    New subscription activated
                  </div>
                  <div className="text-xs text-gray-400">6h ago</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    Rate card updated
                  </div>
                  <div className="text-xs text-gray-400">8h ago</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    Collaboration completed
                  </div>
                  <div className="text-xs text-gray-400">12h ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

