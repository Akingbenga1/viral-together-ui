'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Star, Shield, Users, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import InfluencerRateForm from '@/components/InfluencerRateForm';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import InfluencerSearchForm from '@/components/InfluencerSearchForm';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData = [
    {
      id: 1,
      title: "Connect Influencers with",
      highlight: "Brands",
      description: "This helps customize your vault structure for your team to manage connections and credentials. The ultimate platform for influencer marketing.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format",
      options: ["Start Free Trial", "View Dashboard", "Learn More"]
    },
    {
      id: 2,
      title: "Empower Content",
      highlight: "Creators",
      description: "Join thousands of influencers who monetize their creativity through authentic brand partnerships. Build your personal brand and grow your audience.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&auto=format",
      options: ["Join as Creator", "View Portfolio", "Success Stories"]
    },
    {
      id: 3,
      title: "Scale Your Business with",
      highlight: "Influence",
      description: "Discover the perfect influencers for your campaigns. Track performance, manage relationships, and drive real business growth through authentic partnerships.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format",
      options: ["Find Influencers", "Campaign Tools", "Analytics Hub"]
    },
    {
      id: 4,
      title: "Amplify Your",
      highlight: "Reach",
      description: "Leverage the power of social media to expand your brand's visibility. Connect with micro and macro influencers to reach diverse audiences and build authentic communities.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format",
      options: ["Explore Reach", "Audience Insights", "Growth Metrics"]
    },
    {
      id: 5,
      title: "Maximize Your",
      highlight: "ROI",
      description: "Track campaign performance with advanced analytics and insights. Optimize your influencer partnerships for maximum return on investment and sustainable growth.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
      options: ["ROI Calculator", "Performance Reports", "Optimization Tools"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselData.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <UnauthenticatedLayout>

      {/* Hero Carousel Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-12">
          <div className="container mx-auto">
            {/* Carousel Wrapper */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselData.map((slide, index) => (
                  <div key={slide.id} className="w-full flex-shrink-0">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      
                      {/* Left Side - Content */}
                      <div className="text-left space-y-8">
                        {/* Progress Dots */}
                        <div className="flex space-x-2 mb-8">
                          {carouselData.map((_, dotIndex) => (
                            <button
                              key={dotIndex}
                              onClick={() => setCurrentSlide(dotIndex)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                dotIndex === currentSlide ? 'bg-cyan-400' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                          {/* Additional inactive dots for design */}
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        </div>

                        <div className="transform transition-all duration-500 ease-out">
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            {slide.title}
                            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                              {slide.highlight}
                            </span>
                          </h1>
                        </div>
                        
                        <p className="text-lg text-slate-300 max-w-2xl leading-relaxed transform transition-all duration-500 delay-100 ease-out">
                          {slide.description}
                        </p>

                        {/* Selection Options */}
                        <div className="space-y-4 max-w-md">
                          {slide.options.map((option, optionIndex) => (
                            <button 
                              key={optionIndex}
                              className={`w-full p-4 backdrop-blur-sm border border-slate-700/50 rounded-xl text-left transition-all duration-200 hover:border-cyan-400/30 transform hover:scale-[1.02] ${
                                optionIndex === 0 
                                  ? 'bg-slate-800/50 text-white hover:bg-slate-700/50' 
                                  : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50'
                              }`}
                            >
                              <span className="font-medium">{option}</span>
                            </button>
                          ))}
                        </div>

                        {/* Next Button */}
                        <div className="pt-8">
                          <Link href="/auth/register" className="inline-flex items-center px-8 py-3 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-slate-400 hover:bg-slate-600/50 hover:text-cyan-400 transition-all duration-200 transform hover:scale-105">
                            Get Started
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Side - Large Image */}
                      <div className="hidden lg:flex justify-center items-center">
                        {/* Main Image - 50% viewport height */}
                        <div className="relative w-full max-w-2xl">
                          <div className="w-full rounded-3xl overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 shadow-2xl transform transition-all duration-700 hover:scale-[1.02]" style={{ height: '65vh' }}>
                            <img 
                              src={slide.image} 
                              alt={`${slide.highlight} illustration`}
                              className="w-full h-full object-cover opacity-90"
                              onError={(e) => {
                                e.currentTarget.src = `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23334155'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='24'%3E${slide.highlight}%3C/text%3E%3C/svg%3E`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            
                            {/* Image Overlay Content */}
                            <div className="absolute bottom-6 left-6 right-6">
                              <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
                                <h3 className="text-white font-semibold text-lg mb-1">
                                  {slide.title} {slide.highlight}
                                </h3>
                                <p className="text-slate-300 text-sm">
                                  {slide.description.split('.')[0]}.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200 transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200 transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-cyan-400 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Influencer and Brand Collaboration</h3>
              <p className="text-gray-600">
                Seamless collaboration tools connecting influencers with brands for 
                authentic partnerships and successful campaigns.
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


    </UnauthenticatedLayout>
  );
} 