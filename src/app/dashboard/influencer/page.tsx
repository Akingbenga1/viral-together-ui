'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, Star, MessageCircle } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';

export default function InfluencerDashboardPage() {
  const { user, userRoles } = useAuth();
  const [stats, setStats] = useState({
    totalFollowers: 0,
    engagementRate: 0,
    totalEarnings: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    averageRate: 0,
  });

  useEffect(() => {
    // Simulate fetching influencer stats
    setStats({
      totalFollowers: 125000,
      engagementRate: 4.2,
      totalEarnings: 8500,
      activeCampaigns: 3,
      completedCampaigns: 15,
      averageRate: 350,
    });
  }, []);

  const statCards = [
    {
      name: 'Total Followers',
      value: stats.totalFollowers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+0.3%',
      changeType: 'positive',
    },
    {
      name: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18%',
      changeType: 'positive',
    },
    {
      name: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+2',
      changeType: 'positive',
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      brand: 'TechCorp',
      type: 'Instagram Post',
      status: 'Active',
      earnings: 450,
      deadline: '2024-01-15',
    },
    {
      id: 2,
      brand: 'FashionBrand',
      type: 'YouTube Video',
      status: 'Completed',
      earnings: 800,
      deadline: '2024-01-10',
    },
    {
      id: 3,
      brand: 'FoodDelivery',
      type: 'TikTok Video',
      status: 'Active',
      earnings: 300,
      deadline: '2024-01-20',
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
                Influencer Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back, {user?.first_name || user?.username}! Here's your influencer performance overview.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                View Campaigns
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
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentCampaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.type}
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
                            ${campaign.earnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(campaign.deadline).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Update Rate Card</h4>
                  <p className="text-sm text-gray-500">Set your pricing</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Browse Opportunities</h4>
                  <p className="text-sm text-gray-500">Find new campaigns</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-500">View performance data</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
