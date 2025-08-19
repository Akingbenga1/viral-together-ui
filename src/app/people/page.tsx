import Link from 'next/link';
import { ArrowRight, Users, Heart, Target, Zap, Globe, Award, Star } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Former VP of Marketing at TechCorp, passionate about democratizing influencer marketing."
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "CTO & Co-Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Ex-Google engineer with 10+ years building scalable platforms and AI solutions."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Head of Product",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Product leader with expertise in creator economy and user experience design."
  },
  {
    id: 4,
    name: "David Kim",
    position: "VP of Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Full-stack expert leading our technical architecture and development teams."
  },
  {
    id: 5,
    name: "Lisa Thompson",
    position: "Head of Marketing",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Marketing strategist with deep experience in influencer partnerships and brand growth."
  },
  {
    id: 6,
    name: "Alex Martinez",
    position: "Lead Data Scientist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "AI/ML specialist developing our matching algorithms and analytics platform."
  },
  {
    id: 7,
    name: "Rachel Green",
    position: "Head of Partnerships",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Partnership expert building relationships with brands and creator networks."
  },
  {
    id: 8,
    name: "James Wilson",
    position: "VP of Operations",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    bio: "Operations leader ensuring smooth platform operations and customer success."
  }
];

export default function PeoplePage() {
  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Meet Our <span className="gradient-bg bg-clip-text text-transparent">People</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The passionate team behind Viral Together, dedicated to revolutionizing influencer marketing 
            and building authentic connections between brands and creators.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the talented individuals who are building the future of influencer marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="card text-center group hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-primary-200 transition-colors">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.position}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diversity & Culture Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Diverse Culture
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe that diversity drives innovation and creates better solutions for our global community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Inclusive Environment</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Viral Together, we foster an inclusive workplace where every voice is heard and valued. 
                  Our team represents diverse backgrounds, perspectives, and experiences from around the world. 
                  We believe that this diversity is our greatest strength, enabling us to better understand 
                  and serve our global community of brands and creators.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're committed to creating opportunities for underrepresented groups in tech and marketing, 
                  ensuring that our platform reflects the rich diversity of the creator economy we serve.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Remote-First Culture</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our remote-first culture allows us to tap into global talent and create a flexible, 
                  productive environment. We prioritize work-life balance, mental health, and personal growth, 
                  understanding that happy, healthy team members create the best products and experiences.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We invest in continuous learning, professional development, and team building activities 
                  that strengthen our bonds despite geographical distances.
                </p>
              </div>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Global Team</h4>
                <p className="text-gray-600">Team members across 12+ countries and counting</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Equal Opportunity</h4>
                <p className="text-gray-600">Committed to fair hiring and advancement practices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Growth Mindset</h4>
                <p className="text-gray-600">Continuous learning and development opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Mission & Vision
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The driving force behind everything we do at Viral Together.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  "To democratize influencer marketing by providing a transparent, efficient, and authentic 
                  platform that connects brands with the perfect influencers, enabling meaningful partnerships 
                  that drive real business growth while empowering creators to monetize their influence effectively."
                </p>
                <p className="text-gray-600">
                  We're committed to breaking down barriers in the influencer marketing industry, 
                  making it accessible to brands of all sizes and creators at every stage of their journey.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  "To become the world's leading influencer marketing platform, setting the standard for 
                  transparency, authenticity, and measurable results in the creator economy. We envision a 
                  future where every brand can easily find their perfect influencer match, and every creator 
                  can build sustainable income through meaningful brand partnerships."
                </p>
                <p className="text-gray-600">
                  We're building the infrastructure for the future of creator economy, where authentic 
                  partnerships drive real value for everyone involved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our decisions, actions, and relationships.
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

      {/* Join Our Team Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who share our vision for the future 
            of influencer marketing. Come build something amazing with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              View Open Positions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/about" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </UnauthenticatedLayout>
  );
}

