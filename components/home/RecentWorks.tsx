'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Eye, Heart, Loader2 } from 'lucide-react';

const categories = ['Tous', 'Mariages', 'Portraits', 'Événements', 'Corporate', 'Infographie', 'Produits', 'Famille'];

export default function RecentWorks() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les photos vedettes au montage du composant
  useEffect(() => {
    fetchFeaturedPhotos();
  }, []);

  const fetchFeaturedPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/public-gallery?featured=true');
      const data = await response.json();
      
      if (data.success) {
        setPhotos(data.data);
      } else {
        console.error('Erreur lors du chargement des photos vedettes:', data.error);
      }
    } catch (error) {
      console.error('Erreur fetchFeaturedPhotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhotos =
    activeCategory === 'Tous'
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Nos réalisations récentes
          </h2>
          <p className="text-lg text-neutral-600">
            Découvrez quelques-unes de nos meilleures créations
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 size={48} className="animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-neutral-600">Chargement des réalisations...</p>
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo) => (
              <Card
                key={photo._id}
                hover
                className="group overflow-hidden cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
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
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                      <span className="text-neutral-400 text-sm">{photo.title}</span>
                    </div>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{photo.title}</h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart size={16} />
                        {photo.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {photo.views || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
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
                Aucune réalisation trouvée
              </h3>
              <p className="text-neutral-500">
                {activeCategory === 'Tous' 
                  ? 'Aucune réalisation vedette n\'est disponible pour le moment.' 
                  : `Aucune réalisation dans la catégorie "${activeCategory}".`
                }
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveCategory('Tous')}
              className="mt-4"
            >
              Voir toutes les réalisations
            </Button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/galerie">
            <Button variant="primary" size="lg">
              Voir toute la galerie
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


