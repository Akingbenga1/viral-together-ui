'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Filter, MapPin, Globe, Star, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Influencers
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your influencer network and discover new talent.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Influencer
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search influencers..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="input"
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
                <button className="btn btn-outline btn-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="card">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Influencers</p>
                  <p className="text-2xl font-semibold text-gray-900">{influencers.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available Now</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {influencers.filter(inf => inf.availability).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {influencers.length > 0 
                      ? formatCurrency(influencers.reduce((sum, inf) => sum + inf.rate_per_post, 0) / influencers.length)
                      : '$0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Influencers Grid */}
          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInfluencers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInfluencers.map((influencer) => (
                  <div key={influencer.id} className="card hover:shadow-md transition-shadow">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-white">
                          {influencer.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {influencer.name || 'Unnamed Influencer'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {influencer.bio}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {influencer.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        {influencer.languages}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Posts</p>
                        <p className="font-semibold">{formatNumber(influencer.total_posts)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Growth</p>
                        <p className="font-semibold">{influencer.growth_rate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Campaigns</p>
                        <p className="font-semibold">{influencer.successful_campaigns}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(influencer.rate_per_post)}
                      </span>
                      <button
                        onClick={() => handleAvailabilityToggle(influencer.id, !influencer.availability)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          influencer.availability
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {influencer.availability ? 'Available' : 'Busy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No influencers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterAvailable !== null
                    ? 'Try adjusting your search or filters.'
                    : 'Get started by adding your first influencer.'
                  }
                </p>
                <div className="mt-6">
                  <button className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Influencer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 