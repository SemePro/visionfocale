import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface du document ActivityLog
export interface IActivityLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  action: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Schéma principal ActivityLog
const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    userEmail: {
      type: String,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['gallery', 'client', 'booking', 'invoice', 'settings', 'user', 'public_gallery'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Index pour les recherches fréquentes
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, timestamp: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

// Méthode statique pour créer un log
ActivityLogSchema.statics.log = async function (data: {
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  action: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}): Promise<IActivityLog> {
  return this.create(data);
};

// Export du modèle
const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;


