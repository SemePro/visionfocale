import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface du document PublicGallery
export interface IPublicGallery extends Document {
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnail: string;
  featured: boolean;
  likes: number;
  views: number;
  order: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schéma principal PublicGallery
const PublicGallerySchema = new Schema<IPublicGallery>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['Mariages', 'Portraits', 'Événements', 'Corporate', 'Infographie', 'Produits', 'Famille', 'Anniversaires', 'Sortie de nouveau-né', 'Baptême'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Index pour les recherches
PublicGallerySchema.index({ category: 1, featured: -1, order: 1 });
PublicGallerySchema.index({ featured: -1, createdAt: -1 });

// Méthode pour incrémenter les vues
PublicGallerySchema.methods.incrementViews = function (): Promise<IPublicGallery> {
  this.views += 1;
  return this.save();
};

// Méthode pour incrémenter les likes
PublicGallerySchema.methods.incrementLikes = function (): Promise<IPublicGallery> {
  this.likes += 1;
  return this.save();
};

// Export du modèle
const PublicGallery: Model<IPublicGallery> =
  mongoose.models.PublicGallery ||
  mongoose.model<IPublicGallery>('PublicGallery', PublicGallerySchema);

export default PublicGallery;


