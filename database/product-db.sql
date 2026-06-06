-- ============================================
-- E-Commerce Microservices — Product Database
-- Database: ecommerce_products
-- ============================================

-- Créer la base de données
-- CREATE DATABASE ecommerce_products;

-- Se connecter à ecommerce_products avant d'exécuter ce script

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches et filtres
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Recherche full-text
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(
    to_tsvector('french', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Données de démonstration : catégories
INSERT INTO categories (name, description) VALUES
    ('Électronique', 'Smartphones, ordinateurs, accessoires électroniques'),
    ('Vêtements', 'Mode homme et femme'),
    ('Maison', 'Décoration, meubles et accessoires pour la maison'),
    ('Sport', 'Équipements et vêtements de sport'),
    ('Livres', 'Romans, essais, manuels et bandes dessinées')
ON CONFLICT (name) DO NOTHING;

-- Données de démonstration : produits
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
    ('Smartphone ProMax 15', 'Dernier smartphone avec écran AMOLED 6.7 pouces, 256Go de stockage et appareil photo 108MP.', 999.99, 50,
        (SELECT id FROM categories WHERE name = 'Électronique'),
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'),
    ('Laptop UltraBook X1', 'Ordinateur portable ultra-fin, processeur i7, 16Go RAM, SSD 512Go.', 1299.99, 30,
        (SELECT id FROM categories WHERE name = 'Électronique'),
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
    ('Écouteurs Sans Fil Pro', 'Écouteurs Bluetooth avec réduction de bruit active et autonomie de 24h.', 199.99, 100,
        (SELECT id FROM categories WHERE name = 'Électronique'),
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
    ('T-Shirt Premium Coton', 'T-shirt 100% coton biologique, coupe ajustée, disponible en plusieurs couleurs.', 29.99, 200,
        (SELECT id FROM categories WHERE name = 'Vêtements'),
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
    ('Veste en Cuir Vintage', 'Veste en cuir véritable, style rétro, doublure en soie.', 249.99, 25,
        (SELECT id FROM categories WHERE name = 'Vêtements'),
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
    ('Lampe Design Nordique', 'Lampe de bureau en bois et métal, style scandinave minimaliste.', 79.99, 60,
        (SELECT id FROM categories WHERE name = 'Maison'),
        'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400'),
    ('Tapis Berbère Artisanal', 'Tapis fait main en laine naturelle, motifs géométriques traditionnels.', 189.99, 15,
        (SELECT id FROM categories WHERE name = 'Maison'),
        'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400'),
    ('Ballon de Football Pro', 'Ballon officiel taille 5, cousu main, certifié FIFA.', 49.99, 80,
        (SELECT id FROM categories WHERE name = 'Sport'),
        'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400'),
    ('Tapis de Yoga Premium', 'Tapis anti-dérapant 6mm, matériaux écologiques, sangle de transport incluse.', 39.99, 120,
        (SELECT id FROM categories WHERE name = 'Sport'),
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'),
    ('Le Petit Prince', 'Chef-d''œuvre intemporel d''Antoine de Saint-Exupéry, édition illustrée.', 12.99, 300,
        (SELECT id FROM categories WHERE name = 'Livres'),
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400')
ON CONFLICT DO NOTHING;
