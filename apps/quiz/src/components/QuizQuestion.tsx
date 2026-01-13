import { getCategoryColor } from "../lib/categoryColors";
import type {
  AnswerStatus,
  QuizQuestion as QuizQuestionType,
} from "../lib/types";
import AnswerButton from "./AnswerButton";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-quiz-text-muted">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(question.category).bg} ${getCategoryColor(question.category).text}`}
        >
          {question.category}
        </span>
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
            disabled={status !== "unanswered"}
            onClick={() => onAnswer(answer)}
          />
        ))}
      </div>
    </div>
  );
}
