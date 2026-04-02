// Mock data pour la démonstration

export type ResourceCategory = 'famille' | 'amis' | 'collegues' | 'voisins' | 'communaute';
export type ResourceType = 'article' | 'video' | 'exercice' | 'outil';
export type UserRole = 'citoyen' | 'moderateur' | 'admin';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  isPublic: boolean;
  content: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isModerated: boolean;
  replies?: Comment[];
}

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.fr',
    role: 'citoyen',
    joinedAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@example.fr',
    role: 'moderateur',
    joinedAt: '2024-11-20',
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.fr',
    role: 'admin',
    joinedAt: '2024-10-01',
  },
];

// Mock resources
export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Comment organiser un repas familial inclusif',
    description: 'Guide pratique pour organiser des moments conviviaux en famille en tenant compte des besoins de chacun.',
    category: 'famille',
    type: 'article',
    author: 'Marie Dupont',
    authorId: '1',
    createdAt: '2026-03-15',
    views: 1234,
    likes: 89,
    commentsCount: 12,
    isPublic: true,
    content: 'Contenu détaillé de l\'article sur l\'organisation de repas familiaux...',
    tags: ['repas', 'convivialité', 'inclusion'],
  },
  {
    id: '2',
    title: 'Exercice d\'écoute active entre amis',
    description: 'Un exercice pratique pour développer l\'écoute empathique dans vos relations amicales.',
    category: 'amis',
    type: 'exercice',
    author: 'Jean Martin',
    authorId: '2',
    createdAt: '2026-03-20',
    views: 987,
    likes: 67,
    commentsCount: 8,
    isPublic: true,
    content: 'Instructions détaillées pour l\'exercice d\'écoute active...',
    tags: ['écoute', 'communication', 'empathie'],
  },
  {
    id: '3',
    title: 'Gérer les conflits au travail avec bienveillance',
    description: 'Vidéo explicative sur les techniques de résolution de conflits en milieu professionnel.',
    category: 'collegues',
    type: 'video',
    author: 'Sophie Bernard',
    authorId: '3',
    createdAt: '2026-03-18',
    views: 2341,
    likes: 156,
    commentsCount: 23,
    isPublic: true,
    content: 'Lien vers la vidéo et transcription...',
    tags: ['conflit', 'travail', 'médiation'],
  },
  {
    id: '4',
    title: 'Créer un groupe d\'entraide de voisinage',
    description: 'Outil interactif pour lancer et animer un réseau de solidarité dans votre quartier.',
    category: 'voisins',
    type: 'outil',
    author: 'Marie Dupont',
    authorId: '1',
    createdAt: '2026-03-25',
    views: 756,
    likes: 42,
    commentsCount: 5,
    isPublic: true,
    content: 'Guide pas à pas pour créer un groupe d\'entraide...',
    tags: ['solidarité', 'quartier', 'entraide'],
  },
  {
    id: '5',
    title: 'S\'engager dans une association locale',
    description: 'Découvrez comment l\'engagement associatif renforce les liens communautaires et le bien-être.',
    category: 'communaute',
    type: 'article',
    author: 'Jean Martin',
    authorId: '2',
    createdAt: '2026-03-28',
    views: 1543,
    likes: 98,
    commentsCount: 15,
    isPublic: true,
    content: 'Article complet sur l\'engagement associatif...',
    tags: ['engagement', 'association', 'bénévolat'],
  },
  {
    id: '6',
    title: 'Maintenir le lien avec sa famille éloignée',
    description: 'Conseils pratiques et outils numériques pour garder contact avec vos proches à distance.',
    category: 'famille',
    type: 'article',
    author: 'Sophie Bernard',
    authorId: '3',
    createdAt: '2026-03-30',
    views: 890,
    likes: 71,
    commentsCount: 9,
    isPublic: true,
    content: 'Stratégies pour maintenir les liens familiaux à distance...',
    tags: ['distance', 'numérique', 'communication'],
  },
  {
    id: '7',
    title: 'Organiser des activités entre amis sans exclusion',
    description: 'Guide pour planifier des sorties qui conviennent à tous, quel que soit le budget ou les capacités.',
    category: 'amis',
    type: 'article',
    author: 'Marie Dupont',
    authorId: '1',
    createdAt: '2026-03-12',
    views: 654,
    likes: 48,
    commentsCount: 6,
    isPublic: true,
    content: 'Idées d\'activités inclusives entre amis...',
    tags: ['activités', 'inclusion', 'loisirs'],
  },
  {
    id: '8',
    title: 'Team building bienveillant : exercices pratiques',
    description: 'Série d\'exercices pour renforcer la cohésion d\'équipe dans le respect de chacun.',
    category: 'collegues',
    type: 'exercice',
    author: 'Jean Martin',
    authorId: '2',
    createdAt: '2026-03-22',
    views: 1876,
    likes: 134,
    commentsCount: 18,
    isPublic: true,
    content: 'Exercices de team building détaillés...',
    tags: ['équipe', 'cohésion', 'exercices'],
  },
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    resourceId: '1',
    userId: '2',
    userName: 'Jean Martin',
    content: 'Excellent article ! J\'ai appliqué ces conseils pour notre dernier repas de famille et ça a très bien fonctionné.',
    createdAt: '2026-03-16',
    isModerated: true,
  },
  {
    id: '2',
    resourceId: '1',
    userId: '3',
    userName: 'Sophie Bernard',
    content: 'Merci pour ces idées pratiques. Particulièrement utile pour prendre en compte les allergies alimentaires.',
    createdAt: '2026-03-17',
    isModerated: true,
  },
  {
    id: '3',
    resourceId: '2',
    userId: '1',
    userName: 'Marie Dupont',
    content: 'L\'exercice d\'écoute active m\'a vraiment aidé à améliorer ma communication avec mes amis.',
    createdAt: '2026-03-21',
    isModerated: true,
  },
];

