'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Téléphone',
    details: ['+228 XX XX XX XX', '+228 XX XX XX XX'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['contact@visionfocale.com', 'info@visionfocale.com'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    details: ['Lomé, Agoê Sogbossito', 'Togo, Afrique de l\'Ouest'],
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    title: 'Horaires',
    details: ['Lun - Sam: 9h - 18h', 'Dimanche: Sur rendez-vous'],
    color: 'from-orange-500 to-orange-600',
  },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/visionfocale', color: 'bg-pink-500' },
  { name: 'Facebook', href: 'https://facebook.com/visionfocale', color: 'bg-blue-600' },
  { name: 'TikTok', href: 'https://tiktok.com/@visionfocale', color: 'bg-black' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/visionfocale', color: 'bg-blue-700' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Une question ? Un projet ? N'hésitez pas à nous contacter, nous sommes là pour vous !
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="text-center">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} text-white mb-4 shadow-lg`}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-3">{info.title}</h3>
                    {info.details.map((detail, index) => (
                      <p key={index} className="text-sm text-neutral-600">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-neutral-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs
                  délais.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                    <Input
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+228 XX XX XX XX"
                    />
                  </div>

                  <Input
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Objet de votre message"
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre projet ou posez votre question..."
                    rows={6}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    leftIcon={<Send size={20} />}
                  >
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="h-[400px]">
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <MapPin size={48} className="text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 font-medium">Carte de localisation</p>
                    <p className="text-sm text-neutral-500">Lomé, Agoê Sogbossito, Togo</p>
                  </div>
                </div>
              </Card>

              {/* Quick Contact Options */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    Ou contactez-nous directement
                  </h3>

                  <a
                    href="tel:+228XXXXXXXX"
                    className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Appelez-nous</p>
                      <p className="text-sm text-neutral-600">+228 XX XX XX XX</p>
                    </div>
                  </a>

                  <WhatsAppButton context="inquiry" text="WhatsApp" />

                  <a
                    href="mailto:contact@visionfocale.com"
                    className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Email</p>
                      <p className="text-sm text-neutral-600">contact@visionfocale.com</p>
                    </div>
                  </a>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Suivez-nous</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${social.color} text-white p-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity`}
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Questions fréquentes</h2>
            <p className="text-lg text-neutral-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Quels sont vos délais de livraison ?',
                a: 'Nous livrons généralement les photos dans les 48-72h après la séance. Pour les projets urgents, un service express est disponible.',
              },
              {
                q: 'Proposez-vous des forfaits pour les mariages ?',
                a: 'Oui, nous avons plusieurs forfaits mariage adaptés à tous les budgets. Contactez-nous pour un devis personnalisé.',
              },
              {
                q: 'Comment se déroule une séance photo ?',
                a: 'Après réservation, nous planifions un brief pour comprendre vos besoins, puis nous organisons la séance. Vous recevez ensuite vos photos via une galerie privée en ligne.',
              },
              {
                q: 'Puis-je télécharger mes photos ?',
                a: 'Absolument ! Toutes vos photos sont disponibles en haute résolution dans votre galerie privée, sans watermark.',
              },
            ].map((faq, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-2">{faq.q}</h3>
                  <p className="text-neutral-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton context="support" floating />
    </main>
  );
}


