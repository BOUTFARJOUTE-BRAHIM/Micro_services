/**
 * Tests unitaires — src/app/register/page.js
 *
 * RegisterPage :
 * - Affiche les champs prénom, nom, email, password, confirm
 * - Valide que les mots de passe correspondent
 * - Valide la longueur minimum du mot de passe (6 chars)
 * - Appelle useAuth().register() à la soumission
 * - Redirige vers /products en cas de succès
 * - Affiche un message d'erreur en cas d'échec
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../../src/app/register/page';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockRegister = jest.fn();
const mockPush     = jest.fn();

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ register: mockRegister }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

// ── Helpers ────────────────────────────────────────────────────────────────
async function fillForm(overrides = {}) {
  const defaults = {
    firstName:       'Brahim',
    lastName:        'Boutfarjoute',
    email:           'brahim@test.com',
    password:        'Secret123!',
    confirmPassword: 'Secret123!',
  };
  const data = { ...defaults, ...overrides };

  await userEvent.type(screen.getByLabelText('Prénom'),               data.firstName);
  await userEvent.type(screen.getByLabelText('Nom'),                  data.lastName);
  await userEvent.type(screen.getByLabelText('Email'),                data.email);
  await userEvent.type(screen.getByLabelText('Mot de passe'),         data.password);
  await userEvent.type(screen.getByLabelText('Confirmer le mot de passe'), data.confirmPassword);
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. Rendu du formulaire
// ═════════════════════════════════════════════════════════════════════════════
describe('RegisterPage — rendu', () => {
  beforeEach(() => render(<RegisterPage />));

  it('affiche le titre "Créer un compte"', () => {
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
  });

  it('affiche le sous-titre', () => {
    expect(screen.getByText('Rejoignez ShopVerse dès aujourd\'hui')).toBeInTheDocument();
  });

  it('affiche le champ Prénom', () => {
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
  });

  it('affiche le champ Nom', () => {
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
  });

  it('affiche le champ Email', () => {
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('affiche le champ Mot de passe', () => {
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('affiche le champ Confirmer le mot de passe', () => {
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
  });

  it('affiche le bouton "Créer mon compte"', () => {
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeInTheDocument();
  });

  it('affiche le lien vers la page de connexion', () => {
    const link = screen.getByRole('link', { name: 'Se connecter' });
    expect(link).toHaveAttribute('href', '/login');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. Validations côté client
// ═════════════════════════════════════════════════════════════════════════════
describe('RegisterPage — validations', () => {
  beforeEach(() => render(<RegisterPage />));

  it('affiche une erreur si les mots de passe ne correspondent pas', async () => {
    await fillForm({ password: 'Secret123!', confirmPassword: 'DifferentPass!' });
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(
        screen.getByText('Les mots de passe ne correspondent pas')
      ).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('affiche une erreur si le mot de passe est trop court (< 6 chars)', async () => {
    await fillForm({ password: '12345', confirmPassword: '12345' });
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(
        screen.getByText('Le mot de passe doit contenir au moins 6 caractères')
      ).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('accepte un mot de passe de 6 caractères exactement', async () => {
    mockRegister.mockResolvedValueOnce({
      data: { token: 'tok', user: { first_name: 'Brahim' } },
    });

    await fillForm({ password: 'Aa1234', confirmPassword: 'Aa1234' });
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));
  });

  it('n\'appelle pas register() si les passwords ne correspondent pas', async () => {
    await fillForm({ confirmPassword: 'mismatch' });
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => screen.getByText(/mots de passe/i));
    expect(mockRegister).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. Soumission réussie
// ═════════════════════════════════════════════════════════════════════════════
describe('RegisterPage — soumission réussie', () => {
  it('appelle register() avec les bons arguments', async () => {
    mockRegister.mockResolvedValueOnce({
      data: { token: 'tok', user: {} },
    });
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'Brahim',
        lastName:  'Boutfarjoute',
        email:     'brahim@test.com',
        password:  'Secret123!',
      });
    });
    // confirmPassword ne doit PAS être envoyé
    expect(mockRegister).not.toHaveBeenCalledWith(
      expect.objectContaining({ confirmPassword: expect.anything() })
    );
  });

  it('redirige vers /products après inscription réussie', async () => {
    mockRegister.mockResolvedValueOnce({
      data: { token: 'tok', user: {} },
    });
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/products'));
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. Soumission en erreur
// ═════════════════════════════════════════════════════════════════════════════
describe('RegisterPage — soumission en erreur', () => {
  it('affiche le message d\'erreur API (ex: email déjà utilisé)', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Email déjà utilisé'));
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(screen.getByText('Email déjà utilisé')).toBeInTheDocument();
    });
  });

  it('affiche un message générique si l\'erreur n\'a pas de message', async () => {
    mockRegister.mockRejectedValueOnce(new Error(''));
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de l\'inscription')).toBeInTheDocument();
    });
  });

  it('ne redirige pas si register() échoue', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Erreur réseau'));
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => screen.getByText('Erreur réseau'));
    expect(mockPush).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. État de chargement
// ═════════════════════════════════════════════════════════════════════════════
describe('RegisterPage — état de chargement', () => {
  it('désactive le bouton pendant la soumission', async () => {
    mockRegister.mockReturnValueOnce(new Promise(() => {}));
    render(<RegisterPage />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
