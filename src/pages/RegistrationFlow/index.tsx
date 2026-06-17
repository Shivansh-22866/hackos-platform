import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRegistrationStore } from '../../store/registrationStore';
import { StepIndicator } from './StepIndicator';
import { Step1Personal } from './Step1Personal';
import { Step2Team } from './Step2Team';
import { Step3Track } from './Step3Track';
import { Step4Review } from './Step4Review';
import { Step5Confirmation } from './Step5Confirmation';

const STEP_LABELS = ['Personal info', 'Team setup', 'Track selection', 'Review', 'Confirmation'];

export function RegistrationFlow() {
  const { eventId: paramEventId } = useParams<{ eventId: string }>();
  const { step, setStep, setEventId, reset } = useRegistrationStore();

  useEffect(() => {
    reset();
    if (paramEventId) setEventId(paramEventId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramEventId]);

  const steps: Record<number, JSX.Element> = {
    1: <Step1Personal />,
    2: <Step2Team />,
    3: <Step3Track />,
    4: <Step4Review />,
    5: <Step5Confirmation />,
  };

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-ink-faint uppercase tracking-widest mb-1">HackOS 2026</p>
          <h1 className="text-2xl font-bold font-mono text-ink">Registration</h1>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-raised shadow-xl shadow-black/30 p-8">
          {step < 5 && (
            <StepIndicator
              current={step}
              total={5}
              labels={STEP_LABELS}
              onBack={(s) => setStep(s as 1 | 2 | 3 | 4 | 5)}
            />
          )}
          {steps[step]}
        </div>
      </div>
    </main>
  );
}
