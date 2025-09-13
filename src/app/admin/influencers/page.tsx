'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Filter, Download, ArrowLeft, Eye, MessageSquare, Target, BarChart3, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';
import toast from 'react-hot-toast';

export default function AdminInfluencersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInfluencersData = async () => {
      try {
        const influencersData = await apiClient.getInfluencers();
        setInfluencers(influencersData);
      } catch (error) {
        console.error('Failed to fetch influencers data:', error);
        toast.error('Failed to load influencers data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencersData();
  }, []);

  // Calculate influencer metrics
  const totalInfluencers = influencers.length;
  const activeInfluencers = influencers.filter(inf => inf.availability).length;
  const unavailableInfluencers = influencers.filter(inf => !inf.availability).length;
  const avgRate = influencers.length > 0 
    ? Math.round(influencers.reduce((sum, inf) => sum + (inf.rate_per_post || 0), 0) / influencers.length)
    : 0;

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(influencers.map(inf => inf.location).filter(Boolean)));

  // Filter influencers based on criteria
  const filteredInfluencers = influencers.filter(inf => {
    const matchesAvailability = filterAvailability === 'all' || 
      (filterAvailability === 'available' && inf.availability) ||
      (filterAvailability === 'unavailable' && !inf.availability);
    
    const matchesLocation = filterLocation === 'all' || inf.location === filterLocation;
    
    const matchesSearch = searchTerm === '' || 
      inf.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAvailability && matchesLocation && matchesSearch;
  });

  const influencerMetrics = [
    {
      name: 'Total Influencers',
      value: totalInfluencers,
      icon: Users,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'All registered influencers',
    },
    {
      name: 'Available',
      value: activeInfluencers,
      icon: Target,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Available for campaigns',
    },
    {
      name: 'Unavailable',
      value: unavailableInfluencers,
      icon: BarChart3,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Currently unavailable',
    },
    {
      name: 'Average Rate',
      value: `$${avgRate}`,
      icon: Star,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Per post rate',
    },
  ];

  const getAvailabilityColor = (availability: boolean) => {
    return availability 
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
      : 'bg-rose-500/20 text-rose-400 border border-rose-500/20';
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded-xl w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
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
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => router.push('/admin/analytics')}
                    className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                  </button>
                  <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                    Influencer Management 👥
                  </h1>
                </div>
                <div className="text-slate-300 text-lg leading-relaxed">
                  <span>Manage and monitor all platform influencers</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">Live Data</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Influencer Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {influencerMetrics.map((metric) => (
              <div
                key={metric.name}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{metric.value}</h3>
                    <p className="text-slate-400 text-sm truncate">{metric.name}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{metric.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <span className="text-white font-medium">Filters:</span>
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value as any)}
                    className="select-dark px-4 py-2 rounded-xl font-medium"
                  >
                    <option value="all">All Influencers</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="select-dark px-4 py-2 rounded-xl font-medium"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search influencers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Showing {filteredInfluencers.length} of {influencers.length} influencers
              </div>
            </div>
          </div>

          {/* Influencers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">
                        {influencer.user?.first_name?.[0]?.toUpperCase() || influencer.user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {influencer.user?.first_name} {influencer.user?.last_name}
                      </h3>
                      <p className="text-sm text-slate-400">@{influencer.user?.username}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(influencer.availability)}`}>
                    {influencer.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{influencer.location || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Star className="w-4 h-4 text-slate-400" />
                    <span>${influencer.rate_per_post || 0} per post</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>{influencer.growth_rate || 0}% growth rate</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span>{influencer.successful_campaigns || 0} successful campaigns</span>
                  </div>

                  {influencer.bio && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {influencer.bio}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    Joined {influencer.created_at ? new Date(influencer.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">No influencers found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
