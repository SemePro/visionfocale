'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, Eye, Star, Trash, Search, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

const categories = ['Tous', 'Mariages', 'Portraits', 'Événements', 'Corporate', 'Infographie', 'Produits', 'Famille', 'Anniversaires', 'Sortie de nouveau-né', 'Baptême'];

export default function GaleriePubliquePage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tous');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    featured: false,
  });

  // Charger les photos au montage du composant
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/public-gallery');
      const data = await response.json();
      
      if (data.success) {
        setPhotos(data.data);
      } else {
        toast.error('Erreur lors du chargement des photos');
      }
    } catch (error) {
      console.error('Erreur fetchPhotos:', error);
      toast.error('Erreur lors du chargement des photos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Tous' || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Gestion des fichiers uploadés
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Upload des images vers Cloudinary
  const uploadToCloudinary = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'public');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload');
    }

    return response.json();
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.category || uploadedFiles.length === 0) {
      toast.error('Veuillez remplir tous les champs et sélectionner au moins une image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload chaque fichier vers Cloudinary
      const uploadPromises = uploadedFiles.map(async (file) => {
        const uploadResult = await uploadToCloudinary(file);
        
        if (uploadResult.success) {
          // Créer l'entrée dans la galerie publique
          const photoData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            imageUrl: uploadResult.data.watermarkedUrl, // URL avec watermark
            thumbnail: uploadResult.data.thumbnail,
            featured: formData.featured,
          };

          const response = await fetch('/api/public-gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(photoData),
          });

          const result = await response.json();
          
          if (!result.success) {
            throw new Error(result.error || 'Erreur lors de la création');
          }

          return result.data;
        } else {
          throw new Error(uploadResult.error || 'Erreur upload');
        }
      });

      const newPhotos = await Promise.all(uploadPromises);
      
      // Mettre à jour la liste des photos
      setPhotos((prev) => [...newPhotos, ...prev]);
      
      toast.success(`Galerie "${formData.title}" créée avec ${newPhotos.length} photo(s) !`);
      
      // Reset du formulaire
      setIsUploadModalOpen(false);
      setFormData({ title: '', description: '', category: '', featured: false });
      setUploadedFiles([]);
      setUploadProgress({});
      
    } catch (error: any) {
      console.error('Erreur upload:', error);
      toast.error(error.message || 'Erreur lors de l\'upload');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (photo: any) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      category: photo.category,
      featured: photo.featured,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/public-gallery/${editingPhoto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          featured: formData.featured,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPhotos((prev) =>
          prev.map((p) => (p._id === editingPhoto._id ? result.data : p))
        );
        toast.success('Photo mise à jour !');
        setIsEditModalOpen(false);
        setEditingPhoto(null);
        setFormData({ title: '', description: '', category: '', featured: false });
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Erreur update:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;
    
    try {
      const response = await fetch(`/api/public-gallery/${photoId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setPhotos((prev) => prev.filter((p) => p._id !== photoId));
        toast.success('Photo supprimée');
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      console.error('Erreur delete:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleFeatured = async (photoId: string) => {
    try {
      const photo = photos.find(p => p._id === photoId);
      if (!photo) return;

      const response = await fetch(`/api/public-gallery/${photoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...photo,
          featured: !photo.featured,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPhotos((prev) =>
          prev.map((p) => (p._id === photoId ? result.data : p))
        );
        toast.success('Statut vedette mis à jour');
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Erreur toggle featured:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Galerie Publique</h1>
          <p className="text-neutral-600">Gérez le portfolio visible sur le site</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus size={20} />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Créer une Galerie
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={20} />}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input sm:w-48"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total photos</p>
            <p className="text-2xl font-bold text-neutral-900">{photos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Photos vedettes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {photos.filter((p) => p.featured).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Vues totales</p>
            <p className="text-2xl font-bold text-neutral-900">
              {photos.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Likes totaux</p>
            <p className="text-2xl font-bold text-red-500">
              {photos.reduce((sum, p) => sum + (p.likes || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-neutral-600">Chargement des photos...</p>
          </CardContent>
        </Card>
      )}

      {/* Photos Grid */}
      {!isLoading && filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo._id} hover className="overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center overflow-hidden">
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-neutral-400 text-sm">{photo.title}</span>
                )}
                {photo.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Star size={14} className="fill-current" />
                      Vedette
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-neutral-900 line-clamp-1">{photo.title}</h3>
                  <Badge variant="primary" size="sm">
                    {photo.category}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{photo.description}</p>

                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {photo.views || 0}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    ❤️ {photo.likes || 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(photo)}
                  >
                    <Eye size={16} className="mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFeatured(photo._id)}
                    title={photo.featured ? 'Retirer vedette' : 'Mettre en vedette'}
                  >
                    <Star size={16} className={photo.featured ? 'fill-yellow-500 text-yellow-500' : ''} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(photo._id)}>
                    <Trash size={16} className="text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-neutral-600">Aucune photo trouvée.</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setFormData({ title: '', description: '', category: '', featured: false });
          setUploadedFiles([]);
        }}
        title="Créer une nouvelle galerie"
        size="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Photos de la galerie <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload size={48} className="text-neutral-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-neutral-900 mb-2">
                Cliquez pour sélectionner ou glissez-déposez plusieurs photos
              </p>
              <p className="text-sm text-neutral-600">JPG, PNG • Max 10 MB par image • Sélection multiple autorisée</p>
            </div>
            
            {/* Selected Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">
                  Photos sélectionnées ({uploadedFiles.length})
                </p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                      <span className="text-sm text-neutral-600">{file.name}</span>
                      <span className="text-xs text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label="Nom de la galerie"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Ex: Mariage Sarah & Paul"
          />

          <Textarea
            label="Description de la galerie"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez brièvement cette galerie..."
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              <option value="">Sélectionner...</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Mettre en vedette</p>
              <p className="text-sm text-neutral-600">Afficher sur la page d'accueil</p>
            </div>
          </label>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => {
            setIsUploadModalOpen(false);
            setFormData({ title: '', description: '', category: '', featured: false });
            setUploadedFiles([]);
            setUploadProgress({});
          }}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpload} isLoading={isSubmitting}>
            {uploadedFiles.length > 1 ? `Créer la galerie (${uploadedFiles.length} photos)` : uploadedFiles.length === 1 ? 'Créer la galerie (1 photo)' : 'Créer la galerie'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPhoto(null);
          setFormData({ title: '', description: '', category: '', featured: false });
        }}
        title="Modifier la photo"
        size="lg"
      >
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          <Input
            label="Nom de la galerie"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Ex: Mariage Sarah & Paul"
          />

          <Textarea
            label="Description de la galerie"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez brièvement cette galerie..."
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              <option value="">Sélectionner...</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Mettre en vedette</p>
              <p className="text-sm text-neutral-600">Afficher sur la page d'accueil</p>
            </div>
          </label>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => {
            setIsEditModalOpen(false);
            setEditingPhoto(null);
            setFormData({ title: '', description: '', category: '', featured: false });
          }}>
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

