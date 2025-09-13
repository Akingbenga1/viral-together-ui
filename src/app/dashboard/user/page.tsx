'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Share2,
  Zap
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDisplayName } from '@/lib/roleUtils';

export default function UserDashboardPage() {
  const { user, userRoles } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalEarnings: 0,
    engagement: 0,
    followers: 0,
  });

  useEffect(() => {
    // Simulate fetching user stats
    setStats({
      totalCampaigns: 12,
      activeCampaigns: 3,
      completedCampaigns: 9,
      totalEarnings: 2500,
      engagement: 8.4,
      followers: 15420,
    });
  }, []);

  const statCards = [
    {
      name: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: Target,
      gradient: 'from-cyan-400 to-teal-500',
      description: 'All time campaigns',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Zap,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Currently running',
      change: '+3',
      changeType: 'increase',
    },
    {
      name: 'Engagement Rate',
      value: `${stats.engagement}%`,
      icon: Heart,
      gradient: 'from-pink-400 to-rose-500',
      description: 'Average engagement',
      change: '+0.8%',
      changeType: 'increase',
    },
    {
      name: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-amber-400 to-orange-500',
      description: 'All time earnings',
      change: '+$320',
      changeType: 'increase',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'campaign_completed',
      title: 'Summer Fashion Campaign',
      description: 'Campaign completed successfully with 12.5K engagement',
      time: '2 hours ago',
      icon: Award,
      color: 'text-emerald-400',
    },
    {
      id: 2,
      type: 'new_follower',
      title: 'New Milestone Reached',
      description: 'You gained 500+ new followers this week',
      time: '5 hours ago',
      icon: TrendingUp,
      color: 'text-cyan-400',
    },
    {
      id: 3,
      type: 'payment_received',
      title: 'Payment Received',
      description: '$450 payment for Tech Product Review campaign',
      time: '1 day ago',
      icon: DollarSign,
      color: 'text-amber-400',
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
                Welcome back, {user?.first_name || user?.username}! 👋
              </h1>
              <div className="text-slate-300 text-lg leading-relaxed">
                <span>Here's what's happening with your campaigns today</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300">
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
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.name}
              className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.changeType === 'increase' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-slate-400 text-sm">{stat.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-cyan-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center mr-4`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{activity.title}</h4>
                      <p className="text-slate-400 text-sm">{activity.description}</p>
                      <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & User Info */}
          <div className="space-y-6">
            {/* User Roles */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-cyan-400" />
                Your Roles
              </h3>
              <div className="space-y-2">
                {userRoles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 mr-2 mb-2"
                  >
                    {role.name}
                  </span>
                ))}
                {userRoles.length === 0 && (
                  <span className="text-slate-500 text-sm">No roles assigned</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-left transition-colors group">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-cyan-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">View Profile</h4>
                      <p className="text-sm text-slate-400">Update your information</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-left transition-colors group">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-emerald-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors">Browse Campaigns</h4>
                      <p className="text-sm text-slate-400">Find new opportunities</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-left transition-colors group">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-amber-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-white group-hover:text-amber-400 transition-colors">Settings</h4>
                      <p className="text-sm text-slate-400">Manage preferences</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
