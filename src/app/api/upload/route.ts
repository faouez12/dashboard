import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const hasR2 = !!(
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ENDPOINT &&
  process.env.R2_BUCKET_NAME
)

let s3Client: S3Client | null = null

if (hasR2) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
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

    if (hasR2 && s3Client) {
      const bucketName = process.env.R2_BUCKET_NAME!
      let publicUrl = process.env.R2_PUBLIC_URL || ''

      if (publicUrl.endsWith('/')) {
        publicUrl = publicUrl.slice(0, -1)
      }

      await s3Client.send(
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
