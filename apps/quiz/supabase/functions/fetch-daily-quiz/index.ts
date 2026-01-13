import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface TriviaQuestion {
  category: string;
  id: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  regions: string[];
  isNiche: boolean;
  question: { text: string };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: 'text_choice';
}

interface QuizQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  answers: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function fetchQuestions(difficulty: string, limit: number): Promise<TriviaQuestion[]> {
  const url = `https://the-trivia-api.com/v2/questions?limit=${limit}&types=text_choice&difficulties=${difficulty}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${difficulty} questions: ${response.statusText}`);
  }

  return response.json();
}

function transformQuestion(trivia: TriviaQuestion): QuizQuestion {
  const allAnswers = [trivia.correctAnswer, ...trivia.incorrectAnswers];

  return {
    id: trivia.id,
    category: trivia.category,
    difficulty: trivia.difficulty,
    question: trivia.question.text,
    correctAnswer: trivia.correctAnswer,
    answers: shuffleArray(allAnswers),
  };
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const quizDate = tomorrow.toISOString().split('T')[0];

    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('date', quizDate)
      .single();

    if (existingQuiz) {
      return new Response(
        JSON.stringify({ message: `Quiz for ${quizDate} already exists` }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      fetchQuestions('easy', 3),
      fetchQuestions('medium', 4),
      fetchQuestions('hard', 3),
    ]);

    const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    const shuffledQuestions = shuffleArray(allQuestions);
    const transformedQuestions = shuffledQuestions.map(transformQuestion);

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        date: quizDate,
        questions: transformedQuestions,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert quiz: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        message: `Quiz for ${quizDate} created successfully`,
        quiz_id: data.id
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating daily quiz:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
