import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { AnswerStatus, Quiz, QuizState, Score } from "../lib/types";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";

interface QuizContainerProps {
  quiz: Quiz;
}

export default function QuizContainer({ quiz }: QuizContainerProps) {
  const [state, setState] = useState<QuizState>(() => ({
    quizId: quiz.id,
    currentQuestion: 0,
    answers: new Array(quiz.questions.length).fill(null),
    startedAt: new Date().toISOString(),
  }));
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("unanswered");
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState<
    string | null
  >(null);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const [existingScore, setExistingScore] = useState<Score | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const checkExistingScore = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: score } = await supabase
          .from("scores")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("quiz_id", quiz.id)
          .single();

        if (score) {
          setExistingScore(score as Score);
          setIsFirstAttempt(false);
        }
      }
      setCheckingExisting(false);
    };

    checkExistingScore();
  }, [quiz.id]);

  const handleAnswer = (answer: string) => {
    if (answerStatus !== "unanswered") return;

    const currentQuestion = quiz.questions[state.currentQuestion];
    if (!currentQuestion) return;
    const isCorrect = answer === currentQuestion.correctAnswer;

    setCurrentSelectedAnswer(answer);
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

      setState(newState);
      setAnswerStatus("unanswered");
      setCurrentSelectedAnswer(null);
    }, 1000);
  };

  const handleReplay = () => {
    setExistingScore(null);
    setIsFirstAttempt(false);
    setState({
      quizId: quiz.id,
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null),
      startedAt: new Date().toISOString(),
    });
    setAnswerStatus("unanswered");
  };

  if (checkingExisting) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-quiz-text-muted">Loading...</div>
      </div>
    );
  }

  if (existingScore) {
    return (
      <QuizResults
        quiz={quiz}
        answers={existingScore.answers}
        onReplay={handleReplay}
        isFirstAttempt={false}
      />
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-quiz-text text-center">
        {formatDate(quiz.date)}
      </h1>
      <QuizQuestion
        question={currentQuestion}
        questionNumber={state.currentQuestion + 1}
        totalQuestions={quiz.questions.length}
        selectedAnswer={
          currentSelectedAnswer ?? state.answers[state.currentQuestion] ?? null
        }
        status={answerStatus}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
