'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowLeft } from 'lucide-react'

interface Part {
  id: string
  name: string
  description: string | null
  _count: {
    questions: number
  }
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/parts')
      if (response.ok) {
        const data = await response.json()
        setParts(data)
      }
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Các phần thi TOEIC</h1>
            <p className="text-gray-600 mt-2">Chọn một phần để bắt đầu luyện tập</p>
          </div>
        </div>

        {/* Parts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Card key={part.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{part.name}</CardTitle>
                  <Badge variant="secondary">
                    {part._count.questions} câu hỏi
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {part.description || 'Không có mô tả'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/parts/${part.id}`}>
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Bắt đầu học
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {parts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có phần thi nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hãy thêm các phần thi và câu hỏi để bắt đầu học tập
            </p>
            <Link href="/admin">
              <Button>
                Quản lý nội dung
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

