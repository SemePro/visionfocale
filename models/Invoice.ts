import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface pour un item de facture
export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Interface du document Invoice
export interface IInvoice extends Document {
  invoiceNumber: string;
  clientId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled' | 'overdue';
  dueDate?: Date;
  paidDate?: Date;
  paymentMethod?: 'cash' | 'mobile_money' | 'bank_transfer' | 'card';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Invoice Item
const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

// Schéma principal Invoice
const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
    },
    items: [InvoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'cancelled', 'overdue'],
      default: 'draft',
      index: true,
    },
    dueDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'mobile_money', 'bank_transfer', 'card'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour les recherches
InvoiceSchema.index({ status: 1, createdAt: -1 });
InvoiceSchema.index({ clientPhone: 1 });
InvoiceSchema.index({ clientName: 1 });

// Méthode statique pour générer un numéro de facture unique
InvoiceSchema.statics.generateInvoiceNumber = async function (): Promise<string> {
  const year = new Date().getFullYear();
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    },
  });
  const number = String(count + 1).padStart(4, '0');
  return `INV-${year}-${number}`;
};

// Middleware pour générer le numéro de facture
InvoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    this.invoiceNumber = await (this.constructor as any).generateInvoiceNumber();
  }
  
  // Calculer le total
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.tax - this.discount;
  
  next();
});

// Middleware pour vérifier les factures en retard
InvoiceSchema.pre('save', function (next) {
  if (
    this.status === 'sent' &&
    this.dueDate &&
    new Date() > this.dueDate &&
    !this.paidDate
  ) {
    this.status = 'overdue';
  }
  next();
});

// Export du modèle
const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;


