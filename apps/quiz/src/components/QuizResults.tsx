import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Quiz } from '../lib/types';

interface QuizResultsProps {
  quiz: Quiz;
  answers: (string | null)[];
  onReplay: () => void;
  isFirstAttempt: boolean;
}

export default function QuizResults({ quiz, answers, onReplay, isFirstAttempt }: QuizResultsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const score = answers.reduce((acc, answer, index) => {
    return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
  }, 0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && isFirstAttempt) {
        saveScore(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveScore = async (userId: string) => {
    if (saved || saving) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('scores').upsert({
        user_id: userId,
        quiz_id: quiz.id,
        score,
        answers: answers.filter((a): a is string => a !== null),
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,quiz_id',
      });

      if (!error) {
        setSaved(true);
      }
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const getEmojiResult = () => {
    return answers.map((answer, index) =>
      answer === quiz.questions[index].correctAnswer ? '🟩' : '🟥'
    ).join('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getShareText = () => {
    const formattedDate = formatDate(quiz.date);
    const quizUrl = `${window.location.origin}/history/${quiz.date}`;
    return `Daily Quiz - ${formattedDate}\n${getEmojiResult()}\nScore: ${score}/10\n\nPlay: ${quizUrl}`;
  };

  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Quiz Results',
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-quiz-text mb-2">Quiz Complete!</h2>
        <p className="text-quiz-text-muted">{formatDate(quiz.date)}</p>
      </div>

      <div className="py-8">
        <div className="text-6xl font-bold text-quiz-accent mb-4">
          {score}/10
        </div>
        <div className="text-2xl tracking-wider">
          {getEmojiResult()}
        </div>
      </div>

      {isFirstAttempt && !user && (
        <div className="bg-quiz-surface border border-quiz-border rounded-lg p-4">
          <p className="text-quiz-text-muted mb-3">Sign in to save your score</p>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 text-sm font-medium text-quiz-text bg-quiz-accent hover:bg-quiz-accent-hover rounded-lg transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      )}

      {isFirstAttempt && user && (
        <div className="text-quiz-text-muted">
          {saving ? 'Saving score...' : saved ? '✓ Score saved' : ''}
        </div>
      )}

      {!isFirstAttempt && (
        <p className="text-quiz-text-muted text-sm">
          This is a replay. Only your first attempt is saved.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleShare}
          className="px-6 py-3 font-medium text-quiz-text bg-quiz-accent hover:bg-quiz-accent-hover rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Share Results'}
        </button>
        <button
          onClick={onReplay}
          className="px-6 py-3 font-medium text-quiz-text bg-quiz-surface border border-quiz-border hover:bg-quiz-border rounded-lg transition-colors"
        >
          Play Again
        </button>
        <a
          href="/history"
          className="px-6 py-3 font-medium text-quiz-text bg-quiz-surface border border-quiz-border hover:bg-quiz-border rounded-lg transition-colors"
        >
          More Quizzes
        </a>
      </div>
    </div>
  );
}
