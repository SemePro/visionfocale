'use client';

import { useState } from 'react';
import { Plus, Edit, Trash, DollarSign, Camera, Palette, Video, Radio } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

// Mock data
const services = [
  {
    id: '1',
    category: 'Photographie',
    icon: 'Camera',
    services: [
      { id: '1-1', name: 'Mariage & Cérémonie', price: 250000, duration: 6, popular: true },
      { id: '1-2', name: 'Portrait Professionnel', price: 30000, duration: 1, popular: false },
      { id: '1-3', name: 'Événement Corporate', price: 150000, duration: 4, popular: true },
      { id: '1-4', name: 'Photo de Famille', price: 50000, duration: 2, popular: false },
      { id: '1-5', name: 'Shooting Produit', price: 75000, duration: 3, popular: false },
      { id: '1-6', name: 'Anniversaire', price: 80000, duration: 3, popular: false },
      { id: '1-7', name: 'Sortie de nouveau-né', price: 60000, duration: 2, popular: false },
      { id: '1-8', name: 'Baptême', price: 100000, duration: 4, popular: true },
    ],
  },
  {
    id: '2',
    category: 'Infographie',
    icon: 'Palette',
    services: [
      { id: '2-1', name: 'Design de Logo', price: 50000, duration: 0, popular: true },
      { id: '2-2', name: 'Carte de Visite', price: 15000, duration: 0, popular: false },
      { id: '2-3', name: 'Flyer & Affiche', price: 20000, duration: 0, popular: false },
      { id: '2-4', name: 'Bannière Réseaux Sociaux', price: 10000, duration: 0, popular: false },
      { id: '2-5', name: 'Retouche Photo', price: 5000, duration: 0, popular: true },
    ],
  },
  {
    id: '3',
    category: 'Vidéo',
    icon: 'Video',
    services: [
      { id: '3-1', name: 'Vidéo Événementielle', price: 200000, duration: 6, popular: true },
      { id: '3-2', name: 'Clip Promotionnel', price: 150000, duration: 0, popular: false },
      { id: '3-3', name: 'Vidéo Corporate', price: 180000, duration: 0, popular: false },
      { id: '3-4', name: 'Montage Vidéo', price: 50000, duration: 0, popular: false },
    ],
  },
  {
    id: '4',
    category: 'Services Drone',
    icon: 'Radio',
    services: [
      { id: '4-1', name: 'Survol de Terrain', price: 100000, duration: 2, popular: true },
      { id: '4-2', name: 'Vidéo Drone 4K', price: 150000, duration: 3, popular: true },
      { id: '4-3', name: 'Photos Aériennes HD', price: 80000, duration: 2, popular: false },
      { id: '4-4', name: 'Vue Panoramique 360°', price: 120000, duration: 2, popular: false },
    ],
  },
];

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState(services);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    price: '',
    duration: '',
    description: '',
    popular: false,
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (editingService) {
      // Update existing service
      setServicesData((prev) =>
        prev.map((cat) => ({
          ...cat,
          services: cat.services.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  name: formData.name,
                  price: parseInt(formData.price),
                  duration: parseInt(formData.duration || '0'),
                  popular: formData.popular,
                }
              : s
          ),
        }))
      );
      toast.success('Service modifié avec succès !');
    } else {
      // Add new service
      const categoryIndex = servicesData.findIndex((c) => c.category === formData.category);
      if (categoryIndex !== -1) {
        const newService = {
          id: `${servicesData[categoryIndex].id}-${servicesData[categoryIndex].services.length + 1}`,
          name: formData.name,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration || '0'),
          popular: formData.popular,
        };
        setServicesData((prev) =>
          prev.map((cat, idx) =>
            idx === categoryIndex
              ? { ...cat, services: [...cat.services, newService] }
              : cat
          )
        );
      }
      toast.success('Service ajouté avec succès !');
    }

    setIsModalOpen(false);
    setEditingService(null);
    setFormData({ category: '', name: '', price: '', duration: '', description: '', popular: false });
    setIsSubmitting(false);
  };

  const handleEdit = (service: any, category: string) => {
    setEditingService(service);
    setFormData({
      category,
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: '',
      popular: service.popular,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string, categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setServicesData((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, services: cat.services.filter((s) => s.id !== serviceId) }
          : cat
      )
    );
    toast.success('Service supprimé');
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({ category: '', name: '', price: '', duration: '', description: '', popular: false });
    setIsModalOpen(true);
  };

  const totalServices = services.reduce((sum, cat) => sum + cat.services.length, 0);
  const popularServices = services.reduce(
    (sum, cat) => sum + cat.services.filter((s) => s.popular).length,
    0
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Services & Tarifs</h1>
          <p className="text-neutral-600">Gérez votre catalogue de services et prix</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus size={20} />}
          onClick={handleAddNew}
        >
          Nouveau service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total services</p>
            <p className="text-2xl font-bold text-neutral-900">{totalServices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Services populaires</p>
            <p className="text-2xl font-bold text-yellow-600">{popularServices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Catégories</p>
            <p className="text-2xl font-bold text-neutral-900">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Prix moyen</p>
            <p className="text-2xl font-bold text-green-600">85K</p>
          </CardContent>
        </Card>
      </div>

      {/* Services by Category */}
      <div className="space-y-6">
        {servicesData.map((category) => {
          const IconComponent =
            category.icon === 'Camera' 
              ? Camera 
              : category.icon === 'Palette' 
              ? Palette 
              : category.icon === 'Video'
              ? Video
              : Radio;

          return (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.category}</h3>
                    <p className="text-sm text-neutral-600 font-normal">
                      {category.services.length} services
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-neutral-900">{service.name}</h4>
                          {service.popular && (
                            <Badge variant="warning" size="sm">
                              Populaire
                            </Badge>
                          )}
                        </div>
                        {service.duration > 0 && (
                          <p className="text-sm text-neutral-600">
                            Durée: {service.duration} heure{service.duration > 1 && 's'}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {(service.price / 1000).toFixed(0)}K FCFA
                          </p>
                          {service.price >= 100000 && (
                            <p className="text-xs text-neutral-500">À partir de</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service, category.category)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id, category.id)}
                          >
                            <Trash size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? 'Modifier le service' : 'Ajouter un nouveau service'}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              disabled={!!editingService}
            >
              <option value="">Sélectionner...</option>
              <option value="Photographie">Photographie</option>
              <option value="Infographie">Infographie</option>
              <option value="Vidéo">Vidéo</option>
              <option value="Services Drone">Services Drone</option>
            </select>
            {editingService && (
              <p className="text-xs text-neutral-500 mt-1">
                La catégorie ne peut pas être modifiée
              </p>
            )}
          </div>

          <Input
            label="Nom du service"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ex: Portrait Professionnel"
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Prix (FCFA)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              placeholder="50000"
              leftIcon={<DollarSign size={20} />}
            />
            <Input
              label="Durée (heures)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="2"
              helperText="Laissez vide si non applicable"
            />
          </div>

          <Textarea
            label="Description (optionnel)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez le service..."
            rows={3}
          />

          <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
            <input
              type="checkbox"
              checked={formData.popular}
              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Service populaire</p>
              <p className="text-sm text-neutral-600">Afficher comme service populaire</p>
            </div>
          </label>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            {editingService ? 'Enregistrer' : 'Ajouter le service'}
          </Button>
        </ModalFooter>
      </Modal>
    </AdminLayout>
  );
}

