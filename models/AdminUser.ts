import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
AdminUserSchema.index({ username: 1 });
AdminUserSchema.index({ role: 1 });
AdminUserSchema.index({ isActive: 1 });

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);