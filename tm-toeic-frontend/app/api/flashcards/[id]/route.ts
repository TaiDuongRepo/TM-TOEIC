import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/flashcards/[id] - Get a specific flashcard
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        repetitionHistory: {
          orderBy: { reviewDate: 'desc' },
          take: 10
        }
      }
    });

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }

    return NextResponse.json({ flashcard });
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    return NextResponse.json({ error: 'Failed to fetch flashcard' }, { status: 500 });
  }
}

// PUT /api/flashcards/[id] - Update a flashcard
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const body = await request.json();
    const { frontContent, backContent, imageUrl, audioUrl } = body;

    const flashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        frontContent,
        backContent,
        imageUrl,
        audioUrl,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ flashcard });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json({ error: 'Failed to update flashcard' }, { status: 500 });
  }
}

// DELETE /api/flashcards/[id] - Delete a flashcard
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    await prisma.flashcard.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json({ error: 'Failed to delete flashcard' }, { status: 500 });
  }
}

