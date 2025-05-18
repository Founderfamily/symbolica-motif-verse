
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const { t } = useTranslation();
  const auth = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError(t('auth.passwordsMustMatch'));
          setLoading(false);
          return;
        }
        
        await auth.signUp(email, password);
        setMessage(t('auth.checkEmailVerification'));
      } else if (mode === 'signin') {
        await auth.signIn(email, password);
      } else if (mode === 'reset') {
        // Reset password logic here
        setMessage(t('auth.passwordResetSent'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'signin' ? (
            <I18nText translationKey="auth.signIn">Sign In</I18nText>
          ) : mode === 'signup' ? (
            <I18nText translationKey="auth.signUp">Sign Up</I18nText>
          ) : (
            <I18nText translationKey="auth.resetPassword">Reset Password</I18nText>
          )}
        </h1>
        <p className="text-slate-500 mt-2">
          {mode === 'signin' ? (
            <I18nText translationKey="auth.signInSubtitle">Access your account</I18nText>
          ) : mode === 'signup' ? (
            <I18nText translationKey="auth.signUpSubtitle">Create a new account</I18nText>
          ) : (
            <I18nText translationKey="auth.resetPasswordSubtitle">We'll send you a link to reset your password</I18nText>
          )}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4 text-sm">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            <I18nText translationKey="auth.emailAddress">Email Address</I18nText>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            required
          />
        </div>
        
        {mode !== 'reset' && (
          <div className="space-y-2">
            <Label htmlFor="password">
              <I18nText translationKey="auth.password">Password</I18nText>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
            />
          </div>
        )}
        
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              <I18nText translationKey="auth.confirmPassword">Confirm Password</I18nText>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
            />
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <I18nText translationKey="common.loading">Loading...</I18nText>
          ) : mode === 'signin' ? (
            <I18nText translationKey="auth.signIn">Sign In</I18nText>
          ) : mode === 'signup' ? (
            <I18nText translationKey="auth.signUp">Sign Up</I18nText>
          ) : (
            <I18nText translationKey="auth.resetPassword">Reset Password</I18nText>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center space-y-2">
        {mode === 'signin' && (
          <>
            <p className="text-sm text-slate-500">
              <I18nText translationKey="auth.noAccount">Don't have an account?</I18nText>{' '}
              <button
                onClick={() => switchMode('signup')}
                type="button"
                className="text-amber-600 hover:underline focus:outline-none"
              >
                <I18nText translationKey="auth.signUpLink">Sign up</I18nText>
              </button>
            </p>
            <button
              onClick={() => switchMode('reset')}
              type="button"
              className="text-sm text-amber-600 hover:underline focus:outline-none"
            >
              <I18nText translationKey="auth.forgotPassword">Forgot password?</I18nText>
            </button>
          </>
        )}
        
        {mode === 'signup' && (
          <p className="text-sm text-slate-500">
            <I18nText translationKey="auth.haveAccount">Already have an account?</I18nText>{' '}
            <button
              onClick={() => switchMode('signin')}
              type="button"
              className="text-amber-600 hover:underline focus:outline-none"
            >
              <I18nText translationKey="auth.signInLink">Sign in</I18nText>
            </button>
          </p>
        )}
        
        {mode === 'reset' && (
          <button
            onClick={() => switchMode('signin')}
            type="button"
            className="text-sm text-amber-600 hover:underline focus:outline-none"
          >
            <I18nText translationKey="auth.backToSignIn">Back to sign in</I18nText>
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
