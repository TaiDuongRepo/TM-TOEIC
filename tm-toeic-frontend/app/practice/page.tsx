import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Play, Target, TrendingUp } from 'lucide-react'

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-3xl font-bold text-gray-900">Luyện tập</h1>
            <p className="text-gray-600 mt-2">Các chế độ luyện tập và theo dõi tiến độ</p>
          </div>
        </div>

        {/* Practice Modes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-blue-600" />
                Luyện tập nhanh
              </CardTitle>
              <CardDescription>
                Luyện tập ngẫu nhiên các câu hỏi từ tất cả các phần
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/parts">
                <Button className="w-full">
                  Bắt đầu
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-green-600" />
                Luyện tập theo Part
              </CardTitle>
              <CardDescription>
                Tập trung vào một phần cụ thể của bài thi TOEIC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/parts">
                <Button variant="outline" className="w-full">
                  Chọn Part
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Theo dõi tiến độ
              </CardTitle>
              <CardDescription>
                Xem thống kê và tiến độ học tập của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                Sắp ra mắt
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <Card>
          <CardHeader>
            <CardTitle>Tính năng sắp ra mắt</CardTitle>
            <CardDescription>
              Các tính năng đang được phát triển để nâng cao trải nghiệm học tập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Bài thi thử</h4>
                <p className="text-sm text-gray-600">
                  Làm bài thi thử hoàn chỉnh với thời gian giới hạn
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Thống kê chi tiết</h4>
                <p className="text-sm text-gray-600">
                  Theo dõi điểm số, thời gian làm bài và xu hướng cải thiện
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Luyện tập cá nhân hóa</h4>
                <p className="text-sm text-gray-600">
                  Gợi ý câu hỏi dựa trên điểm yếu và sở thích
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Chia sẻ kết quả</h4>
                <p className="text-sm text-gray-600">
                  Chia sẻ thành tích và so sánh với bạn bè
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

