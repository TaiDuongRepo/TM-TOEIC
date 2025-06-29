import { NextRequest, NextResponse } from 'next/server'
import { minioClient, bucketName, ensureBucket } from '@/lib/minio'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    await ensureBucket()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'image' or 'audio'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !['image', 'audio'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "image" or "audio"' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a']

    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    if (type === 'audio' && !allowedAudioTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid audio file type. Allowed: MP3, WAV, OGG, M4A' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${type}s/${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to MinIO
    await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
      'Content-Type': file.type
    })

    // Generate URL through our API endpoint
    const fileUrl = `/api/files?fileName=${encodeURIComponent(fileName)}`

    return NextResponse.json({
      url: fileUrl,
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      )
    }

    await minioClient.removeObject(bucketName, fileName)

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

