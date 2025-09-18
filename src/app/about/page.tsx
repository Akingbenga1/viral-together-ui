import Link from 'next/link';
import { ArrowRight, Target, Eye, TrendingUp, Users, Globe, Heart, Zap } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function AboutPage() {
  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="gradient-bg bg-clip-text text-transparent">Viral Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionizing influencer marketing by creating authentic connections between brands and creators worldwide.
          </p>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center font-medium">
                &quot;To democratize influencer marketing by providing a transparent, efficient, and authentic platform that connects brands with the perfect influencers, enabling meaningful partnerships that drive real business growth while empowering creators to monetize their influence effectively.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center font-medium">
                &quot;To become the world&apos;s leading influencer marketing platform, setting the standard for transparency, authenticity, and measurable results in the creator economy. We envision a future where every brand can easily find their perfect influencer match, and every creator can build sustainable income through meaningful brand partnerships.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Strategy Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Growth Strategy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach to scaling Viral Together and revolutionizing the influencer marketing industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Phase 1 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 1: Foundation</h3>
              <p className="text-gray-600">
                Build a robust platform with core features including influencer discovery, 
                rate management, and secure payment processing. Focus on user experience 
                and platform stability.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 2: Expansion</h3>
              <p className="text-gray-600">
                Expand to new markets and regions, implementing advanced analytics, 
                AI-powered matching algorithms, and comprehensive campaign management tools.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 3: Innovation</h3>
              <p className="text-gray-600">
                Introduce cutting-edge features like predictive analytics, automated 
                campaign optimization, and blockchain-based transparency solutions.
              </p>
            </div>

            {/* Phase 4 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 4: Ecosystem</h3>
              <p className="text-gray-600">
                Create a comprehensive creator economy ecosystem with educational resources, 
                community features, and advanced monetization tools for influencers.
              </p>
            </div>

            {/* Phase 5 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 5: Leadership</h3>
              <p className="text-gray-600">
                Establish Viral Together as the industry standard, driving innovation 
                and setting best practices for the entire influencer marketing landscape.
              </p>
            </div>

            {/* Phase 6 */}
            <div className="card text-center h-full">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 6: Global Domination</h3>
              <p className="text-gray-600">
                Achieve market leadership across all major regions, with comprehensive 
                solutions for every type of brand and creator partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Viral Together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-600">
                We believe in genuine partnerships that create real value for both brands and creators.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear, honest communication and pricing throughout every partnership.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Constantly pushing boundaries to improve the influencer marketing experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building a supportive ecosystem where everyone can thrive and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Revolution
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of the future of influencer marketing. Connect with brands and creators 
            who share your vision for authentic, impactful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/pricing" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </UnauthenticatedLayout>
  );
} 