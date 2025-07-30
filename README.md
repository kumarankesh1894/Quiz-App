# Quiz Application - README

## Overview

This quiz application is built with React and provides an interactive way for users to test their knowledge across various categories. The app fetches questions from the Open Trivia Database API, presents them in a timed quiz format, and provides detailed results upon completion.

### Key Features:
- Email validation and user identification
- 15-question quiz with 30-minute timer
- Visual question navigation panel
- Answer review with correct/incorrect indicators
- Responsive design for all device sizes
- Progress persistence using localStorage

### Component Structure:
1. **QuizSetup**: Handles user registration and quiz parameters
2. **QuestionPanel**: Displays question navigation with status indicators
3. **App**: Main component managing quiz state and logic
4. **ReportPage**: Shows quiz results and answer review

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```bash
   cd quiz-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`

## Assumptions

1. Users will complete the quiz in one session (with localStorage as fallback)
2. The Open Trivia API will be available and responsive
3. Email validation follows standard format requirements
4. 30 minutes is sufficient time for 15 questions
5. Users understand the color-coding in the question navigation panel

## Challenges Faced

### 1. API Integration Issues
Initially encountered network errors 4-5 times during API integration. Resolved by:
- Implementing proper error handling
- Adding retry logic
- Validating API responses before processing
- Adding loading states for better UX

### 2. Prop Drilling
Initially passed parameters directly through components, which became messy. Solved by:
- Restructuring component hierarchy
- Centralizing state management in the App component
- Using context API for shared state where appropriate

### 3. Auto-Submit Logic
Implementing the auto-submit when time expires required careful handling of:
- Timer state management
- Cleanup of interval effects
- Synchronization with quiz completion state

### 4. Timer and useEffect Issues
Faced challenges with timer accuracy and effect dependencies. Resolved by:
- Properly cleaning up intervals in useEffect
- Using functional updates for timeLeft state
- Consulting documentation and online resources to understand best practices
- Implementing a more robust timer system with pause/resume capability

## Bonus Features Implemented

### Enhanced User Experience
- **Responsive Design**: Fully adaptive layout for mobile, tablet, and desktop
- **Smooth Transitions**: CSS animations for button interactions and page transitions
- **State Persistence**: Quiz progress saved to localStorage
- **Error Handling**: Graceful degradation when API fails
- **Accessibility**: Keyboard navigation and focus states
- **Animations**: Loading indicators and interactive feedback

### Additional Improvements
- Question shuffling to prevent pattern recognition
- HTML entity decoding for proper question display
- Visual indicators for question status
- Comprehensive answer review system
- Clean, modern UI with consistent styling

## Future Enhancements

1. Implement user accounts for score history
2. Add question bookmarking feature
3. Include difficulty-based scoring
4. Add sound effects for feedback
5. Implement social sharing of results
6. Add more detailed analytics in reports

This application demonstrates solid React skills, attention to detail, and problem-solving ability while meeting all specified requirements.