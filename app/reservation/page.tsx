'use client';

import { useState } from 'react';
import { Camera, Calendar, MapPin, User, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import toast from 'react-hot-toast';

const services = [
  { id: 'mariage', name: 'Mariage & Cérémonie', price: '250 000', icon: '💍' },
  { id: 'portrait', name: 'Portrait Professionnel', price: '30 000', icon: '👤' },
  { id: 'evenement', name: 'Événement Corporate', price: '150 000', icon: '🎉' },
  { id: 'famille', name: 'Photo de Famille', price: '50 000', icon: '👨‍👩‍👧‍👦' },
  { id: 'produit', name: 'Shooting Produit', price: '75 000', icon: '📦' },
  { id: 'infographie', name: 'Design Graphique', price: '50 000', icon: '🎨' },
  { id: 'anniversaire', name: 'Anniversaire', price: '80 000', icon: '🎂' },
  { id: 'nouveau-ne', name: 'Sortie de nouveau-né', price: '60 000', icon: '👶' },
  { id: 'bapteme', name: 'Baptême', price: '100 000', icon: '⛪' },
];

const steps = [
  { id: 1, name: 'Service', icon: Camera },
  { id: 2, name: 'Date & Lieu', icon: Calendar },
  { id: 3, name: 'Vos informations', icon: User },
  { id: 4, name: 'Confirmation', icon: Check },
];

export default function ReservationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    date: '',
    time: '',
    duration: '2',
    location: '',
    details: '',
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, serviceType: serviceId });
  };

  const handleNext = () => {
    // Validation basique
    if (currentStep === 1 && !formData.serviceType) {
      toast.error('Veuillez sélectionner un service');
      return;
    }
    if (currentStep === 2 && (!formData.date || !formData.time || !formData.location)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (currentStep === 3 && (!formData.name || !formData.phone || !formData.email)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientInfo: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          },
          serviceType: services.find(s => s.id === formData.serviceType)?.name,
          scheduledDate: new Date(`${formData.date}T${formData.time}`),
          duration: parseInt(formData.duration),
          location: formData.location,
          details: formData.details,
          specialRequests: formData.specialRequests,
          createdVia: 'website',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Réservation envoyée avec succès ! Nous vous contacterons sous 24h.');
        // Passer à l'étape de confirmation
        setCurrentStep(5);
      } else {
        toast.error('Erreur lors de la réservation. Veuillez réessayer.');
      }
    } catch (error) {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === formData.serviceType);

  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Réservez votre séance</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            En quelques clics, réservez votre session photo ou votre projet infographique
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      {currentStep <= 4 && (
        <section className="py-8 bg-white sticky top-20 z-30 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-primary-500 text-white scale-110 shadow-lg'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                      </div>
                      <span
                        className={`mt-2 text-xs sm:text-sm font-medium ${
                          isActive ? 'text-primary-600' : 'text-neutral-600'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded ${
                          currentStep > step.id ? 'bg-green-500' : 'bg-neutral-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Form Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <Card>
            <CardContent className="p-8">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                      Quel service souhaitez-vous ?
                    </h2>
                    <p className="text-neutral-600">Sélectionnez le type de prestation</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          formData.serviceType === service.id
                            ? 'border-primary-500 bg-primary-50 scale-105 shadow-lg'
                            : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="font-bold text-neutral-900 mb-2">{service.name}</h3>
                        <p className="text-primary-600 font-bold text-sm">
                          À partir de {service.price} FCFA
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2">Date et lieu</h2>
                    <p className="text-neutral-600">
                      Quand et où souhaitez-vous votre {selectedService?.name.toLowerCase()} ?
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Input
                      label="Date souhaitée"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                      label="Heure"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Durée estimée
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="1">1 heure</option>
                        <option value="2">2 heures</option>
                        <option value="3">3 heures</option>
                        <option value="4">4 heures</option>
                        <option value="5">5 heures</option>
                        <option value="6">Journée entière</option>
                      </select>
                    </div>
                    <Input
                      label="Lieu"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Lomé, Hôtel Sarakawa"
                      leftIcon={<MapPin size={20} />}
                    />
                  </div>

                  <Textarea
                    label="Détails de l'événement (optionnel)"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Décrivez brièvement votre projet ou événement..."
                    rows={4}
                  />
                </div>
              )}

              {/* Step 3: Personal Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2">Vos informations</h2>
                    <p className="text-neutral-600">
                      Pour vous contacter et confirmer votre réservation
                    </p>
                  </div>

                  <Input
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Input
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+228 XX XX XX XX"
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>

                  <Textarea
                    label="Demandes spéciales (optionnel)"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Y a-t-il des demandes particulières ou des détails importants ?"
                    rows={4}
                  />
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                      Récapitulatif de votre réservation
                    </h2>
                    <p className="text-neutral-600">Vérifiez les informations avant de confirmer</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <h3 className="font-bold text-neutral-900 mb-2">Service</h3>
                      <p className="text-neutral-700">{selectedService?.name}</p>
                      <p className="text-primary-600 font-bold mt-1">
                        À partir de {selectedService?.price} FCFA
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <h3 className="font-bold text-neutral-900 mb-2">Date et lieu</h3>
                      <p className="text-neutral-700">
                        📅 {new Date(formData.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-neutral-700">
                        🕐 {formData.time} ({formData.duration} heure{formData.duration !== '1' && 's'})
                      </p>
                      <p className="text-neutral-700">📍 {formData.location}</p>
                      {formData.details && (
                        <p className="text-neutral-600 text-sm mt-2">{formData.details}</p>
                      )}
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <h3 className="font-bold text-neutral-900 mb-2">Vos informations</h3>
                      <p className="text-neutral-700">👤 {formData.name}</p>
                      <p className="text-neutral-700">📞 {formData.phone}</p>
                      <p className="text-neutral-700">✉️ {formData.email}</p>
                    </div>

                    {formData.specialRequests && (
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <h3 className="font-bold text-neutral-900 mb-2">Demandes spéciales</h3>
                        <p className="text-neutral-700">{formData.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        ℹ️ <strong>Note importante :</strong> Cette réservation est une demande.
                        Nous vous contacterons sous 24h pour confirmer la disponibilité et
                        finaliser les détails.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {currentStep === 5 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                    Réservation envoyée !
                  </h2>
                  <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
                    Merci {formData.name} ! Nous avons bien reçu votre demande de réservation.
                    Nous vous contacterons dans les 24h pour confirmer.
                  </p>
                  <div className="space-y-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => window.location.href = '/'}
                    >
                      Retour à l'accueil
                    </Button>
                    <div className="text-sm text-neutral-600">
                      <p>Un email de confirmation a été envoyé à {formData.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep > 1 && currentStep <= 4 && (
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <Button variant="outline" size="lg" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
                    Retour
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleNext}
                      rightIcon={<ArrowRight size={20} />}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      rightIcon={<Check size={20} />}
                    >
                      Confirmer la réservation
                    </Button>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleNext}
                    rightIcon={<ArrowRight size={20} />}
                  >
                    Continuer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Alternative */}
          {currentStep <= 4 && (
            <div className="mt-8 text-center">
              <p className="text-neutral-600 mb-4">
                Vous préférez réserver par WhatsApp ?
              </p>
              <WhatsAppButton
                context="booking"
                bookingInfo={{
                  serviceType: selectedService?.name,
                  date: formData.date,
                }}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}


