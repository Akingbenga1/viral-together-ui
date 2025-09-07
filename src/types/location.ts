// Location-related TypeScript interfaces for the UI

export interface LocationBase {
  city_name: string;
  region_name?: string;
  region_code?: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  postcode?: string;
  time_zone?: string;
  is_primary: boolean;
}

export interface InfluencerLocationCreate extends LocationBase {}

export interface InfluencerLocationUpdate extends LocationBase {}

export interface InfluencerLocation extends LocationBase {
  id: number;
  influencer_id: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessLocationCreate extends LocationBase {}

export interface BusinessLocationUpdate extends LocationBase {}

export interface BusinessLocation extends LocationBase {
  id: number;
  business_id: number;
  created_at: string;
  updated_at: string;
}

export interface GeocodeRequest {
  address: string;
  country_code?: string;
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  display_name: string;
  city?: string;
  region?: string;
  country?: string;
  postcode?: string;
  country_code?: string;
}

export interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodeResponse {
  display_name: string;
  city?: string;
  region?: string;
  country?: string;
  postcode?: string;
  country_code?: string;
}

export interface LocationSearchRequest {
  query: string;
  country_code?: string;
  limit?: number;
}

export interface LocationSearchResult {
  display_name: string;
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
}

export interface LocationPromotionRequestBase {
  latitude: number;
  longitude: number;
  country_id?: number;
  city?: string;
  region_name?: string;
  region_code?: string;
  postcode?: string;
  time_zone?: string;
  radius_km: number;
}

export interface LocationPromotionRequestCreate extends LocationPromotionRequestBase {
  business_id: number;
  promotion_id: number;
}

export interface LocationPromotionRequestUpdate extends LocationPromotionRequestBase {}

export interface LocationPromotionRequest extends LocationPromotionRequestBase {
  id: number;
  business_id: number;
  promotion_id: number;
  created_at: string;
  updated_at: string;
}

export interface LocationPromotionRequestWithDetails extends LocationPromotionRequest {
  business_name?: string;
  promotion_title?: string;
  country_name?: string;
  distance_km?: number;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius_km: number;
  category?: string;
  min_followers?: number;
  max_rate?: number;
  industry?: string;
  verified_only?: boolean;
  min_budget?: number;
  max_budget?: number;
}

export interface NearbyInfluencer {
  influencer: any; // Will use existing Influencer type
  location: InfluencerLocation;
  distance_km: number;
}

export interface NearbyBusiness {
  business: any; // Will use existing Business type
  location: BusinessLocation;
  distance_km: number;
}

export interface NearbyPromotion {
  request: LocationPromotionRequest;
  business: any; // Will use existing Business type
  promotion: any; // Will use existing Promotion type
  distance_km: number;
}
