'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Copy, ExternalLink, Edit, Trash2, Eye } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { 
  InfluencerCoachingGroup, 
  CreateInfluencerCoachingGroupData,
  JoinGroupResponse 
} from '@/types';

export default function CoachingDashboard() {
  const [groups, setGroups] = useState<InfluencerCoachingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateInfluencerCoachingGroupData>({
    name: '',
    description: '',
    is_paid: false,
    price: undefined,
    currency: 'USD',
    max_members: undefined
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyCoachingGroups();
      setGroups(response);
    } catch (error) {
      console.error('Error loading coaching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGroup = await apiClient.createCoachingGroup(formData);
      setGroups([...groups, newGroup]);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        is_paid: false,
        price: undefined,
        currency: 'USD',
        max_members: undefined
      });
    } catch (error) {
      console.error('Error creating coaching group:', error);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.joinCoachingGroup({
        join_code: joinCode,
        payment_reference: undefined
      });
      setJoinMessage(response.message);
      if (response.success) {
        setShowJoinForm(false);
        setJoinCode('');
        // Reload groups to show the new membership
        loadGroups();
      }
    } catch (error) {
      console.error('Error joining coaching group:', error);
      setJoinMessage('Failed to join group. Please check the code and try again.');
    }
  };

  const copyToClipboard = async (text: string, code: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateInviteLink = (joinCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/dashboard/coaching/join?code=${joinCode}`;
  };

  if (loading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded-xl w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
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
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Influencer Coaching 🎯
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Create coaching groups and help other influencers grow their presence
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">
                      {groups.length} Group{groups.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Group</span>
                  </button>
                  <button
                    onClick={() => setShowJoinForm(true)}
                    className="btn-dark px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                  >
                    <Users className="w-4 h-4" />
                    <span>Join Group</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{group.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    group.is_active 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {group.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {group.description && (
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{group.description}</p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Members:</span>
                    <span className="font-medium text-white">
                      {group.current_members}
                      {group.max_members && ` / ${group.max_members}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type:</span>
                    <span className={`font-medium ${
                      group.is_paid ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {group.is_paid ? 'Paid' : 'Free'}
                    </span>
                  </div>

                  {group.is_paid && group.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Price:</span>
                      <span className="font-medium text-white">
                        ${group.price} {group.currency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Join Code Section */}
                <div className="border-t border-slate-600/30 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Join Code:</span>
                    <button
                      onClick={() => copyToClipboard(group.join_code, group.join_code)}
                      className="text-cyan-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl px-4 py-3 mb-4 border border-slate-600/30">
                    <code className="text-sm font-mono text-cyan-400">{group.join_code}</code>
                    {copiedCode === group.join_code && (
                      <span className="ml-2 text-xs text-emerald-400 font-medium">Copied!</span>
                    )}
                  </div>

                  {/* Invite Link */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Invite Link:</span>
                    <button
                      onClick={() => copyToClipboard(generateInviteLink(group.join_code), `link-${group.id}`)}
                      className="text-cyan-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl px-4 py-3 text-xs text-slate-300 truncate border border-slate-600/30">
                    {generateInviteLink(group.join_code)}
                    {copiedCode === `link-${group.id}` && (
                      <span className="ml-2 text-xs text-emerald-400 font-medium">Copied!</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-600/30">
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-colors font-medium">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-slate-700/50 text-slate-300 border border-slate-600/30 rounded-xl hover:bg-slate-700/70 transition-colors font-medium">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/30 transition-colors font-medium">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {groups.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No coaching groups yet</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                Create your first coaching group to start helping other influencers grow their presence
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Group</span>
              </button>
            </div>
          )}

        {/* Create Group Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="form-container-dark w-full max-w-md">
              <h2 className="text-xl font-semibold text-form-text mb-6">Create Coaching Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-dark">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-dark"
                    placeholder="Enter group name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="label-dark">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="textarea-dark"
                    placeholder="Describe your coaching group..."
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="is_paid"
                    checked={formData.is_paid}
                    onChange={(e) => setFormData({...formData, is_paid: e.target.checked})}
                    className="checkbox-dark mt-0.5"
                  />
                  <label htmlFor="is_paid" className="text-sm text-form-text leading-5 cursor-pointer">
                    This is a paid coaching group
                  </label>
                </div>

                {formData.is_paid && (
                  <div className="space-y-2">
                    <label className="label-dark">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || undefined})}
                      className="input-dark"
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="label-dark">
                    Max Members (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_members || ''}
                    onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value) || undefined})}
                    className="input-dark"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn-dark-primary flex-1 h-12 rounded-xl font-medium"
                  >
                    Create Group
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-dark flex-1 h-12 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Join Group Modal */}
        {showJoinForm && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="form-container-dark w-full max-w-md">
              <h2 className="text-xl font-semibold text-form-text mb-6">Join Coaching Group</h2>
              <form onSubmit={handleJoinGroup} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-dark">
                    Join Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="input-dark font-mono tracking-wider"
                    placeholder="Enter the join code"
                  />
                </div>

                {joinMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${
                    joinMessage.includes('Failed') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {joinMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn-dark-primary flex-1 h-12 rounded-xl font-medium"
                  >
                    Join Group
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinForm(false);
                      setJoinCode('');
                      setJoinMessage('');
                    }}
                    className="btn-dark flex-1 h-12 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
