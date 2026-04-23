import { useNavigate, Link } from 'react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Heart,
  BookOpen,
  TrendingUp,
  Eye,
  MessageCircle,
  LogOut,
  Edit,
} from 'lucide-react';

// 1. On supprime currentUser et logout des mockData
import {
  mockResources,
  isFavorite,
  type ResourceCategory,
} from '../data/mockData';
import { toast } from 'sonner';

// 2. On importe notre vraie mémoire globale
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 3. On récupère le vrai utilisateur et la vraie fonction de déconnexion
  const { user, logout } = useAuthStore();

  useEffect(() => {
    // Si l'utilisateur n'est pas dans le store, on le renvoie au login
    if (!user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/connexion');
    }
  }, [user, navigate]);

  // Sécurité anti-crash : si pas de user, on affiche un écran vide le temps de la redirection
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout(); // Ceci va vider le localStorage proprement
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  // Note: On garde les mockResources temporairement pour l'affichage visuel
  const favoriteResources = mockResources.filter((r) => isFavorite(r.id));
  const myContributions = mockResources.filter((r) => r.authorId === user._id); // MongoDB utilise _id

  const getCategoryColor = (category: ResourceCategory) => {
    const colors: Record<ResourceCategory, string> = {
      famille: 'bg-pink-100 text-pink-700',
      amis: 'bg-yellow-100 text-yellow-700',
      collegues: 'bg-blue-100 text-blue-700',
      voisins: 'bg-green-100 text-green-700',
      communaute: 'bg-purple-100 text-purple-700',
    };
    return colors[category];
  };

  const getCategoryLabel = (category: ResourceCategory) => {
    const labels: Record<ResourceCategory, string> = {
      famille: 'Famille',
      amis: 'Amis',
      collegues: 'Collègues',
      voisins: 'Voisins',
      communaute: 'Communauté',
    };
    return labels[category];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-gray-600">
                {/* 4. On utilise firstname au lieu de name */}
                Bienvenue, <span className="font-semibold">{user.firstname}</span> !
              </p>
              <Badge variant="outline" className="mt-2">
                {/* 5. On utilise les rôles tels qu'ils sont dans ton backend */}
                {user.role === 'USER' && 'Citoyen'}
                {user.role === 'MODERATOR' && 'Modérateur'}
                {user.role === 'ADMIN' && 'Administrateur'}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/creer-ressource">
                <Button className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Créer une ressource
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ressources favorites</CardTitle>
              <Heart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{favoriteResources.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Vos ressources enregistrées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mes contributions</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myContributions.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Ressources créées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impact total</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {myContributions.reduce((sum, r) => sum + r.views, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Vues sur vos ressources
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Votre progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Ressources consultées</span>
                  <span className="font-medium">12 / 20</span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Exercices complétés</span>
                  <span className="font-medium">5 / 10</span>
                </div>
                <Progress value={50} />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Contributions partagées</span>
                  <span className="font-medium">{myContributions.length} / 5</span>
                </div>
                <Progress value={(myContributions.length / 5) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Mes favoris
            </TabsTrigger>
            <TabsTrigger value="contributions">
              <BookOpen className="h-4 w-4 mr-2" />
              Mes contributions
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Ressources favorites</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteResources.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Vous n'avez pas encore de ressources favorites
                    </p>
                    <Link to="/catalogue">
                      <Button>Explorer le catalogue</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoriteResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(resource.category)}>
                              {getCategoryLabel(resource.category)}
                            </Badge>
                          </div>
                          <Link to={`/ressource/${resource.id}`}>
                            <h3 className="font-semibold hover:text-blue-600 transition-colors">
                              {resource.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {resource.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {resource.commentsCount}
                            </span>
                          </div>
                        </div>
                        <Link to={`/ressource/${resource.id}`}>
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <CardTitle>Mes contributions</CardTitle>
              </CardHeader>
              <CardContent>
                {myContributions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Vous n'avez pas encore créé de ressources
                    </p>
                    <Link to="/creer-ressource">
                      <Button>Créer ma première ressource</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myContributions.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(resource.category)}>
                              {getCategoryLabel(resource.category)}
                            </Badge>
                            {resource.isPublic ? (
                              <Badge variant="outline">Public</Badge>
                            ) : (
                              <Badge variant="secondary">Privé</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {resource.views.toLocaleString()} vues
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {resource.likes} J'aime
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {resource.commentsCount} commentaires
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Link to={`/ressource/${resource.id}`}>
                            <Button size="sm">Voir</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}