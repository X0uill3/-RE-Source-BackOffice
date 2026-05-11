<div align="center">

# (RE)Sources — Backoffice

**Plateforme numérique de partage de ressources sociales**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/Licence-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Présentation

**(RE)Sources** est une plateforme numérique permettant aux citoyens de découvrir, partager et gérer des ressources autour du lien social — famille, amis, collègues, voisins et communauté. Ce dépôt contient le **frontend** (backoffice / SPA) de la plateforme.

La plateforme offre :
- Un **catalogue** de ressources filtrables par catégorie et type
- Un **espace personnel** pour suivre ses favoris, contributions et objectifs
- Un **panel d'administration** pour les modérateurs et administrateurs
- Un **tableau de bord analytique** avec graphiques et statistiques

---

## Stack technique

| Couche | Technologies |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Style | TailwindCSS 4, Emotion |
| Composants UI | Radix UI, shadcn/ui (50+ composants) |
| Routing | React Router 7 |
| State global | Zustand |
| Données serveur | TanStack React Query 5 + Axios |
| Formulaires | React Hook Form |
| Graphiques | Recharts |
| Animations | Motion (Framer Motion) |
| Thèmes | next-themes |
| Icônes | Lucide React, Material UI Icons |

---

## Fonctionnalités

### Espace public
- **Accueil** — Hero section, présentation des fonctionnalités et appels à l'action
- **Catalogue** — Recherche plein texte, filtres par catégorie (`famille`, `amis`, `collègues`, `voisins`, `communauté`) et par type (`article`, `vidéo`, `exercice`, `outil`)
- **Détail d'une ressource** — Contenu complet, métadonnées, commentaires et interactions

### Espace utilisateur (authentifié)
- **Tableau de bord** — Suivi d'objectifs, ressources favorites, contributions et historique d'interactions
- **Créer une ressource** — Formulaire de soumission avec upload multipart
- **Profil** — Gestion du compte utilisateur

### Administration
- **Panel admin** — Modération des ressources et gestion des utilisateurs
- **Analytics** — Statistiques de la plateforme, ressources les plus consultées, tendances mensuelles

---

## Structure du projet

```
ReSource-Backoffice/
├── src/
│   ├── app/
│   │   ├── App.tsx               # Composant racine + RouterProvider
│   │   ├── routes.tsx            # Déclaration des routes
│   │   ├── components/
│   │   │   ├── Layout.tsx        # Mise en page globale (header, nav, footer)
│   │   │   └── ui/               # Bibliothèque de 50+ composants (shadcn-style)
│   │   └── pages/                # Pages de l'application
│   │       ├── Home.tsx
│   │       ├── Catalog.tsx
│   │       ├── ResourceDetail.tsx
│   │       ├── Dashboard.tsx
│   │       ├── CreateResource.tsx
│   │       ├── AdminPanel.tsx
│   │       ├── Analytics.tsx
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       └── NotFound.tsx
│   ├── hooks/                    # Hooks React Query (ressources, interactions, admin…)
│   ├── services/
│   │   └── api.ts                # Instance Axios + intercepteur token Bearer
│   ├── store/
│   │   └── authStore.ts          # Store Zustand (auth, token, utilisateur)
│   ├── utils/
│   │   └── categoryStyles.tsx    # Couleurs dynamiques par catégorie
│   └── styles/                   # CSS global, fonts, thème
├── index.html
├── vite.config.ts
└── package.json
```

---

## Installation et démarrage

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Le **backend** doit tourner sur `http://localhost:5000` (voir [ReSource-Backend](../backend))

### Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd ReSource-Backoffice

# Installer les dépendances
npm install
```

### Lancer en développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet si vous souhaitez personnaliser l'URL de l'API :

```env
VITE_API_URL=http://localhost:5000/api
```

> Par défaut, l'URL est définie directement dans `src/services/api.ts`.

---

## Rôles utilisateurs

| Rôle | Accès |
|---|---|
| `citoyen` | Catalogue, espace personnel, création de ressources |
| `MODERATOR` | Tout ce qui précède + modération des contenus |
| `ADMIN` | Accès complet + panel d'administration et analytics |

---

## Design

Le design de l'application est basé sur la maquette Figma officielle :
[Voir la maquette Figma](https://www.figma.com/design/P8hplPvPQw5SUtVn286xEL/Plateforme-num%C3%A9rique--RE-Sources)

---

## Conformité

La plateforme est conçue dans le respect des référentiels **RGPD** et **RGAA** (accessibilité numérique).

---

<div align="center">
  <sub>Développé dans le cadre du titre professionnel <strong>Concepteur Développeur d'Applications (CDA) — Bloc 2</strong></sub>
</div>
