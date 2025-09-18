'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, Star, Shield, Zap, Globe, BarChart3, MessageSquare, Camera, Target, Crown, CheckCircle } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function PartnersPage() {
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);

  const partners = [
    {
      name: 'Stripe',
      logo: '/stripe-logo.png', // You can add actual logo images
      description: 'Leading payment processing platform',
      category: 'Payment Processing',
      benefits: [
        'Secure payment processing',
        'Global payment support',
        'Advanced fraud protection',
        'Real-time analytics'
      ]
    },
    {
      name: 'AWS',
      logo: '/aws-logo.png',
      description: 'Cloud infrastructure and services',
      category: 'Cloud Infrastructure',
      benefits: [
        'Scalable cloud infrastructure',
        'Advanced AI and ML capabilities',
        'Global data centers',
        'Enterprise-grade security'
      ]
    },
    {
      name: 'Mailtrap',
      logo: '/mailtrap-logo.png',
      description: 'Email testing and delivery platform',
      category: 'Email Testing',
      benefits: [
        'Safe email testing',
        'Email delivery monitoring',
        'Spam testing tools',
        'Email analytics'
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPartnerIndex((prev) => (prev + 1) % partners.length);
    }, 5000); // Change partner every 5 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <UnauthenticatedLayout>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Strategic
            <span className="gradient-bg bg-clip-text text-transparent"> Partnerships</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We collaborate with industry leaders to deliver exceptional value to our users. 
            Our partnerships enable us to provide cutting-edge solutions for influencers, 
            businesses, and social media professionals.
          </p>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why We Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our strategic partnerships allow us to deliver comprehensive solutions 
              that address the unique needs of our diverse user base.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Media Influencers</h3>
              <p className="text-gray-600">
                Access to advanced analytics, payment processing, and marketing tools 
                to help influencers grow their audience and monetize their content.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Influencers</h3>
              <p className="text-gray-600">
                Enterprise-grade tools for campaign management, advanced reporting, 
                and strategic partnerships to scale their influence.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Businesses</h3>
              <p className="text-gray-600">
                Comprehensive influencer marketing solutions with secure payments, 
                detailed analytics, and campaign automation tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Showcase Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Trusted Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We work with industry leaders to provide you with the best tools and services.
            </p>
          </div>
          
          {/* Partner Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Partner Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                {partners.map((partner, index) => (
                  <div
                    key={partner.name}
                    className={`card text-center transition-all duration-500 ${
                      index === currentPartnerIndex 
                        ? 'transform scale-105 shadow-xl border-primary-500' 
                        : 'opacity-60'
                    }`}
                  >
                    <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{partner.name}</h3>
                    <p className="text-sm text-primary-600 mb-2">{partner.category}</p>
                    <p className="text-gray-600 mb-4">{partner.description}</p>
                    
                    <ul className="space-y-2 text-left">
                      {partner.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Slider Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {partners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPartnerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPartnerIndex 
                        ? 'bg-primary-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our partnership process ensures seamless integration and maximum value for all stakeholders.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                We identify partners whose solutions align with our users&apos; needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration</h3>
              <p className="text-gray-600">
                Seamless integration of partner services into our platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch</h3>
              <p className="text-gray-600">
                Rollout of integrated solutions to our user community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization</h3>
              <p className="text-gray-600">
                Continuous improvement based on user feedback and performance data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our network of strategic partners and help us deliver exceptional 
            value to influencers, businesses, and social media professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              Become a Partner
              <ArrowRight className="ml-2 w-5 h-5" />
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