'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Users, TrendingUp, Star, Shield, Zap, Globe, BarChart3, MessageSquare, Camera, Target, Crown } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: 'Social Media Influencer',
      monthlyPrice: 20,
      yearlyPrice: 200, // 2 months free
      icon: Camera,
      description: 'Perfect for content creators and social media influencers',
      features: [
        'Create and manage your influencer profile',
        'Set your rates and availability',
        'Connect with brands directly',
        'Basic analytics and insights',
        'Up to 10 active campaigns',
        'Email support',
        'Mobile app access',
        'Basic document generation'
      ],
      popular: false
    },
    {
      name: 'Professional',
      monthlyPrice: 30,
      yearlyPrice: 300, // 2 months free
      icon: Star,
      description: 'For established influencers and content creators',
      features: [
        'Everything in Social Media plan',
        'Advanced analytics and reporting',
        'Priority brand matching',
        'Up to 25 active campaigns',
        'Advanced document generation',
        'Social media plan generation',
        'Business plan generation',
        'Priority email support',
        'Custom rate cards',
        'Growth tracking tools'
      ],
      popular: true
    },
    {
      name: 'Business',
      monthlyPrice: 50,
      yearlyPrice: 500, // 2 months free
      icon: Crown,
      description: 'For businesses and agencies managing multiple campaigns',
      features: [
        'Everything in Professional plan',
        'Unlimited campaigns',
        'Team collaboration tools',
        'Advanced campaign management',
        'Custom integrations',
        'Dedicated account manager',
        'Phone and email support',
        'White-label options',
        'API access',
        'Advanced reporting suite',
        'Bulk influencer outreach',
        'Campaign automation'
      ],
      popular: false
    }
  ];

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (billingCycle === 'yearly') {
      const yearlySavings = (plan.monthlyPrice * 12) - plan.yearlyPrice;
      return yearlySavings;
    }
    return 0;
  };

  return (
    <UnauthenticatedLayout>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="gradient-bg bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core features 
            with no hidden fees or surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border-2 p-8 ${
                    plan.popular
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-purple-50 shadow-xl'
                      : 'border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">${getPrice(plan)}</span>
                      <span className="text-gray-500 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        Save ${getSavings(plan)} per year
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/auth/register"
                    className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our pricing and plans.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated 
                and reflected in your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on all plans. No credit card required to start 
                your trial.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans. 
                All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access 
                to your plan until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of influencers and businesses who trust Viral Together 
            for their marketing campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              Start Free Trial
            </Link>
            <Link href="/#features" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>


    </UnauthenticatedLayout>
  );
} 