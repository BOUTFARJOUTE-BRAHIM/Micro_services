'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroGlow} />
        <div className="container" style={styles.heroContent}>
          <span style={styles.heroBadge} className="glass">
            🚀 Architecture Microservices
          </span>
          <h1 style={styles.heroTitle}>
            Bienvenue sur{' '}
            <span className="gradient-text">ShopVerse</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Découvrez notre plateforme e-commerce moderne, construite avec une architecture
            microservices scalable. Explorez le catalogue, passez vos commandes en toute sécurité.
          </p>
          <div style={styles.heroActions}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Explorer le catalogue
            </Link>
            {!user && (
              <Link href="/register" className="btn btn-secondary btn-lg">
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>
            Architecture <span className="gradient-text">Microservices</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            Chaque service est indépendant, scalable et communique via API REST
          </p>
          <div style={styles.featureGrid}>
            {[
              {
                icon: '🔐',
                title: 'Auth Service',
                port: ':4001',
                desc: 'Inscription, connexion, gestion JWT et profils utilisateurs sécurisés avec bcrypt.',
                color: '#7c3aed',
              },
              {
                icon: '📦',
                title: 'Product Service',
                port: ':4002',
                desc: 'CRUD complet des produits et catégories, recherche, filtrage et gestion du stock.',
                color: '#3b82f6',
              },
              {
                icon: '🛒',
                title: 'Order Service',
                port: ':4003',
                desc: 'Création de commandes, vérification du stock en temps réel et suivi des statuts.',
                color: '#10b981',
              },
            ].map((feature, i) => (
              <div key={i} style={styles.featureCard} className="card">
                <div style={{...styles.featureIcon, background: `${feature.color}20`, color: feature.color}}>
                  {feature.icon}
                </div>
                <h3 style={styles.featureTitle}>
                  {feature.title}
                  <span style={{...styles.featurePort, color: feature.color}}>
                    {feature.port}
                  </span>
                </h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={styles.techSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Stack Technique</h2>
          <div style={styles.techGrid}>
            {[
              { name: 'Next.js 14', desc: 'Frontend React', icon: '⚛️' },
              { name: 'Express.js', desc: 'API Backend', icon: '🟢' },
              { name: 'PostgreSQL', desc: 'Base de données', icon: '🐘' },
              { name: 'JWT', desc: 'Authentification', icon: '🔑' },
            ].map((tech, i) => (
              <div key={i} style={styles.techCard} className="glass">
                <span style={styles.techIcon}>{tech.icon}</span>
                <span style={styles.techName}>{tech.name}</span>
                <span style={styles.techDesc}>{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background: 'var(--gradient-hero)',
    zIndex: 0,
  },
  heroGlow: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background: 'var(--gradient-glow)',
    filter: 'blur(60px)',
    zIndex: 0,
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem var(--container-padding)',
  },
  heroBadge: {
    display: 'inline-block',
    padding: '0.5rem 1.25rem',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-xl)',
  },
  heroTitle: {
    fontSize: 'var(--font-size-5xl)',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: 'var(--space-xl)',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    fontSize: 'var(--font-size-lg)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    marginBottom: 'var(--space-2xl)',
    maxWidth: '600px',
    margin: '0 auto var(--space-2xl)',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-md)',
    flexWrap: 'wrap',
  },
  features: {
    padding: '6rem 0',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 'var(--space-md)',
    letterSpacing: '-0.02em',
  },
  sectionSubtitle: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    marginBottom: 'var(--space-3xl)',
    maxWidth: '500px',
    margin: '0 auto var(--space-3xl)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-xl)',
  },
  featureCard: {
    textAlign: 'center',
    padding: 'var(--space-2xl)',
  },
  featureIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-lg)',
    fontSize: '1.75rem',
    marginBottom: 'var(--space-lg)',
  },
  featureTitle: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 700,
    marginBottom: 'var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
  },
  featurePort: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    opacity: 0.7,
  },
  featureDesc: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
  },
  techSection: {
    padding: '4rem 0',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-lg)',
    marginTop: 'var(--space-2xl)',
  },
  techCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-xl)',
    borderRadius: 'var(--radius-lg)',
    textAlign: 'center',
  },
  techIcon: {
    fontSize: '2rem',
    marginBottom: 'var(--space-xs)',
  },
  techName: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 700,
  },
  techDesc: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-secondary)',
  },
};
