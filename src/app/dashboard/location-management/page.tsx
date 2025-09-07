'use client';

import React, { useState, useEffect } from 'react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import InteractiveMap from '@/components/InteractiveMap';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function LocationManagementPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Array<{
    id: number;
    city_name: string;
    country_code: string;
    country_name: string;
    latitude: number | string | null;
    longitude: number | string | null;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
  }>>([]);
  const [influencerId, setInfluencerId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    city_name: '',
    country_code: '',
    country_name: '',
    latitude: 40.7128,
    longitude: -74.0060,
    is_primary: false
  });

  // Helper function to safely format coordinates
  const formatCoordinate = (coord: number | string | null): string => {
    if (coord === null || coord === undefined) return 'N/A';
    const num = Number(coord);
    if (isNaN(num)) return 'N/A';
    return num.toFixed(6);
  };

  // Get influencer ID and load existing locations when component mounts
  useEffect(() => {
    const getInfluencerId = async () => {
      if (user?.id) {
        try {
          // Get all influencers and find the one matching the current user
          const allInfluencers = await apiClient.getInfluencers();
          const currentUserInfluencer = allInfluencers.find(
            influencer => influencer.user.id === user.id
          );
          
          if (currentUserInfluencer) {
            setInfluencerId(currentUserInfluencer.id);
            
            // Load existing locations
            try {
              const existingLocations = await apiClient.getInfluencerLocations(currentUserInfluencer.id);
              setLocations(existingLocations);
            } catch (error) {
              console.log('No existing locations found or error occurred:', error);
            }
          } else {
            console.log('User does not have an influencer profile');
          }
        } catch (error) {
          console.log('Error fetching influencers or user is not an influencer:', error);
          // User might be a business or not have an influencer profile yet
        }
      }
    };

    getInfluencerId();
  }, [user]);

  // This function is called by the map component to update form fields only
  // It does NOT trigger any API calls or form submissions
  const handleLocationSelect = (lat: number, lng: number, cityName?: string, countryCode?: string, countryName?: string, displayName?: string) => {
    console.log('Map location selected - updating form fields only:', { lat, lng, cityName, countryCode, countryName, displayName });
    
    // Show toast message with street name and autofill notification
    if (displayName) {
      toast.success(`${displayName} - Location data has been autofilled in the form below`, {
        duration: 4000,
        position: 'top-right',
      });
    }
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      city_name: cityName || prev.city_name,
      country_code: countryCode || prev.country_code,
      country_name: countryName || prev.country_name
    }));
  };

  // This function handles the actual form submission and API call
  // It is completely separate from handleLocationSelect which only updates form fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted - making API call to save location');
    
    // Basic validation - only coordinates are required
    if (formData.latitude === 0 && formData.longitude === 0) {
      toast.error('Please select a location on the map or enter coordinates manually');
      return;
    }
    
    // Validate coordinate ranges
    if (formData.latitude < -90 || formData.latitude > 90) {
      toast.error('Latitude must be between -90 and 90 degrees');
      return;
    }
    
    if (formData.longitude < -180 || formData.longitude > 180) {
      toast.error('Longitude must be between -180 and 180 degrees');
      return;
    }
    
    // Check if user has influencer profile
    if (!influencerId) {
      toast.error('You need to have an influencer profile to save locations. Please complete your influencer profile first.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Saving location...');
      
      // Prepare location data for API
      const locationData = {
        city_name: formData.city_name,
        country_code: formData.country_code,
        country_name: formData.country_name,
        latitude: parseFloat(formData.latitude.toFixed(6)),
        longitude: parseFloat(formData.longitude.toFixed(6)),
        is_primary: formData.is_primary,
        // Optional fields with default values
        region_name: undefined,
        region_code: undefined,
        postcode: undefined,
        time_zone: undefined
      };
      
      console.log('Sending location data to API:', locationData);
      console.log('Influencer ID:', influencerId);
      
             // Call API to save location
       const response = await apiClient.addInfluencerLocation(influencerId, locationData);
       
       console.log('API Response:', response);
       console.log('Response type:', typeof response);
       console.log('Response latitude type:', typeof response.latitude);
       console.log('Response longitude type:', typeof response.longitude);
       
       // Dismiss loading toast and show success
       toast.dismiss(loadingToast);
       toast.success('Location saved successfully!');
      
             // Add new location to the list with proper type safety
       const newLocation = {
         id: response.id || Date.now(), // fallback ID if not provided
         city_name: response.city_name || '',
         country_code: response.country_code || '',
         country_name: response.country_name || '',
         latitude: response.latitude || 0,
         longitude: response.longitude || 0,
         is_primary: response.is_primary || false,
         created_at: response.created_at,
         updated_at: response.updated_at
       };
       setLocations(prev => [...prev, newLocation]);
      
             // Reset form and hide it
       setFormData({
         city_name: '',
         country_code: '',
         country_name: '',
         latitude: 40.7128,
         longitude: -74.0060,
         is_primary: false
       });
      setShowForm(false);
      
      console.log('Location saved:', response);
      
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Location Management 📍
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Manage your operational locations for better reach and local partnerships
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {locations.length} Location{locations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:p-8">
          {!influencerId && (
            <div className="mb-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
              <p className="text-amber-200 leading-relaxed">
                <strong className="text-amber-100 font-semibold">Note:</strong> You need to complete your influencer profile before you can manage locations. 
                Please visit your influencer profile page to set up your account.
              </p>
            </div>
          )}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">Your Locations</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={!influencerId}
              className="btn-dark-primary px-6 h-12 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {showForm ? 'Cancel' : 'Add Location'}
            </button>
          </div>

          {showForm ? (
            <div className="border-t border-form-border/20 pt-8">
              <h3 className="text-xl font-bold text-white mb-6 leading-tight tracking-tight">Add New Location</h3>
              <form onSubmit={handleSubmit} className="space-y-8" id="location-form" noValidate>
                
                {/* Interactive Map */}
                <div className="space-y-3">
                  <label className="text-base font-semibold text-white leading-relaxed">Select Location on Map (Optional)</label>
                  <p className="text-slate-300 leading-relaxed max-w-2xl">
                    Use the map to automatically fill city name, country name, and country code, or enter them manually below. 
                    The map will also update the latitude and longitude fields automatically.
                  </p>
                  <div className="border border-form-border/30 rounded-xl p-4 bg-form-surface/30 backdrop-blur-sm">
                    <InteractiveMap
                      onLocationSelect={handleLocationSelect}
                      initialLat={formData.latitude}
                      initialLng={formData.longitude}
                    />
                  </div>
                  {formData.latitude !== 40.7128 || formData.longitude !== -74.0060 ? (
                    <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-sm text-green-400 font-medium">
                        ✓ Map location selected: {formatCoordinate(formData.latitude)}, {formatCoordinate(formData.longitude)}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* City and Country Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-white leading-relaxed">City Name</label>
                    <input
                      type="text"
                      value={formData.city_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, city_name: e.target.value }))}
                      className="input-dark text-white placeholder:text-slate-400"
                      placeholder="Will be auto-filled from map selection"
                    />
                    {formData.city_name && (
                      <p className="text-sm text-green-400 mt-2 font-medium leading-relaxed">✓ Auto-filled from map</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-white leading-relaxed">Country Name</label>
                    <input
                      type="text"
                      value={formData.country_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, country_name: e.target.value }))}
                      className="input-dark text-white placeholder:text-slate-400"
                      placeholder="Will be auto-filled from map selection"
                    />
                    {formData.country_name && (
                      <p className="text-sm text-green-400 mt-2 font-medium leading-relaxed">✓ Auto-filled from map</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-white leading-relaxed">Country Code</label>
                    <input
                      type="text"
                      value={formData.country_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value.toUpperCase() }))}
                      className="input-dark font-mono tracking-wider text-white placeholder:text-slate-400"
                      maxLength={2}
                      placeholder="US, GB, CA (auto-filled from map)"
                    />
                    {formData.country_code && (
                      <p className="text-sm text-green-400 mt-2 font-medium leading-relaxed">✓ Auto-filled from map</p>
                    )}
                  </div>
                </div>

                {/* Coordinate Fields */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white leading-tight tracking-tight">Coordinates (Optional Manual Entry)</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    These fields are automatically filled when you select a location on the map above, but you can also enter coordinates manually.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-white leading-relaxed">
                        Latitude
                        <span className="text-slate-400 font-normal ml-2">(-90 to 90)</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-90"
                        max="90"
                        value={formData.latitude}
                        onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                        className="input-dark font-mono tracking-wider text-white placeholder:text-slate-400"
                        placeholder="40.712800"
                      />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Current: {formatCoordinate(formData.latitude)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-white leading-relaxed">
                        Longitude
                        <span className="text-slate-400 font-normal ml-2">(-180 to 180)</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-180"
                        max="180"
                        value={formData.longitude}
                        onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                        className="input-dark font-mono tracking-wider text-white placeholder:text-slate-400"
                        placeholder="-74.006000"
                      />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Current: {formatCoordinate(formData.longitude)}
                      </p>
                    </div>
                  </div>
                  {(formData.latitude !== 40.7128 || formData.longitude !== -74.0060) && (
                    <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                      <p className="text-sm text-cyan-400 font-medium leading-relaxed">
                        📍 Custom coordinates set: {formatCoordinate(formData.latitude)}, {formatCoordinate(formData.longitude)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Location Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="checkbox-dark mt-1"
                  />
                  <label htmlFor="is_primary" className="text-sm font-medium text-white leading-relaxed cursor-pointer">
                    Set as primary location
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => console.log('Save Location button clicked')}
                    className="btn-dark-primary px-8 h-12 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Location'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {locations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-300 text-lg leading-relaxed">No locations found. Add your first location to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white leading-tight tracking-tight">Your Saved Locations</h3>
                  {locations.map((location, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <p className="font-semibold text-white text-lg leading-relaxed">
                            {location.city_name || 'Unknown City'}, {location.country_name || location.country_code || 'Unknown Country'}
                          </p>
                          <p className="text-slate-300 leading-relaxed">
                            Coordinates: {formatCoordinate(location.latitude)}, {formatCoordinate(location.longitude)}
                          </p>
                          {location.is_primary && (
                            <span className="inline-block mt-3 px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 font-medium">
                              Primary Location
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
