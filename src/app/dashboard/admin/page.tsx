'use client';

import { useEffect, useState } from 'react';
import { Users, Settings, Shield, BarChart3, UserPlus, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { UserWithRoles, Role } from '@/types';
import { getRoleDisplayName, getRoleColor } from '@/lib/roleUtils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user, hasRoleLevel } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!hasRoleLevel('admin')) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          apiClient.getAllUsersWithRoles(),
          apiClient.getAllRoles(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hasRoleLevel]);

  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      await apiClient.assignRoleToUser(userId, roleId);
      toast.success('Role assigned successfully');
      
      // Refresh users data
      const updatedUsers = await apiClient.getAllUsersWithRoles();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to assign role:', error);
      toast.error('Failed to assign role');
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      await apiClient.removeRoleFromUser(userId, roleId);
      toast.success('Role removed successfully');
      
      // Refresh users data
      const updatedUsers = await apiClient.getAllUsersWithRoles();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to remove role:', error);
      toast.error('Failed to remove role');
    }
  };

  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      icon: Users,
      gradient: 'from-cyan-400 to-teal-500',
      description: 'Registered users',
      change: '+12',
      changeType: 'increase',
    },
    {
      name: 'Total Roles',
      value: roles.length,
      icon: Shield,
      gradient: 'from-emerald-400 to-cyan-500',
      description: 'System roles',
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Active Users',
      value: users.filter(u => u.roles && u.roles.length > 0).length,
      icon: UserCheck,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Users with roles',
      change: '+8',
      changeType: 'increase',
    },
    {
      name: 'System Health',
      value: 'Excellent',
      icon: BarChart3,
      gradient: 'from-amber-400 to-orange-500',
      description: 'All systems operational',
      change: '100%',
      changeType: 'increase',
    },
  ];

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
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Admin Dashboard 🛡️
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  System administration and user management
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 whitespace-nowrap">System Online</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Manage Roles</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.name}
                className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group overflow-hidden min-w-0"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs lg:text-sm flex-shrink-0 ${
                      stat.changeType === 'increase' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                      <span className="font-medium whitespace-nowrap">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{stat.value}</h3>
                    <p className="text-slate-400 text-sm truncate">{stat.name}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 lg:p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-cyan-400" />
                User Management
              </h3>
              <div className="overflow-x-auto -mx-4 lg:-mx-6">
                <div className="inline-block min-w-full px-4 lg:px-6 align-middle">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                          User
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider hidden sm:table-cell min-w-0">
                          Email
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                          Roles
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-0">
                          Actions
                        </th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-3 lg:px-6 py-4">
                          <div className="flex items-center min-w-0">
                            <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
                                <span className="text-xs lg:text-sm font-bold text-white">
                                  {user.first_name?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                              <div className="text-sm font-semibold text-white leading-relaxed truncate">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-xs lg:text-sm text-slate-400 leading-relaxed truncate">
                                @{user.username}
                              </div>
                              <div className="text-xs text-slate-400 leading-relaxed truncate sm:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-sm text-slate-300 leading-relaxed hidden sm:table-cell">
                          <div className="truncate max-w-xs">{user.email}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4">
                          <div className="flex flex-wrap gap-1 lg:gap-2 max-w-xs">
                            {user.roles?.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20"
                              >
                                {getRoleDisplayName(role.name)}
                              </span>
                            ))}
                            {(!user.roles || user.roles.length === 0) && (
                              <span className="text-slate-500 text-xs px-2 py-1 lg:px-3 lg:py-1.5 bg-slate-700/30 rounded-lg">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors whitespace-nowrap"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="form-container-dark w-full max-w-md">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 leading-tight tracking-tight">
                Manage Roles - {selectedUser?.first_name} {selectedUser?.last_name}
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">Current Roles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser?.roles?.map((role) => (
                      <div key={role.id} className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20">
                          {getRoleDisplayName(role.name)}
                        </span>
                        <button
                          onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                          className="text-rose-400 hover:text-rose-300 text-sm w-6 h-6 rounded-full bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {(!selectedUser?.roles || selectedUser.roles.length === 0) && (
                      <span className="text-slate-400 text-sm px-3 py-1.5 bg-slate-700/30 rounded-lg">No roles assigned</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">Available Roles:</h4>
                  <div className="space-y-3">
                    {roles.map((role) => {
                      const hasRole = selectedUser?.roles?.some(r => r.id === role.id);
                      return (
                        <div key={role.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                          <span className="text-sm text-white font-medium">{getRoleDisplayName(role.name)}</span>
                          {!hasRole && (
                            <button
                              onClick={() => handleAssignRole(selectedUser!.id, role.id)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  className="btn-dark px-6 h-12 rounded-xl font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UnifiedDashboardLayout>
  );
}
