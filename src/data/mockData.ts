import type { User, Event, Track, Team, Project, Registration, Judge, JudgeScore, Announcement, LeaderboardEntry } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'alice@mit.edu', name: 'Alice Johnson', college_or_org: 'MIT', role: 'participant', created_at: '2026-05-01T10:00:00Z' },
  { id: 'user-2', email: 'bob@stanford.edu', name: 'Bob Smith', college_or_org: 'Stanford', role: 'participant', created_at: '2026-05-02T10:00:00Z' },
  { id: 'user-3', email: 'carol@hackos.io', name: 'Dr. Carol Davis', college_or_org: 'HackOS Committee', role: 'judge', created_at: '2026-04-15T10:00:00Z' },
  { id: 'user-4', email: 'dave@hackos.io', name: 'Dave Wilson', college_or_org: 'HackOS', role: 'organizer', created_at: '2026-03-01T10:00:00Z' },
  { id: 'user-5', email: 'charlie@berkeley.edu', name: 'Charlie Chen', college_or_org: 'UC Berkeley', role: 'participant', created_at: '2026-05-03T10:00:00Z' },
  { id: 'user-6', email: 'diana@cmu.edu', name: 'Diana Park', college_or_org: 'Carnegie Mellon', role: 'participant', created_at: '2026-05-04T10:00:00Z' },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1', title: 'HackOS 2026', tagline: 'Build the future, one commit at a time.',
    description: 'HackOS 2026 is the premier hackathon for student developers, designers, and innovators. Over 48 hours, teams compete across three tracks — AI/ML, Web3, and Open Innovation — for $50,000 in prizes and mentorship from industry leaders.',
    rules: 'Teams must consist of 2–4 members.\nAll code must be written during the hackathon.\nOpen-source libraries and APIs are permitted.\nProjects must be submitted before the deadline.',
    eligibility_criteria: 'Open to all students enrolled in any college or university worldwide, or graduates within the last 12 months.',
    start_date: '2026-07-10T09:00:00Z', end_date: '2026-07-12T09:00:00Z',
    registration_open: '2026-06-01T00:00:00Z', judging_start: '2026-07-12T10:00:00Z', results_date: '2026-07-12T18:00:00Z',
    team_min_size: 2, team_max_size: 4, participant_count: 847, status: 'active', cta_url: '/register/event-1',
    resources: [{ label: 'Starter Kit', url: '#' }, { label: 'API Docs', url: '#' }, { label: 'Figma Design System', url: '#' }, { label: 'Discord', url: '#' }],
    sponsors: [{ name: 'TechCorp', logo_url: '', tier: 'platinum' }, { name: 'InnovateLabs', logo_url: '', tier: 'gold' }, { name: 'StartupHub', logo_url: '', tier: 'gold' }, { name: 'DevTools Inc', logo_url: '', tier: 'silver' }, { name: 'CloudBase', logo_url: '', tier: 'silver' }, { name: 'DataStream', logo_url: '', tier: 'bronze' }],
  },
  {
    id: 'event-2', title: 'HackOS Mini — Climate Tech', tagline: 'Code for the planet.',
    description: 'A focused 24-hour sprint on climate technology solutions. Build tools for carbon tracking, renewable energy optimization, or sustainable agriculture.',
    rules: 'Teams of 1–3 members.\nTheme: Climate & Sustainability (mandatory).\nMust include a working demo.',
    eligibility_criteria: 'Open to all — students, professionals, and enthusiasts welcome.',
    start_date: '2026-08-15T09:00:00Z', end_date: '2026-08-16T09:00:00Z',
    registration_open: '2026-07-20T00:00:00Z', judging_start: '2026-08-16T10:00:00Z', results_date: '2026-08-16T16:00:00Z',
    team_min_size: 1, team_max_size: 3, participant_count: 212, status: 'upcoming', cta_url: '/register/event-2',
    resources: [], sponsors: [{ name: 'GreenVentures', logo_url: '', tier: 'platinum' }],
  },
  {
    id: 'event-3', title: 'HackOS Healthcare', tagline: 'Technology meets care.',
    description: 'Build digital health solutions with real impact. Patient monitoring, mental health apps, and medical data analysis. 534 participants, 89 projects submitted.',
    rules: 'Teams of 2–5 members.\nSolutions must be HIPAA-compliant in design.\nNo real patient data may be used.',
    eligibility_criteria: 'Open to all students. Healthcare background is a plus.',
    start_date: '2026-05-01T09:00:00Z', end_date: '2026-05-03T09:00:00Z',
    registration_open: '2026-04-01T00:00:00Z', judging_start: '2026-05-03T10:00:00Z', results_date: '2026-05-03T18:00:00Z',
    team_min_size: 2, team_max_size: 5, participant_count: 534, status: 'closed', cta_url: '/register/event-3',
    resources: [], sponsors: [],
  },
];

