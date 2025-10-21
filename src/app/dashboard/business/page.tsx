'use client';

import { useEffect, useState } from 'react';
import { 
  Building, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Search,
  Target,
  Award,
  Eye,
  Heart,
  Share2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDisplayName } from '@/lib/roleUtils';

export default function BusinessDashboardPage() {
  const { user, userRoles } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpent: 0,
    totalReach: 0,
    averageEngagement: 0,
    influencersHired: 0,
  });

  useEffect(() => {
    // Simulate fetching business stats
    setStats({
      totalCampaigns: 8,
      activeCampaigns: 3,
      totalSpent: 12500,
      totalReach: 2500000,
      averageEngagement: 3.8,
      influencersHired: 12,
    });
  }, []);

  const statCards = [
    {
      name: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: Building,
      gradient: 'from-blue-400 to-cyan-500',
      description: 'All time campaigns',
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Target,
      gradient: 'from-emerald-400 to-teal-500',
      description: 'Currently running',
      change: '+1',
      changeType: 'increase',
    },
    {
      name: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Campaign investment',
      change: '+15%',
      changeType: 'increase',
    },
    {
      name: 'Total Reach',
      value: `${(stats.totalReach / 1000000).toFixed(1)}M`,
      icon: Users,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Audience reached',
      change: '+22%',
      changeType: 'increase',
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: 'Summer Product Launch',
      status: 'Active',
      budget: 2500,
      influencers: 3,
      reach: 450000,
      engagement: 4.2,
    },
    {
      id: 2,
      name: 'Holiday Promotion',
      status: 'Completed',
      budget: 1800,
      influencers: 2,
      reach: 320000,
      engagement: 3.8,
    },
    {
      id: 3,
      name: 'Brand Awareness',
      status: 'Active',
      budget: 3000,
      influencers: 4,
      reach: 680000,
      engagement: 4.5,
    },
  ];

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Business Dashboard 🏢
              </h1>
              <div className="text-slate-300 text-lg leading-relaxed">
                <span>Here&apos;s your business campaign overview</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300">
                    {user?.first_name} {user?.last_name}
                  </span>
                  {user?.roles && user.roles.length > 0 && (
                    <>
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20"
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
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300 whitespace-nowrap">Campaigns Active</span>
                </div>
              </div>
              <button className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap">
                <Search className="h-5 w-5" />
                <span>Find Influencers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat, index) => (
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

        {/* Quick Actions */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden mb-8">
          <div className="p-4 lg:p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 text-left group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Create Campaign</h4>
                    <p className="text-sm text-slate-400">Launch new campaign</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 text-left group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors">Find Influencers</h4>
                    <p className="text-sm text-slate-400">Search for creators</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 text-left group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">Analytics</h4>
                    <p className="text-sm text-slate-400">View performance data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 lg:p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Recent Campaigns
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Influencers
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Reach
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {recentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-2 py-3 text-sm font-medium text-white">
                        {campaign.name}
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          campaign.status === 'Active' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/20'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-sm font-medium text-white">
                        ${campaign.budget.toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-sm text-slate-300">
                        {campaign.influencers}
                      </td>
                      <td className="px-2 py-3 text-sm text-slate-300">
                        {(campaign.reach / 1000).toFixed(0)}K
                      </td>
                      <td className="px-2 py-3 text-sm text-slate-300">
                        {campaign.engagement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
