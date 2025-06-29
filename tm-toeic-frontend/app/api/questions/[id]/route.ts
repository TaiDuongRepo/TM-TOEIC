import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        part: true,
        options: true,
        explanation: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const body = await request.json()
    const { 
      questionText, 
      questionType, 
      imageUrl, 
      audioUrl, 
      options, 
      explanation 
    } = body

    // Update question
    await prisma.question.update({
      where: { id },
      data: {
        questionText: questionText || null,
        questionType,
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null
      }
    })

    // Update options
    if (options) {
      // Delete existing options
      await prisma.option.deleteMany({
        where: { questionId: id }
      })

      // Create new options
      await prisma.option.createMany({
        data: options.map((option: { text: string; isCorrect?: boolean }) => ({
          questionId: id,
          optionText: option.text,
          isCorrect: option.isCorrect || false
        }))
      })
    }

    // Update explanation
    if (explanation !== undefined) {
      if (explanation) {
        await prisma.explanation.upsert({
          where: { questionId: id },
          update: { explanationText: explanation },
          create: {
            questionId: id,
            explanationText: explanation
          }
        })
      } else {
        await prisma.explanation.deleteMany({
          where: { questionId: id }
        })
      }
    }

    // Fetch updated question
    const updatedQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        part: true,
        options: true,
        explanation: true
      }
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    await prisma.question.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}

