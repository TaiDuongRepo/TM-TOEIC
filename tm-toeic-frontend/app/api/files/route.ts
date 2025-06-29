import { NextRequest, NextResponse } from 'next/server'
import { minioClient, bucketName } from '@/lib/minio'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      )
    }

    // Get file from MinIO
    const fileStream = await minioClient.getObject(bucketName, fileName)
    
    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of fileStream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Get file metadata
    const stat = await minioClient.statObject(bucketName, fileName)
    
    // Determine content type
    const contentType = stat.metaData['content-type'] || 'application/octet-stream'
    
    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Length', buffer.length.toString())
    headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return new NextResponse(buffer, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    )
  }
}

