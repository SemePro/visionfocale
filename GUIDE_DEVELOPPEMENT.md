# 🛠️ Guide de Développement - VisionFocale

## 📚 Table des matières

1. [Architecture du projet](#architecture)
2. [Conventions de code](#conventions)
3. [Création de nouvelles pages](#pages)
4. [Création de composants](#composants)
5. [Création d'API routes](#api-routes)
6. [Utilisation de MongoDB](#mongodb)
7. [Intégration Cloudinary](#cloudinary)
8. [Authentification](#authentification)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## 🏗️ Architecture du projet

### Structure des dossiers

```
visionfocale/
├── app/                    # Pages et routes (Next.js 14 App Router)
│   ├── api/               # API Routes
│   ├── admin/             # Pages admin (protégées)
│   ├── client/            # Pages client (galeries privées)
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── admin/            # Composants spécifiques admin
│   ├── client/           # Composants spécifiques client
│   ├── layout/           # Layout (Navbar, Footer)
│   ├── home/             # Composants page d'accueil
│   └── shared/           # Composants partagés
├── lib/                   # Utilitaires et intégrations
├── models/                # Modèles MongoDB (Mongoose)
├── types/                 # Types TypeScript
├── public/                # Assets statiques
└── hooks/                 # Custom React hooks
```

### Principes d'architecture

1. **Séparation des préoccupations**: UI, logique métier, données
2. **Composants réutilisables**: Maximum de réutilisabilité
3. **Type safety**: TypeScript partout
4. **Server components par défaut**: Utiliser 'use client' uniquement si nécessaire
5. **API Routes**: Backend séparé du frontend

---

## 📝 Conventions de code

### Nommage

- **Fichiers composants**: PascalCase (ex: `Button.tsx`)
- **Fichiers utilitaires**: camelCase (ex: `formatDate.ts`)
- **Dossiers**: kebab-case (ex: `home-components/`)
- **Variables**: camelCase (ex: `userName`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_UPLOAD_SIZE`)
- **Types/Interfaces**: PascalCase avec préfixe I (ex: `IUser`)

### Composants

```tsx
// ✅ Bon exemple
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick 
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### API Routes

```ts
// ✅ Bon exemple
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Model from '@/models/Model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await Model.find();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 📄 Création de nouvelles pages

### Page client standard

```tsx
// app/nouvelle-page/page.tsx
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Titre de la page - VisionFocale',
  description: 'Description SEO',
};

export default function NouvellePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Titre</h1>
          {/* Contenu */}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
```

### Page admin protégée

```tsx
// app/admin/ma-page/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function MaPageAdmin() {
  // Vérifier authentification
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }
  
  return (
    <AdminLayout>
      <h1>Page Admin</h1>
      {/* Contenu */}
    </AdminLayout>
  );
}
```

### Page avec interactivité

```tsx
// app/ma-page/page.tsx
'use client'; // Nécessaire pour useState, useEffect, etc.

import { useState, useEffect } from 'react';

export default function PageInteractive() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json.data);
      setLoading(false);
    }
    fetchData();
  }, []);
  
  if (loading) return <Loader />;
  
  return <div>{/* Contenu */}</div>;
}
```

---

## 🧩 Création de composants

### Composant UI réutilisable

```tsx
// components/ui/MonComposant.tsx
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface MonComposantProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'special';
  size?: 'sm' | 'md' | 'lg';
}

const MonComposant = forwardRef<HTMLDivElement, MonComposantProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          variant === 'special' && 'special-styles',
          size === 'lg' && 'large-styles',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MonComposant.displayName = 'MonComposant';

export default MonComposant;
```

### Composant avec état local

```tsx
// components/features/Counter.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setCount(count - 1)}>-</Button>
      <span className="text-2xl font-bold">{count}</span>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </div>
  );
}
```

---

## 🔌 Création d'API routes

### Route GET simple

```ts
// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Paramètres de query
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Filtres
    const filter: any = {};
    if (category) filter.category = category;
    
    // Récupération
    const items = await Item.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Route POST avec validation

