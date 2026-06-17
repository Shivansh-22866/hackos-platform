export type UserRole = 'participant' | 'judge' | 'organizer';
export type EventStatus = 'upcoming' | 'active' | 'closed';
export type ProjectStatus = 'not_started' | 'draft' | 'submitted';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type ReviewStatus = 'pending' | 'in_review' | 'scored';
export type NotificationType = 'announcement' | 'score_update' | 'deadline_alert' | 'registration_alert';
export type TargetType = 'broadcast' | 'team' | 'user' | 'role';

export interface User {
  id: string;
  email: string;
  name: string;
  college_or_org: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}
export interface Event {
  id: string;
  title: string;
  tagline: string;
  description: string;
  rules: string;
  eligibility_criteria: string;
  start_date: string;
  end_date: string;
  registration_open: string;
  judging_start: string;
  results_date: string;
  team_min_size: number;
  team_max_size: number;
  participant_count: number;
  status: EventStatus;
  cta_url: string;
  resources: Array<{ label: string; url: string }>;
  sponsors: Array<{ name: string; logo_url: string; tier: string }>;
}
export interface Track {
  id: string;
  event_id: string;
  name: string;
  description: string;
  problem_statement: string;
  prize_first: number;
  prize_second: number;
  prize_third: number;
}
export interface Team {
  id: string;
  event_id: string;
  track_id: string;
  leader_id: string;
  members: string[];
  invite_code: string;
  summary: string;
  created_at: string;
}
export interface Project {
  id: string;
  team_id: string;
  event_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  demo_url?: string;
  github_url?: string;
  pitch_deck_url?: string;
  video_url?: string;
  status: ProjectStatus;
  submitted_at?: string;
}
export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  team_id?: string;
  track_id: string;
  status: RegistrationStatus;
  registered_at: string;
  user?: User;
  team?: Team;
  track?: Track;
}
export interface Judge {
  id: string;
  event_id: string;
  assigned_tracks: string[];
  is_active: boolean;
  user?: User;
}
export interface JudgeScore {
  id: string;
  judge_id: string;
  project_id: string;
  innovation: number;
  technical: number;
  impact: number;
  presentation: number;
  comments?: string;
  review_status: ReviewStatus;
  scored_at?: string;
  project?: Project;
}
export interface Announcement {
  id: string;
  event_id: string;
  created_by: string;
  title: string;
  body: string;
  target_type: TargetType;
  target_id?: string;
  created_at: string;
}
export interface LeaderboardEntry {
  team_id: string;
  team_name: string;
  track_name: string;
  total_score: number;
  current_rank: number;
  previous_rank: number;
  rank_delta: number;
}
export interface SSENotification {
  type: NotificationType;
  target_type: TargetType;
  target_id?: string;
  payload: Record<string, unknown>;
  sent_at: string;
}
export interface RegistrationPersonalInfo {
  name: string;
  email: string;
  college_or_org: string;
}
export interface RegistrationTeamChoice {
  action: 'create' | 'join';
  teamName?: string;
  inviteCode?: string;
  teamId?: string;
}
