import { useState } from 'react';
import { useRegistrationStore } from '../../store/registrationStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Errors { name?: string; email?: string; college_or_org?: string }

export function Step1Personal() {
  const { personalInfo, setPersonalInfo, setStep, eventId } = useRegistrationStore();
  const [errors, setErrors] = useState<Errors>({});
  const [checking, setChecking] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!personalInfo.name.trim()) e.name = 'Name is required';
    if (!personalInfo.email.trim()) e.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(personalInfo.email)) e.email = 'Enter a valid email';
    if (!personalInfo.college_or_org.trim()) e.college_or_org = 'Institution is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setChecking(true);
    try {
      // Duplicate detection — check if email already registered for this event
      const res = await fetch(`/api/registrations/check?email=${encodeURIComponent(personalInfo.email)}&eventId=${eventId}`);
      const { exists } = (await res.json()) as { exists: boolean };
      if (exists) {
        setErrors({ email: 'This email is already registered for this event. Check your team dashboard.' });
        return;
      }
      setStep(2);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink font-mono">Personal information</h2>
        <p className="text-sm text-ink-muted mt-1">Tell us about yourself. This creates your HackOS account.</p>
      </div>
      <Input
        label="Full name"
        placeholder="Alice Johnson"
        value={personalInfo.name}
        onChange={(e) => setPersonalInfo({ name: e.target.value })}
        error={errors.name}
        autoFocus
      />
      <Input
        label="Email address"
        type="email"
        placeholder="alice@university.edu"
        value={personalInfo.email}
        onChange={(e) => setPersonalInfo({ email: e.target.value })}
        error={errors.email}
        hint="Used for login and duplicate detection"
      />
      <Input
        label="College / Organisation"
        placeholder="MIT"
        value={personalInfo.college_or_org}
        onChange={(e) => setPersonalInfo({ college_or_org: e.target.value })}
        error={errors.college_or_org}
      />
      <Button onClick={() => void handleNext()} loading={checking} className="w-full mt-2">
        Continue →
      </Button>
    </div>
  );
}
