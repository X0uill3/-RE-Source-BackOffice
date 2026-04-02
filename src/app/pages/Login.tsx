import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users } from 'lucide-react';
import { login } from '../data/mockData';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = login(email, password);

    if (user) {
      toast.success(`Bienvenue, ${user.name} !`);
      navigate('/tableau-de-bord');
    } else {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-600 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">(RE)Sources Relationnelles</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Accédez à vos ressources favorites et votre progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@example.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Comptes de démonstration :</p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-medium">Citoyen :</p>
                  <p className="text-gray-600">marie.dupont@example.fr</p>
                </div>
                <div>
                  <p className="font-medium">Modérateur :</p>
                  <p className="text-gray-600">jean.martin@example.fr</p>
                </div>
                <div>
                  <p className="font-medium">Admin :</p>
                  <p className="text-gray-600">sophie.bernard@example.fr</p>
                </div>
                <p className="text-gray-500 italic mt-2">
                  Mot de passe : n'importe quelle valeur
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Vous n'avez pas de compte ? </span>
              <Link to="/inscription" className="text-blue-600 hover:underline font-medium">
                Inscrivez-vous
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="ghost">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
