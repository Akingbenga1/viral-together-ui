'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { uiLogger } from '@/lib/logger';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasRoleLevel, isLoading, userRoles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't check permissions while still loading
    if (isLoading) {
      console.log('AdminLayout - Still loading, skipping access check');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('AdminLayout - No user found, redirecting to login');
      uiLogger.logWarn('Admin route access denied - user not authenticated');
      toast.error('Access denied. Please login first.');
      router.push('/auth/login');
      return;
    }

    // Wait for user roles to be loaded
    if (!userRoles || userRoles.length === 0) {
      console.log('AdminLayout - User roles not loaded yet, waiting...', {
        user: user?.username,
        userRoles,
        userRolesLength: userRoles?.length
      });
      // Don't redirect yet, wait for roles to load
      return;
    }

    // Check if user has admin or super_admin role
    const hasAdminAccess = hasRoleLevel('admin');
    
    // Debug logging
    console.log('AdminLayout - Debug info:', {
      user: user?.username,
      userId: user?.id,
      userRoles: userRoles?.map(r => r.name),
      hasAdminAccess,
      hasAdminRole: hasRoleLevel('admin'),
      hasSuperAdminRole: hasRoleLevel('super_admin'),
      isLoading
    });
    
    uiLogger.logInfo('Admin layout access check', {
      user: user?.username,
      userId: user?.id,
      userRoles: userRoles?.map(r => r.name),
      hasAdminAccess,
      hasAdminRole: hasRoleLevel('admin'),
      hasSuperAdminRole: hasRoleLevel('super_admin'),
      isLoading
    });

    if (!hasAdminAccess) {
      console.log('AdminLayout - Access denied - insufficient privileges', {
        user: user?.username,
        userRoles: userRoles?.map(r => r.name),
        hasAdminAccess
      });
      
      uiLogger.logWarn('Admin route access denied - insufficient privileges', {
        user: user?.username,
        userRoles: userRoles?.map(r => r.name),
        hasAdminAccess
      });
      
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }

    console.log('AdminLayout - Access granted successfully');
    uiLogger.logInfo('Admin route accessed successfully', {
      user: user?.username,
      userId: user?.id,
      userRoles: userRoles?.map(r => r.name)
    });
  }, [user, hasRoleLevel, isLoading, userRoles, router]);

  // Show loading while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user doesn't have admin access
  // Wait for roles to be loaded before making final decision
  if (!user || isLoading || (!userRoles || userRoles.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading user permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasRoleLevel('admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-300">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
