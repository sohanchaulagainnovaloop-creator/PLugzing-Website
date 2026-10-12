'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Invalid email or password.');
        return;
      }

      // Store the JWT returned by the backend.
      localStorage.setItem('accessToken', result.data.accessToken);

      if (result.data.refreshToken) {
        localStorage.setItem('refreshToken', result.data.refreshToken);
      }

      // Login successful
      window.location.href = '/';
    } catch {
      setError(
        'Unable to connect to the server. Make sure the Plugzing backend is running.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <img
            src="/images/logo.png"
            alt="Plugzin"
            className="auth-brand-logo"
          />
          <span>plugzin</span>
        </Link>

        <div className="auth-header">
          <p className="auth-eyebrow">WELCOME BACK</p>

          <h1>Sign In</h1>

          <p>Sign in to access your Plugzin account and manage your tools.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Password</label>

              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <p className="auth-register">
          Don't have an account? <Link href="/register">Get Started</Link>
        </p>
      </div>
    </main>
  );
}
