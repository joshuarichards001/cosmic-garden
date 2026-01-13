import { supabase } from "../lib/supabase";

interface LoginButtonProps {
  className?: string;
}

export default function LoginButton({ className = "" }: LoginButtonProps) {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className={`px-4 py-2 font-medium text-quiz-text bg-quiz-accent hover:bg-quiz-accent-hover rounded-lg transition-colors ${className}`}
    >
      Sign in with Google
    </button>
  );
}
