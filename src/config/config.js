// Configuration file for the Quiz Application
// This file handles environment variables and provides fallback values

const config = {
  // API Configuration
  API: {
    BASE_URL: 'https://opentdb.com/api.php',
    DEFAULT_QUESTION_COUNT: 15,
  },
  
  // Quiz Settings
  QUIZ: {
    TIMER_MINUTES: 30,
    MIN_EMAIL_LENGTH: 5,
  },
  
  // Application Settings
  APP: {
    NAME: 'Quiz Platform',
    VERSION: '1.0.0',
    ENVIRONMENT: 'production',
  }
}

export default config
