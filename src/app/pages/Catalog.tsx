import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Filter, Eye, Heart, MessageCircle } from 'lucide-react';
import { type ResourceCategory, type ResourceType } from '../data/mockData';
import { getCategoryColor } from '../../utils/categoryStyles';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');

// AJOUT : État pour stocker les vraies ressources
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      const result = await response.json();
      
      if (result.status === 'success') {
        // C'est ici qu'on cible le tableau dans la structure MongoDB
        // On essaie d'abord result.data.resources, sinon result.data
        const actualData = result.data.resources || result.data;
        setResources(actualData);
      }
    } catch (error) {
      console.error("Erreur catalogue :", error);
      setResources([]); 
    }
  };
  fetchResources();
}, []);

const filteredResources = resources.filter((resource) => { 
     const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.categorie === selectedCategory;
    const matchesType = selectedType === 'all' || resource.typeRessource === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      famille: 'Famille',
      amis: 'Amis',
      collegues: 'Collègues',
      voisins: 'Voisins',
      communaute: 'Communauté',
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      article: 'Article',
      video: 'Vidéo',
      exercice: 'Exercice',
      outil: 'Outil',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: ResourceType) => {
    const icons: Record<ResourceType, string> = {
      article: '📄',
      video: '🎥',
      exercice: '✏️',
      outil: '🔧',
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Catalogue de ressources</h1>
          <p className="text-gray-600 max-w-3xl">
            Explorez notre bibliothèque de ressources pour renforcer vos relations dans tous les domaines de votre vie
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher une ressource, un mot-clé..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ResourceCategory | 'all')}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="famille">Famille</SelectItem>
                    <SelectItem value="amis">Amis</SelectItem>
                    <SelectItem value="collegues">Collègues</SelectItem>
                    <SelectItem value="voisins">Voisins</SelectItem>
                    <SelectItem value="communaute">Communauté</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="w-full md:w-40">
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ResourceType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="exercice">Exercice</SelectItem>
                    <SelectItem value="outil">Outil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredResources.length} ressource{filteredResources.length > 1 ? 's' : ''} trouvée{filteredResources.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune ressource ne correspond à votre recherche</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link key={resource._id} to={`/ressource/${resource._id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    {/* Sécurité sur la catégorie : on affiche le nom si c'est un objet, sinon rien */}
                    <Badge className={getCategoryColor(resource.categorie?.name || 'famille')}>
                      {resource.categorie?.name || 'Ressource'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* PROTECTION : On vérifie si tags existe avant de faire slice */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(resource.tags || []).slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* PROTECTION : Valeurs par défaut (0) pour les stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{(resource.views || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{(resource.likes || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