export const MOCK_TRACKS: Track[] = [
  { id: 'track-1', event_id: 'event-1', name: 'AI/ML', description: 'Build intelligent systems with machine learning, LLMs, or computer vision.', problem_statement: 'Design an AI-powered solution addressing a real-world problem in education, healthcare, or productivity. Demonstrate meaningful use of ML or large language models with clear impact metrics.', prize_first: 15000, prize_second: 7500, prize_third: 3000 },
  { id: 'track-2', event_id: 'event-1', name: 'Web3', description: 'Decentralized applications, smart contracts, and blockchain-native solutions.', problem_statement: 'Build a dApp that solves a trust, ownership, or transparency problem. Must be deployed on a testnet with a working smart contract.', prize_first: 15000, prize_second: 7500, prize_third: 3000 },
  { id: 'track-3', event_id: 'event-1', name: 'Open Innovation', description: 'No constraints — build anything that creates genuine value for real users.', problem_statement: 'Identify a problem you care about and ship the best solution you can. Judged on originality, execution, and real-world applicability.', prize_first: 10000, prize_second: 5000, prize_third: 2000 },
  { id: 'track-4', event_id: 'event-2', name: 'Climate Tech', description: 'Carbon tracking, renewable energy, and sustainable agriculture tools.', problem_statement: 'Build a tool that measurably helps reduce carbon emissions or enables climate-positive behaviors.', prize_first: 5000, prize_second: 2500, prize_third: 1000 },
];

export const MOCK_TEAMS: Team[] = [
  { id: 'team-1', event_id: 'event-1', track_id: 'track-1', leader_id: 'user-1', members: ['user-1', 'user-2', 'user-5'], invite_code: 'HACK-ALPHA-42', summary: 'Building an AI-powered adaptive study assistant.', created_at: '2026-06-15T14:00:00Z' },
  { id: 'team-2', event_id: 'event-1', track_id: 'track-2', leader_id: 'user-6', members: ['user-6'], invite_code: 'HACK-BETA-77', summary: 'Decentralized credentials for academic institutions.', created_at: '2026-06-16T09:00:00Z' },
  { id: 'team-3', event_id: 'event-1', track_id: 'track-3', leader_id: 'user-2', members: ['user-2'], invite_code: 'HACK-GAMMA-99', summary: 'Open-source dev tools for accessibility testing.', created_at: '2026-06-17T11:00:00Z' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'project-1', team_id: 'team-1', event_id: 'event-1', title: 'StudyMind AI', description: 'An adaptive learning assistant that personalizes study plans based on student performance patterns using fine-tuned LLMs.', tech_stack: ['React', 'Python', 'FastAPI', 'GPT-4', 'PostgreSQL'], demo_url: 'https://studymind.demo.com', github_url: 'https://github.com/team-alpha/studymind', video_url: 'https://youtube.com/watch?v=example', status: 'submitted', submitted_at: '2026-07-11T22:45:00Z' },
  { id: 'project-2', team_id: 'team-2', event_id: 'event-1', title: 'EduCred', description: 'Blockchain-based academic credential verification eliminating fake degrees and streamlining hiring.', tech_stack: ['Solidity', 'React', 'Hardhat', 'IPFS'], github_url: 'https://github.com/team-beta/educred', status: 'draft' },
  { id: 'project-3', team_id: 'team-3', event_id: 'event-1', title: 'A11y Scanner', description: 'Real-time accessibility scanner that integrates into CI/CD pipelines.', tech_stack: ['TypeScript', 'Node.js', 'Playwright'], status: 'not_started' },
];

