
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Since we removed user auth, we'll return default settings or create a single global settings record
    let settings = await prisma.userSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.userSettings.create({
        data: {
          alertTimeMinutes: 30,
          enablePushNotifications: true,
          enableEmailNotifications: false,
          workingHoursStart: "09:00",
          workingHoursEnd: "18:00",
          autoTagging: true,
          aiSuggestions: true,
          theme: "light",
          language: "pt",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Update the global settings
    let settings = await prisma.userSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          ...data,
        },
      });
    } else {
      settings = await prisma.userSettings.update({
        where: {
          id: settings.id,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
