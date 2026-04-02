import { Outlet, Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Menu, X, Heart, Users, BookOpen, BarChart3, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(currentUser);
  const location = useLocation();

  useEffect(() => {
    setUser(currentUser);
    setMobileMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
  ];

  const userNavigation = user
    ? [
      { name: 'Mon tableau de bord', href: '/tableau-de-bord', icon: Heart },
      { name: 'Créer une ressource', href: '/creer-ressource', icon: BookOpen },
      ...(user.role === 'admin' || user.role === 'moderateur'
        ? [
          { name: 'Administration', href: '/admin', icon: Settings },
          { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        ]
        : []),
    ]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">(RE)Sources</span>
                <span className="text-sm text-gray-600 leading-none">Relationnel</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Bonjour, <span className="font-medium">{user.name}</span>
                  </span>
                  {userNavigation.map((item) => (
                    <Link key={item.name} to={item.href}>
                      <Button
                        variant={location.pathname === item.href ? 'default' : 'ghost'}
                        size="sm"
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/connexion">
                    <Button variant="ghost" size="sm">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/inscription">
                    <Button size="sm">Inscription</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 text-base font-medium rounded-md ${location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Connecté en tant que <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${location.pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="space-y-2 px-4 pt-2">
                  <Link to="/connexion" className="block">
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/inscription" className="block">
                    <Button className="w-full">Inscription</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="font-bold">(RE)Sources Relationnelles</span>
              </div>
              <p className="text-sm text-gray-600">
                Plateforme du Ministère des Solidarités et de la Santé pour renforcer les liens sociaux.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Liens utiles</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/catalogue" className="text-gray-600 hover:text-blue-600">
                    Catalogue de ressources
                  </Link>
                </li>
                <li>
                  <Link to="/inscription" className="text-gray-600 hover:text-blue-600">
                    Créer un compte
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Aide et support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Conformité</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Conforme RGPD</li>
                <li>✓ Accessible RGAA</li>
                <li>✓ Données chiffrées</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2026 Ministère des Solidarités et de la Santé - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
