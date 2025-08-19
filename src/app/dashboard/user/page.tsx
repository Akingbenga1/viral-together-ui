'use client';

import { useEffect, useState } from 'react';
import { User, Settings, Bell, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

export default function UserDashboardPage() {
  const { user, userRoles } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    // Simulate fetching user stats
    setStats({
      totalCampaigns: 12,
      activeCampaigns: 3,
      completedCampaigns: 9,
      totalEarnings: 2500,
    });
  }, []);

  const statCards = [
    {
      name: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'All time campaigns',
    },
    {
      name: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Bell,
      color: 'bg-green-500',
      description: 'Currently running',
    },
    {
      name: 'Completed',
      value: stats.completedCampaigns,
      icon: User,
      color: 'bg-purple-500',
      description: 'Successfully finished',
    },
    {
      name: 'Total Earnings',
      value: `$${stats.totalEarnings}`,
      icon: Settings,
      color: 'bg-orange-500',
      description: 'All time earnings',
    },
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                User Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.first_name || user?.username}! Here's your activity overview.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
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
                        <dd className="text-sm text-gray-500">
                          {stat.description}
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

          {/* User Roles */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Roles</h3>
              <div className="flex flex-wrap gap-2">
                {userRoles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {role.name}
                  </span>
                ))}
                {userRoles.length === 0 && (
                  <span className="text-gray-500">No roles assigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">View Profile</h4>
                  <p className="text-sm text-gray-500">Update your information</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Browse Campaigns</h4>
                  <p className="text-sm text-gray-500">Find new opportunities</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <h4 className="font-medium text-gray-900">Settings</h4>
                  <p className="text-sm text-gray-500">Manage your preferences</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
