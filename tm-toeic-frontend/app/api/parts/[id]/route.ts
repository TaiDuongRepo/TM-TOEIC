import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
            explanation: true
          }
        }
      }
    })

    if (!part) {
      return NextResponse.json(
        { error: 'Part not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json(
      { error: 'Failed to fetch part' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    const body = await request.json()
    const { name, description } = body

    const part = await prisma.part.update({
      where: { id },
      data: {
        name,
        description: description || null
      }
    })

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json(
      { error: 'Failed to update part' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    await prisma.part.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Part deleted successfully' })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json(
      { error: 'Failed to delete part' },
      { status: 500 }
    )
  }
}

