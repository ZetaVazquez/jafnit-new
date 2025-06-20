
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Target, 
  TrendingUp, 
  Calendar, 
  Apple, 
  Dumbbell,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MyGoals from './MyGoals';
import MyProgress from './MyProgress';
import MyDiets from './MyDiets';
import MyWorkouts from './MyWorkouts';
import UserProfile from './UserProfile';

const ClientDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleSignOut = async () => {
    await signOut();
  };

  if (currentView === 'goals') {
    return <MyGoals onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'progress') {
    return <MyProgress onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'diets') {
    return <MyDiets onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'workouts') {
    return <MyWorkouts onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'profile') {
    return <UserProfile onGoBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-nutrition-green transition-all"
                onClick={() => setCurrentView('profile')}
              >
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="bg-nutrition-green text-white">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-nutrition-black">
                  ¡Hola, {profile?.name || 'Usuario'}!
                </h1>
                <p className="text-nutrition-gray">Bienvenido a tu panel de control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-nutrition-gray hover:text-nutrition-green"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Objetivos de Hoy</p>
                  <p className="text-2xl font-bold">3/4</p>
                </div>
                <Target className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Entrenamientos</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Dumbbell className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Días Activos</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('profile')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <User className="w-5 h-5 mr-2" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Gestiona tu información personal, configuraciones y preferencias.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Goals Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('goals')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Target className="w-5 h-5 mr-2" />
                Mis Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Sigue y completa tus objetivos diarios de salud y bienestar.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Objetivos
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('progress')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <TrendingUp className="w-5 h-5 mr-2" />
                Mi Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Visualiza tu evolución y logros a lo largo del tiempo.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Progreso
              </Button>
            </CardContent>
          </Card>

          {/* Diet Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('diets')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Apple className="w-5 h-5 mr-2" />
                Mi Plan Nutricional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Accede a tu plan de alimentación personalizado y recetas.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Plan
              </Button>
            </CardContent>
          </Card>

          {/* Workouts Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('workouts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Dumbbell className="w-5 h-5 mr-2" />
                Mis Entrenamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Descubre y sigue tus rutinas de ejercicios personalizadas.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Entrenamientos
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Calendar className="w-5 h-5 mr-2" />
                Mi Agenda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Programa y gestiona tus citas y entrenamientos.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Agenda
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
