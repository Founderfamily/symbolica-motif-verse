import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Brain, Trophy, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty_level: string;
}

interface SymbolQuizProps {
  symbolId: string;
}

export const SymbolQuiz: React.FC<SymbolQuizProps> = ({ symbolId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['symbol-quiz-questions', symbolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbol_quiz_questions')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('difficulty_level', { ascending: true });
      
      if (error) throw error;
      return data as QuizQuestion[];
    }
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    setShowAnswer(true);
    const newUserAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newUserAnswers);
    
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
      toast.success('Bonne réponse !');
    } else {
      toast.error('Réponse incorrecte');
    }
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Quiz interactif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucune question de quiz disponible pour ce symbole.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Quiz terminé !
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-primary">
            {percentage}%
          </div>
          <p className="text-lg">
            Vous avez obtenu <span className="font-semibold">{score}</span> sur <span className="font-semibold">{questions.length}</span> questions correctes !
          </p>
          
          <div className="space-y-2">
            {percentage >= 80 && (
              <Badge className="bg-green-100 text-green-800">
                🎉 Excellente maîtrise !
              </Badge>
            )}
            {percentage >= 60 && percentage < 80 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                👏 Bon travail !
              </Badge>
            )}
            {percentage < 60 && (
              <Badge className="bg-red-100 text-red-800">
                💪 Continuez à apprendre !
              </Badge>
            )}
          </div>
          
          <Button onClick={resetQuiz} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Recommencer le quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Quiz interactif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
            <Badge className={getDifficultyColor(currentQuestion?.difficulty_level || '')}>
              {getDifficultyLabel(currentQuestion?.difficulty_level || '')}
            </Badge>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
        
        {currentQuestion && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {currentQuestion.question_text}
            </h3>
            
            <div className="space-y-2">
              {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`w-full justify-start p-4 h-auto text-left ${
                    showAnswer && option === currentQuestion.correct_answer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : showAnswer && selectedAnswer === option && option !== currentQuestion.correct_answer
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showAnswer}
                >
                  <div className="flex items-center gap-3">
                    {showAnswer && option === currentQuestion.correct_answer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {showAnswer && selectedAnswer === option && option !== currentQuestion.correct_answer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
              
              {currentQuestion.question_type === 'true_false' && (
                <div className="flex gap-2">
                  {['Vrai', 'Faux'].map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className={`flex-1 ${
                        showAnswer && option === currentQuestion.correct_answer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : showAnswer && selectedAnswer === option && option !== currentQuestion.correct_answer
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showAnswer}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {showAnswer && currentQuestion.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Explication :</h4>
                <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Score actuel : {score}/{currentQuestionIndex + (showAnswer ? 1 : 0)}
              </div>
              
              <div className="space-x-2">
                {!showAnswer && selectedAnswer && (
                  <Button onClick={handleSubmitAnswer}>
                    Confirmer la réponse
                  </Button>
                )}
                
                {showAnswer && (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};