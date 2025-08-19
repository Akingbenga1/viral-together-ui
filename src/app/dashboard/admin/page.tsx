'use client';

import { useEffect, useState } from 'react';
import { Users, Settings, Shield, BarChart3, UserPlus, UserCheck } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
      color: 'bg-blue-500',
    },
    {
      name: 'Total Roles',
      value: roles.length,
      icon: Shield,
      color: 'bg-green-500',
    },
    {
      name: 'Active Users',
      value: users.filter(u => u.roles && u.roles.length > 0).length,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'System Health',
      value: 'Good',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white shadow rounded-lg p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Admin Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                System administration and user management
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowRoleModal(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Roles
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className={`${stat.color} px-5 py-3`}>
                  <div className="text-sm">
                    <span className="text-white">View details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.first_name?.[0] || user.username[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <span
                                  key={role.id}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}
                                >
                                  {getRoleDisplayName(role.name)}
                                </span>
                              ))}
                              {(!user.roles || user.roles.length === 0) && (
                                <span className="text-gray-500 text-xs">No roles</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Manage Roles
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Manage Roles - {selectedUser?.first_name} {selectedUser?.last_name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Roles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser?.roles?.map((role) => (
                      <div key={role.id} className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                          {getRoleDisplayName(role.name)}
                        </span>
                        <button
                          onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {(!selectedUser?.roles || selectedUser.roles.length === 0) && (
                      <span className="text-gray-500 text-sm">No roles assigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Roles:</h4>
                  <div className="space-y-2">
                    {roles.map((role) => {
                      const hasRole = selectedUser?.roles?.some(r => r.id === role.id);
                      return (
                        <div key={role.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{getRoleDisplayName(role.name)}</span>
                          {!hasRole && (
                            <button
                              onClick={() => handleAssignRole(selectedUser!.id, role.id)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
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

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
