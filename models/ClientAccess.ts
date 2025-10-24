import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface pour un téléchargement individuel
export interface IDownload {
  photoId: string;
  downloadedAt: Date;
  ipAddress?: string;
}

// Interface du document ClientAccess
export interface IClientAccess extends Document {
  galleryId: mongoose.Types.ObjectId;
  phoneNumber: string;
  verifiedAt: Date;
  downloads: IDownload[];
  downloadCount: number;
  likes: string[];
  favorites: string[];
  lastAccessAt: Date;
}

// Schéma Download
const DownloadSchema = new Schema<IDownload>({
  photoId: { type: String, required: true },
  downloadedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

// Schéma principal ClientAccess
const ClientAccessSchema = new Schema<IClientAccess>(
  {
    galleryId: {
      type: Schema.Types.ObjectId,
      ref: 'Gallery',
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    downloads: [DownloadSchema],
    downloadCount: {
      type: Number,
      default: 0,
    },
    likes: [{ type: String }],
    favorites: [{ type: String }],
    lastAccessAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index composé pour requêtes fréquentes
ClientAccessSchema.index({ galleryId: 1, phoneNumber: 1 }, { unique: true });

// Méthode pour vérifier si un téléchargement est déjà effectué
ClientAccessSchema.methods.hasDownloaded = function (photoId: string): boolean {
  return this.downloads.some((d: IDownload) => d.photoId === photoId);
};

// Méthode pour ajouter un téléchargement
ClientAccessSchema.methods.addDownload = function (photoId: string, ipAddress?: string): void {
  if (!this.hasDownloaded(photoId)) {
    this.downloads.push({
      photoId,
      downloadedAt: new Date(),
      ipAddress,
    });
    this.downloadCount += 1;
  }
};

// Middleware pour mettre à jour lastAccessAt
ClientAccessSchema.pre('save', function (next) {
  this.lastAccessAt = new Date();
  next();
});

// Export du modèle
const ClientAccess: Model<IClientAccess> =
  mongoose.models.ClientAccess ||
  mongoose.model<IClientAccess>('ClientAccess', ClientAccessSchema);

export default ClientAccess;


