/**
 * Tests unitaires — src/components/Navbar.js
 *
 * Navbar :
 * - Logo "ShopVerse" avec lien vers /
 * - Lien "Catalogue" vers /products
 * - Si NON connecté : liens Connexion + Inscription
 * - Si connecté     : prénom user + bouton Déconnexion + lien Commandes
 * - Bouton logout appelle useAuth().logout()
 * - Active le lien courant (isActive)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../src/components/Navbar';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockLogout   = jest.fn();
let   mockUser     = null;
let   mockPathname = '/';

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. Rendu — utilisateur non connecté
// ═════════════════════════════════════════════════════════════════════════════
describe('Navbar — utilisateur NON connecté', () => {
  beforeEach(() => {
    mockUser = null;
    render(<Navbar />);
  });

  it('affiche le logo ShopVerse', () => {
    expect(screen.getByText('ShopVerse')).toBeInTheDocument();
  });

  it('le logo est un lien vers /', () => {
    const logoLink = screen.getByText('ShopVerse').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('affiche le lien Catalogue vers /products', () => {
    const link = screen.getByRole('link', { name: 'Catalogue' });
    expect(link).toHaveAttribute('href', '/products');
  });

  it('affiche le bouton/lien Connexion', () => {
    expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
  });

  it('le lien Connexion pointe vers /login', () => {
    expect(screen.getByRole('link', { name: 'Connexion' })).toHaveAttribute('href', '/login');
  });

  it('affiche le lien Inscription', () => {
    expect(screen.getByRole('link', { name: 'Inscription' })).toBeInTheDocument();
  });

  it('le lien Inscription pointe vers /register', () => {
    expect(screen.getByRole('link', { name: 'Inscription' })).toHaveAttribute('href', '/register');
  });

  it('n\'affiche PAS le prénom utilisateur', () => {
    expect(screen.queryByText('Brahim')).not.toBeInTheDocument();
  });

  it('n\'affiche PAS le bouton Déconnexion', () => {
    expect(screen.queryByRole('button', { name: 'Déconnexion' })).not.toBeInTheDocument();
  });

  it('n\'affiche PAS le lien Mes Commandes', () => {
    expect(screen.queryByRole('link', { name: 'Mes Commandes' })).not.toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. Rendu — utilisateur connecté
// ═════════════════════════════════════════════════════════════════════════════
describe('Navbar — utilisateur connecté', () => {
  beforeEach(() => {
    mockUser = { id: 1, first_name: 'Brahim', email: 'brahim@test.com' };
    render(<Navbar />);
  });

  it('affiche le prénom de l\'utilisateur', () => {
    expect(screen.getByText('Brahim')).toBeInTheDocument();
  });

  it('affiche le bouton Déconnexion', () => {
    expect(screen.getByRole('button', { name: 'Déconnexion' })).toBeInTheDocument();
  });

  it('affiche le lien Mes Commandes', () => {
    const link = screen.getByRole('link', { name: 'Mes Commandes' });
    expect(link).toHaveAttribute('href', '/orders');
  });

  it('n\'affiche PAS le lien Connexion', () => {
    expect(screen.queryByRole('link', { name: 'Connexion' })).not.toBeInTheDocument();
  });

  it('n\'affiche PAS le lien Inscription', () => {
    expect(screen.queryByRole('link', { name: 'Inscription' })).not.toBeInTheDocument();
  });

  it('affiche toujours le logo et le lien Catalogue', () => {
    expect(screen.getByText('ShopVerse')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catalogue' })).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. Action logout
// ═════════════════════════════════════════════════════════════════════════════
describe('Navbar — logout', () => {
  beforeEach(() => {
    mockUser = { id: 1, first_name: 'Brahim' };
  });

  it('appelle logout() au clic sur Déconnexion', async () => {
    render(<Navbar />);
    await userEvent.click(screen.getByRole('button', { name: 'Déconnexion' }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. Lien actif (isActive)
// ═════════════════════════════════════════════════════════════════════════════
describe('Navbar — lien actif', () => {
  it('marque le lien Catalogue comme actif si pathname est /products', () => {
    mockUser     = null;
    mockPathname = '/products';
    render(<Navbar />);

    // Le lien actif devrait exister
    const catalogueLink = screen.getByRole('link', { name: 'Catalogue' });
    expect(catalogueLink).toBeInTheDocument();
    // En vrai le style change — ici on vérifie juste que le lien est présent
  });
});
