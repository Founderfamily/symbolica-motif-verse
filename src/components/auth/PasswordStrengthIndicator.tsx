
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const checks = [
    { label: 'Au moins 6 caractères', test: password.length >= 6 },
    { label: 'Une majuscule', test: /[A-Z]/.test(password) },
    { label: 'Une minuscule', test: /[a-z]/.test(password) },
    { label: 'Un chiffre', test: /\d/.test(password) },
  ];

  const passedChecks = checks.filter(check => check.test).length;
  const strength = passedChecks / checks.length;

  const getStrengthColor = () => {
    if (strength < 0.5) return 'bg-red-500';
    if (strength < 0.75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 0.5) return 'Faible';
    if (strength < 0.75) return 'Moyen';
    return 'Fort';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-600">{getStrengthText()}</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-1 text-xs">
            {check.test ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-gray-400" />
            )}
            <span className={check.test ? 'text-green-600' : 'text-gray-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
