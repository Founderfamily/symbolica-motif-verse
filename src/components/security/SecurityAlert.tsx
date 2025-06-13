
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SecurityAlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({ type, title, message, onDismiss }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <Shield className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <Alert className={`${getAlertClass()} mb-4`}>
      {getIcon()}
      <AlertTitle className="flex items-center justify-between">
        {title}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
