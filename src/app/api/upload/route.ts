import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

function getR2Config() {
  const isConfigured = !!(
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT &&
    process.env.R2_BUCKET_NAME
  )
  if (!isConfigured) return null
  
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
  return { client, bucketName: process.env.R2_BUCKET_NAME! }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate type (images and videos)
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only images and videos are allowed' }, { status: 400 })
    }

    // Max 100MB limit for video files
    const MAX_SIZE = 100 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const folder = file.type.startsWith('video/') ? 'videos' : 'visuals'
    const filePath = `${folder}/${fileName}`

    const r2 = getR2Config()
    if (r2) {
      const bucketName = r2.bucketName
      let publicUrl = process.env.R2_PUBLIC_URL || ''

      if (publicUrl.endsWith('/')) {
        publicUrl = publicUrl.slice(0, -1)
      }

      await r2.client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filePath,
          Body: buffer,
          ContentType: file.type,
        })
      )

      const fileUrl = `${publicUrl}/${filePath}`
      return NextResponse.json({ url: fileUrl })
    }

    return NextResponse.json({ error: 'R2 Storage is not properly configured in env files.' }, { status: 500 })
  } catch (err: any) {
    console.error('[R2_UPLOAD_ROUTE_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
