import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../../store/authStore';
import { useResourceDetail } from '../../hooks/useRessource';
import { useComments, useAddComment } from '../../hooks/useComment';
import {
  useMyInteractions,
  useRecordInteraction,
  useRemoveInteraction,
} from '../../hooks/useInteraction';

const TYPE_LABELS: Record<string, string> = {
  ARTICLE: 'Article',
  VIDEO: 'Vidéo',
  ACTIVITY: 'Exercice',
  GAME: 'Jeu / Outil',
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { data: resource, isLoading } = useResourceDetail(id!);
  const { data: comments = [] } = useComments(id!);
  const addComment = useAddComment();

  // Toutes les interactions de l'utilisateur pour cette ressource
  const { data: myInteractions = [] } = useMyInteractions(user?._id);
  const recordInteraction = useRecordInteraction();
  const removeInteraction = useRemoveInteraction();

  // IDs des interactions en cours pour cette ressource
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [exploitedId, setExploitedId] = useState<string | null>(null);
  const [viewRecorded, setViewRecorded] = useState(false);

  const [newComment, setNewComment] = useState('');

  // Synchroniser l'état des boutons depuis les interactions chargées
  useEffect(() => {
    if (!id || !myInteractions.length) return;
    const forThisResource = myInteractions.filter(
      (i: any) => i.ressourceId?.toString() === id || i.ressourceId?._id?.toString() === id
    );
    const fav = forThisResource.find((i: any) => i.interactionType === 'FAVORITE');
    const share = forThisResource.find((i: any) => i.interactionType === 'SHARE');
    setFavoriteId(fav?._id ?? null);
    setExploitedId(share?._id ?? null);
  }, [myInteractions, id]);

  // Enregistrer une vue au chargement (une seule fois par session)
  useEffect(() => {
    if (!user || !id || viewRecorded || !resource) return;
    setViewRecorded(true);
    recordInteraction.mutate({ interactionType: 'VIEW', ressourceId: id });
  }, [user, id, resource]);

  // Toggle générique pour FAVORITE / SAVE / SHARE
  const handleToggle = (
    type: 'FAVORITE' | 'SAVE' | 'SHARE',
    currentId: string | null,
    setId: (v: string | null) => void,
    label: { add: string; remove: string }
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      navigate('/connexion');
      return;
    }
    if (currentId) {
      removeInteraction.mutate(currentId, {
        onSuccess: () => { setId(null); toast.success(label.remove); },
        onError: () => toast.error('Erreur lors de la modification'),
      });
    } else {
      recordInteraction.mutate({ interactionType: type, ressourceId: id! }, {
        onSuccess: (interaction: any) => {
          setId(interaction?._id ?? null);
          toast.success(label.add);
        },
        onError: () => toast.error('Erreur lors de la modification'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Chargement de la ressource...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ressource non trouvée</h2>
          <Link to="/catalogue"><Button>Retour au catalogue</Button></Link>
        </div>
      </div>
    );
  }

  const authorName = resource.userId
    ? `${resource.userId.firstname} ${resource.userId.lastname}`
    : 'Anonyme';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Lien copié dans le presse-papier !');
    if (user && !exploitedId) {
      recordInteraction.mutate({ interactionType: 'SHARE', ressourceId: id! }, {
        onSuccess: (interaction: any) => setExploitedId(interaction?._id ?? null),
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      navigate('/connexion');
      return;
    }
    if (!newComment.trim()) return;
    addComment.mutate(
      { resourceId: id!, content: newComment },
      {
        onSuccess: () => {
          setNewComment('');
          toast.success('Commentaire envoyé ! Il sera visible après modération.');
        },
        onError: () => toast.error("Erreur lors de l'envoi du commentaire"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/catalogue">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au catalogue
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {resource.categorie?.name && (
                  <Badge variant="outline">{resource.categorie.name}</Badge>
                )}
                {resource.typeRessource && (
                  <Badge variant="secondary">
                    {TYPE_LABELS[resource.typeRessource] || resource.typeRessource}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{resource.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Par {authorName}</span>
                <span>•</span>
                <span>
                  {new Date(resource.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{(resource.views || 0).toLocaleString()} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length} commentaires</span>
                </div>
              </div>
            </div>

            {/* Barre d'actions — même logique que le Mobile */}
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Enregistrer = FAVORITE */}
              <Button
                variant={favoriteId ? 'default' : 'outline'}
                onClick={() => handleToggle('FAVORITE', favoriteId, setFavoriteId, {
                  add: 'Ajouté aux favoris !',
                  remove: 'Retiré des favoris',
                })}
                disabled={recordInteraction.isPending || removeInteraction.isPending}
                className="flex-1 sm:flex-none"
              >
                {favoriteId ? (
                  <><BookmarkCheck className="h-4 w-4 mr-2" />Enregistré</>
                ) : (
                  <><Bookmark className="h-4 w-4 mr-2" />Enregistrer</>
                )}
              </Button>

              {/* Partager = copie le lien + enregistre SHARE */}
              <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <p className="text-lg text-gray-700">{resource.description}</p>
            </div>

            {resource.content && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Contenu</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{resource.content}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commentaires */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">
              Commentaires ({comments.length})
            </h2>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <Textarea
                  placeholder="Partagez votre expérience ou posez une question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={4}
                />
                <Button type="submit" disabled={!newComment.trim() || addComment.isPending}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {addComment.isPending ? 'Envoi...' : 'Publier'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Votre commentaire sera vérifié avant publication.
                </p>
              </form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">
                  Vous devez être connecté pour commenter
                </p>
                <Link to="/connexion"><Button size="sm">Se connecter</Button></Link>
              </div>
            )}

            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Aucun commentaire pour l'instant. Soyez le premier !
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment: any) => {
                  // authorId est populé { _id, firstname, lastname }
                  const author = comment.authorId;
                  const authorName = author?.firstname
                    ? `${author.firstname} ${author.lastname}`
                    : `Utilisateur #${author?.toString().slice(-4) ?? '????'}`;
                  return (
                    <div key={comment._id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{authorName}</span>
                        <span className="text-xs text-gray-500">
                          {comment.date
                            ? new Date(comment.date).toLocaleDateString('fr-FR')
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
