'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { X, Upload, Image, Volume2 } from 'lucide-react'

interface FlashcardPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedText: string
  onSave: (flashcard: {
    frontContent: string
    backContent: string
    imageUrl?: string
    audioUrl?: string
  }) => void
}

export function FlashcardPopup({ isOpen, onClose, selectedText, onSave }: FlashcardPopupProps) {
  const [frontContent, setFrontContent] = useState(selectedText)
  const [backContent, setBackContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = async () => {
    if (!frontContent.trim() || !backContent.trim()) {
      alert('Vui lòng điền đầy đủ nội dung mặt trước và mặt sau của flashcard')
      return
    }

    await onSave({
      frontContent: frontContent.trim(),
      backContent: backContent.trim(),
      imageUrl: imageUrl.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined
    })

    // Reset form
    setFrontContent('')
    setBackContent('')
    setImageUrl('')
    setAudioUrl('')
    onClose()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
      } else {
        alert('Lỗi khi upload hình ảnh')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Lỗi khi upload hình ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'audio')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setAudioUrl(data.url)
      } else {
        alert('Lỗi khi upload âm thanh')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Lỗi khi upload âm thanh')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Thêm Flashcard
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Front Content */}
          <div className="space-y-2">
            <Label htmlFor="front-content">Mặt trước (Từ vựng/Câu hỏi)</Label>
            <Input
              id="front-content"
              value={frontContent}
              onChange={(e) => setFrontContent(e.target.value)}
              placeholder="Nhập từ vựng hoặc câu hỏi..."
              className="text-lg"
            />
          </div>

          {/* Back Content */}
          <div className="space-y-2">
            <Label htmlFor="back-content">Mặt sau (Định nghĩa/Giải thích)</Label>
            <Textarea
              id="back-content"
              value={backContent}
              onChange={(e) => setBackContent(e.target.value)}
              placeholder="Nhập định nghĩa, giải thích, ví dụ..."
              rows={4}
            />
          </div>

          {/* Media Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Hình ảnh (tùy chọn)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Đang upload...' : 'Chọn hình ảnh'}
                    </Button>
                    {imageUrl && (
                      <div className="mt-2">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageUrl('')}
                          className="mt-1 text-red-500"
                        >
                          Xóa hình ảnh
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Upload */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Âm thanh (tùy chọn)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                      id="audio-upload"
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('audio-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Đang upload...' : 'Chọn âm thanh'}
                    </Button>
                    {audioUrl && (
                      <div className="mt-2">
                        <audio controls className="w-full">
                          <source src={audioUrl} />
                          Trình duyệt không hỗ trợ audio.
                        </audio>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAudioUrl('')}
                          className="mt-1 text-red-500"
                        >
                          Xóa âm thanh
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isUploading}>
              Lưu Flashcard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

