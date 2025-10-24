import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VisionFocale - Studio Photographie & Infographie | Lomé, Togo',
  description:
    'Studio professionnel de photographie et infographie à Lomé. Mariages, portraits, événements, corporate, design graphique. Capturez l\'instant, créez l\'émotion.',
  keywords: [
    'photographie Lomé',
    'photographe Togo',
    'infographie Lomé',
    'mariage Lomé',
    'portrait professionnel',
    'événementiel Togo',
    'design graphique',
    'VisionFocale',
  ],
  authors: [{ name: 'VisionFocale' }],
  creator: 'VisionFocale',
  publisher: 'VisionFocale',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'VisionFocale',
    title: 'VisionFocale - Studio Photographie & Infographie',
    description: 'Studio professionnel de photographie et infographie à Lomé, Togo.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VisionFocale Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisionFocale - Studio Photographie & Infographie',
    description: 'Studio professionnel de photographie et infographie à Lomé, Togo.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1a1a1a',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 8px 24px rgba(139, 63, 191, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#8B3FBF',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}


