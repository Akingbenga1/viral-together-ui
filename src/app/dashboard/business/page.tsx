'use client';

import { useEffect, useState } from 'react';
import { Building, DollarSign, Users, TrendingUp, Calendar, Search } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';

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
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive',
    },
    {
      name: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+1',
      changeType: 'positive',
    },
    {
      name: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive',
    },
    {
      name: 'Total Reach',
      value: `${(stats.totalReach / 1000000).toFixed(1)}M`,
      icon: Users,
      color: 'bg-orange-500',
      change: '+22%',
      changeType: 'positive',
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                Business Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back, {user?.first_name || user?.username}! Here&apos;s your business campaign overview.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4 mr-2" />
                Find Influencers
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
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
                        <dd className="text-sm text-green-600">
                          {stat.change}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className={`${stat.color} px-5 py-3`}>
                  <div className="text-sm">
                    <span className="text-white">View details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Campaigns */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Campaigns</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Influencers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reach
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Engagement
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentCampaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${campaign.budget.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.influencers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(campaign.reach / 1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

          {/* Performance Metrics */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Engagement Rate</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.averageEngagement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Influencers Hired</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.influencersHired}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROI (Estimated)</span>
                  <span className="text-lg font-semibold text-green-600">+340%</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Create New Campaign</h4>
                  <p className="text-sm text-gray-500">Launch a new influencer campaign</p>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Find Influencers</h4>
                  <p className="text-sm text-gray-500">Search for suitable influencers</p>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-500">Detailed campaign performance</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
