import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    return NextResponse.json(parts)
  } catch (error) {
    console.error('Error fetching parts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const part = await prisma.part.create({
      data: {
        name,
        description: description || null
      }
    })

    return NextResponse.json(part, { status: 201 })
  } catch (error) {
    console.error('Error creating part:', error)
    return NextResponse.json(
      { error: 'Failed to create part' },
      { status: 500 }
    )
  }
}

