export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metCount = Object.values(requirements).filter(Boolean).length;
  const score = password.length === 0 ? 0 : metCount;

  if (score === 0) {
    return { score: 0, label: '', color: 'bg-gray-200', requirements };
  }
  if (score <= 2) {
    return { score, label: 'Weak', color: 'bg-red-500', requirements };
  }
  if (score <= 3) {
    return { score, label: 'Fair', color: 'bg-yellow-500', requirements };
  }
  if (score <= 4) {
    return { score, label: 'Good', color: 'bg-blue-500', requirements };
  }
  return { score, label: 'Strong', color: 'bg-green-500', requirements };
}
