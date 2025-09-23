'use client';

import { useEffect, useState } from 'react';
import { 
  Target, 
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Music,
  Camera,
  DollarSign
} from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface SocialMediaTarget {
  id: number;
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'Twitter' | 'Facebook' | 'LinkedIn';
  target_type: 'Followers' | 'Engagement Rate' | 'Views' | 'Likes' | 'Subscribers' | 'Revenue';
  current_value: number;
  target_value: number;
  target_date: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Overdue' | 'On Track';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
}

export default function SocialTargetsPage() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<SocialMediaTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<SocialMediaTarget | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    platform: 'Instagram' as const,
    target_type: 'Followers' as const,
    current_value: 0,
    target_value: 0,
    target_date: '',
    description: '',
    priority: 'Medium' as const,
  });

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/social-targets');
      // setTargets(response.data);
      
      // Mock data for demonstration
      const mockTargets: SocialMediaTarget[] = [
        {
          id: 1,
          platform: 'Instagram',
          target_type: 'Followers',
          current_value: 125000,
          target_value: 200000,
          target_date: '2025-06-30',
          description: 'Reach 200K followers by mid-2025 to unlock more brand partnerships',
          status: 'In Progress',
          priority: 'High',
          created_at: '2025-01-01',
          updated_at: '2025-01-15'
        },
        {
          id: 2,
          platform: 'YouTube',
          target_type: 'Subscribers',
          current_value: 45000,
          target_value: 100000,
          target_date: '2025-12-31',
          description: 'Hit 100K subscribers to get the silver play button and monetization boost',
          status: 'On Track',
          priority: 'High',
          created_at: '2025-01-05',
          updated_at: '2025-01-18'
        },
        {
          id: 3,
          platform: 'TikTok',
          target_type: 'Views',
          current_value: 2500000,
          target_value: 5000000,
          target_date: '2025-03-31',
          description: 'Achieve 5M total views to establish strong presence on TikTok',
          status: 'In Progress',
          priority: 'Medium',
          created_at: '2025-01-10',
          updated_at: '2025-01-20'
        },
        {
          id: 4,
          platform: 'Instagram',
          target_type: 'Engagement Rate',
          current_value: 4.2,
          target_value: 6.0,
          target_date: '2025-04-30',
          description: 'Improve engagement rate to 6% for better brand deals',
          status: 'In Progress',
          priority: 'Medium',
          created_at: '2025-01-12',
          updated_at: '2025-01-19'
        },
        {
          id: 5,
          platform: 'YouTube',
          target_type: 'Revenue',
          current_value: 2500,
          target_value: 10000,
          target_date: '2025-08-31',
          description: 'Generate $10K monthly revenue from YouTube content',
          status: 'In Progress',
          priority: 'High',
          created_at: '2024-12-15',
          updated_at: '2025-01-22'
        }
      ];
      
      setTargets(mockTargets);
    } catch (error) {
      console.error('Failed to fetch targets:', error);
      toast.error('Failed to load social media targets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTarget) {
        // Update existing target
        // await api.put(`/social-targets/${editingTarget.id}`, formData);
        
        setTargets(prev => prev.map(target => 
          target.id === editingTarget.id 
            ? { ...target, ...formData, updated_at: new Date().toISOString() }
            : target
        ));
        
        toast.success('Target updated successfully!');
        setEditingTarget(null);
      } else {
        // Create new target
        // await api.post('/social-targets', formData);
        
        const newTarget: SocialMediaTarget = {
          id: Date.now(),
          ...formData,
          status: 'In Progress',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setTargets(prev => [...prev, newTarget]);
        toast.success('Target created successfully!');
      }
      
      // Reset form
      setFormData({
        platform: 'Instagram',
        target_type: 'Followers',
        current_value: 0,
        target_value: 0,
        target_date: '',
        description: '',
        priority: 'Medium',
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save target:', error);
      toast.error('Failed to save target');
    }
  };

  const handleEdit = (target: SocialMediaTarget) => {
    setFormData({
      platform: target.platform,
      target_type: target.target_type,
      current_value: target.current_value,
      target_value: target.target_value,
      target_date: target.target_date,
      description: target.description,
      priority: target.priority,
    });
    setEditingTarget(target);
    setShowAddForm(true);
  };

  const handleDelete = async (targetId: number) => {
    if (!confirm('Are you sure you want to delete this target?')) return;
    
    try {
      // await api.delete(`/social-targets/${targetId}`);
      setTargets(prev => prev.filter(target => target.id !== targetId));
      toast.success('Target deleted successfully!');
    } catch (error) {
      console.error('Failed to delete target:', error);
      toast.error('Failed to delete target');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      case 'TikTok': return Music;
      case 'Twitter': return Twitter;
      case 'Facebook': return Facebook;
      default: return Camera;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'from-pink-500 to-purple-500';
      case 'YouTube': return 'from-red-500 to-red-600';
      case 'TikTok': return 'from-black to-gray-800';
      case 'Twitter': return 'from-blue-400 to-blue-500';
      case 'Facebook': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20';
      case 'On Track':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20';
      case 'In Progress':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20';
      case 'Overdue':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'On Track': return TrendingUp;
      case 'In Progress': return Clock;
      case 'Overdue': return X;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTargetTypeIcon = (type: string) => {
    switch (type) {
      case 'Followers':
      case 'Subscribers': return Users;
      case 'Views': return Eye;
      case 'Likes': return Heart;
      case 'Engagement Rate': return TrendingUp;
      case 'Revenue': return DollarSign;
      default: return Target;
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
                <Target className="w-8 h-8 mr-3 text-cyan-400" />
                Social Media Targets 🎯
              </h1>
              <p className="text-slate-300 text-lg">
                Set and track your social media growth goals
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-2 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Target</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingTarget ? 'Edit Target' : 'Add New Target'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTarget(null);
                    setFormData({
                      platform: 'Instagram',
                      target_type: 'Followers',
                      current_value: 0,
                      target_value: 0,
                      target_date: '',
                      description: '',
                      priority: 'Medium',
                    });
                  }}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      required
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Facebook">Facebook</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Type
                    </label>
                    <select
                      value={formData.target_type}
                      onChange={(e) => setFormData({ ...formData, target_type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      required
                    >
                      <option value="Followers">Followers</option>
                      <option value="Subscribers">Subscribers</option>
                      <option value="Views">Views</option>
                      <option value="Likes">Likes</option>
                      <option value="Engagement Rate">Engagement Rate (%)</option>
                      <option value="Revenue">Revenue ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Value
                    </label>
                    <input
                      type="number"
                      value={formData.current_value}
                      onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      placeholder="Enter current value"
                      min="0"
                      step={formData.target_type === 'Engagement Rate' ? '0.1' : '1'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      value={formData.target_value}
                      onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      placeholder="Enter target value"
                      min={formData.current_value + 1}
                      step={formData.target_type === 'Engagement Rate' ? '0.1' : '1'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none"
                    placeholder="Describe your target and why it's important..."
                    rows={3}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingTarget ? 'Update Target' : 'Save Target'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTarget(null);
                      setFormData({
                        platform: 'Instagram',
                        target_type: 'Followers',
                        current_value: 0,
                        target_value: 0,
                        target_date: '',
                        description: '',
                        priority: 'Medium',
                      });
                    }}
                    className="px-6 py-3 bg-slate-700/30 border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Targets Grid */}
        {targets.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No targets set yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first social media target to start tracking your growth goals!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Target</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {targets.map((target) => {
              const PlatformIcon = getPlatformIcon(target.platform);
              const StatusIcon = getStatusIcon(target.status);
              const TargetTypeIcon = getTargetTypeIcon(target.target_type);
              const progress = calculateProgress(target.current_value, target.target_value);
              
              return (
                <div
                  key={target.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getPlatformColor(target.platform)} rounded-xl flex items-center justify-center shadow-lg`}>
                        <PlatformIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white flex items-center space-x-2">
                          <span>{target.platform}</span>
                          <TargetTypeIcon className="w-4 h-4 text-slate-400" />
                        </h3>
                        <p className="text-sm text-slate-400">{target.target_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(target.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {target.status}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(target.priority)}`}>
                        {target.priority}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Progress</span>
                      <span className="text-sm font-medium text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Values */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Current</p>
                      <p className="text-lg font-bold text-white">
                        {target.target_type === 'Engagement Rate' || target.target_type === 'Revenue' 
                          ? target.current_value.toFixed(target.target_type === 'Revenue' ? 0 : 1)
                          : target.current_value.toLocaleString()
                        }
                        {target.target_type === 'Engagement Rate' && '%'}
                        {target.target_type === 'Revenue' && '$'}
                      </p>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Target</p>
                      <p className="text-lg font-bold text-cyan-400">
                        {target.target_type === 'Engagement Rate' || target.target_type === 'Revenue'
                          ? target.target_value.toFixed(target.target_type === 'Revenue' ? 0 : 1)
                          : target.target_value.toLocaleString()
                        }
                        {target.target_type === 'Engagement Rate' && '%'}
                        {target.target_type === 'Revenue' && '$'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {target.description}
                    </p>
                  </div>

                  {/* Target Date */}
                  <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      Target Date: {new Date(target.target_date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(target)}
                      className="flex-1 bg-slate-700/30 border border-slate-600/30 text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-700/50 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(target.id)}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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