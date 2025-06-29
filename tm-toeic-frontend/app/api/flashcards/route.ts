import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/flashcards - Get all flashcards for a user or flashcards due for review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const dueOnly = searchParams.get('dueOnly') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const whereClause: { userId: string; nextReviewDate?: { lte: Date } } = { userId };

    // If dueOnly is true, only return flashcards due for review
    if (dueOnly) {
      whereClause.nextReviewDate = {
        lte: new Date()
      };
    }

    const flashcards = await prisma.flashcard.findMany({
      where: whereClause,
      include: {
        repetitionHistory: {
          orderBy: { reviewDate: 'desc' },
          take: 5 // Include last 5 review sessions
        }
      },
      orderBy: [
        { nextReviewDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 });
  }
}

// POST /api/flashcards - Create a new flashcard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      frontContent, 
      backContent, 
      imageUrl, 
      audioUrl 
    } = body;

    if (!userId || !frontContent || !backContent) {
      return NextResponse.json({ 
        error: 'User ID, front content, and back content are required' 
      }, { status: 400 });
    }

    // Create new flashcard with default SM-2 values
    const flashcard = await prisma.flashcard.create({
      data: {
        userId,
        frontContent,
        backContent,
        imageUrl,
        audioUrl,
        easinessFactor: 2.5,
        repetitions: 0,
        interval: 1,
        nextReviewDate: new Date() // Available for review immediately
      }
    });

    return NextResponse.json({ flashcard }, { status: 201 });
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 });
  }
}

