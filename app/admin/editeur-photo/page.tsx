'use client';

import { useState, useRef } from 'react';
import { Upload, Download, Save, RotateCcw, Image as ImageIcon, Sparkles, Palette, Crop, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdvancedPhotoEditor from '@/components/admin/AdvancedPhotoEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function PhotoEditorToolPage() {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utiliser une image d'exemple
  const handleUseExample = () => {
    // Image d'exemple haute qualité pour tester l'éditeur
    const exampleImageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face&auto=format&q=80';
    
    setSelectedImage(exampleImageUrl);
    setOriginalImage(exampleImageUrl);
    setIsEditorOpen(false);
    toast.success('Image d\'exemple chargée ! Vous pouvez maintenant ouvrir l\'éditeur.');
  };

  // Gérer la sélection de fichier
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 50MB)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Créer une URL temporaire pour l'image
      const imageUrl = URL.createObjectURL(file);
      
      // Simuler l'upload vers Cloudinary
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadProgress(100);
      setSelectedImage(imageUrl);
      setOriginalImage(imageUrl);
      
      clearInterval(progressInterval);
      toast.success('Image chargée avec succès !');
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement de l\'image');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Ouvrir l'éditeur
  const openEditor = () => {
    if (!selectedImage) {
      toast.error('Veuillez d\'abord sélectionner une image');
      return;
    }
    setIsEditorOpen(true);
  };

  // Sauvegarder l'image éditée
  const handleSaveEdited = (editedImageUrl: string) => {
    setSelectedImage(editedImageUrl);
    setIsEditorOpen(false);
    toast.success('Image éditée sauvegardée !');
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  // Télécharger l'image
  const downloadImage = () => {
    if (!selectedImage) {
      toast.error('Aucune image à télécharger');
      return;
    }

    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `edited-photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image téléchargée !');
  };

  // Réinitialiser
  const resetImage = () => {
    if (originalImage) {
      setSelectedImage(originalImage);
      toast.success('Image réinitialisée');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">🎨 Éditeur Photo Professionnel</h1>
              <p className="text-neutral-600">
                Outil avancé d'édition d'images avec retouche portrait, filtres artistiques et fonctionnalités créatives
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload size={20} />}
                disabled={isUploading}
              >
                {isUploading ? 'Chargement...' : 'Nouvelle Image'}
              </Button>
              {selectedImage && (
                <Button
                  variant="primary"
                  onClick={openEditor}
                  leftIcon={<Sparkles size={20} />}
                >
                  Ouvrir l'Éditeur
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Zone de sélection d'image */}
          {!selectedImage ? (
            <Card className="mb-6">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={40} className="text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    Commencez par sélectionner une image
                  </h3>
                  <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                    Glissez-déposez votre image ici ou cliquez sur le bouton pour la sélectionner. 
                    Formats supportés : JPG, PNG, WebP (max 50MB)
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<Upload size={20} />}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Chargement...' : 'Sélectionner une Image'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleUseExample}
                    >
                      Utiliser un Exemple
                    </Button>
                  </div>

                  {/* Barre de progression */}
                  {isUploading && (
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                        <span>Chargement...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Aperçu de l'image sélectionnée */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Aperçu principal */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon size={20} />
                      Aperçu de l'Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Image sélectionnée"
                        className="w-full h-auto max-h-96 object-contain rounded-lg border border-neutral-200"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetImage}
                          className="bg-white/90 hover:bg-white"
                          title="Réinitialiser"
                        >
                          <RotateCcw size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={downloadImage}
                          className="bg-white/90 hover:bg-white"
                          title="Télécharger"
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions et informations */}
              <div className="space-y-6">
                {/* Actions rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={openEditor}
                      leftIcon={<Sparkles size={20} />}
                    >
                      Ouvrir l'Éditeur
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<Upload size={20} />}
                    >
                      Nouvelle Image
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={downloadImage}
                      leftIcon={<Download size={20} />}
                    >
                      Télécharger
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={resetImage}
                      leftIcon={<RotateCcw size={20} />}
                    >
                      Réinitialiser
                    </Button>
                  </CardContent>
                </Card>

                {/* Fonctionnalités disponibles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fonctionnalités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                        <Palette size={20} className="text-primary-600" />
                        <div>
                          <p className="font-medium text-primary-900">Ajustements</p>
                          <p className="text-sm text-primary-700">Luminosité, contraste, saturation, vignette</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                        <Sparkles size={20} className="text-pink-600" />
                        <div>
                          <p className="font-medium text-pink-900">Retouche Portrait</p>
                          <p className="text-sm text-pink-700">Lissage peau, éclaircissement yeux</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Sparkles size={20} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-900">Filtres Artistiques</p>
                          <p className="text-sm text-purple-700">Cinématique, film, vintage</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Crop size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Branding</p>
                          <p className="text-sm text-green-700">Signature, texte, effets créatifs</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Instructions d'utilisation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>📖 Comment utiliser l'Éditeur Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Étapes d'édition :</h4>
                  <ol className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                      Sélectionnez une image depuis votre ordinateur
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                      Cliquez sur "Ouvrir l'Éditeur" pour accéder aux outils
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                      Utilisez les onglets pour ajuster votre image
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                      Sauvegardez vos modifications
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Conseils :</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Utilisez l'historique (Undo/Redo) pour annuler vos modifications
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Les filtres prédéfinis offrent des effets instantanés
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Le mode plein écran améliore l'expérience d'édition
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Sauvegardez régulièrement vos modifications
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Éditeur Photo Modal */}
        {isEditorOpen && (
          <AdvancedPhotoEditor
            imageUrl={selectedImage}
            originalImageUrl={originalImage}
            onSave={handleSaveEdited}
            onClose={handleCloseEditor}
          />
        )}
      </div>
    </AdminLayout>
  );
}
