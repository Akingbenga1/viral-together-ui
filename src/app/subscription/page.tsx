'use client';

import Link from 'next/link';
import { 
  Check, 
  Shield, 
  CreditCard, 
  Lock, 
  Star, 
  Users, 
  TrendingUp, 
  Globe,
  Crown,
  ArrowLeft,
  Zap
} from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function SubscriptionPage() {
  return (
    <UnauthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Back Link */}
          <div className="mb-8">
            <Link 
              href="/pricing" 
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Viral Together
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey with our premium business plan and unlock powerful tools 
              for influencer marketing and brand partnerships.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - Plan Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Plan</h2>
                <p className="text-gray-600 mb-6">Perfect for businesses and agencies</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$50</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Start your free 14-day trial</span> - No credit card required
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Everything included:</h3>
                {[
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
                  'Campaign automation',
                  'Priority brand matching'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <Link
                href="/auth/register"
                className="w-full block text-center py-4 px-6 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Start Your Free Trial
              </Link>
            </div>

            {/* Right Side - Benefits & Security */}
            <div className="space-y-8">
              
              {/* Key Benefits */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Viral Together?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Proven Growth</h4>
                      <p className="text-gray-600 text-sm">
                        Join thousands of successful brands achieving 300% average ROI through our platform.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vast Network</h4>
                      <p className="text-gray-600 text-sm">
                        Access to over 50,000+ verified influencers across all major social platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                      <p className="text-gray-600 text-sm">
                        Connect with influencers worldwide in 40+ countries and 25+ languages.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h4>
                      <p className="text-gray-600 text-sm">
                        Advanced algorithms ensure perfect influencer-brand matches for maximum impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Security */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Secure Payment Processing</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Powered by Stripe - Industry-leading security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">256-bit SSL encryption for all transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">PCI DSS compliant payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Trusted by Fortune 500 companies</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <img 
                      src="https://stripe.com/img/v3/home/twitter-card.png" 
                      alt="Stripe" 
                      className="h-6 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="font-medium text-gray-900">Stripe Secure</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your payment information is never stored on our servers. All transactions 
                    are processed securely through Stripe's encrypted payment gateway.
                  </p>
                </div>
              </div>

              {/* Money-back Guarantee */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
                  <p className="text-gray-600">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access 
                  until the end of your current billing period.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
                <p className="text-gray-600 text-sm">
                  No setup fees. You only pay the monthly subscription fee of $50 USD.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods are accepted?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, MasterCard, American Express) 
                  and PayPal through our secure Stripe integration.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use enterprise-grade security measures including 256-bit 
                  SSL encryption and are fully compliant with GDPR and CCPA regulations.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </UnauthenticatedLayout>
  );
}