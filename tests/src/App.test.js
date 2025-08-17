```javascript
// src/App.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock any external modules or hooks that App might use
jest.mock('./useQuizData', () => ({
  useQuizData: () => ({
    // Provide minimal mock data required for the timer to start
    quizDuration: 5, // seconds
    startQuiz: jest.fn(),
  }),
}));

describe('App timer integration test', () => {
  beforeAll(() => {
    // Use fake timers to control setInterval/setTimeout
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('timer counts down correctly and triggers completion', async () => {
    // Render the App component
    render(<App />);

    // The timer display should show the initial duration (5 seconds)
    const timerDisplay = screen.getByTestId('time-left');
    expect(timerDisplay).toHaveTextContent('5');

    // Advance time by 1 second and verify decrement
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(timerDisplay).toHaveTextContent('4');

    // Advance time by 3 more seconds to reach zero
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(timerDisplay).toHaveTextContent('1');

    // Final second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Timer should not go negative; it should display 0
    expect(timerDisplay).toHaveTextContent('0');

    // After reaching zero, the report page should appear
    const reportHeading = await screen.findByRole('heading', { name: /quiz report/i });
    expect(reportHeading).toBeInTheDocument();

    // Ensure the timer stops updating after completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // Timer should still show 0
    expect(timerDisplay).toHaveTextContent('0');

    // Optional: Verify that the quiz completion flag is set (if exposed)
    const completionFlag = screen.getByTestId('quiz-completed');
    expect(completionFlag).toHaveTextContent('true');
  });
});
```