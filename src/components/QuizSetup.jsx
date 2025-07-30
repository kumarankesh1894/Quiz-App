import { useState } from 'react'
import './QuizSetup.css'

const QuizSetup = ({ onStartQuiz, isLoading }) => {
  const [userEmail, setUserEmail] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [showEmailError, setShowEmailError] = useState(false)
  const [showCategoryError, setShowCategoryError] = useState(false)
  const [showDifficultyError, setShowDifficultyError] = useState(false)

  const categories = [
    { id: '', name: 'Select a Category *' },
    { id: '9', name: 'General Knowledge' },
    { id: '10', name: 'Entertainment: Books' },
    { id: '11', name: 'Entertainment: Film' },
    { id: '12', name: 'Entertainment: Music' },
    { id: '14', name: 'Entertainment: Television' },
    { id: '15', name: 'Entertainment: Video Games' },
    { id: '17', name: 'Science & Nature' },
    { id: '18', name: 'Science: Computers' },
    { id: '19', name: 'Science: Mathematics' },
    { id: '20', name: 'Mythology' },
    { id: '21', name: 'Sports' },
    { id: '22', name: 'Geography' },
    { id: '23', name: 'History' },
    { id: '24', name: 'Politics' },
    { id: '25', name: 'Art' },
    { id: '26', name: 'Celebrities' },
    { id: '27', name: 'Animals' },
    { id: '28', name: 'Vehicles' }
  ]

  const difficulties = [
    { value: '', name: 'Select Difficulty Level *' },
    { value: 'easy', name: 'Easy' },
    { value: 'medium', name: 'Medium' },
    { value: 'hard', name: 'Hard' }
  ]

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }


  
  const handleStartQuiz = () => {
    let hasError = false
    
    if (userEmail.trim() === '' || !isValidEmail(userEmail)) {
      setShowEmailError(true)
      hasError = true
    } else {
      setShowEmailError(false)
    }
    
    if (selectedCategory === '') {
      setShowCategoryError(true)
      hasError = true
    } else {
      setShowCategoryError(false)
    }
    
    if (selectedDifficulty === '') {
      setShowDifficultyError(true)
      hasError = true
    } else {
      setShowDifficultyError(false)
    }
    
    if (hasError) {
      return
    }
    
    const params = {
      userEmail: userEmail.trim(),
      category: selectedCategory,
      difficulty: selectedDifficulty
    }
    onStartQuiz(params)
  }

  return (
    <div className="quiz-setup">
      <div className="setup-container">
        <h1>🧠 Quiz Platform</h1>
        <p className="setup-description">
          Test your knowledge with 15 questions from the Open Trivia Database!
        </p>

        <div className="setup-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *:</label>
            <input 
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value)
                setShowEmailError(false) // Clear error when user types
              }}
              className={`setup-input ${showEmailError ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {showEmailError && (
              <p className="error-message">Please enter a valid email address!</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Select Category:</label>
            <select 
              id="category"
              value={selectedCategory} 
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setShowCategoryError(false) // Clear error when user selects
              }}
              className={`setup-select ${showCategoryError ? 'error' : ''}`}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {showCategoryError && (
              <p className="error-message">Please select a category to start the quiz!</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Select Difficulty:</label>
            <select 
              id="difficulty"
              value={selectedDifficulty} 
              onChange={(e) => {
                setSelectedDifficulty(e.target.value)
                setShowDifficultyError(false) // Clear error when user selects
              }}
              className={`setup-select ${showDifficultyError ? 'error' : ''}`}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.name}
                </option>
              ))}
            </select>
            {showDifficultyError && (
              <p className="error-message">Please select a difficulty level!</p>
            )}
          </div>

          <button 
            onClick={handleStartQuiz} 
            className="start-quiz-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Start Quiz 🚀'}
          </button>
        </div>

        <div className="quiz-info">
          <div className="info-item">
            <span className="info-number">15</span>
            <span className="info-label">Questions</span>
          </div>
          <div className="info-item">
            <span className="info-number">⏱️</span>
            <span className="info-label">30 Minutes</span>
          </div>
          <div className="info-item">
            <span className="info-number">🏆</span>
            <span className="info-label">Instant Feedback</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizSetup
