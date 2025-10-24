'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Images, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';

interface Booking {
  _id: string;
  bookingNumber: string;
  clientInfo: {
    name: string;
    phone: string;
  };
  serviceType: string;
  scheduledDate: string;
  location?: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  weeklyBookings: number;
  totalRevenue: number;
  uniqueClients: number;
}

const upcomingEvents = [
  {
    title: 'Mariage - Famille KOFFI',
    date: "Aujourd'hui",
    time: '14h00',
    location: 'Hôtel Sarakawa',
    status: 'confirmed' as const,
  },
  {
    title: 'Portrait Corporate - M. ADJEI',
    date: 'Demain',
    time: '10h00',
    location: 'Studio VisionFocale',
    status: 'confirmed' as const,
  },
  {
    title: 'Événement - Lancement Produit',
    date: 'Samedi',
    time: '16h00',
    location: 'Centre de Conférences',
    status: 'pending' as const,
  },
];

const alerts = [
  {
    type: 'warning',
    message: '3 galeries expirent dans 7 jours',
    action: 'Voir les galeries',
  },
  {
    type: 'info',
    message: '5 clients n\'ont pas encore téléchargé leurs photos',
    action: 'Envoyer rappels',
  },
  {
    type: 'success',
    message: 'Backup automatique effectué avec succès',
    action: 'Voir détails',
  },
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    weeklyBookings: 0,
    totalRevenue: 0,
    uniqueClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const data = await response.json();

      if (data.success) {
        const allBookings = data.data;
        setBookings(allBookings);

        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyBookings = allBookings.filter(
          (b: Booking) => new Date(b.createdAt) > oneWeekAgo
        ).length;

        const uniqueClients = new Set(
          allBookings.map((b: Booking) => b.clientInfo.phone)
        ).size;

        const totalRevenue = allBookings
          .filter((b: Booking) => b.status === 'completed')
          .reduce((sum: number, b: any) => sum + (b.pricing?.total || 0), 0);

        setStats({
          totalBookings: allBookings.length,
          weeklyBookings,
          totalRevenue,
          uniqueClients,
        });
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Revenus du mois',
      value: `${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: `${stats.totalBookings} réservations`,
      changeType: 'neutral' as const,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Réservations',
      value: stats.totalBookings.toString(),
      change: `+${stats.weeklyBookings} cette semaine`,
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Galeries créées',
      value: '0',
      change: 'À venir',
      changeType: 'neutral' as const,
      icon: Images,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Clients uniques',
      value: stats.uniqueClients.toString(),
      change: `${stats.totalBookings} réservations`,
      changeType: 'neutral' as const,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const recentActivities = bookings
    .slice(0, 5)
    .map((booking) => ({
      type: 'booking',
      message: `Nouvelle réservation: ${booking.serviceType} - ${booking.clientInfo.name}`,
      time: new Date(booking.createdAt).toLocaleDateString('fr-FR'),
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
    }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">
          Bienvenue! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{activity.message}</p>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : alert.type === 'info'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <p className="text-sm font-medium text-neutral-900 mb-1">{alert.message}</p>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    {alert.action} →
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous à venir (7 prochains jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center text-white">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{event.title}</h3>
                    <p className="text-sm text-neutral-600">
                      {event.date} à {event.time} • {event.location}
                    </p>
                  </div>
                </div>
                <Badge variant={event.status === 'confirmed' ? 'success' : 'warning'}>
                  {event.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

