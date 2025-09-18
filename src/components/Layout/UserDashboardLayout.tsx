'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Search, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  TrendingUp,
  Star,
  Bell,
  User,
  Calendar,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard/user', icon: Home },
  { name: 'Profile', href: '/dashboard/user/profile', icon: User },
  { name: 'Analytics', href: '/dashboard/user/analytics', icon: BarChart3 },
  { name: 'Campaigns', href: '/dashboard/user/campaigns', icon: Calendar },
  { name: 'Notifications', href: '/dashboard/user/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/user/settings', icon: Settings },
];

const UserDashboardLayout = ({ children }: UserDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Background pattern */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 flex z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-slate-300" />
            </button>
          </div>
          
          {/* Mobile sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">User Portal</span>
            </div>
            
            <nav className="mt-8 px-2 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
                    )}
                  >
                    <item.icon className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Mobile user section */}
          <div className="flex-shrink-0 flex border-t border-slate-700/50 p-4">
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-slate-300 flex items-center transition-colors"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Fixed positioning */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-full border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
              {/* Logo section */}
              <div className="flex items-center flex-shrink-0 px-6 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <span className="text-xl font-bold text-white">User Portal</span>
                  <p className="text-xs text-slate-400 mt-1">Personal Dashboard</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
                      )}
                    >
                      <item.icon className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                      )} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* User info card */}
              <div className="px-4 mt-6">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-white">{user?.username}</p>
                      <p className="text-xs text-slate-400">Premium User</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="mt-3 w-full text-xs text-slate-400 hover:text-slate-300 flex items-center justify-center py-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - Properly positioned with margin */}
      <div className="flex flex-col flex-1 lg:ml-72 min-h-screen relative z-10">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
            <button
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-white">User Portal</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
