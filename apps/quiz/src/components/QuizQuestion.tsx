import type { AnswerStatus, QuizQuestion as QuizQuestionType } from '../lib/types';
import AnswerButton from './AnswerButton';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  status: AnswerStatus;
  onAnswer: (answer: string) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  status,
  onAnswer,
}: QuizQuestionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-quiz-easy';
      case 'medium':
        return 'text-quiz-medium';
      case 'hard':
        return 'text-quiz-hard';
      default:
        return 'text-quiz-text-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-quiz-text-muted">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-quiz-text-muted">{question.category}</span>
          <span className={`capitalize ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      <div className="w-full bg-quiz-border rounded-full h-1">
        <div
          className="bg-quiz-accent h-1 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-medium text-quiz-text leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.answers.map((answer) => (
          <AnswerButton
            key={answer}
            answer={answer}
            status={status}
            isCorrectAnswer={answer === question.correctAnswer}
            isSelected={answer === selectedAnswer}
            disabled={status !== 'unanswered'}
            onClick={() => onAnswer(answer)}
          />
        ))}
      </div>
    </div>
  );
}
