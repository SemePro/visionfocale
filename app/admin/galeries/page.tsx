'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Link as LinkIcon,
  Trash,
  MoreVertical,
  Edit3,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import toast from 'react-hot-toast';

export default function GaleriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/galleries');
      const data = await response.json();

      if (data.success) {
        // Transform API data to match UI structure
        const transformedGalleries = data.data.map((gallery: any) => ({
          id: gallery._id,
          galleryId: gallery.galleryId,
          shareLink: gallery.shareLink,
          clientName: gallery.clientInfo.name,
          clientPhone: gallery.clientInfo.phone,
          eventType: gallery.clientInfo.eventType,
          photoCount: gallery.photos?.length || 0,
          downloads: gallery.statistics?.totalDownloads || 0,
          views: gallery.statistics?.views || 0,
          status: gallery.status,
          createdAt: new Date(gallery.createdAt).toLocaleDateString('fr-FR'),
          expiresAt: gallery.expiresAt ? new Date(gallery.expiresAt).toLocaleDateString('fr-FR') : 'Pas d\'expiration',
        }));
        setGalleries(transformedGalleries);
      } else {
        toast.error('Erreur lors du chargement des galeries');
      }
    } catch (error) {
      console.error('Erreur fetchGalleries:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch =
      gallery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || gallery.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Galeries Clients</h1>
          <p className="text-neutral-600">Gérez toutes les galeries privées de vos clients</p>
        </div>
        <Link href="/admin/galeries/nouvelle">
          <Button variant="primary" size="lg" leftIcon={<Plus size={20} />}>
            Nouvelle galerie
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un client ou type d'événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={20} />}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input sm:w-48"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="expired">Expirée</option>
              <option value="archived">Archivée</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total galeries</p>
            <p className="text-2xl font-bold text-neutral-900">{galleries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Photos totales</p>
            <p className="text-2xl font-bold text-neutral-900">
              {galleries.reduce((sum, g) => sum + g.photoCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Téléchargements</p>
            <p className="text-2xl font-bold text-neutral-900">
              {galleries.reduce((sum, g) => sum + g.downloads, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Vues totales</p>
            <p className="text-2xl font-bold text-neutral-900">
              {galleries.reduce((sum, g) => sum + g.views, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Galleries List */}
      <div className="grid gap-4">
        {filteredGalleries.map((gallery) => (
          <Card key={gallery.id} hover>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-neutral-900 mb-1">
                            {gallery.clientName}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="primary" size="sm">
                              {gallery.eventType}
                            </Badge>
                            <Badge
                              variant={gallery.status === 'active' ? 'success' : 'warning'}
                              size="sm"
                            >
                              {gallery.status === 'active' ? 'Active' : 'Expirée'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-neutral-500">Photos</p>
                          <p className="text-sm font-bold text-neutral-900">
                            {gallery.photoCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Téléchargements</p>
                          <p className="text-sm font-bold text-neutral-900">
                            {gallery.downloads}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Vues</p>
                          <p className="text-sm font-bold text-neutral-900">{gallery.views}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Créée le</p>
                          <p className="text-sm font-bold text-neutral-900">
                            {new Date(gallery.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col">
                  <Link href={`/admin/galeries/${gallery.id}`} className="flex-1 lg:flex-none">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye size={16} className="mr-2" />
                      Voir
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 lg:flex-none"
                    onClick={() => {
                      const link = `${window.location.origin}/galerie-client/${gallery.id}`;
                      navigator.clipboard.writeText(link);
                      toast.success('Lien copié !');
                    }}
                  >
                    <LinkIcon size={16} className="mr-2" />
                    Copier lien
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredGalleries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-600">
                Aucune galerie trouvée pour votre recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

