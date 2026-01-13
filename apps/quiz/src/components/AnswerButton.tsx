import type { AnswerStatus } from '../lib/types';

interface AnswerButtonProps {
  answer: string;
  status: AnswerStatus;
  isCorrectAnswer: boolean;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function AnswerButton({
  answer,
  status,
  isCorrectAnswer,
  isSelected,
  disabled,
  onClick,
}: AnswerButtonProps) {
  const getButtonClasses = () => {
    const base = 'w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-center justify-between';

    if (status === 'unanswered') {
      return `${base} border-quiz-border bg-quiz-surface hover:bg-quiz-border hover:border-quiz-accent cursor-pointer`;
    }

    if (isCorrectAnswer) {
      return `${base} border-quiz-correct bg-quiz-correct/10 text-quiz-correct`;
    }

    if (isSelected && !isCorrectAnswer) {
      return `${base} border-quiz-incorrect bg-quiz-incorrect/10 text-quiz-incorrect`;
    }

    return `${base} border-quiz-border bg-quiz-surface opacity-50`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      <span>{answer}</span>
      {status !== 'unanswered' && isCorrectAnswer && (
        <svg className="w-5 h-5 text-quiz-correct" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status !== 'unanswered' && isSelected && !isCorrectAnswer && (
        <svg className="w-5 h-5 text-quiz-incorrect" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}
