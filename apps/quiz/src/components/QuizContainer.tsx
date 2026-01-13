import { useCallback, useEffect, useState } from "react";
import type { AnswerStatus, Quiz, QuizState } from "../lib/types";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";

interface QuizContainerProps {
  quiz: Quiz;
}

const STORAGE_KEY_PREFIX = "quiz_state_";
const FIRST_ATTEMPT_KEY_PREFIX = "quiz_first_attempt_";

export default function QuizContainer({ quiz }: QuizContainerProps) {
  const [state, setState] = useState<QuizState | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("unanswered");
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const [started, setStarted] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${quiz.date}`;
  const firstAttemptKey = `${FIRST_ATTEMPT_KEY_PREFIX}${quiz.date}`;

  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    const wasFirstAttemptUsed = localStorage.getItem(firstAttemptKey);

    if (wasFirstAttemptUsed) {
      setIsFirstAttempt(false);
    }

    if (savedState) {
      const parsed = JSON.parse(savedState) as QuizState;
      if (parsed.quizId === quiz.id) {
        setState(parsed);
        setStarted(true);
      }
    }
  }, [quiz.id, quiz.date, storageKey, firstAttemptKey]);

  const saveState = useCallback(
    (newState: QuizState) => {
      localStorage.setItem(storageKey, JSON.stringify(newState));
      setState(newState);
    },
    [storageKey],
  );

  const startQuiz = () => {
    const newState: QuizState = {
      quizId: quiz.id,
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null),
      startedAt: new Date().toISOString(),
    };
    saveState(newState);
    setStarted(true);
  };

  const handleAnswer = (answer: string) => {
    if (!state || answerStatus !== "unanswered") return;

    const currentQuestion = quiz.questions[state.currentQuestion];
    if (!currentQuestion) return;
    const isCorrect = answer === currentQuestion.correctAnswer;

    setAnswerStatus(isCorrect ? "correct" : "incorrect");

    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestion] = answer;

    const isLastQuestion = state.currentQuestion === quiz.questions.length - 1;

    setTimeout(() => {
      const newState: QuizState = {
        ...state,
        answers: newAnswers,
        currentQuestion: isLastQuestion
          ? state.currentQuestion
          : state.currentQuestion + 1,
        completedAt: isLastQuestion ? new Date().toISOString() : undefined,
      };

      saveState(newState);
      setAnswerStatus("unanswered");

      if (isLastQuestion && isFirstAttempt) {
        localStorage.setItem(firstAttemptKey, "true");
      }
    }, 1500);
  };

  const handleReplay = () => {
    setIsFirstAttempt(false);
    const newState: QuizState = {
      quizId: quiz.id,
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null),
      startedAt: new Date().toISOString(),
    };
    saveState(newState);
    setAnswerStatus("unanswered");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!started || !state) {
    return (
      <div className="text-center space-y-8 py-12">
        <div>
          <h1 className="text-3xl font-bold text-quiz-text mb-2">Daily Quiz</h1>
          <p className="text-quiz-text-muted">{formatDate(quiz.date)}</p>
        </div>

        <p className="text-quiz-text-muted">10 questions • No time limit</p>

        <button
          onClick={startQuiz}
          className="px-8 py-4 text-lg font-medium text-white bg-quiz-accent hover:bg-quiz-accent-hover rounded-lg transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (state.completedAt) {
    return (
      <QuizResults
        quiz={quiz}
        answers={state.answers}
        onReplay={handleReplay}
        isFirstAttempt={isFirstAttempt}
      />
    );
  }

  const currentQuestion = quiz.questions[state.currentQuestion];
  if (!currentQuestion) return null;

  return (
    <QuizQuestion
      question={currentQuestion}
      questionNumber={state.currentQuestion + 1}
      totalQuestions={quiz.questions.length}
      selectedAnswer={state.answers[state.currentQuestion] ?? null}
      status={answerStatus}
      onAnswer={handleAnswer}
    />
  );
}
