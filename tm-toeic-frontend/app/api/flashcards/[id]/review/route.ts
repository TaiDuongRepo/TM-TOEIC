import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSM2 } from '@/lib/sm2/algorithm';

// POST /api/flashcards/[id]/review - Submit a review for a flashcard
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-2)[0];
    const body = await request.json();
    const { quality } = body;

    // Validate quality rating
    if (typeof quality !== 'number' || quality < 0 || quality > 5) {
      return NextResponse.json({ 
        error: 'Quality must be a number between 0 and 5' 
      }, { status: 400 });
    }

    // Get current flashcard data
    const flashcard = await prisma.flashcard.findUnique({
      where: { id }
    });

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }

    // Calculate new SM-2 parameters
    const sm2Result = calculateSM2({
      quality,
      repetitions: flashcard.repetitions,
      easinessFactor: flashcard.easinessFactor,
      interval: flashcard.interval
    });

    // Update flashcard with new parameters and create repetition history
    const [updatedFlashcard, repetitionHistory] = await prisma.$transaction([
      // Update flashcard
      prisma.flashcard.update({
        where: { id },
        data: {
          easinessFactor: sm2Result.easinessFactor,
          repetitions: sm2Result.repetitions,
          interval: sm2Result.interval,
          nextReviewDate: sm2Result.nextReviewDate,
          updatedAt: new Date()
        }
      }),
      // Create repetition history record
      prisma.repetitionHistory.create({
        data: {
          flashcardId: id,
          quality,
          reviewDate: new Date()
        }
      })
    ]);

    return NextResponse.json({ 
      flashcard: updatedFlashcard,
      repetitionHistory,
      sm2Result: {
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        easinessFactor: sm2Result.easinessFactor,
        nextReviewDate: sm2Result.nextReviewDate
      }
    });
  } catch (error) {
    console.error('Error submitting flashcard review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

