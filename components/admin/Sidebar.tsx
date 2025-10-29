'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Images,
  Users,
  Calendar,
  ImagePlus,
  Settings,
  BarChart3,
  DollarSign,
  Menu,
  X,
  Camera,
  LogOut,
  ChevronDown,
  Briefcase,
  Mail,
  Shield,
  Palette,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const getMenuItems = (userRole: string) => [
  {
    section: "Vue d'ensemble",
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ],
  },
  {
    section: 'Galeries & Clients',
    items: [
      { icon: Images, label: 'Galeries Clients', path: '/admin/galeries' },
      { icon: Users, label: 'Clients', path: '/admin/clients' },
      { icon: ImagePlus, label: 'Galerie Publique', path: '/admin/galerie-publique' },
      { icon: Palette, label: 'Éditeur Photo', path: '/admin/editeur-photo' },
      { icon: Video, label: 'Éditeur Vidéo', path: '/admin/editeur-video', disabled: true },
    ],
  },
  {
    section: 'Réservations',
    items: [
      { icon: Calendar, label: 'Toutes les réservations', path: '/admin/reservations' },
    ],
  },
  {
    section: 'Business',
    items: [
      { icon: Briefcase, label: 'Services & Tarifs', path: '/admin/services' },
      { icon: DollarSign, label: 'Finances', path: '/admin/finances' },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { icon: BarChart3, label: 'Statistiques', path: '/admin/analytics' },
    ],
  },
  // Section superadmin seulement
  ...(userRole === 'superadmin' ? [{
    section: 'Administration',
    items: [
      { icon: Shield, label: 'Gestion des Utilisateurs', path: '/admin/utilisateurs' },
    ],
  }] : []),
  {
    section: 'Paramètres',
    items: [
      { icon: Settings, label: 'Paramètres', path: '/admin/parametres' },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<string>('admin');
  const pathname = usePathname();
  const router = useRouter();

  // Récupérer le rôle de l'utilisateur connecté
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserRole(data.user.role);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
      }
    };

    fetchUserRole();
  }, []);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Déconnexion réussie');
        router.push('/admin/login');
        router.refresh();
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-white border-r border-neutral-200 z-40 transition-all duration-300',
          isOpen ? 'w-64' : 'w-20',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-neutral-200">
          <Link href="/admin" className="flex items-center gap-3">
            {isOpen ? (
              <img src="/images/logo.jpeg" alt="VisionFocale Admin" className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 bg-gradient-purple rounded-xl flex items-center justify-center shadow-glow-purple">
                <Camera className="text-white" size={20} />
              </div>
            )}
          </Link>
        </div>

        {/* Menu Container */}
        <div className="flex flex-col h-[calc(100vh-5rem)]">
          {/* Menu */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-custom">
            <div className="space-y-6">
              {getMenuItems(userRole).map((section, idx) => (
                <div key={idx}>
                  {isOpen && (
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2 px-2">
                      {section.section}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      const disabled = item.disabled || false;

                      return (
                        <Link
                          key={item.path}
                          href={disabled ? '#' : item.path}
                          onClick={(e) => {
                            if (disabled) {
                              e.preventDefault();
                              return;
                            }
                            setIsMobileOpen(false);
                          }}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                            disabled
                              ? 'text-neutral-400 cursor-not-allowed opacity-50'
                              : active
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-neutral-700 hover:bg-neutral-100'
                          )}
                        >
                          <Icon size={20} className="flex-shrink-0" />
                          {isOpen && <span>{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-white">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={20} className={isLoggingOut ? 'animate-spin' : ''} />
              {isOpen && <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

