import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-8 h-8 m-1 rounded-full bg-quiz-surface animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="px-4 py-2 text-sm font-medium text-quiz-text bg-quiz-surface border border-quiz-border rounded-lg hover:bg-quiz-border transition-colors"
      >
        Sign in with Google
      </button>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.full_name || user.email;

  return (
    <a
      href="/profile"
      className="flex items-center gap-2 p-1 rounded-full hover:bg-quiz-surface transition-colors"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-quiz-accent flex items-center justify-center text-white text-sm font-medium">
          {displayName?.charAt(0).toUpperCase()}
        </div>
      )}
    </a>
  );
}
