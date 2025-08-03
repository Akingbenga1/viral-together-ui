'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Select from 'react-select/async';
import { components, DropdownIndicatorProps, ClearIndicatorProps, MultiValueRemoveProps } from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Country } from '@/types';

interface CountrySelectProps {
  value: number[];
  onChange: (countryIds: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

interface CountryOption {
  value: number;
  label: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = "Search and select countries...",
  multiple = true,
  className = "",
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<CountryOption[]>([]);

  // Custom components for better styling
  const DropdownIndicator = (props: DropdownIndicatorProps<CountryOption>) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </components.DropdownIndicator>
    );
  };

  const ClearIndicator = (props: ClearIndicatorProps<CountryOption>) => {
    return (
      <components.ClearIndicator {...props}>
        <X className="w-4 h-4 text-gray-400" />
      </components.ClearIndicator>
    );
  };

  const MultiValueRemove = (props: MultiValueRemoveProps<CountryOption>) => {
    return (
      <components.MultiValueRemove {...props}>
        <X className="w-3 h-3 text-gray-400" />
      </components.MultiValueRemove>
    );
  };

  // Load options from API
  const loadOptions = useCallback(async (inputValue: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const countries = await apiClient.getCountries(inputValue, undefined, 20);
      
      return countries.map(country => ({
        value: country.id,
        label: country.name
      }));
    } catch (err) {
      console.error('Error loading countries:', err);
      setError('Failed to load countries');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial country names for selected values
  useEffect(() => {
    if (value.length > 0) {
      const loadSelectedCountryNames = async () => {
        try {
          const countries = await Promise.all(
            value.map(id => apiClient.getCountry(id))
          );
          
          const options = countries.map((country: Country) => ({
            value: country.id,
            label: country.name
          }));
          
          setSelectedOptions(options);
        } catch (err) {
          console.error('Error loading selected country names:', err);
          // Fallback to generic labels
          setSelectedOptions(value.map(id => ({
            value: id,
            label: `Country ${id}`
          })));
        }
      };
      
      loadSelectedCountryNames();
    } else {
      setSelectedOptions([]);
    }
  }, [value]);

  // Handle selection change
  const handleChange = (selected: any) => {
    if (multiple) {
      const selectedIds = selected ? selected.map((option: CountryOption) => option.value) : [];
      onChange(selectedIds);
    } else {
      const selectedId = selected ? selected.value : null;
      onChange(selectedId ? [selectedId] : []);
    }
  };

  return (
    <div className={`country-select-container ${className}`}>
      {error && (
        <div className="text-sm text-red-500 mb-2">{error}</div>
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
        defaultOptions={false}
        cacheOptions={true}
        components={{
          DropdownIndicator,
          ClearIndicator,
          MultiValueRemove
        }}
        classNames={{
          control: ({ isFocused }) =>
            `border rounded-lg bg-white hover:cursor-pointer ${
              isFocused 
                ? 'border-primary-600 ring-1 ring-primary-500' 
                : 'border-gray-300 hover:border-gray-400'
            }`,
          placeholder: () => 'text-gray-500 pl-1 py-0.5',
          input: () => 'pl-1 py-0.5',
          valueContainer: () => 'p-1 gap-1',
          singleValue: () => 'leading-7 ml-1',
          multiValue: () => 'bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5',
          multiValueLabel: () => 'leading-6 py-0.5',
          multiValueRemove: () => 'border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md',
          indicatorsContainer: () => 'p-1 gap-1',
          clearIndicator: () => 'text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800',
          indicatorSeparator: () => 'bg-gray-300',
          dropdownIndicator: () => 'p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black',
          menu: () => 'p-1 mt-2 border border-gray-200 bg-white rounded-lg',
          groupHeading: () => 'ml-3 mt-2 mb-1 text-gray-500 text-sm',
          option: ({ isFocused, isSelected }) =>
            `hover:cursor-pointer px-3 py-2 rounded ${
              isFocused ? 'bg-gray-100 active:bg-gray-200' : ''
            } ${
              isSelected ? 'after:content-["✔"] after:ml-2 after:text-green-500 text-gray-500' : ''
            }`,
          noOptionsMessage: () => 'text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm'
        }}
        styles={{
          input: (base) => ({
            ...base,
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
          }),
        }}
      />
    </div>
  );
};

export default CountrySelect; 