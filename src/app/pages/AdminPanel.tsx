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
  Trash2,
  Search,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../../store/authStore';
import { useAllResources } from '../../hooks/useRessource';
import { useAllComments } from '../../hooks/useComment';
import { useUsers, useDeleteUser, useDeleteComment, useToggleResourceVisibility } from '../../hooks/useAdmin';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuthStore();

  const { data: resources = [], isLoading: isLoadingResources } = useAllResources();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: comments = [], isLoading: isLoadingComments } = useAllComments();

  const deleteUser = useDeleteUser();
  const deleteComment = useDeleteComment();
  const toggleVisibility = useToggleResourceVisibility();

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

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate(commentId, {
      onSuccess: () => toast.success('Commentaire supprimé'),
      onError: () => toast.error('Erreur lors de la suppression'),
    });
  };

  const handleToggleResource = (resourceId: string, visibility: string) => {
    toggleVisibility.mutate({ resourceId, visibility }, {
      onSuccess: () => toast.success(visibility === 'Public' ? 'Ressource dépubliée' : 'Ressource publiée'),
      onError: () => toast.error('Erreur lors de la modification'),
    });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(userId, {
      onSuccess: () => toast.success('Utilisateur supprimé'),
      onError: () => toast.error('Erreur lors de la suppression'),
    });
  };

  const filteredUsers = users.filter(
    (u: any) =>
      u.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(
    (r: any) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
              <MessageCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{comments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="comments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="comments">
              <MessageCircle className="h-4 w-4 mr-2" />
              Commentaires
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

          {/* Commentaires */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commentaires</CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun commentaire</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">
                                Utilisateur {comment.authorId?.toString().slice(-4)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                            <Link to={`/ressource/${comment.ressourceId}`}>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                <Eye className="h-3 w-3 mr-1" />
                                Voir la ressource
                              </Button>
                            </Link>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteComment(comment._id)}
                            disabled={deleteComment.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ressources */}
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
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Vues</TableHead>
                        <TableHead>Visibilité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource: any) => (
                        <TableRow key={resource._id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {resource.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {resource.categorie?.name || '—'}
                            </Badge>
                          </TableCell>
                          <TableCell>{(resource.views || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={resource.visibility === 'Public' ? 'default' : 'secondary'}>
                              {resource.visibility || 'Privé'}
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
                                variant={resource.visibility === 'Public' ? 'destructive' : 'default'}
                                onClick={() => handleToggleResource(resource._id, resource.visibility)}
                                disabled={toggleVisibility.isPending}
                              >
                                {resource.visibility === 'Public' ? 'Dépublier' : 'Publier'}
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

          {/* Utilisateurs */}
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
