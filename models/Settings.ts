import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface pour les informations de l'entreprise
export interface ICompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string[];
  whatsappNumber: string;
  email: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  logo?: string;
}

// Interface pour les horaires d'ouverture
export interface IBusinessHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

// Interface pour les paramètres de watermark
export interface IWatermarkSettings {
  text: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity: number;
  fontSize: number;
  color?: string;
}

// Interface pour le fournisseur SMS
export interface ISMSProvider {
  provider: 'africas_talking' | 'twilio';
  apiKey: string;
  apiUsername?: string;
  senderId: string;
  phoneNumber?: string;
}

// Interface pour les méthodes statiques
export interface ISettingsModel extends Model<ISettings> {
  getSettings(): Promise<ISettings>;
}

// Interface du document Settings
export interface ISettings extends Document {
  companyInfo: ICompanyInfo;
  businessHours: IBusinessHours;
  watermarkSettings: IWatermarkSettings;
  defaultDownloadLimit: number;
  smsProvider: ISMSProvider;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Company Info
const CompanyInfoSchema = new Schema<ICompanyInfo>({
  name: { type: String, default: 'VisionFocale' },
  tagline: { type: String, default: 'Capturez l\'instant, Créez l\'émotion' },
  address: { type: String, default: 'Lomé, Agoê Sogbossito, Togo' },
  phone: [{ type: String }],
  whatsappNumber: { type: String },
  email: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  tiktok: { type: String },
  twitter: { type: String },
  logo: { type: String },
});

// Schéma Business Hours
const BusinessHoursSchema = new Schema<IBusinessHours>({
  monday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  tuesday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  wednesday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  thursday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  friday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  saturday: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '14:00' },
    closed: { type: Boolean, default: false },
  },
  sunday: {
    open: { type: String, default: '00:00' },
    close: { type: String, default: '00:00' },
    closed: { type: Boolean, default: true },
  },
});

// Schéma Watermark Settings
const WatermarkSettingsSchema = new Schema<IWatermarkSettings>({
  text: { type: String, default: 'Photo by VisionFocale' },
  position: {
    type: String,
    enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'center'],
    default: 'bottom-right',
  },
  opacity: { type: Number, default: 60, min: 0, max: 100 },
  fontSize: { type: Number, default: 40, min: 10, max: 100 },
  color: { type: String, default: '#FFFFFF' },
});

// Schéma SMS Provider
const SMSProviderSchema = new Schema<ISMSProvider>({
  provider: {
    type: String,
    enum: ['africas_talking', 'twilio'],
    default: 'africas_talking',
  },
  apiKey: { type: String, required: true },
  apiUsername: { type: String },
  senderId: { type: String, default: 'VisionFocale' },
  phoneNumber: { type: String },
});

// Schéma principal Settings
const SettingsSchema = new Schema<ISettings>(
  {
    companyInfo: {
      type: CompanyInfoSchema,
      required: true,
    },
    businessHours: {
      type: BusinessHoursSchema,
      required: true,
    },
    watermarkSettings: {
      type: WatermarkSettingsSchema,
      required: true,
    },
    defaultDownloadLimit: {
      type: Number,
      default: 20,
      min: 1,
      max: 1000,
    },
    smsProvider: {
      type: SMSProviderSchema,
      required: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Méthode statique pour obtenir les paramètres (singleton)
SettingsSchema.statics.getSettings = async function (): Promise<ISettings> {
  let settings = await this.findOne();
  if (!settings) {
    // Créer des paramètres par défaut
    settings = await this.create({
      companyInfo: {
        name: 'VisionFocale',
        tagline: 'Capturez l\'instant, Créez l\'émotion',
        address: 'Lomé, Agoê Sogbossito, Togo',
        phone: ['+228XXXXXXXX'],
        whatsappNumber: '+228XXXXXXXX',
        email: 'contact@visionfocale.com',
      },
      businessHours: {},
      watermarkSettings: {
        text: 'Photo by VisionFocale',
        position: 'bottom-right',
        opacity: 60,
        fontSize: 40,
      },
      defaultDownloadLimit: 20,
      smsProvider: {
        provider: 'africas_talking',
        apiKey: 'demo',
        senderId: 'VisionFocale',
      },
    });
  }
  return settings;
};

// Export du modèle
const Settings = mongoose.models.Settings as ISettingsModel || 
  mongoose.model<ISettings, ISettingsModel>('Settings', SettingsSchema);

export default Settings;


