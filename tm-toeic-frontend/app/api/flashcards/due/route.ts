import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sortFlashcardsByPriority } from '@/lib/sm2/algorithm';

// GET /api/flashcards/due - Get flashcards due for review, sorted by priority
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get all flashcards due for review (nextReviewDate <= now)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        userId,
        nextReviewDate: {
          lte: new Date()
        }
      },
      include: {
        repetitionHistory: {
          orderBy: { reviewDate: 'desc' },
          take: 3 // Include last 3 review sessions for context
        }
      }
    });

    // Sort flashcards by priority (overdue first, then by next review date)
    const sortedFlashcards = sortFlashcardsByPriority(flashcards);

    // Apply limit
    const limitedFlashcards = sortedFlashcards.slice(0, limit);

    // Calculate statistics
    const stats = {
      totalDue: flashcards.length,
      overdue: flashcards.filter(card => card.nextReviewDate < new Date()).length,
      dueToday: flashcards.filter(card => {
        const today = new Date();
        const cardDate = new Date(card.nextReviewDate);
        return cardDate.toDateString() === today.toDateString();
      }).length
    };

    return NextResponse.json({ 
      flashcards: limitedFlashcards,
      stats
    });
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    return NextResponse.json({ error: 'Failed to fetch due flashcards' }, { status: 500 });
  }
}

