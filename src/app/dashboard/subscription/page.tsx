'use client';

import { useState, useEffect } from 'react';
import { Star, Check, X, CreditCard, Calendar, DollarSign, Users } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white shadow rounded-lg p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Subscription
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your subscription and billing
              </p>
            </div>
          </div>

          {/* Current Subscription Status */}
          {userSubscription && (
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Current Subscription</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You are currently subscribed to the {plans.find(p => p.id === userSubscription.plan_id)?.name || 'Unknown'} plan
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userSubscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userSubscription.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <button
                      onClick={handleManageSubscription}
                      disabled={isProcessing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Loading...' : 'Manage Subscription'}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Current Period</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(userSubscription.current_period_start)} - {formatDate(userSubscription.current_period_end)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="text-sm font-medium text-gray-900">
                        £{plans.find(p => p.id === userSubscription.plan_id)?.price_per_month || 0}/month
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Plan Features</div>
                      <div className="text-sm font-medium text-gray-900">
                        {getPlanFeatures(plans.find(p => p.id === userSubscription.plan_id)?.tier || '').length} features included
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Plans */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {userSubscription ? 'Available Plans' : 'Choose Your Plan'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = userSubscription?.plan_id === plan.id;
                const features = getPlanFeatures(plan.tier);
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-lg shadow-lg border-2 ${getPlanColor(plan.tier)} ${
                      isCurrentPlan ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(plan.tier)}`}>
                          {plan.tier}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">£{plan.price_per_month}</span>
                          <span className="text-gray-500 ml-1">/month</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Billed {plan.billing_cycle}
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isProcessing}
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        •••• •••• •••• {userSubscription.stripe_customer_id.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Next Billing Date</h4>
                    <div className="text-sm text-gray-900">
                      {formatDate(userSubscription.current_period_end)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Can I cancel my subscription anytime?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">What payment methods do you accept?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Is there a free trial available?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    We offer a 7-day free trial for new subscribers. You can cancel anytime during the trial period without being charged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

