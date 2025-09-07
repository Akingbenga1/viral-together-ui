'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Building, Filter, X, Globe, Star, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Influencer, Business, Country, SearchFilters } from '@/types';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'influencers' | 'businesses'>('influencers');
  const [results, setResults] = useState<Influencer[] | Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    language: '',
    minRate: undefined,
    maxRate: undefined,
    minGrowthRate: undefined,
    minSuccessfulCampaigns: undefined,
    availability: undefined,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await apiClient.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsLoading(true);
    try {
      if (searchType === 'influencers') {
        // Search influencers by various criteria
        const influencers = await apiClient.searchInfluencersByCriteria({
          country_ids: filters.location ? [parseInt(filters.location)] : [],
          industry: searchTerm,
          social_media_platform: searchTerm,
        });
        setResults(influencers);
      } else {
        // For businesses, we'll use a simple search for now
        const businesses = await apiClient.getAllBusinesses();
        const filteredBusinesses = businesses.filter(business =>
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredBusinesses);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      language: '',
      minRate: undefined,
      maxRate: undefined,
      minGrowthRate: undefined,
      minSuccessfulCampaigns: undefined,
      availability: undefined,
    });
  };

  const renderInfluencerCard = (influencer: Influencer) => (
    <div key={influencer.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 p-6 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {influencer.user.first_name?.[0]?.toUpperCase() || influencer.user.username[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {influencer.user.first_name} {influencer.user.last_name}
            </h3>
            <p className="text-slate-400">@{influencer.user.username}</p>
            <div className="flex items-center mt-2">
              <MapPin className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-sm text-slate-300">{influencer.base_country.name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-emerald-400">
            £{influencer.rate_per_post}
          </div>
          <div className="text-sm text-slate-400">per post</div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{influencer.bio}</p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Posts</p>
          <p className="font-bold text-white">{influencer.total_posts}</p>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Growth</p>
          <p className="font-bold text-emerald-400">{influencer.growth_rate}%</p>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Campaigns</p>
          <p className="font-bold text-white">{influencer.successful_campaigns}</p>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Status</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
            influencer.availability 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {influencer.availability ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <button className="btn-dark-primary w-full h-12 rounded-xl font-medium">
          View Profile
        </button>
      </div>
    </div>
  );

  const renderBusinessCard = (business: Business) => (
    <div key={business.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 p-6 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Building className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{business.name}</h3>
            <p className="text-slate-400">{business.industry}</p>
            <div className="flex items-center mt-2">
              <MapPin className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-sm text-slate-300">
                {countries.find(c => c.id === business.base_country_id)?.name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{business.description}</p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Contact</p>
          <p className="font-bold text-white text-sm truncate">{business.contact_name}</p>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <p className="text-xs text-slate-400 mb-1">Email</p>
          <p className="font-bold text-cyan-400 text-sm truncate">{business.contact_email}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <button className="btn-dark-primary w-full h-12 rounded-xl font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Search & Discover 🔍
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Find influencers and businesses for your campaigns
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {results.length} Results
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col space-y-6">
              {/* Search Type Toggle */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setSearchType('influencers')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    searchType === 'influencers'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-700/30 text-slate-300 border border-slate-600/30 hover:bg-slate-700/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Influencers</span>
                </button>
                <button
                  onClick={() => setSearchType('businesses')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    searchType === 'businesses'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-700/30 text-slate-300 border border-slate-600/30 hover:bg-slate-700/50'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>Businesses</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="input-dark pl-12 h-12"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    showFilters
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'btn-dark'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="btn-dark-primary px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="border-t border-slate-600/30 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="label-dark">
                        Location
                      </label>
                      <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="select-dark"
                      >
                        <option value="">All Locations</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {searchType === 'influencers' && (
                      <>
                        <div>
                          <label className="label-dark">
                            Language
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., English, Spanish"
                            value={filters.language}
                            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                            className="input-dark"
                          />
                        </div>

                        <div>
                          <label className="label-dark">
                            Min Rate (£)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={filters.minRate || ''}
                            onChange={(e) => setFilters({ ...filters, minRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="input-dark"
                          />
                        </div>

                        <div>
                          <label className="label-dark">
                            Max Rate (£)
                          </label>
                          <input
                            type="number"
                            placeholder="1000"
                            value={filters.maxRate || ''}
                            onChange={(e) => setFilters({ ...filters, maxRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="input-dark"
                          />
                        </div>

                        <div>
                          <label className="label-dark">
                            Min Growth Rate (%)
                          </label>
                          <input
                            type="number"
                            placeholder="5"
                            value={filters.minGrowthRate || ''}
                            onChange={(e) => setFilters({ ...filters, minGrowthRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="input-dark"
                          />
                        </div>

                        <div>
                          <label className="label-dark">
                            Min Successful Campaigns
                          </label>
                          <input
                            type="number"
                            placeholder="10"
                            value={filters.minSuccessfulCampaigns || ''}
                            onChange={(e) => setFilters({ ...filters, minSuccessfulCampaigns: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="input-dark"
                          />
                        </div>

                        <div>
                          <label className="label-dark">
                            Availability
                          </label>
                          <select
                            value={filters.availability?.toString() || ''}
                            onChange={(e) => setFilters({ ...filters, availability: e.target.value ? e.target.value === 'true' : undefined })}
                            className="select-dark"
                          >
                            <option value="">All</option>
                            <option value="true">Available Only</option>
                            <option value="false">Unavailable Only</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mt-8">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchType === 'influencers'
                  ? results.map((result) => renderInfluencerCard(result as Influencer))
                  : results.map((result) => renderBusinessCard(result as Business))
                }
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Search className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find more results.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}

