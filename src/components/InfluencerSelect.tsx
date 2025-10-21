'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Select from 'react-select/async';
import { components, DropdownIndicatorProps, ClearIndicatorProps, MultiValueRemoveProps } from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Influencer } from '@/types';

interface InfluencerSelectProps {
  value: number[];
  onChange: (influencerIds: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

interface InfluencerOption {
  value: number;
  label: string;
  email?: string;
}

const InfluencerSelect: React.FC<InfluencerSelectProps> = ({
  value,
  onChange,
  placeholder = "Search and select influencers...",
  multiple = true,
  className = "",
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<InfluencerOption[]>([]);

  // Custom components for better styling
  const DropdownIndicator = (props: DropdownIndicatorProps<InfluencerOption>) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </components.DropdownIndicator>
    );
  };

  const ClearIndicator = (props: ClearIndicatorProps<InfluencerOption>) => {
    return (
      <components.ClearIndicator {...props}>
        <X className="w-4 h-4 text-slate-400" />
      </components.ClearIndicator>
    );
  };

  const MultiValueRemove = (props: MultiValueRemoveProps<InfluencerOption>) => {
    return (
      <components.MultiValueRemove {...props}>
        <X className="w-3 h-3 text-slate-400" />
      </components.MultiValueRemove>
    );
  };

  // Load options from API
  const loadOptions = useCallback(async (inputValue: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all influencers or search by criteria
      const influencers = await apiClient.getInfluencers();
      
      // Filter by input value if provided
      const filtered = inputValue 
        ? influencers.filter((inf: Influencer) => {
            const name = inf.user ? `${inf.user.first_name || ''} ${inf.user.last_name || ''}`.trim() : '';
            const email = inf.user?.email || '';
            const username = inf.user?.username || '';
            const searchTerm = inputValue.toLowerCase();
            return (
              name.toLowerCase().includes(searchTerm) ||
              email.toLowerCase().includes(searchTerm) ||
              username.toLowerCase().includes(searchTerm)
            );
          })
        : influencers;
      
      return filtered.map((inf: Influencer) => ({
        value: inf.id,
        label: inf.user 
          ? `${inf.user.first_name || ''} ${inf.user.last_name || ''}`.trim() || inf.user.username || `Influencer ${inf.id}`
          : `Influencer ${inf.id}`,
        email: inf.user?.email
      }));
    } catch (err) {
      console.error('Error loading influencers:', err);
      setError('Failed to load influencers');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial influencer names for selected values
  useEffect(() => {
    if (value.length > 0) {
      const loadSelectedInfluencerNames = async () => {
        try {
          const influencers = await Promise.all(
            value.map(id => apiClient.getInfluencer(id))
          );
          
          const options = influencers.map((inf: Influencer) => ({
            value: inf.id,
            label: inf.user 
              ? `${inf.user.first_name || ''} ${inf.user.last_name || ''}`.trim() || inf.user.username || `Influencer ${inf.id}`
              : `Influencer ${inf.id}`,
            email: inf.user?.email
          }));
          
          setSelectedOptions(options);
        } catch (err) {
          console.error('Error loading selected influencer names:', err);
          // Fallback to generic labels
          setSelectedOptions(value.map(id => ({
            value: id,
            label: `Influencer ${id}`
          })));
        }
      };
      
      loadSelectedInfluencerNames();
    } else {
      setSelectedOptions([]);
    }
  }, [value]);

  // Handle selection change
  const handleChange = (selected: any) => {
    if (multiple) {
      const selectedIds = selected ? selected.map((option: InfluencerOption) => option.value) : [];
      onChange(selectedIds);
    } else {
      const selectedId = selected ? selected.value : null;
      onChange(selectedId ? [selectedId] : []);
    }
  };

  return (
    <div className={`influencer-select-container ${className}`}>
      {error && (
        <div className="text-sm text-red-400 mb-2">{error}</div>
      )}
      
      <Select
        isMulti={multiple}
        isClearable={true}
        isSearchable={true}
        isLoading={isLoading}
        isDisabled={disabled}
        placeholder={placeholder}
        value={selectedOptions}
        onChange={handleChange}
        loadOptions={loadOptions}
        defaultOptions={true}
        cacheOptions={true}
        components={{
          DropdownIndicator,
          ClearIndicator,
          MultiValueRemove
        }}
        classNames={{
          control: ({ isFocused }) =>
            `border rounded-lg bg-slate-800/50 hover:cursor-pointer ${
              isFocused 
                ? 'border-cyan-500 ring-1 ring-cyan-500' 
                : 'border-slate-600 hover:border-slate-500'
            }`,
          placeholder: () => 'text-slate-400 pl-1 py-0.5',
          input: () => 'pl-1 py-0.5 text-white',
          valueContainer: () => 'p-1 gap-1',
          singleValue: () => 'leading-7 ml-1 text-white',
          multiValue: () => 'bg-slate-700 rounded items-center py-0.5 pl-2 pr-1 gap-1.5',
          multiValueLabel: () => 'leading-6 py-0.5 text-white',
          multiValueRemove: () => 'border border-slate-600 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 hover:border-red-500/30 rounded-md',
          indicatorsContainer: () => 'p-1 gap-1',
          clearIndicator: () => 'text-slate-400 p-1 rounded-md hover:bg-red-500/20 hover:text-red-400',
          indicatorSeparator: () => 'bg-slate-600',
          dropdownIndicator: () => 'p-1 hover:bg-slate-700 text-slate-400 rounded-md hover:text-white',
          menu: () => 'p-1 mt-2 border border-slate-600 bg-slate-800 rounded-lg',
          groupHeading: () => 'ml-3 mt-2 mb-1 text-slate-400 text-sm',
          option: ({ isFocused, isSelected }) =>
            `hover:cursor-pointer px-3 py-2 rounded ${
              isFocused ? 'bg-slate-700 active:bg-slate-600' : ''
            } ${
              isSelected ? 'after:content-["✔"] after:ml-2 after:text-emerald-400 text-slate-300' : 'text-slate-200'
            }`,
          noOptionsMessage: () => 'text-slate-400 p-2 bg-slate-700/50 border border-dashed border-slate-600 rounded-sm'
        }}
        styles={{
          input: (base) => ({
            ...base,
            color: 'white',
            'input:focus': {
              boxShadow: 'none',
            },
          }),
          multiValueLabel: (base) => ({
            ...base,
            whiteSpace: 'normal',
            overflow: 'visible',
          }),
          control: (base) => ({
            ...base,
            transition: 'none',
            backgroundColor: 'transparent',
          }),
        }}
      />
    </div>
  );
};

export default InfluencerSelect;

