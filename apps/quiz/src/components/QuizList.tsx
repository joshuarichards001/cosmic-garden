import { useEffect, useState } from "react";
import { getCategoryColor } from "../lib/categoryColors";
import { supabase } from "../lib/supabase";

interface QuizSummary {
  id: string;
  date: string;
  questions: { category: string }[];
}

interface QuizListProps {
  quizzes: QuizSummary[];
}

interface ScoreMap {
  [quizId: string]: number;
}

export default function QuizList({ quizzes }: QuizListProps) {
  const [userScores, setUserScores] = useState<ScoreMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserScores = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: scores } = await supabase
          .from("scores")
          .select("quiz_id, score")
          .eq("user_id", session.user.id);

        if (scores) {
          const scoreMap: ScoreMap = {};
          scores.forEach((s) => {
            scoreMap[s.quiz_id] = s.score;
          });
          setUserScores(scoreMap);
        }
      }
      setLoading(false);
    };

    fetchUserScores();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategories = (questions: { category: string }[]) => {
    const categories = new Set(questions.map((q) => q.category));
    return Array.from(categories).slice(0, 3);
  };

  return (
    <div className="space-y-3">
      {quizzes.map((quiz) => {
        const categories = getCategories(quiz.questions);
        const score = userScores[quiz.id];
        const isCompleted = score !== undefined;

        return (
          <a
            key={quiz.id}
            href={`/history/${quiz.date}`}
            className={`block p-4 bg-quiz-surface border border-quiz-border rounded-lg transition-colors ${isCompleted
                ? "opacity-60 hover:opacity-80"
                : "hover:border-quiz-accent"
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-medium text-quiz-text block mb-2">
                  {formatDate(quiz.date)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(cat).bg} ${getCategoryColor(cat).text}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              {isCompleted && !loading && (
                <span className="text-quiz-accent font-bold text-lg">
                  {score}/10
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
