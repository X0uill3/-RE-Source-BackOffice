import { useNavigate, Link } from 'react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Heart, BookOpen, TrendingUp, Eye, LogOut, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../../store/authStore';
import { useMyContributions } from '../../hooks/useRessource';
import { useMyFavorites, useMyInteractions } from '../../hooks/useInteraction';

const GOAL_VIEWED = 10;
const GOAL_EXPLOITED = 5;
const GOAL_CONTRIBUTIONS = 5;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { data: myContributions = [], isLoading: isLoadingContributions } =
    useMyContributions(user?._id);
  const { data: favoriteResources = [], isLoading: isLoadingFavorites } =
    useMyFavorites(user?._id);
  const { data: myInteractions = [], isLoading: isLoadingInteractions } =
    useMyInteractions(user?._id);

  useEffect(() => {
    if (!user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/connexion');
    }
  }, [user, navigate]);

  if (!user) return null;

  if (isLoadingContributions || isLoadingFavorites || isLoadingInteractions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Chargement de votre espace personnel...
        </p>
      </div>
    );
  }

  // Ressources consultées = interactions VIEW dédupliquées par ressourceId
  const viewedResourceIds = new Set(
    myInteractions
      .filter((i: any) => i.interactionType === 'VIEW')
      .map((i: any) => i.ressourceId?.toString() ?? i.ressourceId)
  );
  const viewedCount = viewedResourceIds.size;

  // Exercices exploités = interactions SHARE
  const exploitedCount = myInteractions.filter(
    (i: any) => i.interactionType === 'SHARE'
  ).length;

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
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
                Bienvenue, <span className="font-semibold">{user.firstname}</span> !
              </p>
              <Badge variant="outline" className="mt-2">
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
              <p className="text-xs text-gray-500 mt-1">Vos ressources enregistrées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mes contributions</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myContributions.length}</div>
              <p className="text-xs text-gray-500 mt-1">Ressources créées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impact total</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {myContributions
                  .reduce((sum: number, r: any) => sum + (r.views || 0), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Vues sur vos ressources</p>
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
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    Ressources consultées
                  </span>
                  <span className="font-medium">
                    {viewedCount} / {GOAL_VIEWED}
                  </span>
                </div>
                <Progress value={Math.min((viewedCount / GOAL_VIEWED) * 100, 100)} />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ressources exploitées
                  </span>
                  <span className="font-medium">
                    {exploitedCount} / {GOAL_EXPLOITED}
                  </span>
                </div>
                <Progress value={Math.min((exploitedCount / GOAL_EXPLOITED) * 100, 100)} />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    Contributions partagées
                  </span>
                  <span className="font-medium">
                    {myContributions.length} / {GOAL_CONTRIBUTIONS}
                  </span>
                </div>
                <Progress
                  value={Math.min((myContributions.length / GOAL_CONTRIBUTIONS) * 100, 100)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Mes favoris ({favoriteResources.length})
            </TabsTrigger>
            <TabsTrigger value="contributions">
              <BookOpen className="h-4 w-4 mr-2" />
              Mes contributions ({myContributions.length})
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
                    {favoriteResources.map((interaction: any) => {
                      const resource = interaction.ressourceId || interaction;
                      const resourceId = resource._id || resource.id;
                      return (
                        <div
                          key={interaction._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                {resource.categorie?.name || 'Ressource'}
                              </Badge>
                            </div>
                            <Link to={`/ressource/${resourceId}`}>
                              <h3 className="font-semibold hover:text-blue-600 transition-colors">
                                {resource.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(resource.views || 0).toLocaleString()} vues
                              </span>
                            </div>
                          </div>
                          <Link to={`/ressource/${resourceId}`}>
                            <Button size="sm" variant="outline">
                              Voir
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
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
                    {myContributions.map((resource: any) => (
                      <div
                        key={resource._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {resource.categorie?.name || 'Ressource'}
                            </Badge>
                            {resource.visibility === 'Public' ? (
                              <Badge variant="outline">Public</Badge>
                            ) : (
                              <Badge variant="secondary">Privé</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {(resource.views || 0).toLocaleString()} vues
                            </span>
                          </div>
                        </div>
                        <Link to={`/ressource/${resource._id}`}>
                          <Button size="sm">Voir</Button>
                        </Link>
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