```ts
// app/api/items/route.ts
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, description, category } = body;
    
    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Champs requis manquants' },
        { status: 400 }
      );
    }
    
    // Création
    const item = await Item.create({
      name,
      description,
      category,
    });
    
    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Route dynamique

```ts
// app/api/items/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const item = await Item.findById(params.id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🗄️ Utilisation de MongoDB

### Créer un nouveau modèle

```ts
// models/Article.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index pour recherche
ArticleSchema.index({ title: 'text', content: 'text' });

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
```

### Requêtes courantes

```ts
// Trouver tous
const items = await Item.find();

// Trouver avec filtre
const activeItems = await Item.find({ status: 'active' });

// Trouver un
const item = await Item.findById(id);
const item = await Item.findOne({ slug: 'mon-slug' });

// Créer
const newItem = await Item.create({ name: 'Test', category: 'A' });

// Mettre à jour
const updated = await Item.findByIdAndUpdate(
  id,
  { $set: { name: 'Nouveau nom' } },
  { new: true } // Retourne le document mis à jour
);

// Supprimer
await Item.findByIdAndDelete(id);

// Pagination
const page = 1;
const limit = 20;
const items = await Item.find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## ☁️ Intégration Cloudinary

### Upload avec watermark

```ts
import { uploadPhotoWithWatermark } from '@/lib/cloudinary';

// Dans une API route
const file = formData.get('file') as File;
const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);

const result = await uploadPhotoWithWatermark(buffer, {
  folder: 'visionfocale/galleries/abc123',
  watermarkText: 'Photo by VisionFocale',
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 60,
});

// result contient:
// - originalUrl
// - watermarkedUrl
// - cleanUrl (sans watermark)
// - thumbnail
// - public_id
```

### Upload galerie publique

```ts
import { uploadPublicPhoto } from '@/lib/cloudinary';

const result = await uploadPublicPhoto(buffer, {
  folder: 'visionfocale/public_gallery',
});
```

---

## 🔐 Authentification

### Authentification SMS (OTP)

```ts
// Côté client
async function sendOTP(phoneNumber: string) {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  return res.json();
}

async function verifyOTP(phoneNumber: string, otp: string) {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, otp }),
  });
  const data = await res.json();
  
  if (data.success) {
    // Stocker le token
    localStorage.setItem('auth_token', data.token);
  }
  
  return data;
}
```

---

## ✨ Bonnes pratiques

### 1. Gestion des erreurs

```ts
try {
  await operation();
} catch (error) {
  console.error('Erreur détaillée:', error);
  toast.error('Message utilisateur friendly');
  // Log vers service externe en production
}
```

### 2. Loading states

```tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSubmit() {
    setIsLoading(true);
    try {
      await saveData();
      toast.success('Succès!');
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Button onClick={handleSubmit} isLoading={isLoading}>
      Enregistrer
    </Button>
  );
}
```

### 3. Validation avec Zod

```ts
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^\+228\d{8}$/, 'Numéro togolais invalide'),
});

// Utilisation
const result = schema.safeParse(data);
if (!result.success) {
  return { errors: result.error.flatten() };
}
```

### 4. Optimisation images

```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // Pour images au-dessus de la ligne de flottaison
  placeholder="blur" // Pour better UX
/>
```

### 5. SEO

```tsx
// app/page.tsx
export const metadata = {
  title: 'Titre - VisionFocale',
  description: 'Description complète',
  keywords: ['photographie', 'Lomé', 'Togo'],
  openGraph: {
    title: 'Titre',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
};
```

---

## 🚀 Scripts utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run start

# Linter
npm run lint

# Vérification types
npm run type-check
```

---

## 📞 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

**Bon développement ! 🎉**


