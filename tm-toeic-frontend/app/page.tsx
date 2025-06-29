import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Upload, Play, Brain } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7x1">
          TOEIC Learning Platform
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Nền tảng học TOEIC toàn diện với khả năng upload và quản lý nội dung đa phương tiện
        </p>
      </div>
      <div className="container mx-auto px-4 py-8">

        {/* Main Features */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Học theo Part
              </CardTitle>
              <CardDescription>
                Luyện tập từng phần của bài thi TOEIC với câu hỏi và giải thích chi tiết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/parts">
                <Button className="w-full">
                  Bắt đầu học
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-orange-600" />
                Flashcards
              </CardTitle>
              <CardDescription>
                Ôn tập từ vựng với thuật toán Spaced Repetition thông minh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/flashcards">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Ôn tập
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-green-600" />
                Quản lý nội dung
              </CardTitle>
              <CardDescription>
                Upload và quản lý hình ảnh, âm thanh, câu hỏi và đáp án
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  Quản lý
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-purple-600" />
                Luyện tập
              </CardTitle>
              <CardDescription>
                Thực hành với các bài tập đa dạng và theo dõi tiến độ học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/practice">
                <Button variant="secondary" className="w-full">
                  Luyện tập
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* TOEIC Parts Overview */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Các phần thi TOEIC
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Listening (Nghe)</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Part 1: Photographs (Mô tả hình ảnh)</li>
                <li>• Part 2: Question-Response (Hỏi đáp)</li>
                <li>• Part 3: Conversations (Hội thoại)</li>
                <li>• Part 4: Talks (Bài nói chuyện)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reading (Đọc)</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Part 5: Incomplete Sentences (Hoàn thành câu)</li>
                <li>• Part 6: Text Completion (Hoàn thành đoạn văn)</li>
                <li>• Part 7: Reading Comprehension (Đọc hiểu)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

