import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Shield,
  Users,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../../store/authStore';
import { useMyContributions } from '../../hooks/useRessource';
import { useComments } from '../../hooks/useComment';
import { useUsers, useDeleteUser, useModerateComment, useToggleResource } from '../../hooks/useAdmin';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Vrai utilisateur depuis Zustand
  const { user } = useAuthStore();

  // ✅ Vrais hooks de données
  const { data: resources = [], isLoading: isLoadingResources } = useMyContributions(user?.id || '');
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: comments = [], isLoading: isLoadingComments } = useComments('');

  const deleteUser = useDeleteUser();
  const moderateComment = useModerateComment();
  const toggleResource = useToggleResource();

  // ✅ Vrai garde de connexion et de rôle
  if (!user) {
    toast.error('Vous devez être connecté pour accéder à cette page');
    navigate('/connexion');
    return null;
  }

  if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
    toast.error('Accès refusé : vous devez être administrateur ou modérateur');
    navigate('/');
    return null;
  }

  if (isLoadingResources || isLoadingUsers || isLoadingComments) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Chargement du panel admin...</p>
      </div>
    );
  }

  const pendingComments = comments.filter((c: any) => !c.isModerated);
  const publicResources = resources.filter((r: any) => r.isPublic);

  const handleApproveComment = (commentId: string) => {
    moderateComment.mutate({ commentId, action: 'approve' });
    toast.success('Commentaire approuvé');
  };

  const handleRejectComment = (commentId: string) => {
    moderateComment.mutate({ commentId, action: 'reject' });
    toast.success('Commentaire rejeté');
  };

  const handleToggleResource = (resourceId: string, isPublic: boolean) => {
    toggleResource.mutate({ resourceId, isPublic });
    toast.success(isPublic ? 'Ressource dépubliée' : 'Ressource publiée');
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(userId);
    toast.success('Utilisateur supprimé');
  };

  const filteredUsers = users.filter(
    (u: any) =>
      u.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = publicResources.filter(
    (r: any) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold">Panel d'administration</h1>
          </div>
          <p className="text-gray-600">Modération des contenus et gestion des utilisateurs</p>
          <Badge variant="outline" className="mt-2">
            {user.role === 'ADMIN' ? 'Administrateur' : 'Modérateur'}
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ressources publiques</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publicResources.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commentaires totaux</CardTitle>
              <MessageCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{comments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingComments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="comments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="comments">
              <MessageCircle className="h-4 w-4 mr-2" />
              Modération
              {pendingComments.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {pendingComments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="h-4 w-4 mr-2" />
              Ressources
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          {/* Modération des commentaires */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Commentaires en attente de modération</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingComments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun commentaire en attente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingComments.map((comment: any) => {
                      const resource = resources.find((r: any) => r._id === comment.ressourceId);
                      return (
                        <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  Utilisateur {comment.authorId?.slice(-4)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                              {resource && (
                                <Link to={`/ressource/${resource._id}`}>
                                  <Button variant="link" size="sm" className="p-0 h-auto">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Voir la ressource : {resource.title}
                                  </Button>
                                </Link>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveComment(comment._id)}
                                disabled={moderateComment.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectComment(comment._id)}
                                disabled={moderateComment.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeter
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des ressources */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Gestion des ressources</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Auteur</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Vues</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource: any) => (
                        <TableRow key={resource._id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {resource.title}
                          </TableCell>
                          <TableCell>{resource.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {resource.categorie?.name || resource.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{(resource.views || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={resource.isPublic ? 'default' : 'secondary'}>
                              {resource.isPublic ? 'Public' : 'Privé'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link to={`/ressource/${resource._id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant={resource.isPublic ? 'destructive' : 'default'}
                                onClick={() => handleToggleResource(resource._id, resource.isPublic)}
                                disabled={toggleResource.isPending}
                              >
                                {resource.isPublic ? 'Dépublier' : 'Publier'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u: any) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">
                            {u.firstname} {u.lastname}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                u.role === 'ADMIN'
                                  ? 'destructive'
                                  : u.role === 'MODERATOR'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {u.role === 'ADMIN'
                                ? 'Administrateur'
                                : u.role === 'MODERATOR'
                                ? 'Modérateur'
                                : 'Citoyen'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            {user.role === 'ADMIN' && u._id !== user._id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(u._id)}
                                disabled={deleteUser.isPending}
                              >
                                Supprimer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}