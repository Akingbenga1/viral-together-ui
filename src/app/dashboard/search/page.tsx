'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Building, Filter, X } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
    <div key={influencer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {influencer.user.first_name?.[0] || influencer.user.username[0]}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {influencer.user.first_name} {influencer.user.last_name}
            </h3>
            <p className="text-gray-600">@{influencer.user.username}</p>
            <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">{influencer.base_country.name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">
            £{influencer.rate_per_post}
          </div>
          <div className="text-sm text-gray-500">per post</div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 text-sm line-clamp-2">{influencer.bio}</p>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Total Posts:</span>
          <span className="ml-2 font-medium">{influencer.total_posts}</span>
        </div>
        <div>
          <span className="text-gray-500">Growth Rate:</span>
          <span className="ml-2 font-medium">{influencer.growth_rate}%</span>
        </div>
        <div>
          <span className="text-gray-500">Campaigns:</span>
          <span className="ml-2 font-medium">{influencer.successful_campaigns}</span>
        </div>
        <div>
          <span className="text-gray-500">Available:</span>
          <span className={`ml-2 font-medium ${influencer.availability ? 'text-green-600' : 'text-red-600'}`}>
            {influencer.availability ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );

  const renderBusinessCard = (business: Business) => (
    <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
            <p className="text-gray-600">{business.industry}</p>
            <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                {countries.find(c => c.id === business.base_country_id)?.name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 text-sm line-clamp-2">{business.description}</p>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Contact:</span>
          <span className="ml-2 font-medium">{business.contact_name}</span>
        </div>
        <div>
          <span className="text-gray-500">Email:</span>
          <span className="ml-2 font-medium">{business.contact_email}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Search
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find influencers and businesses for your campaigns
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col space-y-4">
                {/* Search Type Toggle */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSearchType('influencers')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      searchType === 'influencers'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Influencers</span>
                  </button>
                  <button
                    onClick={() => setSearchType('businesses')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      searchType === 'businesses'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Businesses</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={`Search ${searchType}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 border rounded-md transition-colors ${
                      showFilters
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <select
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Language
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., English, Spanish"
                              value={filters.language}
                              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Rate (£)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={filters.minRate || ''}
                              onChange={(e) => setFilters({ ...filters, minRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Rate (£)
                            </label>
                            <input
                              type="number"
                              placeholder="1000"
                              value={filters.maxRate || ''}
                              onChange={(e) => setFilters({ ...filters, maxRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Growth Rate (%)
                            </label>
                            <input
                              type="number"
                              placeholder="5"
                              value={filters.minGrowthRate || ''}
                              onChange={(e) => setFilters({ ...filters, minGrowthRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Successful Campaigns
                            </label>
                            <input
                              type="number"
                              placeholder="10"
                              value={filters.minSuccessfulCampaigns || ''}
                              onChange={(e) => setFilters({ ...filters, minSuccessfulCampaigns: e.target.value ? parseInt(e.target.value) : undefined })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Availability
                            </label>
                            <select
                              value={filters.availability?.toString() || ''}
                              onChange={(e) => setFilters({ ...filters, availability: e.target.value ? e.target.value === 'true' : undefined })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="">All</option>
                              <option value="true">Available Only</option>
                              <option value="false">Unavailable Only</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear Filters</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

