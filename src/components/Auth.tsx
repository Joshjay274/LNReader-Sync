import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const clear = () => {
    setError('');
    setMessage('');
  };

  const handleGoogle = async () => {
    if (!auth || !googleProvider) {
      setError('Firebase is not configured for Google sign-in.');
      return;
    }

    try {
      clear();
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!auth) return setError('Firebase not configured');
    try {
      clear();
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      setMessage('Account created. A verification email was sent.');
    } catch (err: any) {
      setError(err?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!auth) return setError('Firebase not configured');
    try {
      clear();
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!auth) return setError('Firebase not configured');
    try {
      clear();
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            className={`secondary-button ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
            disabled={loading}
          >
            Sign in
          </button>
          <button
            className={`secondary-button ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
            disabled={loading}
          >
            Create account
          </button>
          <button
            className={`secondary-button ${mode === 'reset' ? 'active' : ''}`}
            onClick={() => setMode('reset')}
            disabled={loading}
          >
            Reset password
          </button>
        </div>

        {error ? <div className="status-banner error-banner">{error}</div> : null}
        {message ? <div className="status-banner info-banner">{message}</div> : null}
      </div>

      {!isFirebaseConfigured ? (
        <div className="status-banner info-banner">
          Firebase not configured. Fill <strong>.env</strong> from <strong>.env.example</strong> to enable auth and sync.
        </div>
      ) : null}

      {(mode === 'signin' || mode === 'signup') && (
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.2)' }}
            />
          </div>

          {mode === 'signup' && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Password (min 6 chars)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.2)' }}
              />
            </div>
          )}

          {mode === 'signin' && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.2)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="primary-button" type="submit" disabled={loading}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            {mode === 'signin' && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => setMode('reset')}
                disabled={loading}
              >
                Forgot password
              </button>
            )}
          </div>
        </form>
      )}

      {mode === 'reset' && (
        <form onSubmit={handleReset}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.2)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="primary-button" type="submit" disabled={loading}>
              Send reset email
            </button>
            <button className="secondary-button" type="button" onClick={() => setMode('signin')} disabled={loading}>
              Back
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>or</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="secondary-button" onClick={handleGoogle} disabled={!isFirebaseConfigured || loading}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
