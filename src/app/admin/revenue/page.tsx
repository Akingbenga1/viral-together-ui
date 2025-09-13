'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Filter, Download, ArrowLeft, Users, CreditCard, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { UserSubscription } from '@/types';
import toast from 'react-hot-toast';

export default function AdminRevenuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled' | 'pending'>('all');

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const subscriptionsData = await apiClient.getAllSubscriptions();
        console.log('Revenue page - Raw subscriptions data:', subscriptionsData);
        console.log('Revenue page - First subscription user data:', subscriptionsData[0]?.user);
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
        toast.error('Failed to load revenue data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Calculate revenue metrics
  const totalRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + (sub.plan?.price_per_month || 0), 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled').length;
  const pendingSubscriptions = subscriptions.filter(sub => sub.status === 'pending').length;

  // Filter subscriptions based on status
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  // Handle subscription cancellation
  const handleCancelSubscription = async (subscriptionId: number) => {
    if (window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        const response = await apiClient.cancelSubscription(subscriptionId);
        
        if (response.success) {
          toast.success('Subscription cancelled successfully');
          // Refresh the subscriptions data
          const updatedSubscriptions = await apiClient.getAllSubscriptions();
          setSubscriptions(updatedSubscriptions);
        } else {
          toast.error(response.message || 'Failed to cancel subscription');
        }
      } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        const errorMessage = error.response?.data?.detail || error.message || 'An error occurred while cancelling the subscription';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const revenueMetrics = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Monthly recurring revenue',
    },
    {
      name: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: Users,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Currently active',
    },
    {
      name: 'Cancelled',
      value: cancelledSubscriptions,
      icon: CreditCard,
      gradient: 'from-rose-400 to-pink-500',
      description: 'Cancelled subscriptions',
    },
    {
      name: 'Pending',
      value: pendingSubscriptions,
      icon: BarChart3,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Pending approval',
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
      <div className="min-h-full w-full overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
                  <button
                    onClick={() => router.push('/admin/analytics')}
                    className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                    Revenue Management 💰
                  </h1>
                </div>
                <div className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  <span>Track and manage subscription revenue</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300 text-sm sm:text-base">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-3 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-slate-300 whitespace-nowrap">Live Data</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-200 text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 py-3 px-4 sm:px-6 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-medium text-sm">Filters:</span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="select-dark px-2 py-1.5 rounded-lg font-medium text-sm"
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="select-dark px-2 py-1.5 rounded-lg font-medium text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </div>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {revenueMetrics.map((metric) => (
              <div
                key={metric.name}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{metric.value}</h3>
                    <p className="text-slate-400 text-sm truncate">{metric.name}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{metric.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscriptions Table */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden w-full">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                Subscription Details
              </h3>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[180px]">
                      User
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[120px]">
                      Plan
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[90px]">
                      Price
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[90px]">
                      Status
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[100px]">
                      Start
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[100px]">
                      End
                    </th>
                    <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[70px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white truncate">
                            {subscription.user ? (
                              subscription.user.first_name && subscription.user.last_name 
                                ? `${subscription.user.first_name} ${subscription.user.last_name}`
                                : subscription.user.username || 'Unknown User'
                            ) : (
                              `User ID: ${subscription.user_id}`
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {subscription.user?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-white truncate">
                          {subscription.plan?.name || 'No Plan'}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-emerald-400">
                          ${subscription.plan?.price_per_month || 0}/mo
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : subscription.status === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                        }`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs text-slate-300">
                        {subscription.current_period_start ? new Date(subscription.current_period_start).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs text-slate-300">
                        {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            View
                          </button>
                          {subscription.status === 'active' && (
                            <button
                              onClick={() => handleCancelSubscription(subscription.id)}
                              disabled={isLoading}
                              className="px-2 py-1 bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/20 rounded-md hover:from-rose-500/30 hover:to-red-500/30 hover:text-rose-300 transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">No subscriptions found</h3>
                <p className="text-slate-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
