'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Upload,
  Download,
  Eye,
  Heart,
  Trash,
  Edit,
  Share2,
  CheckCircle,
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

// Mock gallery data
const mockGallery = {
  id: '1',
  clientName: 'Sarah & Paul Mensah',
  clientPhone: '+228 90 XX XX XX',
  clientEmail: 'sarah.mensah@email.com',
  eventType: 'Mariage',
  eventDate: '2024-10-15',
  createdAt: '2024-10-10',
  photoCount: 248,
  downloadLimit: 20,
  downloadsUsed: 5,
  views: 156,
  expiresAt: '2024-11-15',
  status: 'active',
  settings: {
    allowLikes: true,
    allowFavorites: true,
  },
  photos: Array.from({ length: 248 }, (_, i) => ({
    id: `photo-${i + 1}`,
    url: `https://via.placeholder.com/800x600?text=Photo+${i + 1}`,
    thumbnail: `https://via.placeholder.com/400x300?text=Photo+${i + 1}`,
    views: Math.floor(Math.random() * 50),
    likes: Math.floor(Math.random() * 20),
    downloads: Math.floor(Math.random() * 5),
    uploadedAt: '2024-10-10',
  })),
};

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const galleryId = params.id as string;
  const [gallery] = useState(mockGallery);
  const [photos, setPhotos] = useState(mockGallery.photos);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [settings, setSettings] = useState({
    downloadLimit: gallery.downloadLimit.toString(),
    expiryDays: '30',
    allowLikes: gallery.settings.allowLikes,
    allowFavorites: gallery.settings.allowFavorites,
  });

  const galleryLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/galerie-client/${galleryId}`;
  const daysRemaining = Math.ceil(
    (new Date(gallery.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const remainingDownloads = gallery.downloadLimit - gallery.downloadsUsed;

  // Copy link
  const copyLink = () => {
    navigator.clipboard.writeText(galleryLink);
    setLinkCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Share via WhatsApp
  const shareWhatsApp = () => {
    const message = `Bonjour ${gallery.clientName},\n\nVos photos sont prêtes ! 📸\n\nAccédez à votre galerie privée :\n${galleryLink}\n\nAuthentifiez-vous avec votre numéro : ${gallery.clientPhone}\n\nCordialement,\nVisionFocale 💜`;
    window.open(
      `https://wa.me/${gallery.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  // Select/Deselect photos
  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const selectAll = () => {
    setSelectedPhotos(photos.map((p) => p.id));
  };

  const deselectAll = () => {
    setSelectedPhotos([]);
  };

  // Delete selected photos
  const handleDeleteSelected = async () => {
    if (selectedPhotos.length === 0) {
      toast.error('Veuillez sélectionner des photos');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPhotos.length} photo(s) ?`)) {
      return;
    }

    setPhotos((prev) => prev.filter((p) => !selectedPhotos.includes(p.id)));
    toast.success(`${selectedPhotos.length} photo(s) supprimée(s)`);
    setSelectedPhotos([]);
  };

  // Upload new photos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 50 * 1024 * 1024;

      if (!isValidType) {
        toast.error(`${file.name} n'est pas une image valide`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} est trop volumineux (max 50MB)`);
        return false;
      }
      return true;
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} photo(s) ajoutée(s)`);
  };

  const removeUploadFile = (index: number) => {
    URL.revokeObjectURL(URL.createObjectURL(uploadedFiles[index]));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressStep = 100 / uploadedFiles.length;

      for (let i = 0; i < uploadedFiles.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUploadProgress((i + 1) * progressStep);
      }

      toast.success(`${uploadedFiles.length} photo(s) uploadée(s) !`);
      setUploadedFiles([]);
      setIsUploadModalOpen(false);
      setIsUploading(false);
    } catch (error) {
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }
  };

  // Update settings
  const handleUpdateSettings = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Paramètres mis à jour !');
    setIsSettingsModalOpen(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/admin/galeries')}
          className="mb-4"
        >
          Retour aux galeries
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{gallery.clientName}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <ImageIcon size={16} />
                {gallery.photoCount} photos
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(gallery.eventDate).toLocaleDateString('fr-FR')}
              </span>
              <span>•</span>
              <Badge variant={daysRemaining > 7 ? 'success' : 'warning'}>
                <Clock size={14} className="mr-1" />
                Expire dans {daysRemaining} jours
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsLinkModalOpen(true)} leftIcon={<Copy size={20} />}>
              Copier lien
            </Button>
            <Button variant="outline" onClick={shareWhatsApp} leftIcon={<Share2 size={20} />}>
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(true)}
              leftIcon={<Settings size={20} />}
            >
              Paramètres
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Upload size={20} />}
            >
              Ajouter photos
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Total photos</p>
            <p className="text-2xl font-bold text-neutral-900">{gallery.photoCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Vues totales</p>
            <p className="text-2xl font-bold text-blue-600">{gallery.views}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Téléchargements</p>
            <p className="text-2xl font-bold text-green-600">
              {gallery.downloadsUsed}/{gallery.downloadLimit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Likes totaux</p>
            <p className="text-2xl font-bold text-red-500">
              {photos.reduce((sum, p) => sum + p.likes, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-neutral-600 mb-1">Restants</p>
            <p className={`text-2xl font-bold ${remainingDownloads > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remainingDownloads}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Nom</p>
              <p className="font-medium text-neutral-900 flex items-center gap-2">
                <User size={16} />
                {gallery.clientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Téléphone</p>
              <p className="font-medium text-neutral-900 flex items-center gap-2">
                <Phone size={16} />
                {gallery.clientPhone}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Type d'événement</p>
              <Badge variant="primary">{gallery.eventType}</Badge>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Créée le</p>
              <p className="font-medium text-neutral-900">
                {new Date(gallery.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Bar */}
      {selectedPhotos.length > 0 && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg flex items-center justify-between">
          <span className="font-medium text-primary-900">
            {selectedPhotos.length} photo(s) sélectionnée(s)
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              Désélectionner tout
            </Button>
            <Button variant="outline" size="sm" onClick={selectAll}>
              Tout sélectionner
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteSelected} leftIcon={<Trash size={16} />}>
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Photos de la galerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo) => {
              const isSelected = selectedPhotos.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                    isSelected ? 'ring-4 ring-primary-500' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square bg-neutral-200">
                    <img src={photo.thumbnail} alt={photo.id} className="w-full h-full object-cover" />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white">
                        <Eye size={16} className="mr-2" />
                        Voir
                      </Button>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => togglePhotoSelection(photo.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white/80 border-white hover:border-primary-500'
                      }`}
                    >
                      {isSelected && <CheckCircle size={16} className="text-white" />}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                      <Eye size={12} />
                      {photo.views}
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                      <Heart size={12} />
                      {photo.likes}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Lien d'accès client" size="lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Lien de la galerie</label>
            <div className="flex gap-2">
              <input type="text" value={galleryLink} readOnly className="input flex-1 font-mono text-sm" />
              <Button
                variant={linkCopied ? 'success' : 'primary'}
                onClick={copyLink}
                leftIcon={linkCopied ? <CheckCircle size={20} /> : <Copy size={20} />}
              >
                {linkCopied ? 'Copié' : 'Copier'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Le client devra s'authentifier avec son numéro de téléphone : <strong>{gallery.clientPhone}</strong>
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={shareWhatsApp} leftIcon={<Share2 size={20} />}>
            Envoyer par WhatsApp
          </Button>
        </ModalFooter>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Paramètres de la galerie"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Limite de téléchargements"
              type="number"
              value={settings.downloadLimit}
              onChange={(e) => setSettings({ ...settings, downloadLimit: e.target.value })}
              min="1"
              max="1000"
            />
            <Input
              label="Prolonger de (jours)"
              type="number"
              value={settings.expiryDays}
              onChange={(e) => setSettings({ ...settings, expiryDays: e.target.value })}
              min="1"
              max="365"
              helperText={`Expire actuellement dans ${daysRemaining} jours`}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
              <input
                type="checkbox"
                checked={settings.allowLikes}
                onChange={(e) => setSettings({ ...settings, allowLikes: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <div>
                <p className="font-medium text-neutral-900">Autoriser les likes</p>
                <p className="text-sm text-neutral-600">Les clients peuvent liker leurs photos</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
              <input
                type="checkbox"
                checked={settings.allowFavorites}
                onChange={(e) => setSettings({ ...settings, allowFavorites: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <div>
                <p className="font-medium text-neutral-900">Autoriser les favoris</p>
                <p className="text-sm text-neutral-600">Les clients peuvent marquer leurs favoris</p>
              </div>
            </label>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateSettings}>
            Enregistrer
          </Button>
        </ModalFooter>
      </Modal>

      {/* Upload Photos Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Ajouter des photos"
        size="lg"
      >
        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
          >
            <Upload size={48} className="text-neutral-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-900 mb-2">Cliquez pour uploader</p>
            <p className="text-sm text-neutral-600">JPG, PNG, HEIC • Max 50 MB par photo</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div>
              <p className="font-medium text-neutral-900 mb-4">{uploadedFiles.length} photo(s) prête(s)</p>

              {isUploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Upload en cours...</span>
                    <span className="text-sm font-medium text-primary-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeUploadFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadPhotos}
            isLoading={isUploading}
            disabled={uploadedFiles.length === 0}
          >
            Uploader {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
          </Button>
        </ModalFooter>
      </Modal>
    </AdminLayout>
  );
}


