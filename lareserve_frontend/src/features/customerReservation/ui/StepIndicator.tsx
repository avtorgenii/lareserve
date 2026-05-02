import { STEP_LABELS } from '../model/types';

import type { Step } from '../model/types';

export default function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-border bg-white py-4">
      {([1, 2, 3] as Step[]).map((step, index) => {
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={`h-px w-16 ${isDone ? 'bg-primary' : 'border-t border-dashed border-border bg-transparent'}`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? 'bg-primary text-white'
                    : isActive
                      ? 'border-2 border-primary bg-white text-primary'
                      : 'border-2 border-border bg-white text-text-muted'
                }`}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : isDone ? 'text-text' : 'text-text-muted'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
