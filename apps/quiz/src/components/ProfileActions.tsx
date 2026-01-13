import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfileActions() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be signed in to delete your account.");
        setDeleting(false);
        return;
      }

      const { error } = await supabase.functions.invoke("delete-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
        setDeleting(false);
        return;
      }

      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 rounded-full bg-quiz-surface animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleSignIn}
          className="px-6 py-3 font-medium text-quiz-text bg-quiz-accent hover:bg-quiz-accent-hover rounded-lg transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-quiz-surface rounded-lg border border-quiz-border">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-quiz-accent flex items-center justify-center text-white text-lg font-medium">
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-quiz-text truncate">{displayName}</p>
          <p className="text-sm text-quiz-text-muted truncate">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-sm text-quiz-text-muted hover:text-quiz-text transition-colors"
          >
            Sign out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg space-y-3">
          <p className="text-sm text-red-400">
            Are you sure? This will permanently delete your account and all
            your quiz history. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 font-medium text-quiz-text bg-quiz-surface border border-quiz-border rounded-lg hover:bg-quiz-border transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