// Mock statistics
export interface Statistics {
  totalUsers: number;
  totalResources: number;
  totalViews: number;
  totalComments: number;
  usersByRole: Record<UserRole, number>;
  resourcesByCategory: Record<ResourceCategory, number>;
  resourcesByType: Record<ResourceType, number>;
  monthlyViews: Array<{ month: string; views: number }>;
  topResources: Array<{ title: string; views: number }>;
}

export const mockStats: Statistics = {
  totalUsers: 15234,
  totalResources: 487,
  totalViews: 234567,
  totalComments: 3421,
  usersByRole: {
    citoyen: 15100,
    moderateur: 124,
    admin: 10,
  },
  resourcesByCategory: {
    famille: 142,
    amis: 98,
    collegues: 115,
    voisins: 67,
    communaute: 65,
  },
  resourcesByType: {
    article: 245,
    video: 98,
    exercice: 87,
    outil: 57,
  },
  monthlyViews: [
    { month: 'Oct 2025', views: 18500 },
    { month: 'Nov 2025', views: 21300 },
    { month: 'Déc 2025', views: 19800 },
    { month: 'Jan 2026', views: 23400 },
    { month: 'Fév 2026', views: 25100 },
    { month: 'Mar 2026', views: 28200 },
  ],
  topResources: [
    { title: 'Gérer les conflits au travail', views: 2341 },
    { title: 'Team building bienveillant', views: 1876 },
    { title: 'S\'engager dans une association', views: 1543 },
    { title: 'Organiser un repas familial', views: 1234 },
    { title: 'Exercice d\'écoute active', views: 987 },
  ],
};

// Current user simulation
export let currentUser: User | null = null;

export const login = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  if (user && password) {
    currentUser = user;
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
};

export const register = (name: string, email: string, password: string): User => {
  const newUser: User = {
    id: String(mockUsers.length + 1),
    name,
    email,
    role: 'citoyen',
    joinedAt: new Date().toISOString().split('T')[0],
  };
  mockUsers.push(newUser);
  currentUser = newUser;
  return newUser;
};

// Favorites simulation
export const mockFavorites: Set<string> = new Set(['1', '3']);

export const toggleFavorite = (resourceId: string): boolean => {
  if (mockFavorites.has(resourceId)) {
    mockFavorites.delete(resourceId);
    return false;
  } else {
    mockFavorites.add(resourceId);
    return true;
  }
};

export const isFavorite = (resourceId: string): boolean => {
  return mockFavorites.has(resourceId);
};
