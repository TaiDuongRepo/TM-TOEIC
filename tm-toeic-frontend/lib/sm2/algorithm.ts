// SM-2 Algorithm Implementation for Spaced Repetition
// Based on the original SuperMemo 2 algorithm by Piotr Wozniak

export interface SM2Result {
  interval: number;
  repetitions: number;
  easinessFactor: number;
  nextReviewDate: Date;
}

export interface SM2Input {
  quality: number; // 0-5 quality of response
  repetitions: number; // current repetition count
  easinessFactor: number; // current easiness factor
  interval: number; // current interval in days
}

/**
 * Calculate next review parameters using SM-2 algorithm
 * @param input Current flashcard parameters and quality response
 * @returns Updated parameters for next review
 */
export function calculateSM2(input: SM2Input): SM2Result {
  const { quality, repetitions, easinessFactor, interval } = input;
  
  let newEasinessFactor = easinessFactor;
  let newRepetitions = repetitions;
  let newInterval = interval;

  // Update easiness factor if quality >= 3
  if (quality >= 3) {
    newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    // Ensure EF doesn't go below 1.3
    if (newEasinessFactor < 1.3) {
      newEasinessFactor = 1.3;
    }
    
    // Increment repetitions for successful review
    newRepetitions = repetitions + 1;
  } else {
    // Reset repetitions for failed review
    newRepetitions = 0;
  }

  // Calculate new interval
  if (quality < 3) {
    // Failed review - review again tomorrow
    newInterval = 1;
  } else {
    // Successful review
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEasinessFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easinessFactor: newEasinessFactor,
    nextReviewDate
  };
}

/**
 * Get quality description for user interface
 * @param quality Quality rating (0-5)
 * @returns Human-readable description
 */
export function getQualityDescription(quality: number): string {
  switch (quality) {
    case 5:
      return "Perfect - Remembered easily";
    case 4:
      return "Good - Remembered with slight hesitation";
    case 3:
      return "Fair - Remembered with difficulty";
    case 2:
      return "Hard - Forgot but recognized when shown";
    case 1:
      return "Very Hard - Completely forgot";
    case 0:
      return "Blackout - No memory at all";
    default:
      return "Unknown";
  }
}

/**
 * Get flashcards due for review
 * @param flashcards Array of flashcards with nextReviewDate
 * @returns Flashcards that are due for review
 */
export function getFlashcardsDueForReview<T extends { nextReviewDate: Date }>(
  flashcards: T[]
): T[] {
  const now = new Date();
  return flashcards.filter(card => card.nextReviewDate <= now);
}

/**
 * Sort flashcards by review priority (overdue first, then by next review date)
 * @param flashcards Array of flashcards with nextReviewDate
 * @returns Sorted flashcards by review priority
 */
export function sortFlashcardsByPriority<T extends { nextReviewDate: Date }>(
  flashcards: T[]
): T[] {
  const now = new Date();
  return flashcards.sort((a, b) => {
    const aOverdue = a.nextReviewDate.getTime() - now.getTime();
    const bOverdue = b.nextReviewDate.getTime() - now.getTime();
    
    // If both are overdue, prioritize the most overdue
    if (aOverdue < 0 && bOverdue < 0) {
      return aOverdue - bOverdue;
    }
    
    // If one is overdue and one isn't, prioritize the overdue one
    if (aOverdue < 0) return -1;
    if (bOverdue < 0) return 1;
    
    // If neither is overdue, sort by next review date
    return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
  });
}

