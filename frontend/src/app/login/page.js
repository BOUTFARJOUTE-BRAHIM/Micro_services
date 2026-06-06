'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      router.push('/products');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card} className="glass">
        <div style={styles.header}>
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Connectez-vous à votre compte ShopVerse</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Mot de passe</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? <span className="spinner" /> : 'Se connecter'}
          </button>
        </form>

        <p style={styles.footerText}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={styles.footerLink}>Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 'var(--space-xl)',
  },
  glow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '400px',
    height: '300px',
    background: 'var(--gradient-glow)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '440px',
    padding: 'var(--space-2xl)',
    borderRadius: 'var(--radius-xl)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'var(--space-2xl)',
  },
  title: {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 800,
    marginBottom: 'var(--space-sm)',
  },
  subtitle: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
  },
  submitBtn: {
    width: '100%',
    marginTop: 'var(--space-md)',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    marginTop: 'var(--space-xl)',
  },
  footerLink: {
    color: 'var(--color-accent-start)',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
