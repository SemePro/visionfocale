'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  User,
  Settings as SettingsIcon,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Copy,
  Image as ImageIcon,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, name: 'Informations client', icon: User },
  { id: 2, name: 'Configuration', icon: SettingsIcon },
  { id: 3, name: 'Upload photos', icon: Upload },
];

export default function NouvelleGaleriePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPhotosData, setUploadedPhotosData] = useState<any[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    eventType: '',
    eventDate: '',
    downloadLimit: '20',
    allowLikes: true,
    allowFavorites: true,
    expiresInDays: '30',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.clientName || !formData.clientPhone || !formData.eventType) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // File handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max

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

  const removeFile = (index: number) => {
    URL.revokeObjectURL(URL.createObjectURL(uploadedFiles[index]));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success('Photo retirée');
  };

  const handleUploadPhotos = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Veuillez sélectionner des photos');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressStep = 100 / uploadedFiles.length;
      const uploadedPhotos: any[] = [];
      
      // Generate temporary gallery ID for Cloudinary folder
      const tempGalleryId = `GAL-${Date.now()}`;
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const formData = new FormData();
        formData.append('file', uploadedFiles[i]);
        formData.append('type', 'client');
        formData.append('galleryId', tempGalleryId);
        
        const response = await fetch('/api/upload', { 
          method: 'POST', 
          body: formData 
        });
        
        const result = await response.json();
        
        if (result.success) {
          uploadedPhotos.push({
            photoId: result.data.photoId,
            originalUrl: result.data.originalUrl,
            watermarkedUrl: result.data.watermarkedUrl,
            cleanUrl: result.data.cleanUrl,
            thumbnail: result.data.thumbnail,
          });
        } else {
          throw new Error(`Erreur upload ${uploadedFiles[i].name}`);
        }
        
        setUploadProgress((i + 1) * progressStep);
      }

      // Store uploaded photos data for gallery creation
      setUploadedPhotosData(uploadedPhotos);
      
      toast.success(`${uploadedFiles.length} photo(s) uploadée(s) sur Cloudinary !`);
      setIsUploading(false);
    } catch (error: any) {
      toast.error(`Erreur lors de l'upload: ${error.message}`);
      setIsUploading(false);
    }
  };

  const generateAccessLink = () => {
    const galleryId = `GAL-${Date.now()}`;
    const link = `${window.location.origin}/galerie-client/${galleryId}`;
    setGeneratedLink(link);
    return link;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Veuillez ajouter au moins une photo');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Si les photos ne sont pas encore uploadées, les uploader d'abord
      let photosToSave = uploadedPhotosData;
      
      if (uploadedPhotosData.length === 0) {
        toast('📤 Upload des photos sur Cloudinary...');
        
        const progressStep = 50 / uploadedFiles.length; // 50% pour l'upload
        const uploadedPhotos: any[] = [];
        
        // Generate temporary gallery ID for Cloudinary folder
        const tempGalleryId = `GAL-${Date.now()}`;
        
        for (let i = 0; i < uploadedFiles.length; i++) {
          const formData = new FormData();
          formData.append('file', uploadedFiles[i]);
          formData.append('type', 'client');
          formData.append('galleryId', tempGalleryId);
          
          const response = await fetch('/api/upload', { 
            method: 'POST', 
            body: formData 
          });
          
          const result = await response.json();
          
          if (result.success) {
            uploadedPhotos.push({
              photoId: result.data.photoId,
              originalUrl: result.data.originalUrl,
              watermarkedUrl: result.data.watermarkedUrl,
              cleanUrl: result.data.cleanUrl,
              thumbnail: result.data.thumbnail,
            });
          } else {
            throw new Error(`Erreur upload ${uploadedFiles[i].name}`);
          }
          
          setUploadProgress((i + 1) * progressStep);
        }
        
        photosToSave = uploadedPhotos;
        setUploadedPhotosData(uploadedPhotos);
      }
      
      setUploadProgress(60);
      toast('📝 Création de la galerie...');
      
      // Create gallery with uploaded photos
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientInfo: {
            name: formData.clientName,
            phone: formData.clientPhone,
            email: formData.clientEmail,
            eventType: formData.eventType,
            eventDate: formData.eventDate ? new Date(formData.eventDate) : undefined,
          },
          settings: {
            downloadLimit: parseInt(formData.downloadLimit),
            allowLikes: formData.allowLikes,
            allowFavorites: formData.allowFavorites,
            allowShare: true,
          },
          expiresAt: formData.expiresInDays
            ? new Date(Date.now() + parseInt(formData.expiresInDays) * 24 * 60 * 60 * 1000)
            : undefined,
          photos: photosToSave.map(photo => ({
            photoId: photo.photoId,
            originalUrl: photo.originalUrl,
            watermarkedUrl: photo.watermarkedUrl,
            cleanUrl: photo.cleanUrl,
            thumbnail: photo.thumbnail,
          })),
        }),
      });

      setUploadProgress(90);
      const data = await response.json();

      if (data.success) {
        setUploadProgress(100);
        toast.success('✅ Galerie créée avec succès ! Photos uploadées sur Cloudinary.');
        const shareUrl = data.shareUrl || `${window.location.origin}/galerie-client/${data.data.shareLink}`;
        setGeneratedLink(shareUrl);
        setIsLinkModalOpen(true);
      } else {
        toast.error(data.error || 'Erreur lors de la création de la galerie');
      }
    } catch (error: any) {
      toast.error(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nouvelle galerie client</h1>
        <p className="text-neutral-600">Créez une galerie privée pour votre client</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={`mt-2 text-xs ${isActive ? 'text-primary-600 font-medium' : 'text-neutral-600'}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-neutral-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardContent className="p-8">
          {/* Step 1: Client Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Informations du client</h2>
                <p className="text-neutral-600">Entrez les détails de votre client</p>
              </div>

              <Input
                label="Nom du client"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Ex: Sarah & Paul Mensah"
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Téléphone"
                  name="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  required
                  placeholder="+228 XX XX XX XX"
                />
                <Input
                  label="Email (optionnel)"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="client@email.com"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type d'événement <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Mariage">Mariage</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Événement">Événement</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Services Drone">Services Drone</option>
                    <option value="Famille">Famille</option>
                    <option value="Produit">Produit</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <Input
                  label="Date de l'événement (optionnel)"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Configuration de la galerie</h2>
                <p className="text-neutral-600">Définissez les paramètres d'accès</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Limite de téléchargements"
                  name="downloadLimit"
                  type="number"
                  value={formData.downloadLimit}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  helperText="Nombre max de photos que le client peut télécharger"
                />
                <Input
                  label="Expiration (jours)"
                  name="expiresInDays"
                  type="number"
                  value={formData.expiresInDays}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  helperText="Nombre de jours avant expiration"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
                  <input
                    type="checkbox"
                    name="allowLikes"
                    checked={formData.allowLikes}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">Autoriser les likes</p>
                    <p className="text-sm text-neutral-600">Les clients peuvent liker leurs photos préférées</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100">
                  <input
                    type="checkbox"
                    name="allowFavorites"
                    checked={formData.allowFavorites}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">Autoriser les favoris</p>
                    <p className="text-sm text-neutral-600">Les clients peuvent marquer leurs photos favorites</p>
                  </div>
                </label>
              </div>

              <Textarea
                label="Message personnalisé (optionnel)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ajoutez un message pour votre client..."
                rows={4}
              />
            </div>
          )}

          {/* Step 3: Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Upload des photos</h2>
                <p className="text-neutral-600">Ajoutez les photos de votre client</p>
              </div>

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
                <p className="text-lg font-medium text-neutral-900 mb-2">
                  Cliquez pour uploader ou glissez-déposez
                </p>
                <p className="text-sm text-neutral-600">
                  Formats acceptés: JPG, PNG, HEIC • Max 50 MB par photo
                </p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-neutral-900 flex items-center gap-2">
                      <ImageIcon size={20} />
                      {uploadedFiles.length} photo(s) sélectionnée(s)
                    </p>
                    <Badge variant="success">{(uploadedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(1)} MB</Badge>
                  </div>

                  {isUploading && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">Upload en cours...</span>
                        <span className="text-sm font-medium text-primary-600">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto scrollbar-custom">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ℹ️ <strong>Note:</strong> Les watermarks VisionFocale seront appliqués automatiquement lors de l'upload.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
                Retour
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleNext}
                rightIcon={<ArrowRight size={20} />}
              >
                Suivant
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={uploadedFiles.length === 0}
              >
                Créer la galerie et uploader
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Access Link Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          router.push('/admin/galeries');
        }}
        title="Galerie créée avec succès !"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 flex items-center gap-2">
              <CheckCircle size={16} />
              {uploadedFiles.length} photo(s) uploadée(s) • Galerie accessible
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Lien d'accès client
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="input flex-1 font-mono text-sm"
              />
              <Button
                variant={linkCopied ? 'success' : 'primary'}
                onClick={copyLink}
                leftIcon={linkCopied ? <CheckCircle size={20} /> : <Copy size={20} />}
              >
                {linkCopied ? 'Copié' : 'Copier'}
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Partagez ce lien avec <strong>{formData.clientName}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-2 font-medium">
              Informations d'accès :
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Téléphone: {formData.clientPhone}</li>
              <li>Téléchargements max: {formData.downloadLimit} photos</li>
              <li>Expire dans {formData.expiresInDays} jours</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const message = `Bonjour ${formData.clientName},\n\nVos photos sont prêtes ! 📸\n\nAccédez à votre galerie privée :\n${generatedLink}\n\nAuthentifiez-vous avec votre numéro : ${formData.clientPhone}\n\nCordialement,\nVisionFocale 💜`;
                window.open(
                  `https://wa.me/${formData.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
                  '_blank'
                );
              }}
            >
              📱 Envoyer par WhatsApp
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsLinkModalOpen(false);
                router.push('/admin/galeries');
              }}
            >
              Terminé
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
