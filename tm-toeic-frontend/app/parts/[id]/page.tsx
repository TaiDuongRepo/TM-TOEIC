'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { TextSelectionWrapper } from '@/components/flashcard/TextSelectionWrapper'
import { AudioPlayer } from '@/components/ui/audio-player'

interface Option {
  id: string
  optionText: string
  isCorrect: boolean
}

interface Explanation {
  id: string
  explanationText: string
}

interface Question {
  id: string
  questionText: string | null
  questionType: string
  imageUrl: string | null
  audioUrl: string | null
  options: Option[]
  explanation: Explanation | null
}

interface Part {
  id: string
  name: string
  description: string | null
  questions: Question[]
}

export default function PartDetailPage() {
  const params = useParams()
  const [part, setPart] = useState<Part | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPart(params.id as string)
    }
  }, [params.id])

  const fetchPart = async (id: string) => {
    try {
      const response = await fetch(`/api/parts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPart(data)
      }
    } catch (error) {
      console.error('Error fetching part:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId)
  }

  const handleSubmitAnswer = () => {
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (part && currentQuestionIndex < part.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
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

  if (!part) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy phần thi</h2>
          <Link href="/parts">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (part.questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/parts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{part.name}</h1>
              <p className="text-gray-600 mt-2">{part.description}</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="h-16 w-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có câu hỏi nào
            </h3>
            <p className="text-gray-600 mb-4">
              Phần thi này chưa có câu hỏi. Hãy thêm câu hỏi để bắt đầu luyện tập.
            </p>
            <Link href="/admin">
              <Button>
                Thêm câu hỏi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = part.questions[currentQuestionIndex]
  const correctOption = currentQuestion.options.find(option => option.isCorrect)

  return (
    <TextSelectionWrapper userId="default-user-id">
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/parts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{part.name}</h1>
              <p className="text-gray-600 mt-2">{part.description}</p>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    Câu {currentQuestionIndex + 1}
                  </CardTitle>
                  <CardDescription>
                    {currentQuestion.questionType}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {currentQuestion.questionType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              {currentQuestion.questionText && (
                <div className="text-lg text-gray-800 leading-relaxed">
                  {currentQuestion.questionText}
                </div>
              )}

              {/* Image */}
              {currentQuestion.imageUrl && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Question image"
                      className="max-w-full h-auto rounded-lg shadow-md"
                      style={{ maxHeight: '400px' }}
                    />
                    <Badge className="absolute top-2 right-2">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Hình ảnh
                    </Badge>
                  </div>
                </div>
              )}

              {/* Audio */}
              {currentQuestion.audioUrl && (
                <div className="flex justify-center">
                  <AudioPlayer 
                    audioUrl={currentQuestion.audioUrl} 
                    className="w-full max-w-md"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : showExplanation && option.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : showExplanation && selectedAnswer === option.id && !option.isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => !showExplanation && handleAnswerSelect(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        selectedAnswer === option.id
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : showExplanation && option.isCorrect
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-800">{option.optionText}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              {selectedAnswer && !showExplanation && (
                <div className="flex justify-center">
                  <Button onClick={handleSubmitAnswer} size="lg">
                    Kiểm tra đáp án
                  </Button>
                </div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {selectedAnswer === correctOption?.id ? '✅ Chính xác!' : '❌ Không chính xác'}
                  </h4>
                  <p className="text-blue-800 mb-3">
                    Đáp án đúng: <strong>{correctOption?.optionText}</strong>
                  </p>
                  {currentQuestion.explanation && (
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Giải thích:</h5>
                      <p className="text-blue-800">{currentQuestion.explanation.explanationText}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Câu trước
            </Button>
            
            <div className="text-sm text-gray-600">
              Câu {currentQuestionIndex + 1} / {part.questions.length}
            </div>
            
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === part.questions.length - 1 || !showExplanation}
            >
              Câu tiếp theo
            </Button>
          </div>
        </div>
      </div>
    </TextSelectionWrapper>
  )
}