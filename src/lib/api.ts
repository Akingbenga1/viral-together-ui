import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
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
  SocialMediaPlatform
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          Cookies.remove('access_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
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

  // Influencer endpoints
  async getInfluencers(): Promise<Influencer[]> {
    const response: AxiosResponse<Influencer[]> = await this.client.get('/influencer/list');
    return response.data;
  }

  async getInfluencer(id: number): Promise<Influencer> {
    const response: AxiosResponse<Influencer> = await this.client.get(`/influencer/get_influencer/${id}`);
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
    const response: AxiosResponse<SocialMediaPlatform[]> = await this.client.get('/social_media_platform/list');
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
    return response.data;
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
    const response: AxiosResponse<UserSubscription[]> = await this.client.get(`/user_subscription/users/${userId}/subscriptions`);
    return response.data;
  }
}

export const apiClient = new ApiClient(); 