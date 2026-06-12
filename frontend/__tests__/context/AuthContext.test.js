/**
 * Tests unitaires — src/context/AuthContext.js
 *
 * AuthContext gère :
 *  - Chargement du profil au démarrage (loadUser)
 *  - login()    → stocke token + user dans localStorage
 *  - register() → stocke token + user dans localStorage
 *  - logout()   → supprime token, vide user
 *  - useAuth()  → doit être dans un AuthProvider
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// ── Mock ApiClient ────────────────────────────────────────────────────────────
jest.mock('../../src/lib/api', () => ({
  __esModule: true,
  default: {
    login:      jest.fn(),
    register:   jest.fn(),
    getProfile: jest.fn(),
  },
}));

import ApiClient from '../../src/lib/api';

// ── Composant de test pour accéder au contexte ────────────────────────────────
function TestConsumer() {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.first_name : 'null'}</span>
      <button onClick={() => login({ email: 'a@b.com', password: '123' })}>
        Login
      </button>
      <button onClick={() => register({ email: 'a@b.com', password: '123', firstName: 'Jean', lastName: 'Dupont' })}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

// ═════════════════════════════════════════════════════════════════════════════
// 1. État initial
// ═════════════════════════════════════════════════════════════════════════════
describe('AuthContext — état initial', () => {
  it('démarre en chargement (loading=true) puis passe à false', async () => {
    ApiClient.getProfile.mockResolvedValueOnce({
      data: { user: null },
    });

    renderWithProvider();

    // loading commence à true
    expect(screen.getByTestId('loading').textContent).toBe('true');

    // Attend que loadUser() se termine
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('user est null au démarrage si pas de token dans localStorage', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });

  it('charge le profil si un token est présent dans localStorage', async () => {
    localStorage.setItem('token', 'existing_token');
    ApiClient.getProfile.mockResolvedValueOnce({
      data: { user: { id: 1, first_name: 'Brahim', email: 'b@b.com' } },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Brahim');
    });
  });

  it('supprime le token si getProfile échoue (token invalide)', async () => {
    localStorage.setItem('token', 'invalid_token');
    ApiClient.getProfile.mockRejectedValueOnce(new Error('Token invalide'));

    renderWithProvider();

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });

  it('ne fait pas d\'appel API si localStorage est vide', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    expect(ApiClient.getProfile).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. login()
// ═════════════════════════════════════════════════════════════════════════════
describe('AuthContext — login()', () => {
  it('stocke le token dans localStorage après login réussi', async () => {
    ApiClient.login.mockResolvedValueOnce({
      data: { token: 'jwt_login_tok', user: { id: 1, first_name: 'Jean' } },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    expect(localStorage.getItem('token')).toBe('jwt_login_tok');
  });

  it('met à jour user dans le contexte après login', async () => {
    ApiClient.login.mockResolvedValueOnce({
      data: {
        token: 'tok',
        user:  { id: 1, first_name: 'Brahim', email: 'brahim@test.com' },
      },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    expect(screen.getByTestId('user').textContent).toBe('Brahim');
  });

  it('propage l\'erreur si les credentials sont invalides', async () => {
    const error = new Error('Invalid credentials');
    error.status = 401;
    ApiClient.login.mockRejectedValueOnce(error);

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await expect(async () => {
      await act(async () => {
        await userEvent.click(screen.getByText('Login'));
      });
    }).rejects.toThrow('Invalid credentials');

    // User reste null
    expect(screen.getByTestId('user').textContent).toBe('null');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. register()
// ═════════════════════════════════════════════════════════════════════════════
describe('AuthContext — register()', () => {
  it('stocke le token après inscription réussie', async () => {
    ApiClient.register.mockResolvedValueOnce({
      data: {
        token: 'jwt_register_tok',
        user:  { id: 2, first_name: 'Jean' },
      },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      await userEvent.click(screen.getByText('Register'));
    });

    expect(localStorage.getItem('token')).toBe('jwt_register_tok');
  });

  it('met à jour user dans le contexte après inscription', async () => {
    ApiClient.register.mockResolvedValueOnce({
      data: {
        token: 'tok',
        user:  { id: 2, first_name: 'Nouveau', email: 'new@test.com' },
      },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      await userEvent.click(screen.getByText('Register'));
    });

    expect(screen.getByTestId('user').textContent).toBe('Nouveau');
  });

  it('propage l\'erreur si l\'email est déjà utilisé', async () => {
    const error = new Error('Email déjà utilisé');
    error.status = 409;
    ApiClient.register.mockRejectedValueOnce(error);

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await expect(async () => {
      await act(async () => {
        await userEvent.click(screen.getByText('Register'));
      });
    }).rejects.toThrow('Email déjà utilisé');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. logout()
// ═════════════════════════════════════════════════════════════════════════════
describe('AuthContext — logout()', () => {
  it('supprime le token du localStorage', async () => {
    // Setup: user connecté
    localStorage.setItem('token', 'existing_token');
    ApiClient.getProfile.mockResolvedValueOnce({
      data: { user: { id: 1, first_name: 'Brahim' } },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('Brahim'));

    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('remet user à null après logout', async () => {
    localStorage.setItem('token', 'tok');
    ApiClient.getProfile.mockResolvedValueOnce({
      data: { user: { id: 1, first_name: 'Brahim' } },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('Brahim'));

    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    expect(screen.getByTestId('user').textContent).toBe('null');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. useAuth() — hors Provider
// ═════════════════════════════════════════════════════════════════════════════
describe('useAuth() — hors AuthProvider', () => {
  it('lance une erreur si useAuth est utilisé hors AuthProvider', () => {
    // Supprimer les console.error de React pour ce test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BadConsumer() {
      useAuth(); // doit planter
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });
});
