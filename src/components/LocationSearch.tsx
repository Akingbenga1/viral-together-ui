'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { NearbySearchParams, NearbyInfluencer, NearbyBusiness, NearbyPromotion } from '@/types/location';

interface LocationSearchProps {
  onResultsFound: (results: any[], type: string) => void;
}

const LocationSearch = ({ onResultsFound }: LocationSearchProps) => {
  const [searchParams, setSearchParams] = useState<NearbySearchParams>({
    latitude: 0,
    longitude: 0,
    radius_km: 50
  });
  const [searchType, setSearchType] = useState<'influencers' | 'businesses' | 'promotions'>('influencers');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchParams.latitude === 0 || searchParams.longitude === 0) {
      alert('Please enter valid coordinates');
      return;
    }

    setIsLoading(true);
    try {
      let results: NearbyInfluencer[] | NearbyBusiness[] | NearbyPromotion[];
      switch (searchType) {
        case 'influencers':
          results = await api.findInfluencersNearby(searchParams);
          break;
        case 'businesses':
          results = await api.findBusinessesNearby(searchParams);
          break;
        case 'promotions':
          results = await api.findPromotionsNearby(searchParams);
          break;
        default:
          results = [];
      }
      
      onResultsFound(results, searchType);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Location-Based Search</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude *</label>
            <input
              type="number"
              value={searchParams.latitude}
              onChange={(e) => setSearchParams(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              step="any"
              placeholder="40.7128"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Longitude *</label>
            <input
              type="number"
              value={searchParams.longitude}
              onChange={(e) => setSearchParams(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              step="any"
              placeholder="-74.0060"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Radius (km)</label>
            <input
              type="number"
              value={searchParams.radius_km}
              onChange={(e) => setSearchParams(prev => ({ ...prev, radius_km: parseInt(e.target.value) || 50 }))}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              max="500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="influencers">Influencers</option>
              <option value="businesses">Businesses</option>
              <option value="promotions">Promotions</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category/Industry</label>
            <input
              type="text"
              onChange={(e) => {
                if (searchType === 'influencers') {
                  setSearchParams(prev => ({ ...prev, category: e.target.value }));
                } else if (searchType === 'businesses') {
                  setSearchParams(prev => ({ ...prev, industry: e.target.value }));
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
              placeholder={searchType === 'influencers' ? 'Fashion, Tech' : 'Retail, Technology'}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
