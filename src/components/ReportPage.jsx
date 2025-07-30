import './ReportPage.css'

const ReportPage = ({ questions, userAnswers, score, userEmail, onRestartQuiz }) => {
  return (
    <div className="report-page">
      <div className="report-container">
        <h1 className="report-title">Quiz Report</h1>
        <p className="report-email">Email: {userEmail}</p>
        <div className="report-summary">
          <div className="summary-item">
            <span className="summary-label">Total Questions</span>
            <span className="summary-value">{questions.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Correct Answers</span>
            <span className="summary-value score-correct">{score}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Incorrect Answers</span>
            <span className="summary-value score-incorrect">{questions.length - score}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Score</span>
            <span className="summary-value score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </span>
          </div>
        </div>

        <h2 className="review-title">Review Your Answers</h2>
        <div className="questions-review">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index]
            const isCorrect = userAnswer === question.correct_answer
            
            return (
              <div key={index} className="review-question-card">
                <h3 className="review-question-text">{index + 1}. {question.question}</h3>
                <div className={`answer-comparison ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unanswered'}`}>
                  <p><strong>Your Answer:</strong> {userAnswer || 'Not Answered'}</p>
                  {!isCorrect && userAnswer && (
                    <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={onRestartQuiz} className="restart-quiz-btn">
          Try Another Quiz
        </button>
      </div>
    </div>
  )
}

export default ReportPage

