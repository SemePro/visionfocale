'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Check, X, Eye, MoreVertical, Edit } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Loader from '@/components/ui/Loader';
import toast from 'react-hot-toast';

// Mock data (deprecated)
const initialBookings_deprecated = [
  {
    id: '1',
    bookingNumber: 'BOOK2024-001',
    clientName: 'Sarah & Paul Mensah',
    clientPhone: '+228 XX XX XX XX',
    serviceType: 'Mariage',
    date: '2024-10-25',
    time: '14:00',
    location: 'Hôtel Sarakawa, Lomé',
    status: 'confirmed' as const,
    amount: 350000,
    notes: 'Cérémonie traditionnelle + moderne',
  },
  {
    id: '2',
    bookingNumber: 'BOOK2024-002',
    clientName: 'Kofi Adjei',
    clientPhone: '+228 XX XX XX XX',
    serviceType: 'Portrait Corporate',
    date: '2024-10-21',
    time: '10:00',
    location: 'Studio VisionFocale',
    status: 'pending' as const,
    amount: 50000,
    notes: 'Portfolio professionnel LinkedIn',
  },
  {
    id: '3',
    bookingNumber: 'BOOK2024-003',
    clientName: 'TechCorp',
    clientPhone: '+228 XX XX XX XX',
    serviceType: 'Événement Corporate',
    date: '2024-10-28',
    time: '16:00',
    location: 'Centre de Conférences',
    status: 'confirmed' as const,
    amount: 250000,
    notes: 'Lancement de produit',
  },
  {
    id: '4',
    bookingNumber: 'BOOK2024-004',
    clientName: 'Famille Koffi',
    clientPhone: '+228 XX XX XX XX',
    serviceType: 'Photo de Famille',
    date: '2024-10-22',
    time: '15:00',
    location: 'Plage de Lomé',
    status: 'pending' as const,
    amount: 75000,
    notes: 'Session famille au coucher du soleil',
  },
];

export default function ReservationsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const data = await response.json();

      if (data.success) {
        // Transform API data to match UI structure
        const transformedBookings = data.data.map((booking: any) => ({
          id: booking._id,
          bookingNumber: booking.bookingNumber,
          clientName: booking.clientInfo.name,
          clientPhone: booking.clientInfo.phone,
          clientEmail: booking.clientInfo.email,
          serviceType: booking.serviceType,
          date: new Date(booking.scheduledDate).toISOString().split('T')[0],
          time: new Date(booking.scheduledDate).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: booking.location || 'Non spécifié',
          status: booking.status,
          amount: booking.pricing?.total || 0,
          notes: booking.details || booking.specialRequests || '',
        }));

        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => filterStatus === 'all' || booking.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmée</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Annulée</Badge>;
      case 'completed':
        return <Badge variant="info">Terminée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleConfirm = async (bookingId: string) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b))
    );
    toast.success('Réservation confirmée !');
    setIsSubmitting(false);
  };

  const handleReject = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette réservation ?')) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    toast.success('Réservation refusée');
    setIsSubmitting(false);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditForm({
      date: booking.date,
      time: booking.time,
      location: booking.location,
      notes: booking.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking?.id
          ? {
              ...b,
              date: editForm.date,
              time: editForm.time,
              location: editForm.location,
              notes: editForm.notes,
            }
          : b
      )
    );
    toast.success('Réservation mise à jour !');
    setIsEditModalOpen(false);
    setIsSubmitting(false);
  };

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
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Réservations</h1>
        <p className="text-neutral-600">Gérez toutes les réservations de vos clients</p>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Filtrer par statut:</span>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {status === 'all'
                    ? 'Toutes'
                    : status === 'pending'
                    ? 'En attente'
                    : status === 'confirmed'
                    ? 'Confirmées'
                    : status === 'completed'
                    ? 'Terminées'
                    : 'Annulées'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total réservations</p>
            <p className="text-2xl font-bold text-neutral-900">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {bookings.filter((b) => b.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Confirmées</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Revenus prévus</p>
            <p className="text-2xl font-bold text-neutral-900">
              {(bookings.reduce((sum, b) => sum + b.amount, 0) / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} hover>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-neutral-900 text-lg">
                          {booking.clientName}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-neutral-600">
                        Réservation #{booking.bookingNumber}
                      </p>
                    </div>
                    <Badge variant="primary">{booking.serviceType}</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar size={16} className="text-primary-500" />
                      <span>{new Date(booking.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock size={16} className="text-primary-500" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <MapPin size={16} className="text-primary-500" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Phone size={16} className="text-primary-500" />
                      <span>{booking.clientPhone}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-neutral-600">Montant estimé:</span>
                    <span className="text-lg font-bold text-green-600">
                      {(booking.amount / 1000).toFixed(0)}K FCFA
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => handleConfirm(booking.id)}
                        isLoading={isSubmitting}
                      >
                        <Check size={16} className="mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => handleReject(booking.id)}
                        disabled={isSubmitting}
                      >
                        <X size={16} className="mr-2" />
                        Refuser
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:flex-none"
                    onClick={() => handleViewDetails(booking)}
                  >
                    <Eye size={16} className="mr-2" />
                    Détails
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(booking)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-600">Aucune réservation trouvée.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Détails de la réservation"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {selectedBooking.clientName}
                </h3>
                <p className="text-sm text-neutral-600">#{selectedBooking.bookingNumber}</p>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Service</p>
                <p className="font-medium text-neutral-900">{selectedBooking.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Montant</p>
                <p className="font-medium text-green-600 text-lg">
                  {(selectedBooking.amount / 1000).toFixed(0)}K FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Date</p>
                <p className="font-medium text-neutral-900">
                  {new Date(selectedBooking.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Heure</p>
                <p className="font-medium text-neutral-900">{selectedBooking.time}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-neutral-600 mb-1">Lieu</p>
                <p className="font-medium text-neutral-900">{selectedBooking.location}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-neutral-600 mb-1">Téléphone</p>
                <p className="font-medium text-neutral-900">{selectedBooking.clientPhone}</p>
              </div>
              {selectedBooking.notes && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-neutral-600 mb-1">Notes</p>
                  <p className="text-neutral-900">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
            Fermer
          </Button>
          {selectedBooking?.status === 'pending' && (
            <Button
              variant="primary"
              onClick={() => {
                handleConfirm(selectedBooking.id);
                setIsDetailModalOpen(false);
              }}
            >
              Confirmer
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier la réservation"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Date"
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
            <Input
              label="Heure"
              type="time"
              value={editForm.time}
              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
              required
            />
          </div>

          <Input
            label="Lieu"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />

          <Textarea
            label="Notes"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} isLoading={isSubmitting}>
            Enregistrer
          </Button>
        </ModalFooter>
      </Modal>
    </AdminLayout>
  );
}

