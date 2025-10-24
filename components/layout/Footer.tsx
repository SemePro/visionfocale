import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';

const quickLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Galerie', href: '/galerie' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  { name: 'Mariages', href: '/services#mariages' },
  { name: 'Portraits', href: '/services#portraits' },
  { name: 'Événements', href: '/services#evenements' },
  { name: 'Corporate', href: '/services#corporate' },
  { name: 'Infographie', href: '/services#infographie' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/visionfocale', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/visionfocale', label: 'Facebook' },
  { icon: Send, href: 'https://t.me/visionfocale', label: 'Telegram' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <img 
                src="/images/logo.jpeg" 
                alt="VisionFocale" 
                className="h-16 w-auto mb-2 brightness-0 invert"
              />
              <p className="text-sm text-neutral-300">Studio Photo & Infographie</p>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Capturez l'instant, créez l'émotion. Studio professionnel de photographie et
              d'infographie à Lomé, Togo.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nos services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-neutral-300 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">Lomé, Agoê Sogbossito, Togo</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="flex-shrink-0" />
                <a
                  href="tel:+228XXXXXXXX"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  +228 XX XX XX XX
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="flex-shrink-0" />
                <a
                  href="mailto:contact@visionfocale.com"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  contact@visionfocale.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-300">
            <p>© {currentYear} VisionFocale. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/cgu" className="hover:text-white transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

