/**
 * Tests unitaires — src/app/login/page.js
 *
 * LoginPage :
 * - Affiche le formulaire email/password
 * - Appelle useAuth().login() à la soumission
 * - Redirige vers /products en cas de succès
 * - Affiche un message d'erreur en cas d'échec
 * - Désactive le bouton pendant le chargement
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../src/app/login/page';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockLogin  = jest.fn();
const mockPush   = jest.fn();

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. Rendu du formulaire
// ═════════════════════════════════════════════════════════════════════════════
describe('LoginPage — rendu', () => {
  beforeEach(() => render(<LoginPage />));

  it('affiche le titre "Connexion"', () => {
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('affiche le sous-titre', () => {
    expect(
      screen.getByText('Connectez-vous à votre compte ShopVerse')
    ).toBeInTheDocument();
  });

  it('affiche le champ Email', () => {
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('affiche le champ Mot de passe', () => {
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('affiche le bouton "Se connecter"', () => {
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('affiche le lien vers la page d\'inscription', () => {
    const link = screen.getByRole('link', { name: 'Créer un compte' });
    expect(link).toHaveAttribute('href', '/register');
  });

  it('le bouton submit est actif par défaut', () => {
    expect(screen.getByRole('button', { name: 'Se connecter' })).not.toBeDisabled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. Interaction avec le formulaire
// ═════════════════════════════════════════════════════════════════════════════
describe('LoginPage — saisie utilisateur', () => {
  it('met à jour le champ email lors de la saisie', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');

    await userEvent.type(emailInput, 'brahim@test.com');
    expect(emailInput).toHaveValue('brahim@test.com');
  });

  it('met à jour le champ password lors de la saisie', async () => {
    render(<LoginPage />);
    const passInput = screen.getByLabelText('Mot de passe');

    await userEvent.type(passInput, 'Secret123!');
    expect(passInput).toHaveValue('Secret123!');
  });

  it('le champ password est de type password (masqué)', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. Soumission réussie
// ═════════════════════════════════════════════════════════════════════════════
describe('LoginPage — soumission réussie', () => {
  it('appelle login() avec email et password', async () => {
    mockLogin.mockResolvedValueOnce({ data: { token: 'tok', user: {} } });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'brahim@test.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'Secret123!');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(mockLogin).toHaveBeenCalledWith({
      email:    'brahim@test.com',
      password: 'Secret123!',
    });
  });

  it('redirige vers /products après connexion réussie', async () => {
    mockLogin.mockResolvedValueOnce({ data: { token: 'tok', user: {} } });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'brahim@test.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/products'));
  });

  it('n\'affiche pas d\'alerte d\'erreur si login réussit', async () => {
    mockLogin.mockResolvedValueOnce({ data: { token: 'tok', user: {} } });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. Soumission en erreur
// ═════════════════════════════════════════════════════════════════════════════
describe('LoginPage — soumission en erreur', () => {
  it('affiche le message d\'erreur retourné par l\'API', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'mauvais@email.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'mauvais');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('affiche "Erreur de connexion" si pas de message dans l\'erreur', async () => {
    mockLogin.mockRejectedValueOnce(new Error(''));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
    });
  });

  it('ne redirige pas si login échoue', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Erreur'));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => screen.getByText('Erreur'));
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. État de chargement
// ═════════════════════════════════════════════════════════════════════════════
describe('LoginPage — état de chargement', () => {
  it('désactive le bouton pendant la soumission', async () => {
    // login qui ne se résout jamais → simule le loading
    mockLogin.mockReturnValueOnce(new Promise(() => {}));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