export const MOCK_REGISTRATIONS: Registration[] = [
  { id: 'reg-001', user_id: 'user-1', event_id: 'event-1', team_id: 'team-1', track_id: 'track-1', status: 'confirmed', registered_at: '2026-06-15T10:00:00Z' },
  { id: 'reg-002', user_id: 'user-2', event_id: 'event-1', team_id: 'team-1', track_id: 'track-1', status: 'confirmed', registered_at: '2026-06-15T11:00:00Z' },
  { id: 'reg-003', user_id: 'user-5', event_id: 'event-1', team_id: 'team-1', track_id: 'track-1', status: 'confirmed', registered_at: '2026-06-15T12:00:00Z' },
  { id: 'reg-004', user_id: 'user-6', event_id: 'event-1', team_id: 'team-2', track_id: 'track-2', status: 'confirmed', registered_at: '2026-06-16T09:30:00Z' },
];

export const MOCK_JUDGES: Judge[] = [
  { id: 'user-3', event_id: 'event-1', assigned_tracks: ['track-1', 'track-3'], is_active: true },
];

export const MOCK_JUDGE_SCORES: JudgeScore[] = [
  { id: 'score-1', judge_id: 'user-3', project_id: 'project-1', innovation: 9, technical: 8, impact: 9, presentation: 7, comments: 'Excellent LLM usage. The adaptive component is impressive.', review_status: 'scored', scored_at: '2026-07-12T11:30:00Z' },
  { id: 'score-2', judge_id: 'user-3', project_id: 'project-2', innovation: 0, technical: 0, impact: 0, presentation: 0, review_status: 'pending' },
  { id: 'score-3', judge_id: 'user-3', project_id: 'project-3', innovation: 0, technical: 0, impact: 0, presentation: 0, review_status: 'in_review' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann-1', event_id: 'event-1', created_by: 'user-4', title: 'Hackathon is live!', body: 'HackOS 2026 has officially begun! Head to your team dashboard to start building. Submissions close in 48 hours. Good luck!', target_type: 'broadcast', created_at: '2026-07-10T09:00:00Z' },
  { id: 'ann-2', event_id: 'event-1', created_by: 'user-4', title: 'Mentor sessions open', body: 'Industry mentors are available in #mentor-help on Discord from 2 PM to 6 PM today.', target_type: 'broadcast', created_at: '2026-07-10T13:00:00Z' },
  { id: 'ann-3', event_id: 'event-1', created_by: 'user-4', title: '24 hours remaining', body: 'You have 24 hours left. Ensure your GitHub repo is up to date and your demo video is uploaded before the deadline.', target_type: 'broadcast', created_at: '2026-07-11T09:00:00Z' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { team_id: 'team-1', team_name: 'Alpha Builders', track_name: 'AI/ML', total_score: 33, current_rank: 1, previous_rank: 2, rank_delta: -1 },
  { team_id: 'team-2', team_name: 'Chain Reaction', track_name: 'Web3', total_score: 29, current_rank: 2, previous_rank: 1, rank_delta: 1 },
  { team_id: 'team-3', team_name: 'Pixel Pirates', track_name: 'Open Innovation', total_score: 27, current_rank: 3, previous_rank: 3, rank_delta: 0 },
  { team_id: 'team-4', team_name: 'NullPointers', track_name: 'AI/ML', total_score: 25, current_rank: 4, previous_rank: 5, rank_delta: -1 },
  { team_id: 'team-5', team_name: 'Stack Overflow', track_name: 'Web3', total_score: 22, current_rank: 5, previous_rank: 4, rank_delta: 1 },
];
