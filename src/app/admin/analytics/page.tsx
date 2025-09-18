'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Eye, BarChart3, Activity, Target, ArrowUpRight, ArrowDownRight, Settings, Building } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Influencer, Business, UserSubscription } from '@/types';
import { getRoleDisplayName } from '@/lib/roleUtils';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsPage() {
  const { user, userRoles, hasRoleLevel } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('AdminAnalyticsPage - User data:', {
      user,
      userRoles,
      hasAdminLevel: hasRoleLevel('admin'),
      hasSuperAdminLevel: hasRoleLevel('super_admin')
    });
  }, [user, userRoles, hasRoleLevel]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [userRegistrationData, setUserRegistrationData] = useState<any>(null);
  const [businessRegistrationData, setBusinessRegistrationData] = useState<any>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [influencersData, businessesData, subscriptionsData, userRegData, businessRegData, summaryData, revenueData] = await Promise.all([
          apiClient.getInfluencers(),
          apiClient.getAllBusinesses(),
          apiClient.getAllSubscriptions(),
          apiClient.getUserRegistrationsByMonth(),
          apiClient.getBusinessRegistrationsByMonth(),
          apiClient.getAnalyticsSummary(),
          apiClient.getMonthlySubscriptionRevenue(),
        ]);
        
        console.log('Analytics Data Fetched:', {
          influencers: influencersData.length,
          businesses: businessesData.length,
          subscriptions: subscriptionsData.length,
          userRegistrations: userRegData,
          businessRegistrations: businessRegData,
          summary: summaryData,
          monthlyRevenue: revenueData
        });
        
        setInfluencers(influencersData);
        setBusinesses(businessesData);
        setSubscriptions(subscriptionsData);
        setUserRegistrationData(userRegData);
        setBusinessRegistrationData(businessRegData);
        setAnalyticsSummary(summaryData);
        setMonthlyRevenueData(revenueData);
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
  const activeSubscriptions = subscriptions.length;
  const totalRevenue = subscriptions
    .reduce((sum, sub) => sum + (sub.plan?.price_per_month || 0), 0); // Use actual subscription plan prices

  // Debug logging for subscription calculations
  console.log('Subscription Calculations:', {
    subscriptionsCount: subscriptions.length,
    subscriptions: subscriptions.map(sub => ({
      id: sub.id,
      status: sub.status,
      plan: sub.plan ? {
        id: sub.plan.id,
        name: sub.plan.name,
        price_per_month: sub.plan.price_per_month
      } : 'No plan data'
    })),
    totalRevenue: totalRevenue,
    activeSubscriptions: activeSubscriptions
  });

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
      name: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Monthly recurring revenue',
      change: '+15%',
      changeType: 'increase',
      link: '/admin/revenue',
    },
    {
      name: 'Total Subscriptions',
      value: activeSubscriptions,
      icon: Target,
      gradient: 'from-purple-400 to-pink-500',
      description: 'All subscriptions',
      change: '+5%',
      changeType: 'increase',
      link: '/admin/subscriptions',
    },
    {
      name: 'Active Influencers',
      value: activeInfluencers,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Available for campaigns',
      change: '+8%',
      changeType: 'increase',
      link: '/admin/influencers',
    },
    {
      name: 'Total Businesses',
      value: totalBusinesses,
      icon: Building,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Registered business accounts',
      change: '+10%',
      changeType: 'increase',
      link: '/admin/businesses',
    },
  ];

  // Prepare chart data from API response
  const userRegistrationChartData = userRegistrationData ? {
    labels: userRegistrationData.data.map((item: any) => item.month),
    datasets: [
      {
        label: 'New User Registrations',
        data: userRegistrationData.data.map((item: any) => item.registrations),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New User Registrations',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Prepare chart data from API response
  const businessAccountChartData = businessRegistrationData ? {
    labels: businessRegistrationData.data.map((item: any) => item.month),
    datasets: [
      {
        label: 'New Business Accounts',
        data: businessRegistrationData.data.map((item: any) => item.registrations),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  } : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Business Accounts',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
    },
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
      <div className="min-h-full w-full overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Admin Analytics Dashboard 📊
                </h1>
                <div className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  <span>Platform performance and user insights</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-slate-300 text-sm sm:text-base">
                      {user?.first_name} {user?.last_name}
                    </span>
                    {user?.roles && user.roles.length > 0 && (
                      <>
                        {user.roles.map((role) => (
                          <span
                            key={role.id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20"
                          >
                            {getRoleDisplayName(role.name)}
                          </span>
                        ))}
                        <button className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 hover:text-emerald-300 transition-all duration-200">
                          <Settings className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">Real-time Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.name}
                onClick={() => router.push(stat.link)}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-slate-900/20"
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
                    <div className="mt-2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view details →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* New User Registrations - Bar Chart */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
                New User Registrations
              </h3>
              <div className="h-80">
                <Bar data={userRegistrationChartData} options={chartOptions} />
              </div>
            </div>

            {/* New Business Accounts - Line Chart */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                New Business Accounts
              </h3>
              <div className="h-80">
                <Line data={businessAccountChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* User Growth Chart */}
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

            {/* Revenue Chart */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                Monthly Revenue
              </h3>
              <div className="space-y-4">
                {monthlyRevenueData?.data ? (
                  monthlyRevenueData.data.map((data: any) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <span className="text-sm font-medium text-white">{data.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-emerald-400">${data.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading revenue data...</p>
                  </div>
                )}
              </div>
            </div>
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
