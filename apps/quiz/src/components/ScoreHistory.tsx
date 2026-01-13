import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ScoreWithQuiz {
  id: string;
  score: number;
  completed_at: string;
  quiz: {
    date: string;
  };
}

export default function ScoreHistory() {
  const [scores, setScores] = useState<ScoreWithQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('scores')
        .select(`
          id,
          score,
          completed_at,
          quiz:quizzes(date)
        `)
        .eq('user_id', session.user.id)
        .order('completed_at', { ascending: false });

      if (!error && data) {
        setScores(data as unknown as ScoreWithQuiz[]);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalQuizzes = scores.length;
  const averageScore = totalQuizzes > 0
    ? (scores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-quiz-surface rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-quiz-surface border border-quiz-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-quiz-accent">{totalQuizzes}</div>
          <div className="text-sm text-quiz-text-muted">Quizzes Completed</div>
        </div>
        <div className="bg-quiz-surface border border-quiz-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-quiz-accent">{averageScore}</div>
          <div className="text-sm text-quiz-text-muted">Average Score</div>
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-8 text-quiz-text-muted">
          <p>No quizzes completed yet.</p>
          <a href="/" className="text-quiz-accent hover:text-quiz-accent-hover">
            Take today's quiz →
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-quiz-text">Recent Scores</h3>
          <div className="space-y-2">
            {scores.map((score) => (
              <a
                key={score.id}
                href={`/history/${score.quiz.date}`}
                className="flex items-center justify-between p-4 bg-quiz-surface border border-quiz-border rounded-lg hover:border-quiz-accent transition-colors"
              >
                <span className="text-quiz-text">{formatDate(score.quiz.date)}</span>
                <span className="text-quiz-accent font-medium">{score.score}/10</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
