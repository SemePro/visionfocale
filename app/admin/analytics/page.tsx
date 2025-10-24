'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Camera,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Heart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for analytics
const analyticsData = {
  overview: {
    totalRevenue: {
      current: 3250000,
      previous: 2890000,
      change: 12.5,
    },
    totalClients: {
      current: 127,
      previous: 98,
      change: 29.6,
    },
    totalBookings: {
      current: 45,
      previous: 38,
      change: 18.4,
    },
    totalPhotos: {
      current: 8540,
      previous: 7200,
      change: 18.6,
    },
  },
  monthlyRevenue: [
    { month: 'Jan', amount: 450000 },
    { month: 'Fév', amount: 520000 },
    { month: 'Mar', amount: 480000 },
    { month: 'Avr', amount: 620000 },
    { month: 'Mai', amount: 580000 },
    { month: 'Jun', amount: 690000 },
    { month: 'Jul', amount: 750000 },
    { month: 'Aoû', amount: 820000 },
    { month: 'Sep', amount: 780000 },
    { month: 'Oct', amount: 890000 },
  ],
  topServices: [
    { name: 'Mariage & Cérémonie', bookings: 18, revenue: 4500000, growth: 15 },
    { name: 'Événement Corporate', bookings: 12, revenue: 1800000, growth: 22 },
    { name: 'Portrait Professionnel', bookings: 8, revenue: 240000, growth: -5 },
    { name: 'Photo de Famille', bookings: 5, revenue: 250000, growth: 10 },
    { name: 'Shooting Produit', bookings: 2, revenue: 150000, growth: 0 },
  ],
  clientEngagement: {
    totalViews: 45230,
    totalDownloads: 3420,
    totalLikes: 1890,
    avgDownloadsPerGallery: 28.5,
    avgViewsPerGallery: 315,
  },
  topClients: [
    { name: 'Entreprise TechCorp', spent: 750000, bookings: 3, status: 'vip' },
    { name: 'Sarah & Paul Mensah', spent: 350000, bookings: 1, status: 'active' },
    { name: 'Kofi Adjei', spent: 180000, bookings: 2, status: 'active' },
    { name: 'Aminata Diallo', spent: 250000, bookings: 1, status: 'active' },
  ],
  recentActivity: [
    { type: 'booking', description: 'Nouvelle réservation - Mariage', time: '2h' },
    { type: 'payment', description: 'Paiement reçu - 350K FCFA', time: '4h' },
    { type: 'gallery', description: 'Galerie créée - TechCorp Event', time: '6h' },
    { type: 'download', description: '45 photos téléchargées', time: '8h' },
  ],
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map((m) => m.amount));

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Analytics & Statistiques</h1>
          <p className="text-neutral-600">Visualisez les performances de votre studio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" leftIcon={<Download size={20} />}>
            Exporter rapport
          </Button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p
                ? 'bg-primary-500 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {p === 'week' ? 'Cette semaine' : p === 'month' ? 'Ce mois' : 'Cette année'}
          </button>
        ))}
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Revenus totaux</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {(analyticsData.overview.totalRevenue.current / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight size={16} />
                <span className="font-medium">+{analyticsData.overview.totalRevenue.change}%</span>
              </div>
              <span className="text-neutral-500">vs période précédente</span>
            </div>
          </CardContent>
        </Card>

        {/* Clients */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total clients</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {analyticsData.overview.totalClients.current}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight size={16} />
                <span className="font-medium">+{analyticsData.overview.totalClients.change}%</span>
              </div>
              <span className="text-neutral-500">nouveaux clients</span>
            </div>
          </CardContent>
        </Card>

        {/* Bookings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Réservations</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {analyticsData.overview.totalBookings.current}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight size={16} />
                <span className="font-medium">+{analyticsData.overview.totalBookings.change}%</span>
              </div>
              <span className="text-neutral-500">ce mois</span>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Photos livrées</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {(analyticsData.overview.totalPhotos.current / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight size={16} />
                <span className="font-medium">+{analyticsData.overview.totalPhotos.change}%</span>
              </div>
              <span className="text-neutral-500">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyRevenue.map((item, idx) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-neutral-600 w-12">{item.month}</span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {(item.amount / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  {idx === analyticsData.monthlyRevenue.length - 1 && (
                    <Badge variant="success" size="sm">
                      Actuel
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600 flex items-center gap-2">
                  <Eye size={16} className="text-primary-500" />
                  Vues totales
                </span>
                <span className="font-bold text-neutral-900">
                  {analyticsData.clientEngagement.totalViews.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="w-full h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600 flex items-center gap-2">
                  <Download size={16} className="text-primary-500" />
                  Téléchargements
                </span>
                <span className="font-bold text-neutral-900">
                  {analyticsData.clientEngagement.totalDownloads.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="w-4/5 h-full bg-green-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600 flex items-center gap-2">
                  <Heart size={16} className="text-primary-500" />
                  Likes
                </span>
                <span className="font-bold text-neutral-900">
                  {analyticsData.clientEngagement.totalLikes.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="w-3/5 h-full bg-red-500 rounded-full" />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Moy. téléchargements</span>
                <span className="font-bold text-neutral-900">
                  {analyticsData.clientEngagement.avgDownloadsPerGallery}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Moy. vues/galerie</span>
                <span className="font-bold text-neutral-900">
                  {analyticsData.clientEngagement.avgViewsPerGallery}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services les plus demandés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topServices.map((service, idx) => (
                <div
                  key={service.name}
                  className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 mb-1">{service.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span>{service.bookings} réservations</span>
                      <span>•</span>
                      <span className="font-medium text-green-600">
                        {(service.revenue / 1000).toFixed(0)}K FCFA
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {service.growth > 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">+{service.growth}%</span>
                      </div>
                    ) : service.growth < 0 ? (
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown size={16} />
                        <span className="text-sm font-medium">{service.growth}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-500">0%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Meilleurs clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topClients.map((client, idx) => (
                <div
                  key={client.name}
                  className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center text-white font-bold">
                    {client.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900">{client.name}</h4>
                      {client.status === 'vip' && (
                        <Badge variant="warning" size="sm">
                          <Star size={12} className="mr-1 fill-current" />
                          VIP
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span>{client.bookings} réservation(s)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {(client.spent / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-neutral-500">FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


