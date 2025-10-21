'use client';

import { useState, useEffect } from 'react';
import { Star, Check, X, CreditCard, Calendar, DollarSign, Users } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { SubscriptionPlan, UserSubscription } from '@/types';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const [plansData, subscriptionData] = await Promise.all([
          apiClient.getSubscriptionPlans(),
          apiClient.getMySubscription().catch(() => null), // User might not have subscription
        ]);
        
        setPlans(plansData);
        setUserSubscription(subscriptionData);
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
        toast.error('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle success/cancel messages from Stripe checkout (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const canceled = urlParams.get('canceled');
      
      if (success === 'true') {
        toast.success('Subscription activated successfully! Welcome to your new plan.');
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (canceled === 'true') {
        toast.error('Subscription process was canceled. You can try again anytime.');
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleSubscribe = async (planId: number) => {
    setIsProcessing(true);
    try {
      const checkoutSession = await apiClient.createCheckoutSession({
        plan_id: planId,
        success_url: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/subscription?success=true` : '',
        cancel_url: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/subscription?canceled=true` : '',
      });

      if (!checkoutSession.url) {
        throw new Error('No checkout URL received from server');
      }

      // Redirect to Stripe checkout (browser only)
      if (typeof window !== 'undefined') {
        window.location.href = checkoutSession.url;
      }
    } catch (error: any) {
      console.error('Failed to create checkout session:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || 'Invalid request';
        if (errorMessage.includes('already has an active subscription')) {
          toast.error('You already have an active subscription. Please manage your existing subscription instead.');
        } else if (errorMessage.includes('no longer available')) {
          toast.error('This subscription plan is no longer available.');
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 404) {
        toast.error('Subscription plan not found.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to subscribe to a plan.');
      } else if (error.message) {
        // Handle errors thrown by the API client (Stripe errors, etc.)
        toast.error(error.message);
      } else {
        toast.error('Failed to start subscription process. Please try again.');
      }
      
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!userSubscription) return;

    setIsProcessing(true);
    try {
      const portalSession = await apiClient.createPortalSession({
        return_url: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/subscription` : '',
      });

      // Redirect to Stripe customer portal (browser only)
      if (typeof window !== 'undefined') {
        window.location.href = portalSession.url;
      }
    } catch (error: any) {
      console.error('Failed to create portal session:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || 'Invalid request';
        if (errorMessage.includes('No Stripe customer found')) {
          toast.error('No payment information found. Please contact support.');
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 401) {
        toast.error('Please log in to manage your subscription.');
      } else {
        toast.error('Failed to open subscription management. Please try again.');
      }
      
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded-xl w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
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
                  Subscription 💎
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Manage your subscription and billing preferences
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {userSubscription ? 'Active Plan' : 'No Plan'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Subscription Status */}
          {userSubscription && (
            <div className="mb-8">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Current Subscription</h3>
                    <p className="text-slate-300 leading-relaxed">
                      You are currently subscribed to the <span className="font-semibold text-cyan-400">{plans.find(p => p.id === userSubscription.plan_id)?.name || 'Unknown'}</span> plan
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                    <div className="text-center sm:text-right">
                      <div className="text-sm text-slate-400 mb-1">Status</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        userSubscription.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {userSubscription.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <button
                      onClick={handleManageSubscription}
                      disabled={isProcessing}
                      className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50 whitespace-nowrap"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{isProcessing ? 'Loading...' : 'Manage Subscription'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Current Period</div>
                      <div className="text-sm font-medium text-white">
                        {formatDate(userSubscription.current_period_start)} - {formatDate(userSubscription.current_period_end)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-4">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Amount</div>
                      <div className="text-sm font-medium text-white">
                        ${plans.find(p => p.id === userSubscription.plan_id)?.price_per_month || 0}/month
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Plan Features</div>
                      <div className="text-sm font-medium text-white">
                        {plans.find(p => p.id === userSubscription.plan_id)?.features?.length || 0} features included
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Show different content based on subscription status */}
          {userSubscription ? (
            /* Already Subscribed Panel */
            <div className="mb-8">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Already Subscribed! 🎉
                  </h3>
                  
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    You&apos;re currently subscribed to the <span className="font-semibold text-cyan-400">
                      {plans.find(p => p.id === userSubscription.plan_id)?.name || 'Unknown Plan'}
                    </span> plan
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                      <div className="flex items-center mb-3">
                        <Calendar className="h-5 w-5 text-cyan-400 mr-2" />
                        <h4 className="text-sm font-medium text-white">Next Payment</h4>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {formatDate(userSubscription.current_period_end)}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        ${plans.find(p => p.id === userSubscription.plan_id)?.price_per_month || 0} will be charged
                      </p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                      <div className="flex items-center mb-3">
                        <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
                        <h4 className="text-sm font-medium text-white">Payment Method</h4>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        •••• •••• •••• {userSubscription.stripe_subscription_id.slice(-4)}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Manage your payment method
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleManageSubscription}
                      disabled={isProcessing}
                      className="btn-dark-primary px-8 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{isProcessing ? 'Loading...' : 'Manage Subscription'}</span>
                    </button>
                    
                    <button
                      onClick={() => typeof window !== 'undefined' && window.location.reload()}
                      className="btn-dark border border-slate-600/30 hover:border-slate-500/50 px-8 py-3 rounded-xl font-medium"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Choose Your Plan Panel */
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 leading-tight tracking-tight">
                Choose Your Plan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                  const features = plan.features || [];
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-slate-800/30 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
                        plan.tier === '1' ? 'border-slate-600/50' :
                        plan.tier === '2' ? 'border-cyan-500/50' :
                        plan.tier === '3' ? 'border-purple-500/50' :
                        'border-slate-600/50'
                      } hover:border-slate-500/50`}
                    >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white">{plan.name}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            plan.tier === '1' ? 'bg-slate-700/50 text-slate-300 border border-slate-600/30' :
                            plan.tier === '2' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            plan.tier === '3' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                          }`}>
                            Tier {plan.tier}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">${plan.price_per_month}</span>
                          <span className="text-slate-400 ml-1">/month</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                            Billed monthly
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <Check className="h-3 w-3 text-emerald-400" />
                            </div>
                            <span className="text-sm text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isProcessing}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                              plan.tier === '2' 
                                ? 'btn-dark-primary' 
                                : 'btn-dark border border-slate-600/30 hover:border-slate-500/50'
                            }`}
                          >
                            {isProcessing ? 'Processing...' : 'Subscribe Now'}
                          </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Billing Information */}
          {userSubscription && (
            <div className="mb-8">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <h4 className="text-sm font-medium text-white mb-3">Payment Method</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-300">
                        •••• •••• •••• {userSubscription.stripe_subscription_id.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <h4 className="text-sm font-medium text-white mb-3">Next Billing Date</h4>
                    <div className="text-sm text-cyan-400 font-medium">
                      {formatDate(userSubscription.current_period_end)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment History Table */}
          {userSubscription && (
            <div className="mb-8">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Payment History</h3>
                
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600/30">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">#</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Month</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Payment Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Payment Card</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Payment Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Next Payment</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: 1,
                          month: 'December 2024',
                          amount: 29.99,
                          card: '•••• 4242',
                          paymentDate: '2024-12-15',
                          nextPayment: '2025-01-15',
                          status: 'completed'
                        },
                        {
                          id: 2,
                          month: 'November 2024',
                          amount: 29.99,
                          card: '•••• 4242',
                          paymentDate: '2024-11-15',
                          nextPayment: '2024-12-15',
                          status: 'completed'
                        },
                        {
                          id: 3,
                          month: 'October 2024',
                          amount: 29.99,
                          card: '•••• 4242',
                          paymentDate: '2024-10-15',
                          nextPayment: '2024-11-15',
                          status: 'completed'
                        },
                        {
                          id: 4,
                          month: 'September 2024',
                          amount: 29.99,
                          card: '•••• 4242',
                          paymentDate: '2024-09-15',
                          nextPayment: '2024-10-15',
                          status: 'completed'
                        },
                        {
                          id: 5,
                          month: 'August 2024',
                          amount: 29.99,
                          card: '•••• 4242',
                          paymentDate: '2024-08-15',
                          nextPayment: '2024-09-15',
                          status: 'completed'
                        }
                      ].map((payment, index) => (
                        <tr key={payment.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                          <td className="py-4 px-4 text-sm text-slate-300 font-medium">{payment.id}</td>
                          <td className="py-4 px-4 text-sm text-white font-medium">{payment.month}</td>
                          <td className="py-4 px-4 text-sm text-emerald-400 font-semibold">${payment.amount}</td>
                          <td className="py-4 px-4 text-sm text-slate-300">{payment.card}</td>
                          <td className="py-4 px-4 text-sm text-slate-300">{payment.paymentDate}</td>
                          <td className="py-4 px-4 text-sm text-cyan-400">{payment.nextPayment}</td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                                View
                              </button>
                              <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {[
                    {
                      id: 1,
                      month: 'December 2024',
                      amount: 29.99,
                      card: '•••• 4242',
                      paymentDate: '2024-12-15',
                      nextPayment: '2025-01-15',
                      status: 'completed'
                    },
                    {
                      id: 2,
                      month: 'November 2024',
                      amount: 29.99,
                      card: '•••• 4242',
                      paymentDate: '2024-11-15',
                      nextPayment: '2024-12-15',
                      status: 'completed'
                    },
                    {
                      id: 3,
                      month: 'October 2024',
                      amount: 29.99,
                      card: '•••• 4242',
                      paymentDate: '2024-10-15',
                      nextPayment: '2024-11-15',
                      status: 'completed'
                    },
                    {
                      id: 4,
                      month: 'September 2024',
                      amount: 29.99,
                      card: '•••• 4242',
                      paymentDate: '2024-09-15',
                      nextPayment: '2024-10-15',
                      status: 'completed'
                    },
                    {
                      id: 5,
                      month: 'August 2024',
                      amount: 29.99,
                      card: '•••• 4242',
                      paymentDate: '2024-08-15',
                      nextPayment: '2024-09-15',
                      status: 'completed'
                    }
                  ].map((payment) => (
                    <div key={payment.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{payment.month}</h4>
                          <p className="text-xs text-slate-400">Payment #{payment.id}</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                          ${payment.amount}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Payment Card</p>
                          <p className="text-sm text-slate-300">{payment.card}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Payment Date</p>
                          <p className="text-sm text-slate-300">{payment.paymentDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Next Payment</p>
                          <p className="text-sm text-cyan-400">{payment.nextPayment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Status</p>
                          <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                            Completed
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 text-xs rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mb-8">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-white mb-2">Can I cancel my subscription anytime?</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your current billing period.
                  </p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-white mb-2">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
                  </p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-white mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
                  </p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-white mb-2">Is there a free trial available?</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We offer a 7-day free trial for new subscribers. You can cancel anytime during the trial period without being charged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}

