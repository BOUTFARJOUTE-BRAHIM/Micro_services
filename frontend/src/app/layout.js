import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ShopVerse — E-Commerce Microservices',
  description: 'Plateforme e-commerce moderne construite avec une architecture microservices. Découvrez nos produits, passez vos commandes et gérez votre compte.',
  keywords: 'e-commerce, microservices, next.js, boutique en ligne',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer style={footerStyles.footer}>
            <div style={footerStyles.container}>
              <p style={footerStyles.text}>
                © 2026 <span style={footerStyles.brand}>ShopVerse</span> — Architecture Microservices
              </p>
              <p style={footerStyles.sub}>
                Auth :4001 · Products :4002 · Orders :4003
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

const footerStyles = {
  footer: {
    borderTop: '1px solid var(--color-border)',
    padding: '2rem 0',
    marginTop: '4rem',
  },
  container: {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 var(--container-padding)',
    textAlign: 'center',
  },
  text: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
  },
  brand: {
    fontWeight: 700,
    background: 'var(--gradient-accent)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sub: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    marginTop: '0.5rem',
  },
};
