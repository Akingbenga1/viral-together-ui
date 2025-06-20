export interface User {
  id: number;
  username: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export interface Influencer {
  id: number;
  name?: string;
  bio: string;
  profile_image_url: string;
  website_url?: string;
  location: string;
  languages: string;
  availability: boolean;
  rate_per_post: number;
  total_posts: number;
  growth_rate: number;
  successful_campaigns: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateInfluencerData {
  bio: string;
  profile_image_url: string;
  website_url?: string;
  location: string;
  languages: string;
  availability: boolean;
  rate_per_post: number;
  total_posts: number;
  growth_rate: number;
  successful_campaigns: number;
  user_id: number;
}

export interface UpdateInfluencerData {
  name?: string;
  bio?: string;
  profile_image_url?: string;
  website_url?: string;
  location?: string;
  languages?: string;
  availability?: boolean;
  rate_per_post?: number;
  total_posts?: number;
  growth_rate?: number;
  successful_campaigns?: number;
}

export interface RateCard {
  id: number;
  influencer_id: number;
  content_type: string;
  base_rate: number;
  audience_size_multiplier: number;
  engagement_rate_multiplier: number;
  exclusivity_fee: number;
  usage_rights_fee: number;
  revision_fee: number;
  rush_fee: number;
  description: string;
  platform_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRateCardData {
  influencer_id: number;
  content_type: string;
  base_rate: number;
  audience_size_multiplier: number;
  engagement_rate_multiplier: number;
  exclusivity_fee: number;
  usage_rights_fee: number;
  revision_fee: number;
  rush_fee: number;
  description: string;
  platform_id: number;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  uuid: string;
  tier: string;
  price_per_month: number;
  billing_cycle: string;
  is_active: boolean;
  price_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubscriptionPlanData {
  name: string;
  uuid: string;
  tier: string;
  price_per_month: number;
  billing_cycle: string;
  is_active: boolean;
  price_id: string;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at?: string;
  updated_at?: string;
}

export interface CheckoutSessionData {
  plan_id: number;
  success_url: string;
  cancel_url: string;
}

export interface PortalSessionData {
  return_url: string;
}

export interface SearchFilters {
  location?: string;
  language?: string;
  minRate?: number;
  maxRate?: number;
  minGrowthRate?: number;
  minSuccessfulCampaigns?: number;
  availability?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 

export interface SocialMediaPlatform {
  id: number;
  name: string;
  icon_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
} 