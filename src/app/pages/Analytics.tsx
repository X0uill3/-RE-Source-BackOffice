import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, Users, Eye, MessageCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../../store/authStore';
import { useMyContributions } from '../../hooks/useRessource';
import { useUsers } from '../../hooks/useAdmin';
import { useComments } from '../../hooks/useComment';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const navigate = useNavigate();

  // ✅ Vrai utilisateur depuis Zustand
  const { user } = useAuthStore();

  // ✅ Données réelles pour les KPIs
  const { data: resources = [] } = useMyContributions(user?.id || '');
  const { data: users = [] } = useUsers();
  const { data: comments = [] } = useComments('');

  // ✅ Vrai garde de connexion et de rôle
  if (!user) {
    toast.error('Vous devez être connecté pour accéder à cette page');
    navigate('/connexion');
    return null;
  }

  if (user.role !== 'ADMIN') {
    toast.error('Accès refusé : vous devez être administrateur');
    navigate('/');
    return null;
  }

  // Calcul des stats depuis les vraies données
  const totalViews = resources.reduce((sum: number, r: any) => sum + (r.views || 0), 0);

  // Distribution par catégorie
  const categoryMap: Record<string, number> = {};
  resources.forEach((r: any) => {
    const name = r.categorie?.name || 'Autre';
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Distribution par type
  const typeMap: Record<string, number> = {};
  resources.forEach((r: any) => {
    const name = r.type || r.typeRessource || 'Autre';
    typeMap[name] = (typeMap[name] || 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Distribution par rôle
  const roleMap: Record<string, number> = {};
  users.forEach((u: any) => {
    const role =
      u.role === 'ADMIN' ? 'Administrateur' : u.role === 'MODERATOR' ? 'Modérateur' : 'Citoyen';
    roleMap[role] = (roleMap[role] || 0) + 1;
  });
  const roleData = Object.entries(roleMap).map(([name, value]) => ({ name, value }));

  // Top 5 ressources par vues
  const topResources = [...resources]
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((r: any) => ({ title: r.title, views: r.views || 0 }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold">Analytics & Statistiques</h1>
          </div>
          <p className="text-gray-600">
            Tableau de bord des performances et de l'utilisation de la plateforme
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ressources</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resources.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
              <Eye className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
              <MessageCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{comments.length.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources les plus consultées</CardTitle>
              <CardDescription>Top 5</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topResources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ressources par catégorie - Bar chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources par catégorie</CardTitle>
              <CardDescription>Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Ressources" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resources by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources par type</CardTitle>
              <CardDescription>Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Users by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs par rôle</CardTitle>
              <CardDescription>Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {roleData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Export */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Export des données</CardTitle>
            <CardDescription>
              Téléchargez les statistiques complètes pour vos rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => toast.success('Export CSV en cours...')}
              >
                Exporter en CSV
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                onClick={() => toast.success('Export Excel en cours...')}
              >
                Exporter en Excel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                onClick={() => toast.success('Export PDF en cours...')}
              >
                Exporter en PDF
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}