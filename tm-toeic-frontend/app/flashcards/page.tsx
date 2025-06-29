'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Brain, Calendar, TrendingUp, RotateCcw, Volume2, Image as ImageIcon } from 'lucide-react'

interface Flashcard {
  id: string
  frontContent: string
  backContent: string
  imageUrl?: string
  audioUrl?: string
  easinessFactor: number
  repetitions: number
  interval: number
  nextReviewDate: string
  repetitionHistory: Array<{
    id: string
    quality: number
    reviewDate: string
  }>
}

interface ReviewStats {
  totalDue: number
  overdue: number
  dueToday: number
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [stats, setStats] = useState<ReviewStats>({ totalDue: 0, overdue: 0, dueToday: 0 })
  const [loading, setLoading] = useState(true)
  const [reviewMode, setReviewMode] = useState(false)

  const userId = 'default-user-id' // In a real app, this would come from authentication

  useEffect(() => {
    fetchDueFlashcards()
  }, [])

  const fetchDueFlashcards = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/flashcards/due?userId=${userId}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setFlashcards(data.flashcards)
        setStats(data.stats)
        if (data.flashcards.length > 0) {
          setReviewMode(true)
        }
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQualityResponse = async (quality: number) => {
    const currentCard = flashcards[currentCardIndex]
    if (!currentCard) return

    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quality })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Review submitted:', data)

        // Move to next card or finish review
        if (currentCardIndex < flashcards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1)
          setShowAnswer(false)
        } else {
          // Review session completed
          setReviewMode(false)
          setCurrentCardIndex(0)
          setShowAnswer(false)
          // Refresh the flashcards list
          fetchDueFlashcards()
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Lỗi khi gửi đánh giá')
    }
  }

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  const resetReview = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setReviewMode(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải flashcards...</p>
        </div>
      </div>
    )
  }

  if (!reviewMode || flashcards.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
              <p className="text-gray-600 mt-2">Ôn tập từ vựng với thuật toán Spaced Repetition</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cần ôn tập</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quá hạn</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hôm nay</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.dueToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* No flashcards message */}
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {flashcards.length === 0 ? 'Không có flashcard nào cần ôn tập' : 'Hoàn thành ôn tập!'}
              </h3>
              <p className="text-gray-600 mb-6">
                {flashcards.length === 0 
                  ? 'Hãy tạo flashcard bằng cách bôi đen từ vựng khi luyện tập các phần thi TOEIC.'
                  : 'Bạn đã hoàn thành tất cả flashcard cần ôn tập hôm nay. Hãy quay lại sau để tiếp tục ôn tập.'
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/parts">
                  <Button>
                    Luyện tập TOEIC
                  </Button>
                </Link>
                {flashcards.length > 0 && (
                  <Button variant="outline" onClick={resetReview}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Ôn tập lại
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/flashcards">
              <Button variant="outline" size="sm" onClick={() => setReviewMode(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Thoát
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ôn tập Flashcard</h1>
              <p className="text-gray-600">
                Thẻ {currentCardIndex + 1} / {flashcards.length}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            EF: {currentCard.easinessFactor.toFixed(1)} | Lần: {currentCard.repetitions}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <Card className="mb-8 min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-center">
              {showAnswer ? 'Định nghĩa / Giải thích' : 'Từ vựng / Câu hỏi'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {!showAnswer ? (
                // Front of card
                <div className="space-y-6">
                  <div className="text-3xl font-bold text-gray-900 leading-relaxed">
                    {currentCard.frontContent}
                  </div>
                  
                  {currentCard.imageUrl && (
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={currentCard.imageUrl}
                          alt="Flashcard image"
                          className="max-w-full h-auto rounded-lg shadow-md"
                          style={{ maxHeight: '300px' }}
                        />
                        <Badge className="absolute top-2 right-2">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Hình ảnh
                        </Badge>
                      </div>
                    </div>
                  )}

                  {currentCard.audioUrl && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => playAudio(currentCard.audioUrl!)}
                        variant="outline"
                        size="lg"
                      >
                        <Volume2 className="h-5 w-5 mr-2" />
                        Phát âm thanh
                      </Button>
                    </div>
                  )}

                  <Button 
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="mt-8"
                  >
                    Hiển thị đáp án
                  </Button>
                </div>
              ) : (
                // Back of card
                <div className="space-y-6">
                  <div className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentCard.backContent}
                  </div>

                  {/* Quality buttons */}
                  <div className="space-y-4 mt-8">
                    <p className="text-lg font-medium text-gray-900">
                      Bạn nhớ từ này như thế nào?
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { quality: 5, label: 'Hoàn hảo', color: 'bg-green-500 hover:bg-green-600' },
                        { quality: 4, label: 'Tốt', color: 'bg-blue-500 hover:bg-blue-600' },
                        { quality: 3, label: 'Khó', color: 'bg-yellow-500 hover:bg-yellow-600' },
                        { quality: 2, label: 'Rất khó', color: 'bg-orange-500 hover:bg-orange-600' },
                        { quality: 1, label: 'Quên', color: 'bg-red-500 hover:bg-red-600' },
                        { quality: 0, label: 'Không nhớ', color: 'bg-gray-500 hover:bg-gray-600' }
                      ].map(({ quality, label, color }) => (
                        <Button
                          key={quality}
                          onClick={() => handleQualityResponse(quality)}
                          className={`${color} text-white`}
                          size="lg"
                        >
                          <div className="text-center">
                            <div className="font-bold">{quality}</div>
                            <div className="text-sm">{label}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Đánh giá này sẽ ảnh hưởng đến lịch ôn tập tiếp theo của bạn
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

