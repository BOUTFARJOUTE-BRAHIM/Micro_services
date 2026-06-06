'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav style={styles.nav} className="glass">
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span className="gradient-text" style={styles.logoText}>ShopVerse</span>
        </Link>

        <button style={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{...styles.menuBar, ...(menuOpen ? styles.menuBarOpen1 : {})}} />
          <span style={{...styles.menuBar, ...(menuOpen ? styles.menuBarOpen2 : {})}} />
          <span style={{...styles.menuBar, ...(menuOpen ? styles.menuBarOpen3 : {})}} />
        </button>

        <div style={{...styles.links, ...(menuOpen ? styles.linksOpen : {})}}>
          <Link
            href="/products"
            style={{...styles.link, ...(isActive('/products') ? styles.linkActive : {})}}
            onClick={() => setMenuOpen(false)}
          >
            Catalogue
          </Link>

          {user ? (
            <>
              <Link
                href="/orders"
                style={{...styles.link, ...(isActive('/orders') ? styles.linkActive : {})}}
                onClick={() => setMenuOpen(false)}
              >
                Mes Commandes
              </Link>
              <div style={styles.userSection}>
                <span style={styles.userName}>
                  {user.first_name}
                </span>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  style={styles.logoutBtn}
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div style={styles.authLinks}>
              <Link href="/login" style={styles.loginBtn} onClick={() => setMenuOpen(false)}>
                Connexion
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid var(--color-border)',
  },
  container: {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 var(--container-padding)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  menuToggle: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    zIndex: 200,
  },
  menuBar: {
    display: 'block',
    width: '24px',
    height: '2px',
    background: 'var(--color-text-primary)',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  menuBarOpen1: { transform: 'rotate(45deg) translate(5px, 5px)' },
  menuBarOpen2: { opacity: 0 },
  menuBarOpen3: { transform: 'rotate(-45deg) translate(5px, -5px)' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  linksOpen: {},
  link: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    transition: 'color var(--transition-base)',
    textDecoration: 'none',
    padding: '0.25rem 0',
    borderBottom: '2px solid transparent',
  },
  linkActive: {
    color: 'var(--color-text-primary)',
    borderBottomColor: 'var(--color-accent-start)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  userName: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    padding: '0.35rem 0.75rem',
    background: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
  },
  logoutBtn: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  loginBtn: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
  },
};

// Add responsive CSS via a style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav button[aria-label="Menu"] {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(style);
}
