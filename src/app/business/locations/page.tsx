'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Building, 
  Users, 
  Target,
  TrendingUp,
  Globe,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Dynamically import InteractiveMap to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 flex items-center justify-center" style={{ height: '400px' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <p className="text-slate-300">Loading map...</p>
      </div>
    </div>
  )
});

export default function BusinessLocationsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [locations, setLocations] = useState<Array<{
    id: number;
    city_name: string;
    country_code: string;
    country_name: string;
    latitude: number | string | null;
    longitude: number | string | null;
    is_primary: boolean;
    business_type: string;
    target_audience: string;
    influencer_count: number;
    campaign_count: number;
    created_at?: string;
    updated_at?: string;
  }>>([]);
  const [formData, setFormData] = useState({
    city_name: '',
    country_code: '',
    country_name: '',
    latitude: 40.7128,
    longitude: -74.0060,
    is_primary: false,
    business_type: '',
    target_audience: ''
  });

  // Mock data for business locations
  useEffect(() => {
    setLocations([
      {
        id: 1,
        city_name: 'New York',
        country_code: 'US',
        country_name: 'United States',
        latitude: 40.7128,
        longitude: -74.0060,
        is_primary: true,
        business_type: 'Fashion & Retail',
        target_audience: '18-35, Fashion enthusiasts',
        influencer_count: 45,
        campaign_count: 12,
        created_at: '2024-01-01',
        updated_at: '2024-01-15'
      },
      {
        id: 2,
        city_name: 'Los Angeles',
        country_code: 'US',
        country_name: 'United States',
        latitude: 34.0522,
        longitude: -118.2437,
        is_primary: false,
        business_type: 'Entertainment & Media',
        target_audience: '16-30, Content creators',
        influencer_count: 32,
        campaign_count: 8,
        created_at: '2024-01-05',
        updated_at: '2024-01-10'
      },
      {
        id: 3,
        city_name: 'London',
        country_code: 'GB',
        country_name: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        is_primary: false,
        business_type: 'Technology',
        target_audience: '25-45, Tech professionals',
        influencer_count: 28,
        campaign_count: 6,
        created_at: '2024-01-08',
        updated_at: '2024-01-12'
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLocation = {
        id: locations.length + 1,
        ...formData,
        business_type: formData.business_type || 'General Business',
        target_audience: formData.target_audience || 'General audience',
        influencer_count: Math.floor(Math.random() * 50) + 10,
        campaign_count: Math.floor(Math.random() * 20) + 1,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      
      setLocations([...locations, newLocation]);
      setShowForm(false);
      setFormData({
        city_name: '',
        country_code: '',
        country_name: '',
        latitude: 40.7128,
        longitude: -74.0060,
        is_primary: false,
        business_type: '',
        target_audience: ''
      });
      toast.success('Business location added successfully!');
    } catch (error) {
      toast.error('Failed to add location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(loc => loc.id !== id));
      toast.success('Location deleted successfully!');
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.business_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'primary' && location.is_primary) ||
                         (filterType === 'secondary' && !location.is_primary);
    
    return matchesSearch && matchesFilter;
  });

  const getBusinessTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fashion & retail':
        return 'from-pink-400 to-rose-500';
      case 'entertainment & media':
        return 'from-purple-400 to-violet-500';
      case 'technology':
        return 'from-blue-400 to-cyan-500';
      case 'food & beverage':
        return 'from-orange-400 to-amber-500';
      case 'health & fitness':
        return 'from-emerald-400 to-teal-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Business Locations 📍
              </h1>
              <div className="text-slate-300 text-lg leading-relaxed">
                <span>Manage your business locations and target markets</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300 whitespace-nowrap">{locations.length} Locations</span>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(true)}
                className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                <span>Add Location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 lg:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search locations, cities, or business types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all duration-200"
              >
                <option value="all">All Locations</option>
                <option value="primary">Primary Locations</option>
                <option value="secondary">Secondary Locations</option>
              </select>
              <button className="px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-700/70 hover:text-white transition-all duration-200">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden mb-8">
          <div className="p-4 lg:p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              Business Locations Map
            </h3>
            <InteractiveMap 
              locations={filteredLocations}
              onLocationSelect={(location) => {
                console.log('Selected location:', location);
              }}
            />
          </div>
        </div>

        {/* Locations List */}
        <div className="space-y-4">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getBusinessTypeColor(location.business_type)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-white">{location.city_name}</h3>
                        {location.is_primary && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{location.country_name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-slate-500">{location.business_type}</span>
                        <span className="text-xs text-slate-500">{location.target_audience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(location.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-slate-300">Influencers</span>
                    </div>
                    <p className="text-lg font-semibold text-white mt-1">{location.influencer_count}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">Campaigns</span>
                    </div>
                    <p className="text-lg font-semibold text-white mt-1">{location.campaign_count}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-300">Coordinates</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">
                      {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-300">Performance</span>
                    </div>
                    <p className="text-sm text-emerald-400 mt-1">+12% this month</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Location Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Add Business Location</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">City Name</label>
                    <input
                      type="text"
                      value={formData.city_name}
                      onChange={(e) => setFormData({...formData, city_name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Country Code</label>
                      <input
                        type="text"
                        value={formData.country_code}
                        onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                        placeholder="US"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Country Name</label>
                      <input
                        type="text"
                        value={formData.country_name}
                        onChange={(e) => setFormData({...formData, country_name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                        placeholder="United States"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                    >
                      <option value="">Select Business Type</option>
                      <option value="Fashion & Retail">Fashion & Retail</option>
                      <option value="Technology">Technology</option>
                      <option value="Entertainment & Media">Entertainment & Media</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                      placeholder="e.g., 18-35, Fashion enthusiasts"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_primary"
                      checked={formData.is_primary}
                      onChange={(e) => setFormData({...formData, is_primary: e.target.checked})}
                      className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="is_primary" className="text-sm text-slate-300">Set as primary location</label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 text-slate-300 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Location'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
