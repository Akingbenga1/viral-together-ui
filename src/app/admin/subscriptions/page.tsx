'use client';

import { useState, useEffect } from 'react';
import { Target, Users, Calendar, Filter, Download, ArrowLeft, CreditCard, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { UserSubscription } from '@/types';
import toast from 'react-hot-toast';

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled' | 'pending'>('all');

  useEffect(() => {
    const fetchSubscriptionsData = async () => {
      try {
        const subscriptionsData = await apiClient.getAllSubscriptions();
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Failed to fetch subscriptions data:', error);
        toast.error('Failed to load subscriptions data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionsData();
  }, []);

  // Calculate subscription metrics
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled').length;
  const pendingSubscriptions = subscriptions.filter(sub => sub.status === 'pending').length;

  // Filter subscriptions based on status
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  const subscriptionMetrics = [
    {
      name: 'Total Subscriptions',
      value: totalSubscriptions,
      icon: Target,
      gradient: 'from-purple-400 to-pink-500',
      description: 'All subscriptions',
    },
    {
      name: 'Active',
      value: activeSubscriptions,
      icon: CheckCircle,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Currently active',
    },
    {
      name: 'Cancelled',
      value: cancelledSubscriptions,
      icon: XCircle,
      gradient: 'from-rose-400 to-pink-500',
      description: 'Cancelled subscriptions',
    },
    {
      name: 'Pending',
      value: pendingSubscriptions,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Pending approval',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/20';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/20';
    }
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
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => router.push('/admin/analytics')}
                    className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                  </button>
                  <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                    Subscription Management 📋
                  </h1>
                </div>
                <div className="text-slate-300 text-lg leading-relaxed">
                  <span>Manage and monitor all user subscriptions</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">Live Data</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {subscriptionMetrics.map((metric) => (
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

          {/* Filters */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-slate-400" />
                <span className="text-white font-medium">Filters:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="select-dark px-4 py-2 rounded-xl font-medium"
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="select-dark px-4 py-2 rounded-xl font-medium"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <div className="text-sm text-slate-400">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-cyan-400" />
                All Subscriptions
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Plan Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-bold">
                              {subscription.user?.first_name?.[0]?.toUpperCase() || subscription.user?.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {subscription.user?.first_name} {subscription.user?.last_name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {subscription.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {subscription.plan?.name || 'No Plan'}
                        </div>
                        <div className="text-sm text-slate-400">
                          ${subscription.plan?.price_per_month || 0}/month
                        </div>
                        <div className="text-xs text-slate-500">
                          {subscription.plan?.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(subscription.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            View
                          </button>
                          {subscription.status === 'pending' && (
                            <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                              Approve
                            </button>
                          )}
                          {subscription.status === 'active' && (
                            <button className="text-rose-400 hover:text-rose-300 transition-colors">
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
                <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
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
