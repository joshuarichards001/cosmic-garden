export interface TriviaQuestion {
  category: string;
  id: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  regions: string[];
  isNiche: boolean;
  question: { text: string };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: 'text_choice';
}

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  answers: string[];
}

export interface Quiz {
  id: string;
  date: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface User {
  id: string;
  display_name: string | null;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: string[];
  completed_at: string;
}

export interface QuizState {
  quizId: string;
  currentQuestion: number;
  answers: (string | null)[];
  startedAt: string;
  completedAt?: string;
}

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';
