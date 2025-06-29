'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, Volume2 } from 'lucide-react'

interface Part {
  id: string
  name: string
  description: string | null
  _count: {
    questions: number
  }
}

interface Option {
  id: string
  optionText: string
  isCorrect: boolean
}

interface Question {
  id: string
  questionText: string | null
  questionType: string
  imageUrl: string | null
  audioUrl: string | null
  options: Option[]
  explanation: {
    explanationText: string
  } | null
  part: {
    name: string
  }
}

export default function AdminPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPart, setSelectedPart] = useState<string>('')
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  // Form states
  const [questionForm, setQuestionForm] = useState({
    partId: '',
    questionText: '',
    questionType: 'text',
    imageUrl: '',
    audioUrl: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: ''
  })

  useEffect(() => {
    fetchParts()
    fetchQuestions()
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
    }
  }

  const fetchQuestions = async () => {
    try {
      const url = selectedPart && selectedPart !== 'all' ? `/api/questions?partId=${selectedPart}` : '/api/questions'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [selectedPart])

  const handleFileUpload = async (file: File, type: 'image' | 'audio') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'image') {
          setQuestionForm(prev => ({ ...prev, imageUrl: data.url }))
        } else {
          setQuestionForm(prev => ({ ...prev, audioUrl: data.url }))
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const handleSubmitQuestion = async () => {
    try {
      const method = editingQuestion ? 'PUT' : 'POST'
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : '/api/questions'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionForm)
      })

      if (response.ok) {
        setShowQuestionDialog(false)
        setEditingQuestion(null)
        resetForm()
        fetchQuestions()
      }
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchQuestions()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const resetForm = () => {
    setQuestionForm({
      partId: '',
      questionText: '',
      questionType: 'text',
      imageUrl: '',
      audioUrl: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      explanation: ''
    })
  }

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    setQuestionForm({
      partId: question.part ? '' : '', // We'll need the part ID from the question
      questionText: question.questionText || '',
      questionType: question.questionType,
      imageUrl: question.imageUrl || '',
      audioUrl: question.audioUrl || '',
      options: question.options.map(opt => ({
        text: opt.optionText,
        isCorrect: opt.isCorrect
      })),
      explanation: question.explanation?.explanationText || ''
    })
    setShowQuestionDialog(true)
  }

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }))
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý nội dung</h1>
            <p className="text-gray-600 mt-2">Thêm và quản lý câu hỏi, hình ảnh, âm thanh</p>
          </div>
          <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingQuestion(null) }}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                </DialogTitle>
                <DialogDescription>
                  Điền thông tin câu hỏi và các lựa chọn đáp án
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Part Selection */}
                <div>
                  <Label htmlFor="part">Phần thi</Label>
                  <Select value={questionForm.partId} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, partId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phần thi" />
                    </SelectTrigger>
                    <SelectContent>
                      {parts.map(part => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Type */}
                <div>
                  <Label htmlFor="questionType">Loại câu hỏi</Label>
                  <Select value={questionForm.questionType} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, questionType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Văn bản</SelectItem>
                      <SelectItem value="image">Hình ảnh</SelectItem>
                      <SelectItem value="audio">Âm thanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Text */}
                <div>
                  <Label htmlFor="questionText">Nội dung câu hỏi</Label>
                  <Textarea
                    id="questionText"
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, questionText: e.target.value }))}
                    placeholder="Nhập nội dung câu hỏi..."
                    rows={3}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Hình ảnh (tùy chọn)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'image')
                      }}
                    />
                    {questionForm.imageUrl && (
                      <Badge variant="secondary">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Đã tải lên
                      </Badge>
                    )}
                  </div>
                  {questionForm.imageUrl && (
                    <img src={questionForm.imageUrl} alt="Preview" className="mt-2 max-w-xs rounded" />
                  )}
                </div>

                {/* Audio Upload */}
                <div>
                  <Label>Âm thanh (tùy chọn)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'audio')
                      }}
                    />
                    {questionForm.audioUrl && (
                      <Badge variant="secondary">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Đã tải lên
                      </Badge>
                    )}
                  </div>
                  {questionForm.audioUrl && (
                    <audio controls className="mt-2">
                      <source src={questionForm.audioUrl} />
                      Trình duyệt không hỗ trợ phát âm thanh.
                    </audio>
                  )}
                </div>

                {/* Options */}
                <div>
                  <Label>Các lựa chọn đáp án</Label>
                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={option.isCorrect}
                            onChange={() => {
                              setQuestionForm(prev => ({
                                ...prev,
                                options: prev.options.map((opt, i) => ({
                                  ...opt,
                                  isCorrect: i === index
                                }))
                              }))
                            }}
                          />
                          <span className="text-sm">Đúng</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <Label htmlFor="explanation">Giải thích</Label>
                  <Textarea
                    id="explanation"
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Nhập giải thích cho đáp án..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmitQuestion}>
                    {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="partFilter">Lọc theo phần thi</Label>
                <Select value={selectedPart || undefined} onValueChange={setSelectedPart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả phần thi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phần thi</SelectItem>
                    {parts.map(part => (
                      <SelectItem key={part.id} value={part.id}>
                        {part.name} ({part._count.questions} câu hỏi)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {question.questionText || 'Câu hỏi không có tiêu đề'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{question.part.name}</Badge>
                      <Badge variant="secondary">{question.questionType}</Badge>
                      {question.imageUrl && (
                        <Badge variant="secondary">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Hình ảnh
                        </Badge>
                      )}
                      {question.audioUrl && (
                        <Badge variant="secondary">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Âm thanh
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteQuestion(question.id)}>
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded border ${
                        option.isCorrect ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          option.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option.optionText}</span>
                        {option.isCorrect && (
                          <Badge variant="secondary" className="ml-auto">Đáp án đúng</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <h5 className="font-medium text-blue-900 mb-1">Giải thích:</h5>
                    <p className="text-blue-800 text-sm">{question.explanation.explanationText}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có câu hỏi nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hãy thêm câu hỏi đầu tiên để bắt đầu xây dựng nội dung học tập
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

