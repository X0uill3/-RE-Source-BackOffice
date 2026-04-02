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
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import {
  mockResources,
  mockComments,
  currentUser,
  toggleFavorite,
  isFavorite,
  type ResourceCategory,
  type ResourceType,
} from '../data/mockData';
import { toast } from 'sonner';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const resource = mockResources.find((r) => r.id === id);
  const comments = mockComments.filter((c) => c.resourceId === id);

  useEffect(() => {
    if (id) {
      setIsFav(isFavorite(id));
    }
  }, [id]);

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ressource non trouvée</h2>
          <Link to="/catalogue">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const getTypeLabel = (type: ResourceType) => {
    const labels: Record<ResourceType, string> = {
      article: 'Article',
      video: 'Vidéo',
      exercice: 'Exercice',
      outil: 'Outil',
    };
    return labels[type];
  };

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Ressource retirée des favoris' : 'Ressource ajoutée aux favoris');
  };

  const handleToggleFavorite = () => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour ajouter des favoris');
      navigate('/connexion');
      return;
    }
    const newState = toggleFavorite(resource.id);
    setIsFav(newState);
    toast.success(newState ? 'Ajouté aux favoris' : 'Retiré des favoris');
  };

  const handleShare = () => {
    toast.success('Lien copié dans le presse-papier');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour commenter');
      navigate('/connexion');
      return;
    }
    if (!newComment.trim()) return;

    toast.success('Commentaire envoyé ! Il sera visible après modération.');
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
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

      {/* Resource Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={getCategoryColor(resource.category)}>
                  {getCategoryLabel(resource.category)}
                </Badge>
                <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{resource.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Par {resource.author}</span>
                <span>•</span>
                <span>{new Date(resource.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{resource.views.toLocaleString()} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{resource.likes} J'aime</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{resource.commentsCount} commentaires</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant={isLiked ? 'default' : 'outline'}
                onClick={handleLike}
                className="flex-1 sm:flex-none"
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                J'aime
              </Button>
              <Button
                variant={isFav ? 'default' : 'outline'}
                onClick={handleToggleFavorite}
                className="flex-1 sm:flex-none"
              >
                {isFav ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                    Enregistré
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="prose prose-sm md:prose max-w-none mb-6">
              <p className="text-lg text-gray-700">{resource.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Content */}
            <div className="prose prose-sm md:prose max-w-none">
              <h2>Contenu</h2>
              <p>{resource.content}</p>
              <p className="text-gray-600">
                Ce contenu détaillé vous guide étape par étape pour mettre en pratique
                les conseils et améliorer vos relations {getCategoryLabel(resource.category).toLowerCase()}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">
              Commentaires ({comments.length})
            </h2>

            {/* New Comment Form */}
            {currentUser ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <Textarea
                  placeholder="Partagez votre expérience ou posez une question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={4}
                />
                <Button type="submit" disabled={!newComment.trim()}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Publier
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Votre commentaire sera vérifié par notre équipe de modération avant publication.
                </p>
              </form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">
                  Vous devez être connecté pour commenter
                </p>
                <Link to="/connexion">
                  <Button size="sm">Se connecter</Button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à partager votre avis !
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {comment.isModerated && (
                        <Badge variant="outline" className="text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
