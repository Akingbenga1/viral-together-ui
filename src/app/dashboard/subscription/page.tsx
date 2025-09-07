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

  const handleSubscribe = async (planId: number) => {
    setIsProcessing(true);
    try {
      const checkoutSession = await apiClient.createCheckoutSession({
        plan_id: planId,
        success_url: `${window.location.origin}/dashboard/subscription?success=true`,
        cancel_url: `${window.location.origin}/dashboard/subscription?canceled=true`,
      });

      // Redirect to Stripe checkout
      window.location.href = checkoutSession.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast.error('Failed to start subscription process');
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!userSubscription) return;

    setIsProcessing(true);
    try {
      const portalSession = await apiClient.createPortalSession({
        return_url: `${window.location.origin}/dashboard/subscription`,
      });

      // Redirect to Stripe customer portal
      window.location.href = portalSession.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      toast.error('Failed to open subscription management');
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

  const getPlanFeatures = (tier: string) => {
    const baseFeatures = [
      'Access to influencer directory',
      'Basic search and filtering',
      'Email support',
    ];

    switch (tier.toLowerCase()) {
      case 'basic':
        return [
          ...baseFeatures,
          'Up to 10 campaign requests',
          'Standard response time',
        ];
      case 'pro':
        return [
          ...baseFeatures,
          'Unlimited campaign requests',
          'Priority support',
          'Advanced analytics',
          'Custom rate cards',
          'Direct messaging',
        ];
      case 'enterprise':
        return [
          ...baseFeatures,
          'Unlimited everything',
          'Dedicated account manager',
          'Custom integrations',
          'White-label options',
          'API access',
          '24/7 phone support',
        ];
      default:
        return baseFeatures;
    }
  };

  const getPlanColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'basic':
        return 'border-gray-300';
      case 'pro':
        return 'border-primary-500';
      case 'enterprise':
        return 'border-purple-500';
      default:
        return 'border-gray-300';
    }
  };

  const getPlanBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-primary-100 text-primary-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                        £{plans.find(p => p.id === userSubscription.plan_id)?.price_per_month || 0}/month
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
                        {getPlanFeatures(plans.find(p => p.id === userSubscription.plan_id)?.tier || '').length} features included
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Plans */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 leading-tight tracking-tight">
              {userSubscription ? 'Available Plans' : 'Choose Your Plan'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = userSubscription?.plan_id === plan.id;
                const features = getPlanFeatures(plan.tier);
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-slate-800/30 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
                      plan.tier.toLowerCase() === 'basic' ? 'border-slate-600/50' :
                      plan.tier.toLowerCase() === 'pro' ? 'border-cyan-500/50' :
                      'border-purple-500/50'
                    } ${
                      isCurrentPlan ? 'ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'hover:border-slate-500/50'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white">{plan.name}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          plan.tier.toLowerCase() === 'basic' ? 'bg-slate-700/50 text-slate-300 border border-slate-600/30' :
                          plan.tier.toLowerCase() === 'pro' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {plan.tier}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">£{plan.price_per_month}</span>
                          <span className="text-slate-400 ml-1">/month</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                          Billed {plan.billing_cycle}
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
                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="w-full px-4 py-3 border border-slate-600/30 rounded-xl text-sm font-medium text-slate-400 bg-slate-700/30 cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isProcessing}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                              plan.tier.toLowerCase() === 'pro' 
                                ? 'btn-dark-primary' 
                                : 'btn-dark border border-slate-600/30 hover:border-slate-500/50'
                            }`}
                          >
                            {isProcessing ? 'Processing...' : userSubscription ? 'Upgrade Plan' : 'Subscribe Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
                        •••• •••• •••• {userSubscription.stripe_customer_id.slice(-4)}
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

          {/* FAQ Section */}
          <div className="mb-8">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-white mb-2">Can I cancel my subscription anytime?</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
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

