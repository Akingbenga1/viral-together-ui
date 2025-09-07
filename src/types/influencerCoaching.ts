// Influencer Coaching Types

export interface InfluencerCoachingGroup {
  id: number;
  coach_influencer_id: number;
  name: string;
  description?: string;
  is_paid: boolean;
  price?: number;
  currency: string;
  max_members?: number;
  current_members: number;
  join_code: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateInfluencerCoachingGroupData {
  name: string;
  description?: string;
  is_paid: boolean;
  price?: number;
  currency?: string;
  max_members?: number;
}

export interface UpdateInfluencerCoachingGroupData {
  name?: string;
  description?: string;
  is_paid?: boolean;
  price?: number;
  currency?: string;
  max_members?: number;
  is_active?: boolean;
}

export interface InfluencerCoachingMember {
  id: number;
  group_id: number;
  member_influencer_id: number;
  joined_at: string;
  is_active: boolean;
  payment_status: 'pending' | 'paid' | 'free';
  payment_reference?: string;
}

export interface JoinCoachingGroupData {
  join_code: string;
  payment_reference?: string;
}

export interface JoinGroupResponse {
  success: boolean;
  message: string;
  group?: InfluencerCoachingGroup;
  member?: InfluencerCoachingMember;
}

export interface GenerateJoinCodeResponse {
  join_code: string;
  group_id: number;
  message: string;
}

export interface InfluencerCoachingSession {
  id: number;
  group_id: number;
  title: string;
  description?: string;
  session_date: string;
  duration_minutes?: number;
  meeting_link?: string;
  recording_url?: string;
  materials?: string[];
  is_completed: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCoachingSessionData {
  group_id: number;
  title: string;
  description?: string;
  session_date: string;
  duration_minutes?: number;
  meeting_link?: string;
  recording_url?: string;
  materials?: string[];
}

export interface UpdateCoachingSessionData {
  title?: string;
  description?: string;
  session_date?: string;
  duration_minutes?: number;
  meeting_link?: string;
  recording_url?: string;
  materials?: string[];
  is_completed?: boolean;
}

export interface InfluencerCoachingMessage {
  id: number;
  group_id: number;
  sender_influencer_id: number;
  message: string;
  message_type: 'text' | 'file' | 'image' | 'video';
  file_url?: string;
  is_announcement: boolean;
  created_at: string;
}

export interface SendMessageData {
  group_id: number;
  message: string;
  message_type?: 'text' | 'file' | 'image' | 'video';
  file_url?: string;
  is_announcement?: boolean;
}

// Extended types for UI components
export interface CoachingGroupWithMembers extends InfluencerCoachingGroup {
  members: InfluencerCoachingMember[];
}

export interface CoachingGroupWithSessions extends InfluencerCoachingGroup {
  sessions: InfluencerCoachingSession[];
}

export interface CoachingGroupWithMessages extends InfluencerCoachingGroup {
  messages: InfluencerCoachingMessage[];
}

// UI State types
export interface CoachingGroupFormData {
  name: string;
  description: string;
  is_paid: boolean;
  price: string;
  currency: string;
  max_members: string;
}

export interface JoinGroupFormData {
  join_code: string;
  payment_reference: string;
}

export interface SessionFormData {
  title: string;
  description: string;
  session_date: string;
  session_time: string;
  duration_minutes: string;
  meeting_link: string;
}

export interface MessageFormData {
  message: string;
  message_type: 'text' | 'file' | 'image' | 'video';
  file_url: string;
  is_announcement: boolean;
}
