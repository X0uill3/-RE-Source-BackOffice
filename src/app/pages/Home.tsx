import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Users, BookOpen, MessageCircle, Shield, TrendingUp, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              (RE)Sources Relationnelles
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Créez, renforcez et enrichissez vos relations pour améliorer votre qualité de vie
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Une plateforme du Ministère des Solidarités et de la Santé pour vous accompagner dans vos relations familiales, amicales, professionnelles et de voisinage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogue">
                <Button size="lg" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explorer les ressources
                </Button>
              </Link>
              <Link to="/inscription">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Une plateforme accessible à tous
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Accessibilité universelle</h3>
                  <p className="text-gray-600 text-sm">
                    Pour tous les citoyens, sans distinction d'âge, de situation sociale ou d'origine
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ressources variées</h3>
                  <p className="text-gray-600 text-sm">
                    Articles, vidéos, exercices pratiques et outils interactifs adaptés à vos besoins
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Communauté bienveillante</h3>
                  <p className="text-gray-600 text-sm">
                    Partagez, commentez et échangez avec d'autres citoyens dans un espace modéré
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Suivi personnalisé</h3>
                  <p className="text-gray-600 text-sm">
                    Enregistrez vos favoris et suivez votre progression dans vos apprentissages
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Contribution active</h3>
                  <p className="text-gray-600 text-sm">
                    Créez et partagez vos propres ressources pour enrichir la plateforme
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Sécurité & conformité</h3>
                  <p className="text-gray-600 text-sm">
                    Plateforme conforme RGPD et RGAA, avec données chiffrées et anonymisées
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Types de relations
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez des ressources adaptées à chaque sphère de votre vie relationnelle
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Famille', emoji: '👨‍👩‍👧‍����', color: 'bg-pink-500' },
              { name: 'Amis', emoji: '🤝', color: 'bg-yellow-500' },
              { name: 'Collègues', emoji: '💼', color: 'bg-blue-500' },
              { name: 'Voisins', emoji: '🏘️', color: 'bg-green-500' },
              { name: 'Communauté', emoji: '🌍', color: 'bg-purple-500' },
            ].map((category) => (
              <Link key={category.name} to="/catalogue">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center">
                      <div className={`h-16 w-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 text-3xl`}>
                        {category.emoji}
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à enrichir vos relations ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers de citoyens qui utilisent déjà (RE)Sources Relationnelles pour améliorer leur qualité de vie
          </p>
          <Link to="/inscription">
            <Button size="lg" className="text-lg px-8">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
