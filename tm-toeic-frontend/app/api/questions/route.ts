import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partId = searchParams.get('partId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = partId ? { partId } : {}

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        include: {
          part: true,
          options: true,
          explanation: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.question.count({ where })
    ])

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      partId, 
      questionText, 
      questionType, 
      imageUrl, 
      audioUrl, 
      options, 
      explanation 
    } = body

    if (!partId || !questionType) {
      return NextResponse.json(
        { error: 'Part ID and question type are required' },
        { status: 400 }
      )
    }

    // Validate question type
    if (!['text', 'image', 'audio'].includes(questionType)) {
      return NextResponse.json(
        { error: 'Invalid question type' },
        { status: 400 }
      )
    }

    const question = await prisma.question.create({
      data: {
        partId,
        questionText: questionText || null,
        questionType,
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
        options: {
          create: options?.map((option: { text: string; isCorrect?: boolean }) => ({
            optionText: option.text,
            isCorrect: option.isCorrect || false
          })) || []
        },
        explanation: explanation ? {
          create: {
            explanationText: explanation
          }
        } : undefined
      },
      include: {
        options: true,
        explanation: true,
        part: true
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}

