import { create } from 'zustand';
import type { RegistrationPersonalInfo, RegistrationTeamChoice } from '../types';

interface RegistrationState {
  step: 1 | 2 | 3 | 4 | 5;
  eventId: string;
  personalInfo: RegistrationPersonalInfo;
  teamChoice: RegistrationTeamChoice;
  selectedTrackId: string;
  confirmationId: string;
  submitting: boolean;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setEventId: (id: string) => void;
  setPersonalInfo: (info: Partial<RegistrationPersonalInfo>) => void;
  setTeamChoice: (choice: Partial<RegistrationTeamChoice>) => void;
  setSelectedTrackId: (id: string) => void;
  submit: () => Promise<string>;
  reset: () => void;
}

const initialPersonalInfo: RegistrationPersonalInfo = { name: '', email: '', college_or_org: '' };
const initialTeamChoice: RegistrationTeamChoice = { action: 'create', teamName: '', inviteCode: '', teamId: '' };

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  step: 1,
  eventId: '',
  personalInfo: initialPersonalInfo,
  teamChoice: initialTeamChoice,
  selectedTrackId: '',
  confirmationId: '',
  submitting: false,

  setStep: (step) => set({ step }),
  setEventId: (eventId) => set({ eventId }),
  setPersonalInfo: (info) => set((s) => ({ personalInfo: { ...s.personalInfo, ...info } })),
  setTeamChoice: (choice) => set((s) => ({ teamChoice: { ...s.teamChoice, ...choice } })),
  setSelectedTrackId: (selectedTrackId) => set({ selectedTrackId }),

  submit: async () => {
    set({ submitting: true });
    const { personalInfo, teamChoice, selectedTrackId, eventId } = get();
    try {
      // 1. Create/find team
      let teamId = teamChoice.teamId ?? '';
      if (teamChoice.action === 'create') {
        const teamRes = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId, track_id: selectedTrackId, leader_id: 'user-new', name: teamChoice.teamName }),
        });
        const team = (await teamRes.json()) as { id: string };
        teamId = team.id;
      } else if (teamChoice.inviteCode) {
        const teamRes = await fetch(`/api/teams/by-invite/${teamChoice.inviteCode}`);
        const team = (await teamRes.json()) as { id: string };
        teamId = team.id;
      }
      // 2. Create registration
      const regRes = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-new', event_id: eventId, team_id: teamId, track_id: selectedTrackId, ...personalInfo }),
      });
      const reg = (await regRes.json()) as { id: string };
      set({ confirmationId: reg.id, step: 5, submitting: false });
      return reg.id;
    } catch {
      set({ submitting: false });
      throw new Error('Registration failed');
    }
  },

  reset: () => set({ step: 1, personalInfo: initialPersonalInfo, teamChoice: initialTeamChoice, selectedTrackId: '', confirmationId: '' }),
}));
