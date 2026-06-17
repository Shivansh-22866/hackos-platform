import { http, HttpResponse, delay } from 'msw';
import {
  MOCK_EVENTS, MOCK_TRACKS, MOCK_TEAMS, MOCK_PROJECTS,
  MOCK_REGISTRATIONS, MOCK_JUDGES, MOCK_JUDGE_SCORES,
  MOCK_ANNOUNCEMENTS, MOCK_LEADERBOARD, MOCK_USERS,
} from '../data/mockData';
import type { Registration, JudgeScore, Announcement } from '../types';

let registrations = [...MOCK_REGISTRATIONS];
let judgeScores = [...MOCK_JUDGE_SCORES];
let announcements = [...MOCK_ANNOUNCEMENTS];
let projects = [...MOCK_PROJECTS];
let teams = [...MOCK_TEAMS];

export const handlers = [
  // ── Events ────────────────────────────────────────────────────────────────
  http.get('/api/events', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase();
    let result = [...MOCK_EVENTS];
    if (status && status !== 'all') result = result.filter((e) => e.status === status);
    if (search) result = result.filter((e) => e.title.toLowerCase().includes(search) || e.description.toLowerCase().includes(search));
    return HttpResponse.json(result);
  }),

  http.get('/api/events/:id', async ({ params }) => {
    await delay(200);
    const event = MOCK_EVENTS.find((e) => e.id === params.id);
    if (!event) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(event);
  }),

  // ── Tracks ────────────────────────────────────────────────────────────────
  http.get('/api/events/:id/tracks', async ({ params }) => {
    await delay(200);
    const tracks = MOCK_TRACKS.filter((t) => t.event_id === params.id);
    return HttpResponse.json(tracks);
  }),

  // ── Registrations ─────────────────────────────────────────────────────────
  http.get('/api/events/:id/registrations', async ({ params }) => {
    await delay(300);
    const enriched = registrations
      .filter((r) => r.event_id === params.id)
      .map((r) => ({
        ...r,
        user: MOCK_USERS.find((u) => u.id === r.user_id),
        team: teams.find((t) => t.id === r.team_id),
        track: MOCK_TRACKS.find((tr) => tr.id === r.track_id),
      }));
    return HttpResponse.json(enriched);
  }),

  http.get('/api/registrations/check', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const eventId = url.searchParams.get('eventId');
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) return HttpResponse.json({ exists: false });
    const reg = registrations.find((r) => r.user_id === user.id && r.event_id === eventId);
    return HttpResponse.json({ exists: !!reg, registration: reg ?? null });
  }),

  http.post('/api/registrations', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Partial<Registration>;
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      user_id: body.user_id ?? '',
      event_id: body.event_id ?? '',
      team_id: body.team_id,
      track_id: body.track_id ?? '',
      status: 'confirmed',
      registered_at: new Date().toISOString(),
    };
    registrations.push(newReg);
    return HttpResponse.json(newReg, { status: 201 });
  }),

  // ── Teams ─────────────────────────────────────────────────────────────────
  http.get('/api/teams/:id', async ({ params }) => {
    await delay(200);
    const team = teams.find((t) => t.id === params.id);
    if (!team) return new HttpResponse(null, { status: 404 });
    const members = team.members.map((uid) => MOCK_USERS.find((u) => u.id === uid)).filter(Boolean);
    return HttpResponse.json({ ...team, member_details: members });
  }),

  http.get('/api/teams/by-invite/:code', async ({ params }) => {
    await delay(300);
    const team = teams.find((t) => t.invite_code === params.code);
    if (!team) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(team);
  }),

  http.post('/api/teams', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { event_id: string; track_id: string; leader_id: string; name: string };
    const newTeam = {
      id: `team-${Date.now()}`,
      event_id: body.event_id,
      track_id: body.track_id,
      leader_id: body.leader_id,
      members: [body.leader_id],
      invite_code: `HACK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      summary: '',
      created_at: new Date().toISOString(),
    };
    teams.push(newTeam);
    return HttpResponse.json(newTeam, { status: 201 });
  }),

  // ── Projects ──────────────────────────────────────────────────────────────
  http.get('/api/projects', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    const teamId = url.searchParams.get('teamId');
    let result = [...projects];
    if (eventId) result = result.filter((p) => p.event_id === eventId);
    if (teamId) result = result.filter((p) => p.team_id === teamId);
    return HttpResponse.json(result);
  }),

  http.get('/api/projects/:id', async ({ params }) => {
    await delay(200);
    const project = projects.find((p) => p.id === params.id);
    if (!project) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(project);
  }),

  http.post('/api/projects', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Partial<typeof projects[0]>;
    const newProject = { id: `project-${Date.now()}`, status: 'draft' as const, tech_stack: [], ...body };
    projects.push(newProject as typeof projects[0]);
    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.patch('/api/projects/:id', async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<typeof projects[0]>;
    const idx = projects.findIndex((p) => p.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    projects[idx] = { ...projects[idx], ...body };
    return HttpResponse.json(projects[idx]);
  }),

  // ── Judge Scores ──────────────────────────────────────────────────────────
  http.get('/api/judge-scores', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const judgeId = url.searchParams.get('judgeId');
    const result = judgeScores.filter((s) => !judgeId || s.judge_id === judgeId).map((s) => ({
      ...s,
      project: projects.find((p) => p.id === s.project_id),
    }));
    return HttpResponse.json(result);
  }),

  http.post('/api/judge-scores', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Partial<JudgeScore>;
    const idx = judgeScores.findIndex((s) => s.judge_id === body.judge_id && s.project_id === body.project_id);
    const updated: JudgeScore = {
      id: idx >= 0 ? judgeScores[idx].id : `score-${Date.now()}`,
      judge_id: body.judge_id ?? '',
      project_id: body.project_id ?? '',
      innovation: body.innovation ?? 0,
      technical: body.technical ?? 0,
      impact: body.impact ?? 0,
      presentation: body.presentation ?? 0,
      comments: body.comments,
      review_status: 'scored',
      scored_at: new Date().toISOString(),
    };
    if (idx >= 0) judgeScores[idx] = updated;
    else judgeScores.push(updated);
    return HttpResponse.json(updated, { status: 201 });
  }),

  // ── Announcements ─────────────────────────────────────────────────────────
  http.get('/api/announcements', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    const result = announcements.filter((a) => !eventId || a.event_id === eventId);
    return HttpResponse.json(result.sort((a, b) => b.created_at.localeCompare(a.created_at)));
  }),

  http.post('/api/announcements', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<Announcement>;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      event_id: body.event_id ?? '',
      created_by: body.created_by ?? '',
      title: body.title ?? '',
      body: body.body ?? '',
      target_type: body.target_type ?? 'broadcast',
      target_id: body.target_id,
      created_at: new Date().toISOString(),
    };
    announcements.unshift(newAnn);
    return HttpResponse.json(newAnn, { status: 201 });
  }),

  // ── Judges ────────────────────────────────────────────────────────────────
  http.get('/api/judges', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    const result = MOCK_JUDGES.filter((j) => !eventId || j.event_id === eventId).map((j) => ({
      ...j,
      user: MOCK_USERS.find((u) => u.id === j.id),
    }));
    return HttpResponse.json(result);
  }),

  // ── Leaderboard ───────────────────────────────────────────────────────────
  http.get('/api/leaderboard/:eventId', async () => {
    await delay(200);
    return HttpResponse.json(MOCK_LEADERBOARD);
  }),

  // ── Users ─────────────────────────────────────────────────────────────────
  http.get('/api/users/:id', async ({ params }) => {
    await delay(150);
    const user = MOCK_USERS.find((u) => u.id === params.id);
    if (!user) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(user);
  }),
];
