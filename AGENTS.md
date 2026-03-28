# Marketplace Animaux Maroc — AnimalSouk

## Description du projet
Marketplace en ligne dédié à la vente d'animaux au Maroc.
- Les **visiteurs** parcourent les annonces, filtrent par catégorie/ville/prix, et contactent les vendeurs via WhatsApp ou appel téléphonique. Aucun compte requis pour naviguer ou acheter.
- Les **vendeurs** créent un compte pour publier des annonces. Chaque annonce est soumise à validation par l'admin avant publication.
- L'**admin** (une seule personne) valide ou rejette les annonces. Le paiement des frais de publication se fait en dehors de l'application (le vendeur contacte l'admin directement). Aucun système de paiement intégré.

## Stack technique
- **Framework** : Next.js 15 (App Router) + TypeScript
- **Styling** : Tailwind CSS
- **Internationalisation** : next-intl (3 langues : arabe RTL, français, anglais)
- **State management** : Zustand
- **Icônes** : Lucide React
- **Linter** : ESLint
- **Import alias** : `@/*` (défaut Next.js)

## Structure des langues
- `ar` — Arabe (langue par défaut, direction RTL)
- `fr` — Français (LTR)
- `en` — Anglais (LTR)
- Les URLs suivent le pattern : `/ar/...`, `/fr/...`, `/en/...`
- Tous les textes UI utilisent les clés de traduction next-intl, jamais de texte en dur
- Les fichiers de messages sont dans `/messages/ar.json`, `/messages/fr.json`, `/messages/en.json`

## Rôles utilisateurs

### Visiteur (pas de compte)
- Parcourir les annonces
- Filtrer par : catégorie, ville, fourchette de prix, race
- Voir le détail d'une annonce (photos, vidéos, infos complètes)
- Contacter le vendeur via WhatsApp (`https://wa.me/212XXXXXXXXX?text=...`)
- Appeler le vendeur (`tel:+212XXXXXXXXX`)
- Changer la langue (ar/fr/en)
- Ajouter aux favoris (stockage local, pas de compte nécessaire)

### Vendeur (compte requis)
- Inscription : nom, téléphone, email (optionnel), ville, mot de passe
- Connexion : téléphone + mot de passe
- Créer une annonce avec : titre, description, catégorie, sous-catégorie, race, âge, sexe, prix (MAD), ville, photos (max 8), vidéo (max 1), champs optionnels (vaccinations, pedigree, poids, etc.)
- Modifier / supprimer ses annonces
- Voir le statut de ses annonces : en_attente | approuvée | rejetée | vendue
- Dashboard personnel avec la liste de ses annonces

### Admin (un seul utilisateur)
- Dashboard avec les annonces en attente de validation
- Approuver ou rejeter une annonce (avec motif de rejet)
- Voir la liste de tous les vendeurs
- Gérer les catégories
- Statistiques basiques : nombre d'annonces, vendeurs actifs, annonces par catégorie

## Catégories d'animaux
- 🐱 Chats
- 🐶 Chiens
- 🐦 Oiseaux
- 🐟 Poissons & Aquariophilie
- 🐴 Chevaux
- 🐄 Bétail (vaches, moutons, chèvres)
- 🐰 Rongeurs & Lapins
- 🦎 Reptiles
- 🐢 Tortues
- 🦜 Perroquets
- 🐝 Autres
- Chaque catégorie peut avoir des sous-catégories (ex: Chiens → Berger Allemand, Husky, etc.)

## Villes du Maroc (pour les filtres)
Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Kénitra, Tétouan, Salé, Nador, Mohammedia, El Jadida, Béni Mellal, Taza, Khémisset, Settat, Berrechid, Khouribga, Safi, Laâyoune, Errachidia, Guelmim, Dakhla, Autres

## Structure de données — Annonce (Animal)
```typescript
interface Animal {
  id: string;
  sellerId: string;
  title: { ar: string; fr: string; en: string };
  description: { ar: string; fr: string; en: string };
  price: number; // en MAD (Dirham marocain)
  negotiable: boolean;
  category: string;
  subCategory?: string;
  breed?: string;
  age?: string; // ex: "3 mois", "2 ans"
  gender?: 'male' | 'female' | 'unknown';
  city: string;
  photos: string[]; // URLs, max 8
  video?: string; // URL, max 1
  vaccinated?: boolean;
  pedigree?: boolean;
  weight?: string;
  color?: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Structure de données — Vendeur
```typescript
interface Seller {
  id: string;
  name: string;
  phone: string; // format: +212XXXXXXXXX
  email?: string;
  city: string;
  avatar?: string;
  createdAt: Date;
  totalAds: number;
  rating?: number;
}
```

## Règles de code

### Général
- TypeScript strict, pas de `any`
- Composants React : nommage PascalCase, un composant par fichier
- Utiliser les Server Components Next.js par défaut
- Ajouter `"use client"` uniquement quand c'est nécessaire (interactivité, hooks, événements)
- Pas de `console.log` dans le code commité (utiliser uniquement pour debug temporaire)

### Styling
- Tailwind CSS uniquement, pas de CSS modules ni de styled-components
- Design **mobile-first** : commencer par les styles mobile, ajouter les breakpoints `md:` et `lg:`
- Support RTL : utiliser les classes logiques Tailwind (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) au lieu de `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`
- Palette de couleurs : vert nature comme couleur principale, blanc/gris clair pour le fond, texte foncé

### Internationalisation
- Chaque texte visible passe par `useTranslations()` de next-intl
- Les clés de traduction sont organisées par section : `nav.*`, `home.*`, `categories.*`, `animal.*`, `seller.*`, `admin.*`, `common.*`
- Toujours fournir les 3 langues quand on ajoute une clé
- Le layout racine applique `dir="rtl"` et `lang="ar"` quand la locale est arabe

### Structure des dossiers
```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx                  # Accueil
│       ├── animals/
│       │   ├── page.tsx              # Listing avec filtres
│       │   └── [id]/
│       │       └── page.tsx          # Détail annonce
│       ├── categories/
│       │   └── [slug]/
│       │       └── page.tsx          # Annonces par catégorie
│       ├── seller/
│       │   ├── login/page.tsx
│       │   ├── register/page.tsx
│       │   └── dashboard/
│       │       ├── page.tsx          # Mes annonces
│       │       └── new/page.tsx      # Créer annonce
│       └── admin/
│           └── dashboard/
│               └── page.tsx          # Dashboard admin
├── components/
│   ├── layout/                       # Header, Footer, Navigation
│   ├── animals/                      # AnimalCard, AnimalGrid, AnimalFilters
│   ├── seller/                       # SellerProfile, SellerForm
│   ├── ui/                           # Button, Input, Modal, Select, etc.
│   └── common/                       # LanguageSwitcher, SearchBar
├── lib/
│   ├── types.ts                      # Interfaces TypeScript
│   ├── mock-data.ts                  # Données fictives pour le développement
│   ├── constants.ts                  # Catégories, villes, etc.
│   └── utils.ts                      # Fonctions utilitaires
├── stores/
│   └── useStore.ts                   # Zustand stores
└── messages/
    ├── ar.json
    ├── fr.json
    └── en.json
```

## Données mock
Pour le développement frontend, utiliser des données fictives réalistes :
- 15-20 annonces variées avec différentes catégories, villes, prix
- 5-6 vendeurs fictifs avec des numéros WhatsApp marocains
- Photos placeholder via `https://placehold.co/` ou des URLs d'images libres
- Prix réalistes en MAD (ex: chat 500-3000 MAD, chien 1000-8000 MAD, oiseau 100-2000 MAD)

## UX / Design
- Interface épurée, moderne, facile à utiliser
- Le bouton WhatsApp doit être très visible (vert WhatsApp #25D366)
- Les cards d'annonces montrent : photo principale, titre, prix, ville, catégorie
- Formulaire de création d'annonce en multi-étapes sur mobile (pas un long formulaire)
- Skeleton loading pour les images et les listes
- Messages d'état vides : "Aucune annonce trouvée", "Aucun résultat pour cette recherche"
- Transitions et animations subtiles (pas excessives)

## Ce qui n'est PAS inclus
- Système de paiement en ligne
- Chat intégré (la communication passe par WhatsApp/téléphone)
- Système de notation/avis
- Livraison
- Backend / API (sera développé dans une phase ultérieure)