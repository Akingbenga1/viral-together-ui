'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Filter, MapPin, Globe, Star, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const data = await apiClient.getInfluencers();
        setInfluencers(data);
        setFilteredInfluencers(data);
      } catch (error) {
        console.error('Failed to fetch influencers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  useEffect(() => {
    let filtered = influencers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(influencer =>
        influencer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.languages.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Availability filter
    if (filterAvailable !== null) {
      filtered = filtered.filter(influencer => influencer.availability === filterAvailable);
    }

    setFilteredInfluencers(filtered);
  }, [influencers, searchTerm, filterAvailable]);

  const handleAvailabilityToggle = async (id: number, availability: boolean) => {
    try {
      await apiClient.setInfluencerAvailability(id, availability);
      setInfluencers(prev =>
        prev.map(inf => inf.id === id ? { ...inf, availability } : inf)
      );
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Influencers Network ⭐
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Manage your influencer network and discover new talent
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {influencers.filter(inf => inf.availability).length} Available
                    </span>
                  </div>
                </div>
                <button className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap">
                  <Plus className="h-5 w-5" />
                  <span>Add Influencer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search influencers..."
                    className="input-dark pl-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  className="select-dark px-4 py-2 rounded-xl font-medium whitespace-nowrap"
                  value={filterAvailable === null ? '' : filterAvailable.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterAvailable(value === '' ? null : value === 'true');
                  }}
                >
                  <option value="">All Status</option>
                  <option value="true">Available</option>
                  <option value="false">Busy</option>
                </select>
                <button className="btn-dark px-4 py-2 rounded-xl font-medium flex items-center space-x-2 whitespace-nowrap">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+12%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{influencers.length}</h3>
                  <p className="text-slate-400 text-sm truncate">Total Influencers</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Registered on platform</p>
                </div>
              </div>
            </div>
            
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+8%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                    {influencers.filter(inf => inf.availability).length}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">Available Now</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Ready for campaigns</p>
                </div>
              </div>
            </div>
            
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-medium whitespace-nowrap">+15%</span>
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                    {influencers.length > 0 
                      ? formatCurrency(influencers.reduce((sum, inf) => sum + inf.rate_per_post, 0) / influencers.length)
                      : '$0'
                    }
                  </h3>
                  <p className="text-slate-400 text-sm truncate">Average Rate</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">Per post pricing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Influencers Grid */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700/50 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-slate-700/50 rounded w-16"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInfluencers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInfluencers.map((influencer) => (
                  <div key={influencer.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 p-6 group">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {influencer.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {influencer.name || 'Unnamed Influencer'}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                        {influencer.bio}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-slate-300">
                        <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{influencer.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Globe className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{influencer.languages}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <p className="text-xs text-slate-400 mb-1">Posts</p>
                        <p className="font-bold text-white text-sm">{formatNumber(influencer.total_posts)}</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <p className="text-xs text-slate-400 mb-1">Growth</p>
                        <p className="font-bold text-emerald-400 text-sm">{influencer.growth_rate}%</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <p className="text-xs text-slate-400 mb-1">Campaigns</p>
                        <p className="font-bold text-white text-sm">{influencer.successful_campaigns}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-emerald-400">
                        {formatCurrency(influencer.rate_per_post)}
                      </span>
                      <button
                        onClick={() => handleAvailabilityToggle(influencer.id, !influencer.availability)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          influencer.availability
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                      >
                        {influencer.availability ? 'Available' : 'Busy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No influencers found</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                  {searchTerm || filterAvailable !== null
                    ? 'Try adjusting your search or filters to find more influencers.'
                    : 'Get started by adding your first influencer to the platform.'
                  }
                </p>
                <button className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 mx-auto">
                  <Plus className="w-5 h-5" />
                  <span>Add Influencer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
} 