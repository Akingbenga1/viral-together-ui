import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { uiLogger } from './logger';
import toast from 'react-hot-toast';

// Extend Axios config to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: { startTime: number };
  }
}
import { 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  User,
  UserWithRoles,
  Role,
  Influencer, 
  CreateInfluencerData, 
  UpdateInfluencerData,
  RateCard,
  CreateRateCardData,
  SubscriptionPlan,
  CreateSubscriptionPlanData,
  UserSubscription,
  CheckoutSessionData,
  PortalSessionData,
  SocialMediaPlatform,
  Business,
  CreateBusinessData,
  CreateBusinessPublicData,
  CollaborationRequestGeneralData,
  DocumentGenerationResponse,
  Country,
  InfluencersTargets,
  CreateInfluencersTargetsData,
  InfluencerCoachingGroup,
  CreateInfluencerCoachingGroupData,
  UpdateInfluencerCoachingGroupData,
  InfluencerCoachingMember,
  JoinCoachingGroupData,
  JoinGroupResponse,
  GenerateJoinCodeResponse,
  InfluencerCoachingSession,
  CreateCoachingSessionData,
  InfluencerCoachingMessage,
  SendMessageData
} from '@/types';
import {
  GeocodeRequest,
  GeocodeResponse,
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
  LocationSearchResult,
  InfluencerLocationCreate,
  InfluencerLocationUpdate,
  InfluencerLocation,
  BusinessLocationCreate,
  BusinessLocationUpdate,
  BusinessLocation,
  NearbySearchParams,
  NearbyInfluencer,
  NearbyBusiness,
  NearbyPromotion,
  LocationPromotionRequestCreate,
  LocationPromotionRequestUpdate,
  LocationPromotionRequest,
  LocationPromotionRequestWithDetails
} from '@/types/location';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

