import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
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
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
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
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-quiz-surface border border-quiz-border rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b border-quiz-border">
              <p className="text-sm font-medium text-quiz-text truncate">
                {displayName}
              </p>
              <p className="text-xs text-quiz-text-muted truncate">
                {user.email}
              </p>
            </div>
            <div className="py-1">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-quiz-text hover:bg-quiz-border transition-colors"
              >
                Profile
              </a>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-quiz-text hover:bg-quiz-border transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
