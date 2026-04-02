// 1. On définit la liste des styles disponibles
// Ce sont des classes Tailwind complètes pour que le compilateur les détecte
const CATEGORY_PALETTE = [
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
];

/**
 * Attribue une couleur de manière déterministe à une catégorie.
 * Si la catégorie est nouvelle, elle recevra une couleur de la palette.
 */
export const getCategoryColor = (category: string): string => {
  if (!category) return 'bg-gray-100 text-gray-700';

  const normalized = category.toLowerCase().trim();

  // Algorithme de hachage simple (djb2) pour transformer le texte en nombre
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    // On décale les bits pour créer un nombre unique basé sur les caractères
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  // On utilise Math.abs pour éviter les nombres négatifs et le modulo 
  // pour rester dans les index valides du tableau
  const index = Math.abs(hash) % CATEGORY_PALETTE.length;
  
  return CATEGORY_PALETTE[index];
};