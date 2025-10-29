'use client';

import { useState } from 'react';
import { Video, Play, Upload, Film, Sparkles, Zap, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import SimpleVideoEditor from '@/components/admin/SimpleVideoEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function VideoEditorPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const handleSaveProject = (project: any) => {
    // Check if project already exists
    const existingIndex = projects.findIndex(p => p.file === project.file && p.savedAt === project.savedAt);
    
    if (existingIndex >= 0) {
      // Update existing project
      const updatedProjects = [...projects];
      updatedProjects[existingIndex] = project;
      setProjects(updatedProjects);
    } else {
      // Add new project
      setProjects([...projects, project]);
    }
    
    toast.success('Projet sauvegardé avec succès !');
    // Don't close the editor - let the user continue working
  };

  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleOpenProject = (project: any) => {
    // TODO: Implement project loading
    toast.success('Projet ouvert !');
  };

  const handleDeleteProject = (index: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
      toast.success('Projet supprimé');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">🎬 Éditeur Vidéo Professionnel</h1>
              <p className="text-neutral-600">
                Montage vidéo avancé avec timeline multi-pistes, effets, transitions et export HD/4K
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleOpenEditor}
                leftIcon={<Play size={20} />}
                size="lg"
              >
                Nouveau Projet
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!isEditorOpen ? (
          <div className="p-8">
            {/* Features Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film size={20} className="text-blue-600" />
                    Montage de Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Import vidéo, audio, images
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Découper, couper, fusionner
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Recadrer, rotation, échelle
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Vitesse variable, ralenti
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Édition audio, volume
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={20} className="text-purple-600" />
                    Fonctionnalités Avancées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Timeline multi-pistes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Animation par keyframes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Chroma key (fond vert)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Correction colorimétrique
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Effets visuels, transitions
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={20} className="text-green-600" />
                    Export & Branding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Export HD, Full HD, 4K
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Formats MP4, WebM, MOV
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Logo & branding personnalisé
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Titres animés, texte
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Presets & templates
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🚀 Comment Commencer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Importer</h3>
                    <p className="text-sm text-neutral-600">Ajoutez vos vidéos, audios et images</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Éditer</h3>
                    <p className="text-sm text-neutral-600">Découpez, ajoutez des effets et transitions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Personnaliser</h3>
                    <p className="text-sm text-neutral-600">Ajoutez votre branding et textes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-600 font-bold text-lg">4</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Exporter</h3>
                    <p className="text-sm text-neutral-600">Téléchargez en HD ou 4K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={20} />
                    Projets Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-100 rounded flex items-center justify-center">
                            <Video size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900">Projet {index + 1}</h4>
                            <p className="text-sm text-neutral-600">
                              {project.file || 'Vidéo'} • Sauvegardé le {new Date(project.savedAt).toLocaleDateString()}
                            </p>
                            {project.brightness !== 100 && (
                              <p className="text-xs text-neutral-500">
                                Luminosité: {project.brightness}% • Contraste: {project.contrast}% • Saturation: {project.saturation}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenProject(project)}
                          >
                            Ouvrir
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteProject(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Film size={48} className="text-neutral-400" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Aucun projet pour le moment</h3>
                <p className="text-neutral-600 mb-6">Créez votre premier projet vidéo professionnel</p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenEditor}
                  leftIcon={<Play size={20} />}
                >
                  Commencer un Nouveau Projet
                </Button>
              </div>
            )}
          </div>
        ) : (
          <SimpleVideoEditor onSave={handleSaveProject} onClose={handleCloseEditor} />
        )}
      </div>
    </AdminLayout>
  );
}

