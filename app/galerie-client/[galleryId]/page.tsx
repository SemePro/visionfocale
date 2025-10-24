'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Download,
  Eye,
  Heart,
  Lock,
  CheckCircle,
  AlertCircle,
  Phone,
  Clock,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';
import toast from 'react-hot-toast';

// Client Gallery Page - No mock data needed

export default function ClientGalleryPage() {
  const params = useParams();
  const galleryId = params.galleryId as string;

  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gallery, setGallery] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

  // Verify phone number and load gallery
  const handleVerifyPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);
    try {
      // Call API to verify phone number and get gallery
      const response = await fetch(`/api/galleries/${galleryId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Accès autorisé !');
        setIsAuthenticated(true);
        setGallery(data.data);
        setPhotos(data.data.photos || []);
        setDownloadCount(data.data.statistics?.totalDownloads || 0);
      } else {
        toast.error(data.error || 'Numéro de téléphone incorrect');
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle photo selection
  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  // Select all photos
  const selectAll = () => {
    setSelectedPhotos(photos.map((p) => p.photoId));
  };

  // Deselect all photos
  const deselectAll = () => {
    setSelectedPhotos([]);
  };

  // Download a single photo
  const downloadPhoto = async (photo: any, index: number) => {
    try {
      // Sanitize filename (remove special characters)
      const sanitizedClientName = gallery.clientName.replace(/[^a-z0-9]/gi, '_');
      const filename = `${sanitizedClientName}_photo_${index + 1}.jpg`;
      
      // Method 1: Try direct download with Cloudinary URL (add fl_attachment flag)
      // Cloudinary supports forcing download with this transformation
      const downloadUrl = photo.cleanUrl.replace('/upload/', '/upload/fl_attachment/');
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      
      // Fallback: Open in new tab if download fails
      try {
        window.open(photo.cleanUrl, '_blank');
        return true;
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError);
        return false;
      }
    }
  };

  // Download selected photos
  const handleDownload = async () => {
    if (selectedPhotos.length === 0) {
      toast.error('Veuillez sélectionner au moins une photo');
      return;
    }

    const remainingDownloads = gallery.downloadLimit - downloadCount;
    if (selectedPhotos.length > remainingDownloads) {
      toast.error(`Vous ne pouvez télécharger que ${remainingDownloads} photo(s) supplémentaire(s)`);
      return;
    }

    setIsLoading(true);
    setIsDownloadModalOpen(false);

    try {
      // Get selected photos objects
      const photosToDownload = photos.filter((p) => selectedPhotos.includes(p.photoId));
      
      // Download each photo sequentially with progress
      let successCount = 0;
      for (let i = 0; i < photosToDownload.length; i++) {
        const photo = photosToDownload[i];
        
        if (photosToDownload.length > 1) {
          toast(`Téléchargement ${i + 1}/${photosToDownload.length}...`, { duration: 1000 });
        }
        
        const success = await downloadPhoto(photo, i);
        if (success) {
          successCount++;
          // Small delay between downloads to avoid overwhelming the browser
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (successCount > 0) {
        // Track downloads in database
        try {
          const trackResponse = await fetch(`/api/galleries/${galleryId}/track-download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              photoIds: selectedPhotos.slice(0, successCount),
              phone: phoneNumber 
            }),
          });

          const trackData = await trackResponse.json();

          if (trackData.success) {
            // Update local count with server value
            setDownloadCount(trackData.data.totalDownloads);
            toast.success(`${successCount} photo(s) téléchargée(s) avec succès !`);
          } else {
            // Still update local count even if tracking fails
            setDownloadCount((prev) => prev + successCount);
            toast.success(`${successCount} photo(s) téléchargée(s)`);
            console.warn('Tracking failed:', trackData.error);
          }
        } catch (trackError) {
          console.error('Erreur tracking:', trackError);
          // Fallback: update local count
          setDownloadCount((prev) => prev + successCount);
          toast.success(`${successCount} photo(s) téléchargée(s)`);
        }
      } else {
        toast.error('Aucune photo téléchargée');
      }
      
      setSelectedPhotos([]);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Like photo
  const toggleLike = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.photoId === photoId ? { ...p, liked: !p.liked } : p))
    );
  };

  // View photo
  const viewPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setIsViewModalOpen(true);
    setIsImageZoomed(false); // Reset zoom when opening
    setImageRotation(0); // Reset rotation when opening
  };

  // Rotate image functions
  const rotateImage = (degrees: number) => {
    setImageRotation((prev) => (prev + degrees) % 360);
  };

  const resetImageTransform = () => {
    setIsImageZoomed(false);
    setImageRotation(0);
  };

  // Get display URL with fallback (watermarked > clean > thumbnail)
  const getDisplayUrl = (photo: any) => {
    if (photo.watermarkedUrl && photo.watermarkedUrl.includes('cloudinary.com')) {
      return photo.watermarkedUrl;
    }
    if (photo.cleanUrl && photo.cleanUrl.includes('cloudinary.com')) {
      return photo.cleanUrl;
    }
    return photo.thumbnail || photo.originalUrl;
  };

  // Generate thumbnail version of watermarked URL for better performance
  const getThumbnailUrl = (photo: any) => {
    // Use watermarkedUrl if available, fallback to cleanUrl or thumbnail
    if (photo.watermarkedUrl && photo.watermarkedUrl.includes('cloudinary.com')) {
      // Create optimized thumbnail from watermarked version
      return photo.watermarkedUrl.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto/');
    }
    
    // Fallback to cleanUrl (without watermark) if watermarkedUrl doesn't exist
    if (photo.cleanUrl && photo.cleanUrl.includes('cloudinary.com')) {
      return photo.cleanUrl.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto/');
    }
    
    // Final fallback to thumbnail
    return photo.thumbnail;
  };

  // Authentication Screen - Mobile Optimized
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-5 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <img 
                src="/images/logo.jpeg" 
                alt="VisionFocale" 
                className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4" 
              />
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                Accès Galerie Privée
              </h1>
              <p className="text-sm sm:text-base text-neutral-600">
                Entrez votre numéro de téléphone pour accéder à vos photos
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Numéro de téléphone"
                type="tel"
                placeholder="+228 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Phone size={18} className="sm:hidden" />}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyPhone();
                  }
                }}
                required
                className="text-base sm:text-sm"
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full py-3 sm:py-2.5 text-base font-semibold"
                onClick={handleVerifyPhone}
                isLoading={isLoading}
              >
                Accéder à la galerie
              </Button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Utilisez le numéro de téléphone fourni lors de la création de la galerie</span>
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 text-center break-all">
                ID Galerie : {galleryId}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Gallery View (After Authentication)
  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const remainingDownloads = gallery.downloadLimit - downloadCount;
  const daysRemaining = gallery.expiresAt 
    ? Math.ceil((new Date(gallery.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3">
            {/* Title and Info */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold gradient-text mb-1 truncate">
                  {gallery.clientName}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-600 flex-wrap">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <ImageIcon size={14} className="sm:hidden" />
                    <ImageIcon size={16} className="hidden sm:block" />
                    {gallery.photoCount} photos
                  </span>
                  {daysRemaining !== null && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock size={14} className="sm:hidden" />
                        <Clock size={16} className="hidden sm:block" />
                        {daysRemaining > 0 ? `${daysRemaining}j` : 'Expiré'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Downloads Counter */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm text-neutral-600">Téléchargements</p>
                <p className="font-bold text-base sm:text-lg whitespace-nowrap">
                  <span className={remainingDownloads > 0 ? 'text-green-600' : 'text-red-600'}>
                    {remainingDownloads}
                  </span>
                  <span className="text-neutral-400 text-sm sm:text-base"> / {gallery.downloadLimit}</span>
                </p>
              </div>
            </div>

            {/* Selection Actions - Mobile Optimized */}
            {selectedPhotos.length > 0 && (
              <div className="flex items-center gap-2 justify-between flex-wrap">
                <span className="text-xs sm:text-sm font-medium text-primary-900">
                  {selectedPhotos.length} sélectionnée(s)
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={deselectAll}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Tout désélectionner</span>
                    <span className="sm:hidden">Aucune</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={selectAll}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Tout sélectionner</span>
                    <span className="sm:hidden">Toutes</span>
                  </Button>
                  {/* Desktop Download Button - Hidden on mobile (use floating button instead) */}
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="hidden md:inline-flex text-xs sm:text-sm px-3 sm:px-4"
                    leftIcon={<Download size={16} />}
                    disabled={remainingDownloads === 0}
                  >
                    Télécharger ({selectedPhotos.length})
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {photos.map((photo) => {
            const isSelected = selectedPhotos.includes(photo.photoId);

            return (
              <div
                key={photo.photoId}
                className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md ${
                  isSelected ? 'ring-2 sm:ring-4 ring-primary-500' : ''
                }`}
              >
                {/* Image - Show watermarked thumbnail in grid */}
                <div className="aspect-[4/3] bg-neutral-200">
                  <img
                    src={getThumbnailUrl(photo)}
                    alt={`Photo ${photo.photoId}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to regular thumbnail if watermarked version fails
                      const target = e.target as HTMLImageElement;
                      if (target.src !== photo.thumbnail) {
                        target.src = photo.thumbnail;
                      }
                    }}
                  />
                </div>

                {/* Mobile: Always visible action buttons */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-2 md:hidden">
                  <button
                    onClick={() => viewPhoto(photo)}
                    className="flex-1 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    aria-label="Voir la photo"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => toggleLike(photo.photoId)}
                    className={`flex-1 h-9 rounded-lg flex items-center justify-center transition-colors shadow-md ${
                      photo.liked
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 backdrop-blur-sm hover:bg-white'
                    }`}
                    aria-label="Aimer la photo"
                  >
                    <Heart size={18} className={photo.liked ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Desktop: Hover overlay */}
                <div className="hidden md:block absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-3">
                      <button
                        onClick={() => viewPhoto(photo)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors shadow-lg"
                        aria-label="Voir la photo"
                      >
                        <Eye size={22} />
                      </button>
                      <button
                        onClick={() => toggleLike(photo.photoId)}
                        className={`w-12 h-12 bg-white rounded-full flex items-center justify-center transition-colors shadow-lg ${
                          photo.liked
                            ? 'bg-red-500 text-white'
                            : 'hover:bg-red-500 hover:text-white'
                        }`}
                        aria-label="Aimer la photo"
                      >
                        <Heart size={22} className={photo.liked ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection Checkbox - Larger for mobile */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => togglePhotoSelection(photo.photoId)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border-2 flex items-center justify-center transition-colors shadow-md ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white/90 backdrop-blur-sm border-white hover:border-primary-500'
                    }`}
                    aria-label="Sélectionner la photo"
                  >
                    {isSelected && <CheckCircle size={18} className="sm:hidden text-white" />}
                    {isSelected && <CheckCircle size={20} className="hidden sm:block text-white" />}
                  </button>
                </div>

                {/* Like Badge */}
                {photo.liked && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="danger" size="sm" className="shadow-md">
                      <Heart size={12} className="fill-current" />
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Download Button - Mobile Only */}
      {selectedPhotos.length > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsDownloadModalOpen(true)}
            leftIcon={<Download size={20} />}
            disabled={remainingDownloads === 0}
            className="w-full shadow-2xl py-4 text-base font-semibold"
          >
            Télécharger ({selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''})
          </Button>
        </div>
      )}

      {/* Download Confirmation Modal - Mobile Optimized */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Confirmer le téléchargement"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-blue-900 mb-2 font-semibold">
              {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} sélectionnée{selectedPhotos.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs sm:text-sm text-blue-700">
              Téléchargements restants : <strong className="text-lg">{remainingDownloads - selectedPhotos.length}</strong> / {gallery.downloadLimit}
            </p>
          </div>

          {remainingDownloads - selectedPhotos.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-900 flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>Attention : Ceci utilisera tous vos téléchargements restants</span>
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-green-900 flex items-start gap-2">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-green-600" />
              <span>
                <strong>Téléchargement sans watermark</strong> : Les photos seront téléchargées en haute qualité sans le logo VisionFocale.
              </span>
            </p>
          </div>
        </div>

        <ModalFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsDownloadModalOpen(false)}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDownload} 
            isLoading={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2"
            leftIcon={<Download size={18} />}
          >
            Confirmer le téléchargement
          </Button>
        </ModalFooter>
      </Modal>

      {/* Photo View Modal - Enhanced Zoom */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setIsImageZoomed(false);
          setImageRotation(0);
        }}
        title="Aperçu"
        size="xl"
      >
        {selectedPhoto && (
          <div className="relative">
            {/* Image Container with Enhanced Zoom */}
            <div 
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                isImageZoomed 
                  ? 'cursor-move max-h-[90vh] overflow-auto' 
                  : 'cursor-zoom-in max-h-[80vh]'
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <img
                src={getDisplayUrl(selectedPhoto)}
                alt="Photo preview"
                className={`w-full h-auto rounded-lg transition-transform duration-500 ${
                  isImageZoomed ? 'scale-200' : 'scale-100'
                }`}
                style={{ 
                  objectFit: 'contain',
                  minHeight: isImageZoomed ? '100%' : 'auto',
                  transform: `rotate(${imageRotation}deg)`
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  if (target.src !== selectedPhoto.thumbnail) {
                    target.src = selectedPhoto.thumbnail || selectedPhoto.originalUrl || '';
                  }
                }}
              />
              
              {/* Image Controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                {/* Rotation Controls */}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rotateImage(-90);
                    }}
                    className="bg-black/60 text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                    title="Rotation gauche"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rotateImage(90);
                    }}
                    className="bg-black/60 text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                    title="Rotation droite"
                  >
                    <RotateCw size={14} />
                  </button>
                </div>
                
                {/* Zoom Indicator */}
                {!isImageZoomed ? (
                  <div className="bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Eye size={14} />
                    Cliquer pour zoomer (200%)
                  </div>
                ) : (
                  <div className="bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Eye size={14} />
                    Cliquer pour réduire
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => toggleLike(selectedPhoto.photoId)}
                leftIcon={<Heart size={18} className={selectedPhoto.liked ? 'fill-current' : ''} />}
                className={`w-full sm:w-auto ${selectedPhoto.liked ? 'text-red-500 border-red-500' : ''}`}
              >
                {selectedPhoto.liked ? 'Aimée' : 'Aimer'}
              </Button>
              <Button
                variant="outline"
                onClick={resetImageTransform}
                leftIcon={<RefreshCw size={18} />}
                className="w-full sm:w-auto"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  togglePhotoSelection(selectedPhoto.photoId);
                  setIsViewModalOpen(false);
                }}
                leftIcon={<CheckCircle size={18} />}
                className="w-full sm:w-auto"
              >
                {selectedPhotos.includes(selectedPhoto.photoId) ? 'Désélectionner' : 'Sélectionner'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

