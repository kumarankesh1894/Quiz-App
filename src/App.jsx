import { useState, useEffect } from 'react'
import './App.css'
import QuizSetup from './components/QuizSetup'
import QuestionPanel from './components/QuestionPanel'
import ReportPage from './components/ReportPage'
import config from './config/config'

// Main App component
function App() {
  // State management
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(config.QUIZ.TIMER_MINUTES * 60) // Timer in seconds
  const [userEmail, setUserEmail] = useState('')
  const [visitedQuestions, setVisitedQuestions] = useState(new Set())

  // LocalStorage functions for quiz state persistence
  const saveQuizState = (state) => {
    try {
      localStorage.setItem('quizState', JSON.stringify(state))
    } catch (error) {
      console.error('Error saving quiz state:', error)
    }
  }

  const loadQuizState = () => {
    try {
      const savedState = localStorage.getItem('quizState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // Convert visitedQuestions back to a Set
        parsedState.visitedQuestions = new Set(parsedState.visitedQuestions)
        return parsedState
      }
      return null
    } catch (error) {
      console.error('Error loading quiz state:', error)
      return null
    }
  }

  const clearQuizState = () => {
    try {
      localStorage.removeItem('quizState')
    } catch (error) {
      console.error('Error clearing quiz state:', error)
    }
  }

  // Fetch questions from Open Trivia Database API
  const fetchQuestions = async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const baseUrl = config.API.BASE_URL
      const questionCount = config.API.DEFAULT_QUESTION_COUNT
      let apiUrl = `${baseUrl}?amount=${questionCount}`
      if (params.category) apiUrl += `&category=${params.category}`
      if (params.difficulty) apiUrl += `&difficulty=${params.difficulty}`
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (data.response_code !== 0 || data.results.length === 0) {
        throw new Error('No questions found for the selected criteria. Please try again.')
      }
      
      const processedQuestions = data.results.map(q => ({
        ...q,
        question: decodeHTMLEntities(q.question),
        correct_answer: decodeHTMLEntities(q.correct_answer),
        shuffled_answers: shuffleArray([
          ...q.incorrect_answers.map(a => decodeHTMLEntities(a)), 
          decodeHTMLEntities(q.correct_answer)
        ])
      }))
      
      setQuestions(processedQuestions)
      setUserAnswers(new Array(processedQuestions.length).fill(null))
      setUserEmail(params.userEmail || '')
      setVisitedQuestions(new Set([0]))
      setQuizStarted(true)
      setTimeLeft(config.QUIZ.TIMER_MINUTES * 60)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Utility functions
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const decodeHTMLEntities = (text) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted) return
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Auto-submit when time runs out
      submitQuiz()
    }
  }, [timeLeft, quizStarted, quizCompleted])

  // Load quiz state from localStorage on initial render
  useEffect(() => {
    const savedState = loadQuizState()
    if (savedState) {
      setQuestions(savedState.questions)
      setCurrentQuestionIndex(savedState.currentQuestionIndex)
      setUserAnswers(savedState.userAnswers)
      setScore(savedState.score)
      setTimeLeft(savedState.timeLeft)
      setUserEmail(savedState.userEmail)
      setVisitedQuestions(savedState.visitedQuestions)
      setQuizStarted(true)
    }
  }, [])

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      const stateToSave = {
        questions,
        currentQuestionIndex,
        userAnswers,
        score,
        timeLeft,
        userEmail,
        // Convert Set to array for JSON serialization
        visitedQuestions: Array.from(visitedQuestions)
      }
      saveQuizState(stateToSave)
    }
  }, [questions, currentQuestionIndex, userAnswers, score, timeLeft, userEmail, visitedQuestions, quizStarted, quizCompleted])

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answer
    setUserAnswers(newUserAnswers)
  }

  // Navigation functions
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index)
    setVisitedQuestions(prev => new Set(prev).add(index))
  }

  // Calculate final score
  const calculateFinalScore = () => {
    let finalScore = 0
    userAnswers.forEach((answer, index) => {
      if (answer && answer === questions[index].correct_answer) {
        finalScore++
      }
    })
    setScore(finalScore)
  }

  // Submit quiz
  const submitQuiz = () => {
    calculateFinalScore()
    setQuizCompleted(true)
    clearQuizState()
  }

  // Restart quiz
  const restartQuiz = () => {
    clearQuizState()
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setUserAnswers([])
    setQuestions([])
    setUserEmail('')
    setVisitedQuestions(new Set())
    setTimeLeft(config.QUIZ.TIMER_MINUTES * 60)
  }

  // Render logic
  if (isLoading) {
    return (
      <div className="app-centered">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-centered">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => { setError(null); setIsLoading(false); }} className="retry-btn">
            Back to Setup
          </button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <ReportPage 
        questions={questions}
        userAnswers={userAnswers}
        score={score}
        userEmail={userEmail}
        onRestartQuiz={restartQuiz}
      />
    )
  }

  if (!quizStarted) {
    return <QuizSetup onStartQuiz={fetchQuestions} isLoading={isLoading} />
  }

  const currentQuestion = questions[currentQuestionIndex]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="quiz-layout">
      {/* Left Panel - Questions Overview */}
      <div className="left-panel">
        <QuestionPanel 
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionSelect={goToQuestion}
          visitedQuestions={visitedQuestions}
          userAnswers={userAnswers}
        />
      </div>

      {/* Right Panel - Quiz Content */}
      <div className="right-panel">
        <div className="quiz-header-main">
          <div className="quiz-timer">Time Left: {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</div>
          <button onClick={submitQuiz} className="submit-quiz-main-btn">
            Submit Quiz
          </button>
        </div>

        <div className="question-card-main">
          <h2 className="question-text-main">{currentQuestionIndex + 1}. {currentQuestion.question}</h2>
          <div className="answers-container-main">
            {currentQuestion.shuffled_answers.map((answer, index) => {
              const isSelected = userAnswers[currentQuestionIndex] === answer
              return (
                <button
                  key={index}
                  className={`answer-btn-main ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(answer)}
                >
                  {answer}
                </button>
              )
            })}
          </div>
        </div>

        <div className="navigation-buttons-main">
          <button 
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="nav-btn-main prev-btn-main"
          >
            &larr; Previous
          </button>
          <button 
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="nav-btn-main next-btn-main"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
