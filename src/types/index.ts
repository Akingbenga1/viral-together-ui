export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
  influencer_id?: number;
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username_or_email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

export interface Influencer {
  id: number;
  bio?: string;
  profile_image_url?: string;
  website_url?: string;
  languages?: string;
  availability: boolean;
  rate_per_post?: number;
  total_posts?: number;
  growth_rate?: number;
  successful_campaigns?: number;
  user: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  base_country: {
    id: number;
    name: string;
    code: string;
  };
  collaboration_countries: Array<{
    id: number;
    name: string;
    code: string;
  }>;
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
  plan?: SubscriptionPlan;
  user?: User;
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

// Business types
export interface Business {
  id: number;
  name: string;
  description: string;
  website_url?: string;
  industry: string;
  owner_id: number;
  contact_email: string;
  contact_phone: string;
  contact_name: string;
  base_country_id: number;
  collaboration_country_ids: number[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateBusinessData {
  name: string;
  description: string;
  website_url?: string;
  industry: string;
  owner_id: number;
  contact_email: string;
  contact_phone: string;
  first_name: string;
  last_name: string;
  base_country_id: number;
  collaboration_country_ids: number[];
}

export interface CreateBusinessPublicData {
  name: string;
  description: string;
  website_url?: string;
  industry: string;
  contact_email: string;
  contact_phone: string;
  first_name: string;
  last_name: string;
  username: string;
  base_country_id: number;
  collaboration_country_ids: number[];
}

// Document generation types
export interface CollaborationRequestGeneralData {
  business_id: number;
  campaign_title: string;
  campaign_description: string;
  target_audience: string;
  target_follower_range: string;
  preferred_niches: string[];
  deliverables: string[];
  compensation_range: string;
  campaign_duration: string;
  content_requirements: string;
  brand_guidelines: string;
  deadline: string;
  target_countries: string[];
  file_format: string;
}

export interface DocumentGenerationResponse {
  message: string;
  job_id: string;
  document_id: number;
  status: string;
  estimated_completion: string;
  check_status_url: string;
  download_url: string;
}

// Country types
export interface Country {
  id: number;
  name: string;
  code: string;
  code3?: string;
  numeric_code?: string;
  phone_code?: string;
  capital?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  tld?: string;
  region?: string;
  timezones?: string;
  latitude?: number;
  longitude?: number;
}

// Influencer targets types
export interface InfluencersTargets {
  id: number;
  user_id: number;
  posting_frequency?: string;
  engagement_goals?: string;
  follower_growth?: string;
  pricing?: number;
  pricing_currency: string;
  estimated_hours_per_week?: string;
  content_types?: string[];
  platform_recommendations?: string[];
  content_creation_tips?: string[];
  created_at: string;
  updated_at?: string;
}

export interface CreateInfluencersTargetsData {
  posting_frequency?: string;
  engagement_goals?: string;
  follower_growth?: string;
  pricing?: number;
  pricing_currency?: string;
  estimated_hours_per_week?: string;
  content_types?: string[];
  platform_recommendations?: string[];
  content_creation_tips?: string[];
}

// Export influencer coaching types
export * from './influencerCoaching';

// Export location types
export * from './location';