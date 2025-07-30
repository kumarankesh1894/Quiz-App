import './QuestionPanel.css'

const QuestionPanel = ({ 
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  visitedQuestions,
  userAnswers
}) => {
  return (
    <div className="question-panel">
      <h3 className="panel-title">Questions Overview</h3>
      <div className="panel-grid">
        {questions.map((_, index) => {
          const isVisited = visitedQuestions.has(index)
          const isAttempted = userAnswers[index] !== null
          let buttonClass = 'panel-question-btn'

          if (index === currentQuestionIndex) {
            buttonClass += ' current'
          } else if (isAttempted) {
            buttonClass += ' attempted'
          } else if (isVisited) {
            buttonClass += ' visited'
          }

          return (
            <button 
              key={index}
              className={buttonClass}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
      
      <div className="panel-legend">
        <div className="legend-item">
          <div className="legend-color current"></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-color attempted"></div>
          <span>Attempted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color visited"></div>
          <span>Visited</span>
        </div>
      </div>
    </div>
  )
}

export default QuestionPanel

