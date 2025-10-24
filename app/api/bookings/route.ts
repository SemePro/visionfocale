import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingConfirmationWhatsApp } from '@/lib/whatsapp';
import { sendBookingReminderSMS } from '@/lib/sms';

// GET /api/bookings - Liste toutes les réservations
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const serviceType = searchParams.get('serviceType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (serviceType) {
      filter.serviceType = serviceType;
    }

    // Récupérer les réservations
    const bookings = await Booking.find(filter)
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Booking.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur GET /api/bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      clientInfo,
      serviceType,
      scheduledDate,
      duration,
      location,
      details,
      specialRequests,
      pricing,
      createdVia = 'website',
    } = body;

    // Validation
    if (!clientInfo?.name || !clientInfo?.phone || !serviceType || !scheduledDate) {
      return NextResponse.json(
        { success: false, error: 'Informations de réservation incomplètes' },
        { status: 400 }
      );
    }

    // Créer la réservation (le numéro sera généré automatiquement)
    const booking = await Booking.create({
      clientInfo,
      serviceType,
      scheduledDate: new Date(scheduledDate),
      duration,
      location,
      details,
      specialRequests,
      pricing: pricing || {},
      status: 'pending',
      createdVia,
    });

    // Envoyer confirmation WhatsApp (optionnel)
    if (clientInfo.phone) {
      try {
        await sendBookingConfirmationWhatsApp(
          clientInfo.phone,
          clientInfo.name,
          {
            serviceType,
            date: new Date(scheduledDate).toLocaleDateString('fr-FR'),
            time: new Date(scheduledDate).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            location,
          }
        );
      } catch (error) {
        console.error('Erreur envoi confirmation WhatsApp:', error);
        // Ne pas bloquer la création de réservation
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: 'Réservation créée avec succès',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur POST /api/bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


