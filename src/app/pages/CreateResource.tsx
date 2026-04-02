import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { currentUser, type ResourceCategory, type ResourceType } from '../data/mockData';
import { toast } from 'sonner';
import { Link } from 'react-router';

export default function CreateResource() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('famille');
  const [type, setType] = useState<ResourceType>('article');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour créer une ressource');
      navigate('/connexion');
    }
  }, [navigate]);

  if (!currentUser) {
    return null;
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    toast.success(
      isPublic
        ? 'Ressource créée avec succès ! Elle est maintenant visible par tous.'
        : 'Ressource créée et enregistrée en privé.'
    );
    navigate('/tableau-de-bord');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/tableau-de-bord">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Créer une ressource</h1>
          <p className="text-gray-600 mt-2">
            Partagez votre expérience et vos conseils avec la communauté
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de la ressource</CardTitle>
              <CardDescription>
                Remplissez les champs ci-dessous pour créer votre ressource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Comment organiser un repas familial inclusif"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description courte <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Résumé de votre ressource (2-3 phrases)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Catégorie <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ResourceCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="famille">Famille</SelectItem>
                      <SelectItem value="amis">Amis</SelectItem>
                      <SelectItem value="collegues">Collègues</SelectItem>
                      <SelectItem value="voisins">Voisins</SelectItem>
                      <SelectItem value="communaute">Communauté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type de ressource <span className="text-red-500">*</span>
                  </Label>
                  <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                      <SelectItem value="exercice">Exercice</SelectItem>
                      <SelectItem value="outil">Outil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Contenu détaillé <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Développez votre ressource en détail..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                />
                <p className="text-xs text-gray-500">
                  Partagez vos conseils, étapes à suivre, exemples concrets, etc.
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Mots-clés (tags)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Ajouter un mot-clé"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Ressource publique</Label>
                  <p className="text-sm text-gray-500">
                    Rendre cette ressource visible par tous les utilisateurs
                  </p>
                </div>
                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {!isPublic && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="text-blue-800">
                    Cette ressource sera enregistrée en privé et visible uniquement par vous.
                    Vous pourrez la rendre publique plus tard depuis votre tableau de bord.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Link to="/tableau-de-bord">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="w-full sm:w-auto">
              {isPublic ? 'Publier la ressource' : 'Enregistrer en privé'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
