import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface pour les photos
export interface IPhoto {
  photoId: string;
  originalUrl: string;
  watermarkedUrl: string;
  cleanUrl: string;
  thumbnail: string;
  filename?: string; // Optional - photoId is sufficient
  likes?: number;
  isFavorite?: boolean;
  downloads?: number;
  order?: number;
  uploadedAt: Date;
}

// Interface pour les informations client
export interface IClientInfo {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate?: Date;
}

// Interface pour les paramètres de galerie
export interface IGallerySettings {
  downloadLimit: number;
  allowLikes: boolean;
  allowFavorites: boolean;
  allowShare: boolean;
}

// Interface pour les statistiques
export interface IGalleryStatistics {
  views: number;
  totalDownloads: number;
  totalLikes: number;
}

// Interface du document Gallery
export interface IGallery extends Document {
  galleryId: string;
  clientInfo: IClientInfo;
  shareLink: string;
  createdAt: Date;
  expiresAt?: Date;
  settings: IGallerySettings;
  photos: IPhoto[];
  statistics: IGalleryStatistics;
  status: 'active' | 'expired' | 'archived';
}

// Schéma Photo
const PhotoSchema = new Schema<IPhoto>({
  photoId: { type: String, required: true },
  originalUrl: { type: String, required: true },
  watermarkedUrl: { type: String, required: true },
  cleanUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  filename: { type: String, required: false }, // Made optional - photoId is sufficient
  likes: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false },
  downloads: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

// Schéma Client Info
const ClientInfoSchema = new Schema<IClientInfo>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  eventType: { type: String, required: true },
  eventDate: { type: Date },
});

// Schéma Settings
const GallerySettingsSchema = new Schema<IGallerySettings>({
  downloadLimit: { type: Number, required: true, default: 20 },
  allowLikes: { type: Boolean, default: true },
  allowFavorites: { type: Boolean, default: true },
  allowShare: { type: Boolean, default: true },
});

// Schéma Statistics
const GalleryStatisticsSchema = new Schema<IGalleryStatistics>({
  views: { type: Number, default: 0 },
  totalDownloads: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
});

// Schéma principal Gallery
const GallerySchema = new Schema<IGallery>(
  {
    galleryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientInfo: {
      type: ClientInfoSchema,
      required: true,
    },
    shareLink: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    settings: {
      type: GallerySettingsSchema,
      required: true,
    },
    photos: [PhotoSchema],
    statistics: {
      type: GalleryStatisticsSchema,
      default: () => ({ views: 0, totalDownloads: 0, totalLikes: 0 }),
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
GallerySchema.index({ status: 1, createdAt: -1 });
GallerySchema.index({ 'clientInfo.phone': 1 });
GallerySchema.index({ 'clientInfo.name': 1 });

// Méthode pour vérifier si la galerie est expirée
GallerySchema.methods.isExpired = function (): boolean {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Middleware pour mettre à jour le statut si expiré
GallerySchema.pre('save', function (next) {
  if (this.expiresAt && new Date() > this.expiresAt && this.status === 'active') {
    this.status = 'expired';
  }
  next();
});

// Export du modèle
const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;

