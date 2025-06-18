
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, BookOpen, Dumbbell, TrendingUp, Target } from 'lucide-react';

interface ClientDashboardProps {
  userName: string;
  onLogout: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userName, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JA</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent">
              JA Dietética - Panel Cliente
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-nutrition-black font-medium">Hola, {userName}</span>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nutrition-black mb-4">
            ¡Bienvenido a tu Panel Personal!
          </h2>
          <p className="text-lg text-nutrition-gray">
            Aquí podrás seguir tu progreso, acceder a tus planes personalizados y mantener contacto directo con José Antonio.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* My Profile */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-green">
                <User className="w-5 h-5" />
                <span>Mi Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Gestiona tu información personal y objetivos</p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Perfil
              </Button>
            </CardContent>
          </Card>

          {/* My Diet Plan */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-green-emerald">
                <BookOpen className="w-5 h-5" />
                <span>Mi Plan Nutricional</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Accede a tu plan de alimentación personalizado</p>
              <Button className="w-full bg-nutrition-green-emerald hover:bg-nutrition-accent-dark text-white">
                Ver Plan
              </Button>
            </CardContent>
          </Card>

          {/* My Workouts */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-green-sage">
                <Dumbbell className="w-5 h-5" />
                <span>Mis Entrenamientos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Rutinas de ejercicio diseñadas para ti</p>
              <Button className="w-full bg-nutrition-green-sage hover:bg-nutrition-green-dark text-white">
                Ver Rutinas
              </Button>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-accent">
                <TrendingUp className="w-5 h-5" />
                <span>Mi Progreso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Sigue tu evolución y resultados</p>
              <Button className="w-full bg-nutrition-accent hover:bg-nutrition-accent-dark text-white">
                Ver Progreso
              </Button>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-green-dark">
                <Calendar className="w-5 h-5" />
                <span>Mi Calendario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Citas y seguimientos programados</p>
              <Button className="w-full bg-nutrition-green-dark hover:bg-nutrition-green-darker text-white">
                Ver Calendario
              </Button>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-nutrition-green-forest">
                <Target className="w-5 h-5" />
                <span>Mis Objetivos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">Define y alcanza tus metas</p>
              <Button className="w-full bg-nutrition-green-forest hover:bg-nutrition-green-darker text-white">
                Ver Objetivos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Contactar con José Antonio
              </Button>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Actualizar Medidas
              </Button>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Descargar Recursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClientDashboard;
