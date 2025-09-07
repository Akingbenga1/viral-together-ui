'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Star, DollarSign, Search, Plus } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [stats, setStats] = useState({
    totalInfluencers: 0,
    availableInfluencers: 0,
    averageRate: 0,
    totalCampaigns: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allInfluencers, availableInfluencers] = await Promise.all([
          apiClient.getInfluencers(),
          apiClient.getAvailableInfluencers(),
        ]);

        setInfluencers(allInfluencers.slice(0, 5)); // Show only first 5 for preview

        const totalCampaigns = allInfluencers.reduce((sum, inf) => sum + inf.successful_campaigns, 0);
        const averageRate = allInfluencers.length > 0 
          ? allInfluencers.reduce((sum, inf) => sum + inf.rate_per_post, 0) / allInfluencers.length 
          : 0;

        setStats({
          totalInfluencers: allInfluencers.length,
          availableInfluencers: availableInfluencers.length,
          averageRate,
          totalCampaigns,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      name: 'Total Influencers',
      value: stats.totalInfluencers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Available Now',
      value: stats.availableInfluencers,
      icon: Star,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Average Rate',
      value: formatCurrency(stats.averageRate),
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive',
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
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back! Here's what's happening with your influencer campaigns.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="btn btn-outline btn-sm mr-3">
                <Search className="w-4 h-4 mr-2" />
                Search Influencers
              </button>
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Influencer
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.name} className="card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {card.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {typeof card.value === 'string' ? card.value : formatNumber(card.value)}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Influencers */}
          <div className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Influencers</h3>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  View all
                </button>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : influencers.length > 0 ? (
                <div className="space-y-4">
                  {influencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {influencer.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {influencer.name || 'Unnamed Influencer'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {influencer.location} • {influencer.languages}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          influencer.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {influencer.availability ? 'Available' : 'Busy'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(influencer.rate_per_post)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No influencers</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first influencer.
                  </p>
                  <div className="mt-6">
                    <button className="btn btn-primary btn-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Influencer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Find Influencers</h4>
                    <p className="text-sm text-gray-500">Search by location, language, or niche</p>
                  </div>
                </div>
              </div>
              
              <div className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">View Analytics</h4>
                    <p className="text-sm text-gray-500">Track campaign performance</p>
                  </div>
                </div>
              </div>
              
              <div className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Manage Subscription</h4>
                    <p className="text-sm text-gray-500">Upgrade or manage your plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
} 