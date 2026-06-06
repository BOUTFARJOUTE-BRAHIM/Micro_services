'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      router.push('/products');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card} className="glass">
        <div style={styles.header}>
          <h1 style={styles.title}>Créer un compte</h1>
          <p style={styles.subtitle}>Rejoignez ShopVerse dès aujourd'hui</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div className="form-group" style={styles.halfField}>
              <label className="form-label" htmlFor="reg-firstname">Prénom</label>
              <input
                id="reg-firstname"
                type="text"
                className="form-input"
                placeholder="Jean"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={styles.halfField}>
              <label className="form-label" htmlFor="reg-lastname">Nom</label>
              <input
                id="reg-lastname"
                type="text"
                className="form-input"
                placeholder="Dupont"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Mot de passe</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 caractères"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirmer le mot de passe</label>
            <input
              id="reg-confirm"
              type="password"
              className="form-input"
              placeholder="Confirmez votre mot de passe"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? <span className="spinner" /> : 'Créer mon compte'}
          </button>
        </form>

        <p style={styles.footerText}>
          Déjà un compte ?{' '}
          <Link href="/login" style={styles.footerLink}>Se connecter</Link>
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
    top: '25%',
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
    maxWidth: '500px',
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
  row: {
    display: 'flex',
    gap: 'var(--space-md)',
  },
  halfField: {
    flex: 1,
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
