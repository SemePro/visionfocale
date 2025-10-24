'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Mail, Phone, MoreVertical, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import toast from 'react-hot-toast';

// Mock data (deprecated)
const clients_deprecated = [
  {
    id: '1',
    name: 'Sarah & Paul Mensah',
    phone: '+228 XX XX XX XX',
    email: 'sarah.mensah@email.com',
    galleries: 1,
    totalDownloads: 45,
    totalSpent: 350000,
    lastActivity: '2024-10-18',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Kofi Adjei',
    phone: '+228 XX XX XX XX',
    email: 'k.adjei@company.com',
    galleries: 2,
    totalDownloads: 67,
    totalSpent: 180000,
    lastActivity: '2024-10-17',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Aminata Diallo',
    phone: '+228 XX XX XX XX',
    email: 'a.diallo@email.com',
    galleries: 1,
    totalDownloads: 23,
    totalSpent: 250000,
    lastActivity: '2024-10-15',
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Entreprise TechCorp',
    phone: '+228 XX XX XX XX',
    email: 'contact@techcorp.tg',
    galleries: 3,
    totalDownloads: 156,
    totalSpent: 750000,
    lastActivity: '2024-10-20',
    status: 'vip' as const,
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const data = await response.json();

      if (data.success) {
        // Group bookings by client phone number to get unique clients
        const clientMap = new Map();

        data.data.forEach((booking: any) => {
          const phone = booking.clientInfo.phone;
          
          if (!clientMap.has(phone)) {
            clientMap.set(phone, {
              id: phone,
              name: booking.clientInfo.name,
              phone: phone,
              email: booking.clientInfo.email,
              galleries: 0,
              totalDownloads: 0,
              totalSpent: 0,
              bookingsCount: 0,
              lastActivity: booking.createdAt,
              status: 'active' as const,
            });
          }

          const client = clientMap.get(phone);
          client.bookingsCount += 1;
          client.totalSpent += booking.pricing?.total || 0;
          
          // Update last activity if this booking is more recent
          if (new Date(booking.createdAt) > new Date(client.lastActivity)) {
            client.lastActivity = booking.createdAt;
          }
        });

        const uniqueClients = Array.from(clientMap.values());
        setClients(uniqueClients);
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Clients</h1>
          <p className="text-neutral-600">Gérez votre base de clients</p>
        </div>
        <Button variant="outline" size="lg" leftIcon={<Download size={20} />}>
          Exporter
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Input
            placeholder="Rechercher par nom, téléphone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} />}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total clients</p>
            <p className="text-2xl font-bold text-neutral-900">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Clients VIP</p>
            <p className="text-2xl font-bold text-neutral-900">
              {clients.filter((c) => c.status === 'vip').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Revenus total</p>
            <p className="text-2xl font-bold text-neutral-900">
              {(clients.reduce((sum, c) => sum + c.totalSpent, 0) / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Nouveaux ce mois</p>
            <p className="text-2xl font-bold text-neutral-900">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Galeries
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Téléchargements
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Dépensé
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center text-white font-bold">
                          {client.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{client.name}</p>
                          {client.status === 'vip' && (
                            <Badge variant="warning" size="sm">
                              VIP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-neutral-900 flex items-center gap-2">
                          <Phone size={14} />
                          {client.phone}
                        </p>
                        {client.email && (
                          <p className="text-neutral-600 flex items-center gap-2 mt-1">
                            <Mail size={14} />
                            {client.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-900">
                        {client.galleries}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-900">{client.totalDownloads}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        {(client.totalSpent / 1000).toFixed(0)}K FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(client.lastActivity).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-neutral-600">Aucun client trouvé.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

