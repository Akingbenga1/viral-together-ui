'use client';

import { useEffect, useState } from 'react';
import { 
  Megaphone, 
  Calendar, 
  DollarSign, 
  Users,
  Heart,
  X,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Filter,
  Search,
  CheckCircle,
  Star,
  Target,
  ShoppingBag
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Promotion {
  id: number;
  business: {
    name: string;
    logo: string;
    verified: boolean;
    location: string;
  };
  title: string;
  description: string;
  type: 'Product Launch' | 'Discount Campaign' | 'Brand Awareness' | 'Event Promotion' | 'Seasonal Campaign';
  budget: number;
  target_audience: {
    age_range: string;
    interests: string[];
    location: string;
  };
  requirements: {
    min_followers: number;
    engagement_rate: number;
    content_type: string[];
    posting_schedule: string;
  };
  duration: {
    start_date: string;
    end_date: string;
  };
  compensation: {
    type: 'Fixed' | 'Per Engagement' | 'Revenue Share';
    amount: number;
    additional_perks?: string[];
  };
  status: 'active' | 'draft' | 'paused' | 'completed';
  interested_count: number;
  created_at: string;
  is_interested?: boolean;
  is_ignored?: boolean;
}

export default function PromotionsPage() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'budget' | 'ending_soon'>('newest');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/promotions');
      // setPromotions(response.data);
      
      // Mock data for demonstration
      const mockPromotions: Promotion[] = [
        {
          id: 1,
          business: {
            name: 'TechStart Inc.',
            logo: 'TS',
            verified: true,
            location: 'San Francisco, CA'
          },
          title: 'AI-Powered Productivity App Launch',
          description: 'Help us launch our revolutionary AI productivity app by creating engaging content that showcases its key features and benefits to professional audiences.',
          type: 'Product Launch',
          budget: 5000,
          target_audience: {
            age_range: '25-45',
            interests: ['Technology', 'Productivity', 'Business'],
            location: 'United States'
          },
          requirements: {
            min_followers: 50000,
            engagement_rate: 3.5,
            content_type: ['Instagram Post', 'Instagram Story', 'YouTube Video'],
            posting_schedule: '2 posts per week for 4 weeks'
          },
          duration: {
            start_date: '2025-02-01',
            end_date: '2025-02-28'
          },
          compensation: {
            type: 'Fixed',
            amount: 2500,
            additional_perks: ['Free app license', 'Early access to new features']
          },
          status: 'active',
          interested_count: 47,
          created_at: '2025-01-15',
          is_interested: false,
          is_ignored: false
        },
        {
          id: 2,
          business: {
            name: 'EcoStyle Fashion',
            logo: 'ES',
            verified: true,
            location: 'New York, NY'
          },
          title: 'Sustainable Fashion Summer Collection',
          description: 'Promote our eco-friendly summer collection and raise awareness about sustainable fashion choices among millennials and Gen Z.',
          type: 'Seasonal Campaign',
          budget: 8000,
          target_audience: {
            age_range: '18-35',
            interests: ['Fashion', 'Sustainability', 'Lifestyle'],
            location: 'US, Canada, UK'
          },
          requirements: {
            min_followers: 25000,
            engagement_rate: 4.0,
            content_type: ['Instagram Post', 'Instagram Reel', 'TikTok Video'],
            posting_schedule: '3 posts per week for 6 weeks'
          },
          duration: {
            start_date: '2025-05-01',
            end_date: '2025-06-15'
          },
          compensation: {
            type: 'Fixed',
            amount: 1800,
            additional_perks: ['Free clothing items', 'Discount codes for followers']
          },
          status: 'active',
          interested_count: 89,
          created_at: '2025-01-18',
          is_interested: true,
          is_ignored: false
        },
        {
          id: 3,
          business: {
            name: 'FoodieBox',
            logo: 'FB',
            verified: false,
            location: 'Chicago, IL'
          },
          title: 'Healthy Meal Subscription Service',
          description: 'Showcase our convenient and healthy meal subscription service, perfect for busy professionals who want to eat well.',
          type: 'Brand Awareness',
          budget: 3000,
          target_audience: {
            age_range: '25-40',
            interests: ['Health', 'Fitness', 'Cooking', 'Lifestyle'],
            location: 'Major US Cities'
          },
          requirements: {
            min_followers: 15000,
            engagement_rate: 3.0,
            content_type: ['Instagram Story', 'Instagram Post', 'YouTube Short'],
            posting_schedule: '1 post per week for 8 weeks'
          },
          duration: {
            start_date: '2025-02-15',
            end_date: '2025-04-15'
          },
          compensation: {
            type: 'Per Engagement',
            amount: 0.50,
            additional_perks: ['Free meal boxes for 2 months']
          },
          status: 'active',
          interested_count: 32,
          created_at: '2025-01-20',
          is_interested: false,
          is_ignored: false
        },
        {
          id: 4,
          business: {
            name: 'FitLife Gym',
            logo: 'FL',
            verified: true,
            location: 'Los Angeles, CA'
          },
          title: 'New Year Fitness Challenge 2025',
          description: 'Join our New Year fitness challenge and motivate others to achieve their health goals with our state-of-the-art facilities.',
          type: 'Event Promotion',
          budget: 4500,
          target_audience: {
            age_range: '20-50',
            interests: ['Fitness', 'Health', 'Wellness', 'Motivation'],
            location: 'California'
          },
          requirements: {
            min_followers: 30000,
            engagement_rate: 4.5,
            content_type: ['Instagram Reel', 'TikTok Video', 'YouTube Video'],
            posting_schedule: 'Daily posts for 30 days'
          },
          duration: {
            start_date: '2025-01-25',
            end_date: '2025-02-25'
          },
          compensation: {
            type: 'Fixed',
            amount: 3000,
            additional_perks: ['Free gym membership', 'Personal training sessions']
          },
          status: 'active',
          interested_count: 156,
          created_at: '2025-01-12',
          is_interested: false,
          is_ignored: true
        }
      ];
      
      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInterest = async (promotionId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/promotions/${promotionId}/interest`);
      
      setPromotions(prev => prev.map(promo => 
        promo.id === promotionId 
          ? { ...promo, is_interested: true, interested_count: promo.interested_count + 1 }
          : promo
      ));
      
      toast.success('Interest indicated successfully!');
    } catch (error) {
      console.error('Failed to show interest:', error);
      toast.error('Failed to indicate interest');
    }
  };

  const handleIgnore = async (promotionId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/promotions/${promotionId}/ignore`);
      
      setPromotions(prev => prev.map(promo => 
        promo.id === promotionId 
          ? { ...promo, is_ignored: true }
          : promo
      ));
      
      toast.success('Promotion ignored');
    } catch (error) {
      console.error('Failed to ignore promotion:', error);
      toast.error('Failed to ignore promotion');
    }
  };

  const handleRemoveInterest = async (promotionId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/promotions/${promotionId}/interest`);
      
      setPromotions(prev => prev.map(promo => 
        promo.id === promotionId 
          ? { ...promo, is_interested: false, interested_count: Math.max(0, promo.interested_count - 1) }
          : promo
      ));
      
      toast.success('Interest removed');
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast.error('Failed to remove interest');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product Launch':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20';
      case 'Seasonal Campaign':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/20';
      case 'Brand Awareness':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20';
      case 'Event Promotion':
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/20';
      case 'Discount Campaign':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/20';
    }
  };

  const sortedAndFilteredPromotions = promotions
    .filter(promo => {
      // Don't show ignored promotions
      if (promo.is_ignored) return false;
      
      const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promo.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || promo.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'budget':
          return b.budget - a.budget;
        case 'ending_soon':
          return new Date(a.duration.end_date).getTime() - new Date(b.duration.end_date).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Megaphone className="w-8 h-8 mr-3 text-cyan-400" />
                Promotions 📢
              </h1>
              <p className="text-slate-300 text-lg">
                Discover brand promotion opportunities and grow your influence
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300 whitespace-nowrap">
                  {sortedAndFilteredPromotions.length} active promotions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter and Sort Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all appearance-none"
              >
                <option value="all">All Types</option>
                <option value="Product Launch">Product Launch</option>
                <option value="Seasonal Campaign">Seasonal Campaign</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Event Promotion">Event Promotion</option>
                <option value="Discount Campaign">Discount Campaign</option>
              </select>
            </div>

            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="budget">Highest Budget</option>
                <option value="ending_soon">Ending Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        {sortedAndFilteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No promotions found</h3>
            <p className="text-slate-400">
              {searchTerm ? 'Try adjusting your search criteria' : 'Check back later for new opportunities!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedAndFilteredPromotions.map((promotion) => (
              <div
                key={promotion.id}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold">
                      {promotion.business.logo}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{promotion.business.name}</h3>
                        {promotion.business.verified && (
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{promotion.business.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getTypeColor(promotion.type)}`}>
                    {promotion.type}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{promotion.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                    {promotion.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-slate-300">Budget</span>
                    </div>
                    <p className="text-sm font-semibold text-white">${promotion.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-300">Interest</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{promotion.interested_count}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-300">Ends</span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {new Date(promotion.duration.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-slate-300 mb-2">Requirements:</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-700/30 text-slate-300 text-xs rounded-lg border border-slate-600/30">
                      {promotion.requirements.min_followers.toLocaleString()}+ followers
                    </span>
                    <span className="px-2 py-1 bg-slate-700/30 text-slate-300 text-xs rounded-lg border border-slate-600/30">
                      {promotion.requirements.engagement_rate}%+ engagement
                    </span>
                    {promotion.requirements.content_type.slice(0, 2).map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-700/30 text-slate-300 text-xs rounded-lg border border-slate-600/30"
                      >
                        {type}
                      </span>
                    ))}
                    {promotion.requirements.content_type.length > 2 && (
                      <span className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-lg border border-slate-600/30">
                        +{promotion.requirements.content_type.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Compensation */}
                <div className="bg-slate-700/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Compensation</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {promotion.compensation.type === 'Fixed' && `$${promotion.compensation.amount}`}
                        {promotion.compensation.type === 'Per Engagement' && `$${promotion.compensation.amount} per engagement`}
                        {promotion.compensation.type === 'Revenue Share' && `${promotion.compensation.amount}% revenue share`}
                      </p>
                    </div>
                    {promotion.compensation.additional_perks && promotion.compensation.additional_perks.length > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Plus perks</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-slate-300">{promotion.compensation.additional_perks.length} extras</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  {!promotion.is_interested ? (
                    <>
                      <button
                        onClick={() => handleShowInterest(promotion.id)}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Show Interest</span>
                      </button>
                      <button
                        onClick={() => handleIgnore(promotion.id)}
                        className="px-4 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 flex space-x-3">
                      <button
                        onClick={() => handleRemoveInterest(promotion.id)}
                        className="flex-1 bg-slate-700/30 border border-emerald-500/30 text-emerald-400 py-2 px-4 rounded-lg font-medium hover:bg-slate-700/50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Interested</span>
                      </button>
                      <button className="px-4 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}