'use client';

import { useState, useEffect } from 'react';
import { Eye, Heart, ZoomIn, Loader2, RotateCcw, RotateCw, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface Photo {
  _id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnail: string;
  featured: boolean;
  likes: number;
  views: number;
  order: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const categories = ['Tous', 'Mariages', 'Portraits', 'Evenements', 'Corporate', 'Infographie', 'Produits', 'Famille', 'Anniversaires', 'Sortie de nouveau-ne', 'Bapteme'];

export default function GaleriePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

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
        console.error('Erreur lors du chargement des photos:', data.error);
      }
    } catch (error) {
      console.error('Erreur fetchPhotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhotos =
    activeCategory === 'Tous'
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);

  const handlePhotoClick = async (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsImageZoomed(false);
    setImageRotation(0);
    
    try {
      await fetch(`/api/public-gallery/${photo._id}/view`, {
        method: 'PUT',
      });
      
      setPhotos(prev => 
        prev.map(p => 
          p._id === photo._id 
            ? { ...p, views: (p.views || 0) + 1 }
            : p
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'incrementation des vues:', error);
    }
  };

  const rotateImage = (direction: 'left' | 'right') => {
    setImageRotation(prev => direction === 'left' ? prev - 90 : prev + 90);
  };

  const resetImageTransform = () => {
    setIsImageZoomed(false);
    setImageRotation(0);
  };

  const handleContactUs = () => {
    const message = `Bonjour VisionFocale ! Je suis interesse(e) par un projet similaire a "${selectedPhoto?.title}" (${selectedPhoto?.category}). Pourriez-vous me donner plus d'informations sur vos services ?`;
    const whatsappUrl = `https://wa.me/22890940909?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewMoreCategory = () => {
    setActiveCategory(selectedPhoto?.category || 'Tous');
    setSelectedPhoto(null);
    setIsImageZoomed(false);
    setImageRotation(0);
    setTimeout(() => {
      const gallerySection = document.querySelector('section[class*="py-16"]');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLike = async (photoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch(`/api/public-gallery/${photoId}/like`, {
        method: 'PUT',
      });

      if (response.ok) {
        const result = await response.json();
        
        setPhotos(prev => 
          prev.map(p => 
            p._id === photoId 
              ? { ...p, likes: result.data.likes }
              : p
          )
        );
        
        if (selectedPhoto && selectedPhoto._id === photoId) {
          setSelectedPhoto(prev => prev ? { ...prev, likes: result.data.likes } : null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'incrementation des likes:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Notre Galerie</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Decouvrez nos meilleurs travaux en photographie et infographie
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-20 z-30 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white shadow-md scale-105'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-neutral-600">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-16">
          <div className="container-custom text-center">
            <Loader2 size={48} className="animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-neutral-600">Chargement de la galerie...</p>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <section className="py-16">
          <div className="container-custom">
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo, index) => (
                  <Card
                    key={photo._id}
                    hover
                    className="group cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200">
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
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-neutral-400 text-sm text-center px-4">
                            {photo.title}
                          </span>
                        </div>
                      )}

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center justify-between text-white mb-2">
                          <button
                            className="flex items-center gap-1 text-sm hover:text-red-400 transition-colors"
                            onClick={(e) => handleLike(photo._id, e)}
                          >
                            <Heart size={16} />
                            {photo.likes || 0}
                          </button>
                          <span className="flex items-center gap-1 text-sm">
                            <Eye size={16} />
                            {photo.views || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ZoomIn size={20} className="text-white" />
                          <span className="text-white text-sm font-medium">Cliquer pour voir</span>
                        </div>
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePhotoClick(photo);
                          }}
                          title="Voir en grand"
                        >
                          <ZoomIn size={16} className="text-neutral-700" />
                        </button>
                        <button
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                          onClick={(e) => handleLike(photo._id, e)}
                          title="J'aime"
                        >
                          <Heart size={16} className="text-red-500" />
                        </button>
                      </div>

                      {/* Featured Badge */}
                      {photo.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                            ⭐ A la une
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-neutral-900 mb-1 line-clamp-1">{photo.title}</h3>
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                        {photo.description}
                      </p>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                        {photo.category}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-neutral-400 mb-4">
                  <Eye size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-neutral-600 mb-2">
                    Aucune photo trouvee
                  </h3>
                  <p className="text-neutral-500">
                    {activeCategory === 'Tous'
                      ? 'Aucune photo n\'est disponible pour le moment.'
                      : `Aucune photo dans la categorie "${activeCategory}".`
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveCategory('Tous')}
                  className="mt-4"
                >
                  Voir toutes les photos
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => {
            setSelectedPhoto(null);
            setIsImageZoomed(false);
            setImageRotation(0);
          }}
          size="xl"
          showCloseButton
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Container with Controls */}
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-200 to-secondary-200 rounded-xl flex items-center justify-center overflow-hidden relative">
                {selectedPhoto.imageUrl ? (
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 ${
                      isImageZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={{ transform: `rotate(${imageRotation}deg) ${isImageZoomed ? 'scale(1.5)' : 'scale(1)'}` }}
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-neutral-400">Image: {selectedPhoto.title}</span>
                )}

                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    onClick={() => rotateImage('left')}
                    title="Rotation gauche"
                  >
                    <RotateCcw size={18} className="text-neutral-700" />
                  </button>
                  <button
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    onClick={() => rotateImage('right')}
                    title="Rotation droite"
                  >
                    <RotateCw size={18} className="text-neutral-700" />
                  </button>
                  <button
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    onClick={resetImageTransform}
                    title="Reinitialiser"
                  >
                    <RefreshCw size={18} className="text-neutral-700" />
                  </button>
                </div>

                {/* Zoom Indicator */}
                {isImageZoomed && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Zoom active - Cliquez pour desactiver
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                    {selectedPhoto.category}
                  </span>
                  {selectedPhoto.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ A la une
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  {selectedPhoto.title}
                </h2>
                <p className="text-neutral-600 mb-6">{selectedPhoto.description}</p>

                <div className="flex items-center gap-6 mb-6">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                    onClick={(e) => handleLike(selectedPhoto._id, e)}
                  >
                    <Heart size={20} className="fill-current" />
                    <span className="font-medium">{selectedPhoto.likes || 0} likes</span>
                  </button>
                  <div className="flex items-center gap-2 text-neutral-600 px-4 py-2 bg-neutral-50 rounded-lg">
                    <Eye size={20} />
                    <span className="font-medium">{selectedPhoto.views || 0} vues</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleContactUs}
                >
                  Contactez-nous pour un projet similaire
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleViewMoreCategory}
                >
                  Voir plus de {selectedPhoto.category}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}