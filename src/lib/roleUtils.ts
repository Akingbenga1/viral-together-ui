import { Role, User } from '@/types';

// Role hierarchy - higher numbers mean more privileges
export const ROLE_HIERARCHY = {
  'user': 1,
  'influencer': 2,
  'business': 2,
  'professional_influencer': 3,
  'business_influencer': 4,
  'moderator': 5,
  'admin': 6,
  'super_admin': 7
} as const;

// Dashboard route mapping based on highest role
export const ROLE_DASHBOARD_MAP = {
  'user': '/dashboard/user',
  'influencer': '/dashboard/influencer',
  'business': '/dashboard/business',
  'professional_influencer': '/dashboard/influencer',
  'business_influencer': '/dashboard/business-influencer',
  'moderator': '/dashboard/moderator',
  'admin': '/dashboard/admin',
  'super_admin': '/dashboard/admin'
} as const;

/**
 * Get the highest role for a user based on role hierarchy
 */
export function getHighestRole(userRoles: Role[]): string {
  if (!userRoles || userRoles.length === 0) {
    return 'user';
  }

  return userRoles.reduce((highest, role) => {
    const currentLevel = ROLE_HIERARCHY[role.name as keyof typeof ROLE_HIERARCHY] || 0;
    const highestLevel = ROLE_HIERARCHY[highest as keyof typeof ROLE_HIERARCHY] || 0;
    return currentLevel > highestLevel ? role.name : highest;
  }, 'user');
}

/**
 * Get the appropriate dashboard path for a user based on their highest role
 */
export function getDashboardPath(user: User | null): string {
  if (!user || !user.roles) {
    return '/dashboard/user';
  }

  const highestRole = getHighestRole(user.roles);
  return ROLE_DASHBOARD_MAP[highestRole as keyof typeof ROLE_DASHBOARD_MAP] || '/dashboard/user';
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.some(role => role.name === roleName);
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roleNames: string[]): boolean {
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.some(role => roleNames.includes(role.name));
}

/**
 * Check if a user has sufficient role level for a required role
 */
export function hasRoleLevel(user: User | null, requiredRole: string): boolean {
  if (!user || !user.roles) {
    return false;
  }

  const userHighestRole = getHighestRole(user.roles);
  const userLevel = ROLE_HIERARCHY[userHighestRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Get role display name for UI
 */
export function getRoleDisplayName(roleName: string): string {
  const displayNames: Record<string, string> = {
    'user': 'User',
    'influencer': 'Influencer',
    'business': 'Business',
    'professional_influencer': 'Professional Influencer',
    'business_influencer': 'Business Influencer',
    'moderator': 'Moderator',
    'admin': 'Administrator',
    'super_admin': 'Super Administrator'
  };
  return displayNames[roleName] || roleName;
}

/**
 * Get role description for UI
 */
export function getRoleDescription(roleName: string): string {
  const descriptions: Record<string, string> = {
    'user': 'Basic user with standard permissions',
    'influencer': 'Content creator with influencer capabilities',
    'business': 'Business account with commercial permissions',
    'professional_influencer': 'Verified influencer with expanded capabilities',
    'business_influencer': 'Business account with influencer capabilities',
    'moderator': 'User with content management permissions',
    'admin': 'User with administrative permissions',
    'super_admin': 'User with full system control'
  };
  return descriptions[roleName] || 'No description available';
}

/**
 * Get role color for UI badges
 */
export function getRoleColor(roleName: string): string {
  const colors: Record<string, string> = {
    'user': 'bg-gray-100 text-gray-800',
    'influencer': 'bg-blue-100 text-blue-800',
    'business': 'bg-green-100 text-green-800',
    'professional_influencer': 'bg-purple-100 text-purple-800',
    'business_influencer': 'bg-indigo-100 text-indigo-800',
    'moderator': 'bg-yellow-100 text-yellow-800',
    'admin': 'bg-red-100 text-red-800',
    'super_admin': 'bg-black text-white'
  };
  return colors[roleName] || 'bg-gray-100 text-gray-800';
}
