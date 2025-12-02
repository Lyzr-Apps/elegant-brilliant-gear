'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, RotateCcw, Plus } from 'lucide-react'

type Screen = 'setup' | 'quiz' | 'results'
type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  category: string
}

interface QuizState {
  topic: string
  difficulty: Difficulty
  questionCount: 5 | 10 | 15
  questions: Question[]
  currentQuestionIndex: number
  selectedAnswer: number | null
  answers: (number | null)[]
  submitted: boolean
  feedback: string
  score: number
  totalQuestions: number
}

// Sample quiz questions data - In production, this would come from the API
const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  mathematics: [
    {
      id: 1,
      question: 'What is the value of 7 × 8?',
      options: ['48', '54', '56', '62'],
      correct: 2,
      category: 'mathematics'
    },
    {
      id: 2,
      question: 'What is the square root of 144?',
      options: ['10', '12', '14', '16'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 3,
      question: 'What is 25% of 80?',
      options: ['15', '20', '25', '30'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 4,
      question: 'What is the sum of angles in a triangle?',
      options: ['90°', '180°', '270°', '360°'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 5,
      question: 'What is 15 ÷ 3?',
      options: ['3', '5', '7', '9'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 6,
      question: 'What is 2³?',
      options: ['6', '8', '9', '12'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 7,
      question: 'What is the prime number?',
      options: ['1', '4', '7', '10'],
      correct: 2,
      category: 'mathematics'
    },
    {
      id: 8,
      question: 'What is 50% of 200?',
      options: ['50', '75', '100', '150'],
      correct: 2,
      category: 'mathematics'
    },
    {
      id: 9,
      question: 'What is the next number: 2, 4, 6, 8, ?',
      options: ['9', '10', '11', '12'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 10,
      question: 'What is 12 × 12?',
      options: ['144', '156', '168', '180'],
      correct: 0,
      category: 'mathematics'
    },
    {
      id: 11,
      question: 'What is 100 - 45?',
      options: ['45', '55', '65', '75'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 12,
      question: 'What is the LCM of 4 and 6?',
      options: ['12', '24', '6', '8'],
      correct: 0,
      category: 'mathematics'
    },
    {
      id: 13,
      question: 'What is 3⁴?',
      options: ['12', '27', '81', '64'],
      correct: 2,
      category: 'mathematics'
    },
    {
      id: 14,
      question: 'What is the median of 2, 4, 6, 8, 10?',
      options: ['4', '6', '8', '10'],
      correct: 1,
      category: 'mathematics'
    },
    {
      id: 15,
      question: 'What is 99 ÷ 9?',
      options: ['10', '11', '12', '13'],
      correct: 1,
      category: 'mathematics'
    }
  ]
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [quizState, setQuizState] = useState<QuizState>({
    topic: '',
    difficulty: 'Medium',
    questionCount: 5,
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    submitted: false,
    feedback: '',
    score: 0,
    totalQuestions: 0
  })

  const startQuiz = () => {
    if (!quizState.topic.trim()) {
      return
    }

    const topicKey = quizState.topic.toLowerCase()
    let questions = SAMPLE_QUESTIONS[topicKey] || SAMPLE_QUESTIONS.mathematics
    questions = questions.slice(0, quizState.questionCount)

    setQuizState(prev => ({
      ...prev,
      questions,
      answers: Array(quizState.questionCount).fill(null),
      totalQuestions: quizState.questionCount,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      submitted: false,
      feedback: ''
    }))

    setScreen('quiz')
  }

  const selectAnswer = (index: number) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: index
    }))
  }

  const submitAnswer = () => {
    const current = quizState.questions[quizState.currentQuestionIndex]
    const isCorrect = quizState.selectedAnswer === current.correct

    setQuizState(prev => ({
      ...prev,
      answers: prev.answers.map((ans, i) =>
        i === prev.currentQuestionIndex ? prev.selectedAnswer : ans
      ),
      feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${current.options[current.correct]}`,
      submitted: true,
      score: prev.score + (isCorrect ? 1 : 0)
    }))
  }

  const nextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1

    if (nextIndex >= quizState.totalQuestions) {
      setScreen('results')
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: prev.answers[nextIndex] ?? null,
        submitted: false,
        feedback: ''
      }))
    }
  }

  const resetQuiz = () => {
    setQuizState({
      topic: '',
      difficulty: 'Medium',
      questionCount: 5,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: [],
      submitted: false,
      feedback: '',
      score: 0,
      totalQuestions: 0
    })
    setScreen('setup')
  }

  const getPerformanceBadge = () => {
    const percentage = (quizState.score / quizState.totalQuestions) * 100

    if (percentage >= 90) return { label: 'Outstanding', color: 'bg-green-500' }
    if (percentage >= 70) return { label: 'Great Job', color: 'bg-blue-500' }
    if (percentage >= 50) return { label: 'Good Effort', color: 'bg-yellow-500' }
    return { label: 'Keep Practicing', color: 'bg-red-500' }
  }

  const performanceBadge = getPerformanceBadge()
  const scorePercentage = (quizState.score / quizState.totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center p-4">
      {/* SETUP SCREEN */}
      {screen === 'setup' && (
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Quiz Master</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Ready to challenge yourself? Let's test your knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                What would you like to learn about?
              </label>
              <Input
                type="text"
                placeholder="e.g., Mathematics, Science, History"
                value={quizState.topic}
                onChange={e => setQuizState(prev => ({ ...prev, topic: e.target.value }))}
                className="rounded-xl px-4 py-3 border-gray-300 focus:border-red-600 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Pick your difficulty level
              </label>
              <div className="flex gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setQuizState(prev => ({ ...prev, difficulty: diff }))}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      quizState.difficulty === diff
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                How many questions? (Go at your own pace)
              </label>
              <div className="flex gap-2">
                {([5, 10, 15] as const).map(count => (
                  <button
                    key={count}
                    onClick={() => setQuizState(prev => ({ ...prev, questionCount: count }))}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      quizState.questionCount === count
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={startQuiz}
              disabled={!quizState.topic.trim()}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Let's Go
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {!quizState.topic.trim() ? 'Please enter a topic to begin' : 'You are all set!'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* QUIZ SCREEN */}
      {screen === 'quiz' && quizState.questions.length > 0 && (
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">
                Question {quizState.currentQuestionIndex + 1} of {quizState.totalQuestions}
              </span>
              <span className="text-white text-sm">
                Score: {quizState.score}/{quizState.totalQuestions}
              </span>
            </div>
            <Progress
              value={((quizState.currentQuestionIndex + 1) / quizState.totalQuestions) * 100}
              className="h-2 rounded-full"
            />
          </div>

          {/* Question Card */}
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                {quizState.questions[quizState.currentQuestionIndex]?.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {quizState.questions[quizState.currentQuestionIndex]?.options.map(
                  (option, index) => {
                    const isSelected = quizState.selectedAnswer === index
                    const isCorrect = index === quizState.questions[quizState.currentQuestionIndex].correct
                    const showCorrect = quizState.submitted && isCorrect
                    const showIncorrect = quizState.submitted && isSelected && !isCorrect

                    return (
                      <button
                        key={index}
                        onClick={() => !quizState.submitted && selectAnswer(index)}
                        disabled={quizState.submitted}
                        className={`w-full p-4 rounded-2xl font-semibold text-base text-left transition-all ${
                          showCorrect
                            ? 'bg-green-500 text-white border-2 border-green-600'
                            : showIncorrect
                            ? 'bg-red-500 text-white border-2 border-red-600'
                            : isSelected
                            ? 'bg-red-600 text-white border-2 border-red-700'
                            : 'bg-gray-100 text-gray-900 border-2 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  }
                )}
              </div>

              {/* Feedback Panel */}
              {quizState.submitted && (
                <div
                  className={`p-4 rounded-2xl text-sm font-semibold ${
                    quizState.feedback.startsWith('Correct')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{quizState.feedback.startsWith('Correct') ? 'Well done!' : 'No worries!'}</span>
                  </div>
                  <div className="mt-2 text-xs font-normal">
                    {quizState.feedback}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {!quizState.submitted ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={quizState.selectedAnswer === null}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                  >
                    {quizState.currentQuestionIndex === quizState.totalQuestions - 1
                      ? 'See Results'
                      : 'Next Question'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {screen === 'results' && (
        <div className="w-full max-w-2xl space-y-6">
          {/* Score Display */}
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="pt-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">You did it!</h2>
              <p className="text-gray-600 mb-8">Here's how you performed</p>

              {/* Circular Score */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute w-40 h-40 rounded-full border-8 border-red-200"></div>
                  <div className="absolute w-40 h-40 rounded-full border-8 border-transparent border-t-8 border-t-red-600 border-r-8 border-r-red-600"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)`
                    }}
                  ></div>
                  <div className="text-center z-10">
                    <div className="text-5xl font-bold text-red-600">
                      {quizState.score}
                    </div>
                    <div className="text-gray-600 text-sm">
                      of {quizState.totalQuestions}
                    </div>
                  </div>
                </div>
              </div>

              {/* Better circular display using SVG approach */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="12"
                      strokeDasharray={`${(scorePercentage / 100) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-red-600">
                      {Math.round(scorePercentage)}%
                    </div>
                    <div className="text-gray-600 text-sm mt-2">
                      {quizState.score}/{quizState.totalQuestions}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Badge */}
              <Badge className={`${performanceBadge.color} text-white text-base px-6 py-2 rounded-full font-semibold mb-8`}>
                {performanceBadge.label}
              </Badge>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {scorePercentage >= 90 && 'Outstanding! You absolutely crushed this quiz. You really know your stuff!'}
                {scorePercentage >= 70 && scorePercentage < 90 && 'Fantastic job! You clearly have a solid grasp of this topic. Keep pushing forward!'}
                {scorePercentage >= 50 && scorePercentage < 70 && 'Good effort! You\'re on the right track. A little more practice and you\'ll master this topic.'}
                {scorePercentage < 50 && 'Good try! Don\'t get discouraged. Learning takes time, and every attempt makes you stronger!'}
              </p>
            </CardContent>
          </Card>

          {/* Question Breakdown */}
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Let's Review Your Answers</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                See which questions you nailed and where to focus next time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizState.questions.map((question, index) => {
                  const isCorrect = quizState.answers[index] === question.correct
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-2xl ${
                        isCorrect
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : 'bg-red-50 border-l-4 border-red-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5 ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            Question {index + 1}
                          </p>
                          <p className="text-gray-700 text-sm mt-1">
                            {question.question}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700 text-sm mt-2">
                              Correct answer: {question.options[question.correct]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-white hover:bg-gray-100 text-red-600 font-semibold rounded-xl border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </Button>
            <Button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-white hover:bg-gray-100 text-red-600 font-semibold rounded-xl border-2 border-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Try Something New
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
