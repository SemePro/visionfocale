'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Galerie', href: '/galerie' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/10 backdrop-blur-sm border-b border-white/20'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.jpeg" 
              alt="VisionFocale" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                  isActive(item.href)
                    ? 'text-primary-500'
                    : isScrolled 
                      ? 'text-neutral-700 hover:text-primary-500'
                      : 'text-white hover:text-primary-200'
                )}
              >
                {item.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 right-0 h-0.5 transition-transform',
                    isScrolled 
                      ? 'bg-primary-500' 
                      : 'bg-white',
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/reservation">
              <Button variant="primary" size="md">
                Réserver
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled 
                ? "hover:bg-neutral-100 text-neutral-700" 
                : "hover:bg-white/20 text-white"
            )}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-xl rounded-b-2xl border-t border-neutral-100 animate-slide-down">
            <div className="p-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/reservation" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

