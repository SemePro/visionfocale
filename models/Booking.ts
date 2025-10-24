import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface pour les informations client
export interface IBookingClientInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// Interface pour le pricing
export interface IBookingPricing {
  estimated?: number;
  deposit?: number;
  total?: number;
}

// Interface du document Booking
export interface IBooking extends Document {
  bookingNumber: string;
  clientInfo: IBookingClientInfo;
  serviceType: string;
  scheduledDate: Date;
  duration?: number;
  location?: string;
  details?: string;
  specialRequests?: string;
  pricing: IBookingPricing;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdVia: 'website' | 'whatsapp' | 'phone' | 'direct';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Client Info
const BookingClientInfoSchema = new Schema<IBookingClientInfo>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
});

// Schéma Pricing
const BookingPricingSchema = new Schema<IBookingPricing>({
  estimated: { type: Number },
  deposit: { type: Number },
  total: { type: Number },
});

// Schéma principal Booking
const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      unique: true,
      index: true,
    },
    clientInfo: {
      type: BookingClientInfoSchema,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      default: 2,
    },
    location: {
      type: String,
    },
    details: {
      type: String,
    },
    specialRequests: {
      type: String,
    },
    pricing: {
      type: BookingPricingSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    createdVia: {
      type: String,
      enum: ['website', 'whatsapp', 'phone', 'direct'],
      default: 'website',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour les recherches fréquentes
BookingSchema.index({ status: 1, scheduledDate: -1 });
BookingSchema.index({ 'clientInfo.phone': 1 });
BookingSchema.index({ 'clientInfo.name': 1 });
BookingSchema.index({ serviceType: 1 });

// Méthode statique pour générer un numéro de réservation unique
BookingSchema.statics.generateBookingNumber = async function (): Promise<string> {
  const year = new Date().getFullYear();
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    },
  });
  const number = String(count + 1).padStart(4, '0');
  return `BOOK${year}-${number}`;
};

// Middleware pour générer le numéro de réservation
BookingSchema.pre('save', async function (next) {
  if (this.isNew && !this.bookingNumber) {
    this.bookingNumber = await (this.constructor as any).generateBookingNumber();
  }
  next();
});

// Export du modèle
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

