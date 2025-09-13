'use client';

import { useState, useEffect } from 'react';
import { Building, Users, Target, Filter, Download, ArrowLeft, Eye, MessageSquare, MapPin, Calendar, Star, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Business } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBusinessesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBusinessesData = async () => {
      try {
        const businessesData = await apiClient.getAllBusinesses();
        setBusinesses(businessesData);
      } catch (error) {
        console.error('Failed to fetch businesses data:', error);
        toast.error('Failed to load businesses data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessesData();
  }, []);

  // Calculate business metrics
  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter(biz => biz.verified).length;
  const unverifiedBusinesses = businesses.filter(biz => !biz.verified).length;
  const avgBudget = businesses.length > 0 
    ? Math.round(businesses.reduce((sum, biz) => sum + (biz.monthly_budget || 0), 0) / businesses.length)
    : 0;

  // Get unique industries and sizes for filters
  const uniqueIndustries = Array.from(new Set(businesses.map(biz => biz.industry).filter(Boolean)));
  const uniqueSizes = Array.from(new Set(businesses.map(biz => biz.company_size).filter(Boolean)));

  // Filter businesses based on criteria
  const filteredBusinesses = businesses.filter(biz => {
    const matchesIndustry = filterIndustry === 'all' || biz.industry === filterIndustry;
    const matchesSize = filterSize === 'all' || biz.company_size === filterSize;
    
    const matchesSearch = searchTerm === '' || 
      biz.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesIndustry && matchesSize && matchesSearch;
  });

  const businessMetrics = [
    {
      name: 'Total Businesses',
      value: totalBusinesses,
      icon: Building,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'All registered businesses',
    },
    {
      name: 'Verified',
      value: verifiedBusinesses,
      icon: Star,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'Verified business accounts',
    },
    {
      name: 'Unverified',
      value: unverifiedBusinesses,
      icon: BarChart3,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Pending verification',
    },
    {
      name: 'Avg Budget',
      value: `$${avgBudget.toLocaleString()}`,
      icon: Target,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Monthly marketing budget',
    },
  ];

  const getVerificationColor = (verified: boolean) => {
    return verified 
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
      : 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
  };

  const getSizeColor = (size: string) => {
    switch (size?.toLowerCase()) {
      case 'startup':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'small':
        return 'bg-green-500/20 text-green-400 border border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20';
      case 'large':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/20';
      case 'enterprise':
        return 'bg-red-500/20 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/20';
    }
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded-xl w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                    <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => router.push('/admin/analytics')}
                    className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                  </button>
                  <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                    Business Management 🏢
                  </h1>
                </div>
                <div className="text-slate-300 text-lg leading-relaxed">
                  <span>Manage and monitor all business accounts</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">Live Data</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Business Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {businessMetrics.map((metric) => (
              <div
                key={metric.name}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{metric.value}</h3>
                    <p className="text-slate-400 text-sm truncate">{metric.name}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{metric.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <span className="text-white font-medium">Filters:</span>
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="select-dark px-4 py-2 rounded-xl font-medium"
                  >
                    <option value="all">All Industries</option>
                    {uniqueIndustries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="select-dark px-4 py-2 rounded-xl font-medium"
                  >
                    <option value="all">All Sizes</option>
                    {uniqueSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Showing {filteredBusinesses.length} of {businesses.length} businesses
              </div>
            </div>
          </div>

          {/* Businesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {business.company_name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {business.user?.first_name} {business.user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(business.verified)}`}>
                      {business.verified ? 'Verified' : 'Unverified'}
                    </span>
                    {business.company_size && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSizeColor(business.company_size)}`}>
                        {business.company_size}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{business.location || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{business.industry || 'Industry not specified'}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span>${business.monthly_budget?.toLocaleString() || 0} monthly budget</span>
                  </div>

                  {business.description && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {business.description}
                    </p>
                  )}

                  {business.website && (
                    <div className="flex items-center space-x-2 text-sm text-cyan-400">
                      <span>🌐</span>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyan-300 transition-colors truncate"
                      >
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                    {!business.verified && (
                      <button className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors text-sm">
                        <Star className="w-4 h-4" />
                        <span>Verify</span>
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Joined {business.created_at ? new Date(business.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">No businesses found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
