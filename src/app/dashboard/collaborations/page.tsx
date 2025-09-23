'use client';

import { useEffect, useState } from 'react';
import { 
  Handshake, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
  Eye,
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Collaboration {
  id: number;
  brand: {
    name: string;
    logo: string;
    verified: boolean;
  };
  title: string;
  description: string;
  type: 'Instagram Post' | 'YouTube Video' | 'TikTok Video' | 'Story' | 'Reel' | 'Campaign';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  deadline: string;
  requirements: string[];
  engagement_rate?: number;
  followers_min?: number;
  created_at: string;
  updated_at: string;
}

export default function CollaborationsPage() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/collaborations');
      // setCollaborations(response.data);
      
      // Mock data for demonstration
      const mockCollaborations: Collaboration[] = [
        {
          id: 1,
          brand: {
            name: 'TechCorp',
            logo: 'TC',
            verified: true
          },
          title: 'Smartphone Review Campaign',
          description: 'Create an engaging review video for our latest smartphone model highlighting key features and user experience.',
          type: 'YouTube Video',
          status: 'active',
          budget: 1500,
          deadline: '2025-02-15',
          requirements: [
            'Minimum 50K subscribers',
            'Tech niche content',
            'High engagement rate (>3%)',
            'English content'
          ],
          engagement_rate: 4.2,
          followers_min: 50000,
          created_at: '2025-01-10',
          updated_at: '2025-01-12'
        },
        {
          id: 2,
          brand: {
            name: 'FashionBrand',
            logo: 'FB',
            verified: true
          },
          title: 'Spring Collection Showcase',
          description: 'Showcase our latest spring collection through Instagram posts and stories.',
          type: 'Instagram Post',
          status: 'pending',
          budget: 800,
          deadline: '2025-02-28',
          requirements: [
            'Fashion/lifestyle niche',
            'Female influencer preferred',
            'Minimum 25K followers',
            'Active story engagement'
          ],
          engagement_rate: 3.8,
          followers_min: 25000,
          created_at: '2025-01-15',
          updated_at: '2025-01-15'
        },
        {
          id: 3,
          brand: {
            name: 'FoodDelivery',
            logo: 'FD',
            verified: false
          },
          title: 'Quick Recipe TikTok Series',
          description: 'Create a series of quick and easy recipe videos for busy professionals.',
          type: 'TikTok Video',
          status: 'completed',
          budget: 600,
          deadline: '2025-01-30',
          requirements: [
            'Food/cooking content',
            'Trending audio usage',
            'Under 60 seconds',
            'Quick recipe format'
          ],
          engagement_rate: 5.1,
          followers_min: 15000,
          created_at: '2025-01-05',
          updated_at: '2025-01-20'
        },
        {
          id: 4,
          brand: {
            name: 'FitnessApp',
            logo: 'FA',
            verified: true
          },
          title: 'Workout Challenge Promotion',
          description: 'Promote our new 30-day fitness challenge with before/after content.',
          type: 'Instagram Post',
          status: 'pending',
          budget: 1200,
          deadline: '2025-03-01',
          requirements: [
            'Fitness/health niche',
            'Transformation content',
            'Story highlights',
            'Challenge participation'
          ],
          engagement_rate: 4.5,
          followers_min: 30000,
          created_at: '2025-01-18',
          updated_at: '2025-01-18'
        }
      ];
      
      setCollaborations(mockCollaborations);
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
      toast.error('Failed to load collaborations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20';
      case 'active':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'active':
        return TrendingUp;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = collaboration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaboration.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaboration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || collaboration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApply = async (collaborationId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/collaborations/${collaborationId}/apply`);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleWithdraw = async (collaborationId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/collaborations/${collaborationId}/withdraw`);
      toast.success('Application withdrawn successfully!');
    } catch (error) {
      console.error('Failed to withdraw:', error);
      toast.error('Failed to withdraw application');
    }
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Handshake className="w-8 h-8 mr-3 text-cyan-400" />
                Collaborations 🤝
              </h1>
              <p className="text-slate-300 text-lg">
                Discover and manage brand collaboration opportunities
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300 whitespace-nowrap">
                  {filteredCollaborations.length} opportunities available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search collaborations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collaborations Grid */}
        {filteredCollaborations.length === 0 ? (
          <div className="text-center py-12">
            <Handshake className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No collaborations found</h3>
            <p className="text-slate-400">
              {searchTerm ? 'Try adjusting your search criteria' : 'Check back later for new opportunities!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCollaborations.map((collaboration) => {
              const StatusIcon = getStatusIcon(collaboration.status);
              
              return (
                <div
                  key={collaboration.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold">
                        {collaboration.brand.logo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{collaboration.brand.name}</h3>
                          {collaboration.brand.verified && (
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{collaboration.type}</p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(collaboration.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">{collaboration.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                      {collaboration.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">Budget</span>
                      </div>
                      <p className="text-lg font-semibold text-white">${collaboration.budget.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300">Deadline</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {new Date(collaboration.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Requirements:</h5>
                    <div className="flex flex-wrap gap-2">
                      {collaboration.requirements.slice(0, 2).map((requirement, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700/30 text-slate-300 text-xs rounded-lg border border-slate-600/30"
                        >
                          {requirement}
                        </span>
                      ))}
                      {collaboration.requirements.length > 2 && (
                        <span className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-lg border border-slate-600/30">
                          +{collaboration.requirements.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {collaboration.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApply(collaboration.id)}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Handshake className="w-4 h-4" />
                          <span>Apply</span>
                        </button>
                        <button className="px-4 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {collaboration.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleWithdraw(collaboration.id)}
                          className="flex-1 bg-slate-700/30 border border-slate-600/30 text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                        >
                          Withdraw
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 rounded-lg text-cyan-400 hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-200">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {(collaboration.status === 'completed' || collaboration.status === 'cancelled') && (
                      <button className="flex-1 px-4 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-400 cursor-not-allowed">
                        {collaboration.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}