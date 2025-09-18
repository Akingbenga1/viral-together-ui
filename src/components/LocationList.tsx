'use client';

import React from 'react';
import { LocationBase } from '@/types/location';

interface LocationListProps {
  locations: (LocationBase & { id: number })[];
  onEdit: (location: LocationBase & { id: number }) => void;
  onDelete: (locationId: number) => void;
  onSetPrimary: (locationId: number) => void;
  entityType: 'influencer' | 'business';
}

const LocationList = ({
  locations,
  onEdit,
  onDelete,
  onSetPrimary,
  entityType
}: LocationListProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No locations found for this {entityType}.</p>
        <p className="text-sm">Add your first location to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Locations
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {locations.map((location) => (
          <div key={location.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {location.city_name}, {location.country_name}
                  </h4>
                  {location.is_primary && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Primary
                    </span>
                  )}
                </div>
                
                <div className="mt-1 text-sm text-gray-500">
                  <p>
                    {location.region_name && `${location.region_name}, `}
                    {location.postcode && `${location.postcode} `}
                    Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                  {location.time_zone && (
                    <p>Timezone: {location.time_zone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!location.is_primary && (
                  <button
                    onClick={() => onSetPrimary(location.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Set Primary
                  </button>
                )}
                
                <button
                  onClick={() => onEdit(location)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => onDelete(location.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
