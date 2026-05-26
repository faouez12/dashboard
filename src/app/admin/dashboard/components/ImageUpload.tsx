'use client'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
    onImageUploaded: (url: string) => void
    currentImage?: string
    uploadHandler?: (file: File) => Promise<string>
}

export default function ImageUpload({ onImageUploaded, currentImage, uploadHandler }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string>(currentImage || '')
    const [error, setError] = useState<string>('')

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB')
            return
        }

        setError('')
        setUploading(true)

        try {
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            if (uploadHandler) {
                const publicUrl = await uploadHandler(file)
                onImageUploaded(publicUrl)
                setPreview(publicUrl)
            } else {
                console.log('No uploadHandler provided. Simulating upload...')
                await new Promise((resolve) => setTimeout(resolve, 1000))
                onImageUploaded(objectUrl)
            }

        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload image')
            setPreview('')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview('')
        onImageUploaded('')
    }

    return (
        <div className="w-full">
            {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            ) : (
                <div className="relative w-full">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                    {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-sm font-medium">Uploading...</div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
