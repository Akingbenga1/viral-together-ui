'use client';

import React, { useState } from 'react';
import { LocationBase } from '@/types/location';

interface LocationFormProps {
  initialData?: Partial<LocationBase>;
  onSubmit: (data: LocationBase) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
}

export default function LocationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title
}: LocationFormProps) {
  const [formData, setFormData] = useState<LocationBase>({
    city_name: '',
    region_name: '',
    region_code: '',
    country_code: '',
    country_name: '',
    latitude: 0,
    longitude: 0,
    postcode: '',
    time_zone: '',
    is_primary: false,
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City Name *</label>
            <input
              type="text"
              value={formData.city_name}
              onChange={(e) => setFormData(prev => ({ ...prev, city_name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country Code *</label>
            <input
              type="text"
              value={formData.country_code}
              onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border rounded-md"
              maxLength={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Latitude *</label>
            <input
              type="number"
              value={formData.latitude}
              onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              step="any"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Longitude *</label>
            <input
              type="number"
              value={formData.longitude}
              onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              step="any"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_primary}
            onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
            className="h-4 w-4 text-blue-600"
          />
          <label className="ml-2 text-sm">Set as primary location</label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </form>
    </div>
  );
}
