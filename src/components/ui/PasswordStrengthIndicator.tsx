import { checkPasswordStrength } from '@/utils/password';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = checkPasswordStrength(password);

  if (!password) return null;

  const requirementLabels: Record<keyof typeof strength.requirements, string> = {
    length: 'At least 8 characters',
    uppercase: 'One uppercase letter',
    lowercase: 'One lowercase letter',
    number: 'One number',
    special: 'One special character',
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Password strength</span>
        <span className="text-xs font-medium text-gray-700">{strength.label}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <ul className="space-y-1">
        {Object.entries(strength.requirements).map(([key, met]) => (
          <li key={key} className="flex items-center gap-2 text-xs">
            <svg
              className={`w-3.5 h-3.5 flex-shrink-0 ${met ? 'text-green-500' : 'text-gray-300'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={met ? 'text-green-600' : 'text-gray-400'}>
              {requirementLabels[key as keyof typeof strength.requirements]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
