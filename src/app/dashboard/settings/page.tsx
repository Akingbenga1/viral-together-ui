'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Shield, Globe, Save, Eye, EyeOff } from 'lucide-react';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user]);

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    campaign_updates: true,
    new_messages: true,
    weekly_digest: true,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public',
    show_email: false,
    show_phone: false,
    allow_messages: true,
    allow_search: true,
  });

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.updateUserProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        username: profileForm.username,
      });
      
      // Update the user data in the auth context if the update was successful
      if (response && response.user) {
        // You might want to update the user context here
        // For now, we'll just show success
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securityForm.new_password !== securityForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (securityForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.updateUserPassword({
        current_password: securityForm.current_password,
        new_password: securityForm.new_password,
        confirm_password: securityForm.confirm_password,
      });
      
      setSecurityForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('Password changed successfully');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSettingsUpdate = async () => {
    setIsLoading(true);
    try {
      // This would need a corresponding API endpoint
      // await apiClient.updateNotificationSettings(notificationSettings);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySettingsUpdate = async () => {
    setIsLoading(true);
    try {
      // This would need a corresponding API endpoint
      // await apiClient.updatePrivacySettings(privacySettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // This would need a corresponding API endpoint
      // await apiClient.deleteAccount();
      logout();
      toast.success('Account deleted successfully');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
  ];

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1 leading-tight tracking-tight">
                      Settings ⚙️
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Manage your account settings and preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="mb-8">
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-600/30">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 ${
                      activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <span>{tab.name}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'profile' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label-dark mb-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        className="input-dark w-full text-white placeholder:text-slate-400"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="label-dark mb-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        className="input-dark w-full text-white placeholder:text-slate-400"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="label-dark mb-3">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="input-dark w-full pl-10 text-white placeholder:text-slate-400"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-dark mb-3">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="input-dark w-full font-mono tracking-wider text-white placeholder:text-slate-400"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isLoading}
                      className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-3">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Security Settings</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="label-dark mb-3">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={securityForm.current_password}
                          onChange={(e) => setSecurityForm({ ...securityForm, current_password: e.target.value })}
                          className="input-dark w-full pl-10 pr-10 text-white placeholder:text-slate-400"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="label-dark mb-3">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securityForm.new_password}
                          onChange={(e) => setSecurityForm({ ...securityForm, new_password: e.target.value })}
                          className="input-dark w-full pl-10 pr-10 text-white placeholder:text-slate-400"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="label-dark mb-3">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={securityForm.confirm_password}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirm_password: e.target.value })}
                          className="input-dark w-full pl-10 pr-10 text-white placeholder:text-slate-400"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Lock className="h-4 w-4" />
                        <span>{isLoading ? 'Updating...' : 'Change Password'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-600/30">
                    <h4 className="text-lg font-semibold text-white mb-4">Danger Zone</h4>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <p className="text-rose-200 text-sm mb-4 leading-relaxed">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-4 py-2 border border-rose-500/30 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
                  </div>
                  
                  {/* Feature Coming Soon */}
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-6">
                      <Bell className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Feature Coming Soon</h4>
                    <p className="text-slate-400 text-center max-w-md leading-relaxed">
                      We&apos;re working hard to bring you comprehensive notification settings. 
                      This feature will allow you to customize how and when you receive notifications.
                    </p>
                  </div>

                  {/* Commented out notification settings - temporarily disabled */}
                  {/*
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Email Notifications</h4>
                        <p className="text-sm text-slate-400 mt-1">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_notifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Push Notifications</h4>
                        <p className="text-sm text-slate-400 mt-1">Receive push notifications in your browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.push_notifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, push_notifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Marketing Emails</h4>
                        <p className="text-sm text-slate-400 mt-1">Receive promotional and marketing emails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.marketing_emails}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, marketing_emails: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Campaign Updates</h4>
                        <p className="text-sm text-slate-400 mt-1">Get notified about campaign status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.campaign_updates}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, campaign_updates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">New Messages</h4>
                        <p className="text-sm text-slate-400 mt-1">Get notified when you receive new messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.new_messages}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, new_messages: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Weekly Digest</h4>
                        <p className="text-sm text-slate-400 mt-1">Receive a weekly summary of your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weekly_digest}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, weekly_digest: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleNotificationSettingsUpdate}
                        disabled={isLoading}
                        className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Bell className="h-4 w-4" />
                        <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
                      </button>
                    </div>
                  </div>
                  */}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-2xl border border-slate-700/50 border-t-0 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Privacy Settings</h3>
                  </div>
                  
                  {/* Feature Coming Soon */}
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Feature Coming Soon</h4>
                    <p className="text-slate-400 text-center max-w-md leading-relaxed">
                      We&apos;re working hard to bring you comprehensive privacy settings. 
                      This feature will allow you to control your profile visibility and data sharing preferences.
                    </p>
                  </div>

                  {/* Commented out privacy settings - temporarily disabled */}
                  {/*
                  <div className="space-y-6">
                    <div>
                      <label className="label-dark mb-3">
                        Profile Visibility
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                          value={privacySettings.profile_visibility}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, profile_visibility: e.target.value })}
                          className="select-dark w-full pl-10 text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Show Email Address</h4>
                        <p className="text-sm text-slate-400 mt-1">Allow others to see your email address</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.show_email}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, show_email: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Show Phone Number</h4>
                        <p className="text-sm text-slate-400 mt-1">Allow others to see your phone number</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.show_phone}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, show_phone: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Allow Direct Messages</h4>
                        <p className="text-sm text-slate-400 mt-1">Allow other users to send you direct messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allow_messages}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, allow_messages: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Allow Search</h4>
                        <p className="text-sm text-slate-400 mt-1">Allow your profile to appear in search results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allow_search}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, allow_search: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handlePrivacySettingsUpdate}
                        disabled={isLoading}
                        className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Shield className="h-4 w-4" />
                        <span>{isLoading ? 'Saving...' : 'Save Privacy Settings'}</span>
                      </button>
                    </div>
                  </div>
                  */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}

