
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';

export const AuthButtons: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" asChild>
        <Link to="/auth">
          <I18nText translationKey="auth.buttons.login">Log In</I18nText>
        </Link>
      </Button>
      <Button asChild>
        <Link to="/auth">
          <I18nText translationKey="auth.buttons.register">Sign Up</I18nText>
        </Link>
      </Button>
    </div>
  );
};