uiLogger.logInfo('API_BASE_URL ======>', API_BASE_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token and log requests
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log API request
        const startTime = Date.now();
        config.metadata = { startTime };
        
        uiLogger.logApiRequest(
          config.method?.toUpperCase() || 'UNKNOWN',
          config.url || 'UNKNOWN',
          config.data
        );
        
        return config;
      },
      (error) => {
        uiLogger.logApiError('REQUEST', 'UNKNOWN', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors and log responses
    this.client.interceptors.response.use(
      (response) => {
        const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
        
        uiLogger.logApiResponse(
          response.config.method?.toUpperCase() || 'UNKNOWN',
          response.config.url || 'UNKNOWN',
          response.status,
          response.data,
          duration
        );
        
        return response;
      },
      (error) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || Date.now());
        
        uiLogger.logApiError(
          error.config?.method?.toUpperCase() || 'UNKNOWN',
          error.config?.url || 'UNKNOWN',
          error,
          duration
        );
        
        if (error.response?.status === 401) {
          // Clear token and show error message
          Cookies.remove('access_token');
          toast.error('Your session has expired. Please log in again.');
          
          // Use a more graceful redirect approach
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }, 1500); // Give time for toast to show
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username_or_email);
    formData.append('password', credentials.password);
    
    const response: AxiosResponse<AuthTokens> = await this.client.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async register(data: RegisterData): Promise<any> {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.post('/auth/user');
    return response.data;
  }

  // Influencer endpoints
  async getInfluencers(): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get('/influencer/list');
    return response.data;
  }

  async getInfluencer(id: number): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.get(`/influencer/get_influencer/${id}`);
    return response.data;
  }

  async getInfluencerById(id: number): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.get(`/influencer/get_influencer/${id}`);
    return response.data;
  }

  async createInfluencerPublic(data: any): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.post('/influencer/create_public', data);
    return response.data;
  }

  async createInfluencer(data: CreateInfluencerData): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.post('/influencer/create_influencer', data);
    return response.data;
  }

  async updateInfluencer(id: number, data: UpdateInfluencerData): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.put(`/influencer/update_influencer/${id}`, data);
    return response.data;
  }

  async deleteInfluencer(id: number): Promise<void> {
    await this.client.delete(`/influencer/remove_influencer/${id}`);
  }

  async setInfluencerAvailability(id: number, availability: boolean): Promise<void> {
    await this.client.put(`/influencer/set_availability/${id}/${availability}`);
  }

  async getAvailableInfluencers(): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get('/influencer/influencers/available');
    return response.data;
  }

  async searchInfluencersByLocation(location: string): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get(`/influencer/search/${location}`);
    return response.data;
  }

  async searchInfluencersByLanguage(language: string): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get(`/influencer/search_by_language/${language}`);
    return response.data;
  }

  async searchInfluencersByCriteria(criteria: {
    country_ids: number[];
    industry?: string;
    social_media_platform?: string;
  }): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.post('/influencer/search/by_criteria', criteria);
    return response.data;
  }

  async getHighGrowthInfluencers(): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get('/influencer/high_growth');
    return response.data;
  }

  async getInfluencersBySuccessfulCampaigns(campaigns: number): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get(`/influencer/successful_campaigns/${campaigns}`);
    return response.data;
  }

  async getInfluencersByRateRange(minRate: number, maxRate: number): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get(`/influencer/get_rates/${minRate}/${maxRate}`);
    return response.data;
  }

  // Rate Card endpoints
  async createRateCard(data: CreateRateCardData): Promise<RateCard> {
    const response: AxiosResponse<RateCard> = await this.client.post('/rate_card/create_rate_card', data);
    return response.data;
  }

  async getRateCard(id: number): Promise<RateCard> {
    const response: AxiosResponse<RateCard> = await this.client.get(`/rate_card/get_rate_card/${id}`);
    return response.data;
  }

  async getInfluencerRateCards(influencerId: number): Promise<RateCard[]> {
    const response: AxiosResponse<RateCard[]> = await this.client.get(`/rate_card/influencer/${influencerId}/rate_cards`);
    return response.data;
  }

  async updateRateCard(id: number, data: Partial<CreateRateCardData>): Promise<RateCard> {
    const response: AxiosResponse<RateCard> = await this.client.put(`/rate_card/update_rate_card/${id}`, data);
    return response.data;
  }

  async deleteRateCard(id: number): Promise<void> {
    await this.client.delete(`/rate_card/delete_rate_card/${id}`);
  }


  async getInfluencerRateSummary(influencerId: number): Promise<any> {
    const response = await this.client.get(`/rate_card/influencer/${influencerId}/rate_summary`);
    return response.data;
  }

  async searchRateCardsByPriceRange(minPrice: number, maxPrice: number, contentType?: string): Promise<RateCard[]> {
    const params = contentType ? `?content_type=${contentType}` : '';
    const response: AxiosResponse<RateCard[]> = await this.client.get(`/rate_card/search_rate_cards/${minPrice}/${maxPrice}${params}`);
    return response.data;
  }

  async getRateCardsByPlatform(platformId: number): Promise<RateCard[]> {
    const response: AxiosResponse<RateCard[]> = await this.client.get(`/rate_card/platform/${platformId}/rate_cards`);
    return response.data;
  }

  // Social Media Platform endpoints
  async getSocialMediaPlatforms(): Promise<SocialMediaPlatform[]> {
    const response: AxiosResponse<SocialMediaPlatform[]> = await this.client.get('/social-media-platforms/list');
    return response.data;
  }

  // Subscription Plan endpoints
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response: AxiosResponse<SubscriptionPlan[]> = await this.client.get('/subscription/plans');
    return response.data;
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan> {
    const response: AxiosResponse<SubscriptionPlan> = await this.client.get(`/subscription/plans/${id}`);
    return response.data;
  }

  async createSubscriptionPlan(data: CreateSubscriptionPlanData): Promise<SubscriptionPlan> {
    const response: AxiosResponse<SubscriptionPlan> = await this.client.post('/subscription/plans', data);
    return response.data;
  }

  async updateSubscriptionPlan(id: number, data: Partial<CreateSubscriptionPlanData>): Promise<SubscriptionPlan> {
    const response: AxiosResponse<SubscriptionPlan> = await this.client.put(`/subscription/plans/${id}`, data);
    return response.data;
  }

  // User Subscription endpoints
  async createCheckoutSession(data: CheckoutSessionData): Promise<{ url: string }> {
    const response = await this.client.post('/user_subscription/checkout', data);
    
    // Backend returns different formats for success/error
    if (response.data.error) {
      // Error response format: { error: string, details: string }
      throw new Error(response.data.error);
    } else if (response.data.checkout_url) {
      // Success response format: { checkout_url: string, status: string, error: null }
      return { url: response.data.checkout_url };
    } else {
      throw new Error('Invalid response format from server');
    }
  }

  async createPortalSession(data: PortalSessionData): Promise<{ url: string }> {
    const response = await this.client.post('/user_subscription/portal', data);
    return response.data;
  }

  async getMySubscription(): Promise<UserSubscription> {
    const response: AxiosResponse<UserSubscription> = await this.client.get('/user_subscription/my-subscription');
    return response.data;
  }

  async getAllSubscriptions(): Promise<UserSubscription[]> {
    const response: AxiosResponse<UserSubscription[]> = await this.client.get('/user_subscription/subscriptions');
    return response.data;
  }

  async getUserSubscriptions(userId: number): Promise<UserSubscription[]> {
    const response: AxiosResponse<UserSubscription[]> = await this.client.get(`/user_subscription/get_user_subscriptions/${userId}`);
    return response.data;
  }

  async cancelSubscription(subscriptionId: number): Promise<{
    success: boolean;
    message: string;
    subscription_id: number;
    status: string;
    user_id: number;
    stripe_subscription_id?: string;
  }> {
    const response = await this.client.post(`/user_subscription/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  }

  // Business endpoints
  async createBusiness(data: CreateBusinessData): Promise<Business> {
    const response: AxiosResponse<Business> = await this.client.post('/business/create', data);
    return response.data;
  }

  async createBusinessPublic(data: CreateBusinessPublicData): Promise<Business> {
    const response: AxiosResponse<Business> = await this.client.post('/business/create_public', data);
    return response.data;
  }

  async getBusiness(id: number): Promise<Business> {
    const response: AxiosResponse<Business> = await this.client.get(`/business/get_business_by_id/${id}`);
    return response.data;
  }

  async updateBusiness(id: number, data: Partial<CreateBusinessData>): Promise<Business> {
    const response: AxiosResponse<Business> = await this.client.put(`/business/${id}`, data);
    return response.data;
  }

  async deleteBusiness(id: number): Promise<void> {
    await this.client.delete(`/business/${id}`);
  }

  async getAllBusinesses(): Promise<Business[]> {
    const response: AxiosResponse<Business[]> = await this.client.get('/business/get_all');
    return response.data;
  }

  // Document generation endpoints
  async generateCollaborationRequestGeneral(data: CollaborationRequestGeneralData): Promise<DocumentGenerationResponse> {
    const response: AxiosResponse<DocumentGenerationResponse> = await this.client.post('/documents/generate-collaboration-request-general', data);
    return response.data;
  }

  async generateMarketAnalysisPublic(data: any): Promise<DocumentGenerationResponse> {
    const response: AxiosResponse<DocumentGenerationResponse> = await this.client.post('/documents/generate-market-analysis-public', data);
    return response.data;
  }

  async generateSocialMediaPlanPublic(data: any): Promise<DocumentGenerationResponse> {
    const response: AxiosResponse<DocumentGenerationResponse> = await this.client.post('/documents/generate-social-media-plan-public', data);
    return response.data;
  }

  async generateBusinessPlanPublic(data: any): Promise<DocumentGenerationResponse> {
    const response: AxiosResponse<DocumentGenerationResponse> = await this.client.post('/documents/generate-business-plan-public', data);
    return response.data;
  }

  async checkDocumentStatus(documentId: number): Promise<any> {
    const response = await this.client.get(`/documents/${documentId}/status`);
    return response.data;
  }

  async downloadDocument(documentId: number): Promise<Blob> {
    const response = await this.client.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Countries endpoints
  async getCountries(search?: string, region?: string, limit?: number): Promise<Country[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (region) params.append('region', region);
    if (limit) params.append('limit', limit.toString());
    
    const response: AxiosResponse<Country[]> = await this.client.get(`/api/countries?${params}`);
    return response.data;
  }

  async getRegions(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.client.get('/api/countries/regions');
    return response.data;
  }

  async getCountry(id: number): Promise<Country> {
    const response: AxiosResponse<Country> = await this.client.get(`/api/countries/${id}`);
    return response.data;
  }

  // Blog endpoints
  async createBlog(data: {
    author_id: number;
    topic: string;
    description?: string;
    body: string;
    images?: string[];
    cover_image_url?: string;
  }): Promise<any> {
    const response = await this.client.post('/blog/create', data);
    return response.data;
  }

  async updateBlog(id: number, data: Partial<{
    topic: string;
    description: string;
    body: string;
    images: string[];
    cover_image_url: string;
  }>): Promise<any> {
    const response = await this.client.put(`/blog/update/${id}`, data);
    return response.data;
  }

  async getBlogs(): Promise<any[]> {
    const response = await this.client.get('/blog/blogs');
    return response.data;
  }

  async getBlogBySlug(slug: string): Promise<any> {
    const response = await this.client.get(`/blog/blogs/${slug}`);
    return response.data;
  }

  async getBlogsAdmin(): Promise<any[]> {
    const response = await this.client.get('/blog/admin/blogs');
    return response.data;
  }

  async deleteBlog(id: number): Promise<void> {
    await this.client.delete(`/blog/delete/${id}`);
  }

  // Generic HTTP methods for custom endpoints
  async get(url: string, config?: any): Promise<any> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: any): Promise<any> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Role management endpoints
  async getUserRoles(userId: number): Promise<Role[]> {
    const response = await this.client.get(`/role-management/users/${userId}/roles`);
    return response.data;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<any> {
    const response = await this.client.post(`/role-management/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<any> {
    const response = await this.client.delete(`/role-management/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  async getAllRoles(): Promise<Role[]> {
    const response = await this.client.get('/role-management/roles');
    return response.data;
  }

  async getAllUsersWithRoles(): Promise<UserWithRoles[]> {
    const response = await this.client.get('/role-management/users');
    return response.data;
  }

  async getUserById(userId: number): Promise<UserWithRoles> {
    const response = await this.client.get(`/role-management/users/${userId}`);
    return response.data;
  }

  // Admin user profile management endpoints
  async adminGetAllUsers(): Promise<UserWithRoles[]> {
    const response = await this.client.get('/admin/users');
    return response.data;
  }

  async adminUpdateUserProfile(userId: number, profileData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile_number?: string;
    username?: string;
    new_password?: string;
    confirm_password?: string;
  }): Promise<any> {
    const response = await this.client.put(`/admin/users/${userId}/profile_update`, profileData);
    return response.data;
  }

  async adminGetUserProfile(userId: number): Promise<any> {
    const response = await this.client.get(`/admin/users/${userId}/profile`);
    return response.data;
  }

  // User profile management endpoints
  async updateUserProfile(profileData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
  }): Promise<any> {
    const response = await this.client.put('/user/profile/update', profileData);
    return response.data;
  }

  async updateUserPassword(passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<any> {
    const response = await this.client.put('/user/profile/password', passwordData);
    return response.data;
  }

  async getUserProfile(): Promise<any> {
    const response = await this.client.get('/user/profile');
    return response.data;
  }

  // Influencer targets endpoints
  async saveInfluencerTargets(targets: CreateInfluencersTargetsData): Promise<InfluencersTargets> {
    const response = await this.client.post('/api/v1/influencers-targets/', targets);
    return response.data;
  }

  async getInfluencerTargets(): Promise<InfluencersTargets[]> {
    const response = await this.client.get('/api/v1/influencers-targets/');
    return response.data;
  }

  // Influencer Coaching endpoints
  async createCoachingGroup(data: CreateInfluencerCoachingGroupData): Promise<InfluencerCoachingGroup> {
    const response = await this.client.post('/coaching-groups/', data);
    return response.data;
  }

  async getMyCoachingGroups(): Promise<InfluencerCoachingGroup[]> {
    const response = await this.client.get('/coaching-groups/');
    return response.data;
  }

  async getCoachingGroup(groupId: number): Promise<InfluencerCoachingGroup> {
    const response = await this.client.get(`/coaching-groups/${groupId}`);
    return response.data;
  }

  async updateCoachingGroup(groupId: number, data: UpdateInfluencerCoachingGroupData): Promise<InfluencerCoachingGroup> {
    const response = await this.client.put(`/coaching-groups/${groupId}`, data);
    return response.data;
  }

  async deleteCoachingGroup(groupId: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/coaching-groups/${groupId}`);
    return response.data;
  }

  async archiveCoachingGroup(groupId: number): Promise<{ message: string }> {
    const response = await this.client.patch(`/coaching-groups/${groupId}/archive`);
    return response.data;
  }

  async regenerateJoinCode(groupId: number): Promise<GenerateJoinCodeResponse> {
    const response = await this.client.post(`/coaching-groups/${groupId}/generate-code`);
    return response.data;
  }

  async joinCoachingGroup(data: JoinCoachingGroupData): Promise<JoinGroupResponse> {
    const response = await this.client.post('/coaching-groups/join', data);
    return response.data;
  }

  async getGroupInfoByCode(joinCode: string): Promise<any> {
    const response = await this.client.get(`/coaching-groups/info/${joinCode}`);
    return response.data;
  }

  async getJoinedCoachingGroups(): Promise<InfluencerCoachingGroup[]> {
    const response = await this.client.get('/coaching-groups/joined');
    return response.data;
  }

  async createCoachingSession(groupId: number, data: CreateCoachingSessionData): Promise<InfluencerCoachingSession> {
    const response = await this.client.post(`/coaching-groups/${groupId}/sessions`, data);
    return response.data;
  }

  async getCoachingSessions(groupId: number): Promise<InfluencerCoachingSession[]> {
    const response = await this.client.get(`/coaching-groups/${groupId}/sessions`);
    return response.data;
  }

  async sendMessage(groupId: number, data: SendMessageData): Promise<InfluencerCoachingMessage> {
    const response = await this.client.post(`/coaching-groups/${groupId}/messages`, data);
    return response.data;
  }

  async getMessages(groupId: number): Promise<InfluencerCoachingMessage[]> {
    const response = await this.client.get(`/coaching-groups/${groupId}/messages`);
    return response.data;
  }

  // AI Agents endpoints
  async getAIAgents(): Promise<any[]> {
    console.log('Making request to /ai-agents/');
    const response = await this.client.get('/ai-agents/');
    console.log('AI agents API response:', response.data);
    return response.data;
  }

  async getAIAgent(id: number): Promise<any> {
    const response = await this.client.get(`/ai-agents/${id}`);
    return response.data;
  }

  // ========================================
  // LOCATION API ENDPOINTS
  // ========================================

  // Core Location Operations
  async geocodeAddress(request: GeocodeRequest): Promise<GeocodeResponse> {
    const response = await this.client.post('/api/v1/geocode', request);
    return response.data;
  }

  async reverseGeocode(request: ReverseGeocodeRequest): Promise<ReverseGeocodeResponse> {
    const response = await this.client.post('/api/v1/reverse-geocode', request);
    return response.data;
  }

  async searchLocations(query: string, countryCode?: string, limit: number = 10): Promise<LocationSearchResult[]> {
    const params = new URLSearchParams({ query, limit: limit.toString() });
    if (countryCode) params.append('country_code', countryCode);
    const response = await this.client.get(`/api/v1/search?${params}`);
    return response.data;
  }

  // Influencer Location Management
  async addInfluencerLocation(influencerId: number, location: InfluencerLocationCreate): Promise<InfluencerLocation> {
    const response = await this.client.post(`/influencers/${influencerId}/locations`, location);
    return response.data;
  }

  async getInfluencerLocations(influencerId: number): Promise<InfluencerLocation[]> {
    const response = await this.client.get(`/influencers/${influencerId}/locations`);
    return response.data;
  }

  async updateInfluencerLocation(locationId: number, location: InfluencerLocationUpdate): Promise<InfluencerLocation> {
    const response = await this.client.put(`/influencers/locations/${locationId}`, location);
    return response.data;
  }

  async deleteInfluencerLocation(locationId: number): Promise<void> {
    await this.client.delete(`/influencers/locations/${locationId}`);
  }

  // Business Location Management
  async addBusinessLocation(businessId: number, location: BusinessLocationCreate): Promise<BusinessLocation> {
    const response = await this.client.post(`/businesses/${businessId}/locations`, location);
    return response.data;
  }

  async getBusinessLocations(businessId: number): Promise<BusinessLocation[]> {
    const response = await this.client.get(`/businesses/${businessId}/locations`);
    return response.data;
  }

  async updateBusinessLocation(locationId: number, location: BusinessLocationUpdate): Promise<BusinessLocation> {
    const response = await this.client.put(`/businesses/locations/${locationId}`, location);
    return response.data;
  }

  async deleteBusinessLocation(locationId: number): Promise<void> {
    await this.client.delete(`/businesses/locations/${locationId}`);
  }

  // Location Search (Proximity-based)
  async findInfluencersNearby(params: NearbySearchParams): Promise<NearbyInfluencer[]> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius_km: params.radius_km.toString(),
    });
    
    if (params.category) queryParams.append('category', params.category);
    if (params.min_followers) queryParams.append('min_followers', params.min_followers.toString());
    if (params.max_rate) queryParams.append('max_rate', params.max_rate.toString());
    
    const response = await this.client.get(`/api/v1/influencers/nearby?${queryParams}`);
    return response.data;
  }

  async findBusinessesNearby(params: NearbySearchParams): Promise<NearbyBusiness[]> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius_km: params.radius_km.toString(),
    });
    
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.verified_only) queryParams.append('verified_only', params.verified_only.toString());
    
    const response = await this.client.get(`/api/v1/businesses/nearby?${queryParams}`);
    return response.data;
  }

  async findPromotionsNearby(params: NearbySearchParams): Promise<NearbyPromotion[]> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius_km: params.radius_km.toString(),
    });
    
    if (params.min_budget) queryParams.append('min_budget', params.min_budget.toString());
    if (params.max_budget) queryParams.append('max_budget', params.max_budget.toString());
    
    const response = await this.client.get(`/api/v1/promotions/nearby?${queryParams}`);
    return response.data;
  }

  // Location Promotion Requests
  async createLocationPromotionRequest(request: LocationPromotionRequestCreate): Promise<LocationPromotionRequest> {
    const response = await this.client.post('/location-promotion-requests', request);
    return response.data;
  }

  async getLocationPromotionRequests(filters?: {
    business_id?: number;
    promotion_id?: number;
    country_id?: number;
    city?: string;
  }): Promise<LocationPromotionRequestWithDetails[]> {
    const params = new URLSearchParams();
    if (filters?.business_id) params.append('business_id', filters.business_id.toString());
    if (filters?.promotion_id) params.append('promotion_id', filters.promotion_id.toString());
    if (filters?.country_id) params.append('country_id', filters.country_id.toString());
    if (filters?.city) params.append('city', filters.city);
    
    const response = await this.client.get(`/location-promotion-requests?${params}`);
    return response.data;
  }

  async updateLocationPromotionRequest(requestId: number, request: LocationPromotionRequestUpdate): Promise<LocationPromotionRequest> {
    const response = await this.client.put(`/location-promotion-requests/${requestId}`, request);
    return response.data;
  }

  async deleteLocationPromotionRequest(requestId: number): Promise<void> {
    await this.client.delete(`/location-promotion-requests/${requestId}`);
  }

  // Unified Influencer Profile endpoints
  async getUnifiedInfluencerProfile(influencerId: number): Promise<any> {
    const response = await this.client.get(`/unified-influencer-profile/${influencerId}`);
    return response.data;
  }

  async getUnifiedInfluencerProfileByUserId(userId: number): Promise<any> {
    const response = await this.client.get(`/unified-influencer-profile/user/${userId}`);
    return response.data;
  }

  // Recommendations endpoints
  async triggerRecommendationAnalysis(userId: number): Promise<any> {
    const response = await this.client.post(`/recommendations/trigger-analysis/${userId}`);
    return response.data;
  }

  async generateRecommendations(userId: number): Promise<any> {
    const response = await this.client.post(`/recommendations/generate/${userId}`);
    return response.data;
  }

  async getUserRecommendations(userId: number): Promise<any[]> {
    const response = await this.client.get(`/recommendations/user/${userId}`);
    return response.data;
  }

  // Analytics endpoints
  async getUserRegistrationsByMonth(): Promise<{
    success: boolean;
    year: number;
    data: Array<{
      month: string;
      month_number: number;
      registrations: number;
    }>;
  }> {
    const response = await this.client.get('/api/analytics/user-registrations-by-month');
    return response.data;
  }

  async getBusinessRegistrationsByMonth(): Promise<{
    success: boolean;
    year: number;
    data: Array<{
      month: string;
      month_number: number;
      registrations: number;
    }>;
  }> {
    const response = await this.client.get('/api/analytics/business-registrations-by-month');
    return response.data;
  }

  async getAnalyticsSummary(): Promise<{
    success: boolean;
    data: {
      total_users: number;
      new_users_30d: number;
      total_businesses: number;
      new_businesses_30d: number;
      period: string;
    };
  }> {
    const response = await this.client.get('/api/analytics/analytics-summary');
    return response.data;
  }

  async getMonthlySubscriptionRevenue(): Promise<{
    success: boolean;
    year: number;
    data: Array<{
      month: string;
      month_number: number;
      revenue: number;
    }>;
  }> {
    const response = await this.client.get('/api/analytics/monthly-subscription-revenue');
    return response.data;
  }

}

export const apiClient = new ApiClient();
export const api = apiClient; // Alias for backward compatibility 