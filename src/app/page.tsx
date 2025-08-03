import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, Star, Shield } from 'lucide-react';
import InfluencerRateForm from '@/components/InfluencerRateForm';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import InfluencerSearchForm from '@/components/InfluencerSearchForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Viral Together</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Influencers with
            <span className="gradient-bg bg-clip-text text-transparent"> Brands</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform for influencer marketing. Discover talented creators, 
            manage campaigns, and grow your brand with authentic partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Find Influencers Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Influencers near you
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover talented creators in your area and connect with influencers who can help grow your brand.
            </p>
          </div>
          
          <InfluencerSearchForm />
        </div>
      </section>

      {/* Business Profile Form Section */}
      <BusinessProfileForm />

      {/* Influencer Rate Form Section */}
      <InfluencerRateForm />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools and insights to help you find the perfect influencers 
              and manage successful campaigns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Influencer Discovery</h3>
              <p className="text-gray-600">
                Find the perfect influencers based on location, language, engagement rates, 
                and successful campaigns.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track growth rates, campaign performance, and ROI with detailed 
                analytics and reporting tools.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rate Management</h3>
              <p className="text-gray-600">
                Transparent pricing with customizable rate cards for different 
                content types and platforms.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Integrated payment processing with Stripe for secure and reliable 
                subscription management.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Management</h3>
              <p className="text-gray-600">
                Streamline your workflow with tools for campaign planning, 
                execution, and performance tracking.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Tracking</h3>
              <p className="text-gray-600">
                Monitor influencer growth rates and identify rising stars 
                before they become mainstream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow your brand?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of brands and influencers who trust Viral Together 
            for their marketing campaigns.
          </p>
          <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Viral Together</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for influencer marketing and brand partnerships.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Viral Together. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 