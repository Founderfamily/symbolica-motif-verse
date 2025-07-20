import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Compass, Shield, BookOpen, Zap, Crown, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    scores: { explorer: number; guardian: number; scholar: number; pioneer: number; leader: number };
  }[];
}

interface AdventurerType {
  id: string;
  name: string;
  description: string;
  traits: string[];
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Face à un symbole mystérieux, votre première réaction est :",
    answers: [
      { text: "L'analyser méthodiquement pour comprendre son origine", scores: { explorer: 1, guardian: 0, scholar: 3, pioneer: 1, leader: 0 } },
      { text: "Chercher des connexions avec d'autres symboles", scores: { explorer: 3, guardian: 1, scholar: 1, pioneer: 2, leader: 0 } },
      { text: "Imaginer de nouvelles interprétations créatives", scores: { explorer: 2, guardian: 0, scholar: 0, pioneer: 3, leader: 1 } },
      { text: "Partager la découverte avec votre communauté", scores: { explorer: 1, guardian: 2, scholar: 1, pioneer: 0, leader: 3 } }
    ]
  },
  {
    id: 2,
    question: "Votre méthode préférée d'apprentissage :",
    answers: [
      { text: "Expérimentation pratique et exploration", scores: { explorer: 3, guardian: 1, scholar: 0, pioneer: 2, leader: 1 } },
      { text: "Étude approfondie de sources académiques", scores: { explorer: 0, guardian: 1, scholar: 3, pioneer: 0, leader: 1 } },
      { text: "Innovation et création de nouvelles approches", scores: { explorer: 1, guardian: 0, scholar: 1, pioneer: 3, leader: 2 } },
      { text: "Collaboration et échange avec des experts", scores: { explorer: 1, guardian: 2, scholar: 2, pioneer: 1, leader: 3 } }
    ]
  },
  {
    id: 3,
    question: "Dans un projet d'équipe, vous êtes naturellement :",
    answers: [
      { text: "Celui qui découvre de nouvelles pistes", scores: { explorer: 3, guardian: 0, scholar: 1, pioneer: 2, leader: 1 } },
      { text: "Le gardien de la qualité et de la précision", scores: { explorer: 0, guardian: 3, scholar: 2, pioneer: 0, leader: 1 } },
      { text: "L'innovateur qui propose des solutions créatives", scores: { explorer: 1, guardian: 0, scholar: 0, pioneer: 3, leader: 2 } },
      { text: "Le coordinateur qui fédère l'équipe", scores: { explorer: 1, guardian: 1, scholar: 1, pioneer: 1, leader: 3 } }
    ]
  },
  {
    id: 4,
    question: "Votre définition du succès :",
    answers: [
      { text: "Avoir exploré tous les territoires inconnus", scores: { explorer: 3, guardian: 1, scholar: 1, pioneer: 1, leader: 0 } },
      { text: "Avoir préservé et transmis le savoir", scores: { explorer: 0, guardian: 3, scholar: 2, pioneer: 0, leader: 2 } },
      { text: "Avoir maîtrisé parfaitement un domaine", scores: { explorer: 1, guardian: 1, scholar: 3, pioneer: 0, leader: 1 } },
      { text: "Avoir créé quelque chose de révolutionnaire", scores: { explorer: 1, guardian: 0, scholar: 0, pioneer: 3, leader: 2 } }
    ]
  },
  {
    id: 5,
    question: "Face à un défi complexe :",
    answers: [
      { text: "Vous partez à l'aventure pour trouver des indices", scores: { explorer: 3, guardian: 0, scholar: 1, pioneer: 2, leader: 1 } },
      { text: "Vous consultez toutes les ressources disponibles", scores: { explorer: 1, guardian: 2, scholar: 3, pioneer: 0, leader: 1 } },
      { text: "Vous inventez une approche totalement nouvelle", scores: { explorer: 2, guardian: 0, scholar: 0, pioneer: 3, leader: 1 } },
      { text: "Vous mobilisez une équipe d'experts", scores: { explorer: 0, guardian: 1, scholar: 1, pioneer: 1, leader: 3 } }
    ]
  }
];

const adventurerTypes: AdventurerType[] = [
  {
    id: 'explorer',
    name: 'Explorateur Intrépide',
    description: 'Vous êtes attiré par l\'inconnu et les découvertes. Votre curiosité vous pousse à explorer chaque recoin de la connaissance culturelle.',
    traits: ['Curiosité insatiable', 'Ouverture d\'esprit', 'Adaptabilité', 'Instinct de découverte'],
    icon: <Compass className="h-8 w-8" />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'guardian',
    name: 'Gardien du Savoir',
    description: 'Vous valorisez la préservation et la transmission fidèle des connaissances. Votre mission est de protéger l\'héritage culturel.',
    traits: ['Précision', 'Responsabilité', 'Patience', 'Respect des traditions'],
    icon: <Shield className="h-8 w-8" />,
    color: 'text-green-400',
    bgGradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'scholar',
    name: 'Érudit Passionné',
    description: 'Vous cherchez la compréhension profonde et l\'analyse rigoureuse. Votre expertise vous distingue dans votre domaine.',
    traits: ['Analyse approfondie', 'Méthode rigoureuse', 'Expertise', 'Soif de connaissance'],
    icon: <BookOpen className="h-8 w-8" />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500 to-violet-500'
  },
  {
    id: 'pioneer',
    name: 'Pionnier Innovant',
    description: 'Vous créez de nouvelles voies et révolutionnez les approches traditionnelles. Votre vision transforme le futur.',
    traits: ['Innovation', 'Créativité', 'Vision avant-gardiste', 'Courage du changement'],
    icon: <Zap className="h-8 w-8" />,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500 to-amber-500'
  },
  {
    id: 'leader',
    name: 'Meneur Inspirant',
    description: 'Vous fédérez les communautés et inspirez les autres. Votre charisme naturel guide les projets collectifs vers le succès.',
    traits: ['Leadership naturel', 'Communication', 'Vision collective', 'Inspiration'],
    icon: <Crown className="h-8 w-8" />,
    color: 'text-red-400',
    bgGradient: 'from-red-500 to-pink-500'
  }
];

interface AdventurerQuizProps {
  onComplete?: (type: AdventurerType) => void;
}

export default function AdventurerQuiz({ onComplete }: AdventurerQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AdventurerType | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (allAnswers: number[]) => {
    const scores = {
      explorer: 0,
      guardian: 0,
      scholar: 0,
      pioneer: 0,
      leader: 0
    };

    allAnswers.forEach((answerIndex, questionIndex) => {
      const answer = questions[questionIndex].answers[answerIndex];
      Object.entries(answer.scores).forEach(([type, score]) => {
        scores[type as keyof typeof scores] += score;
      });
    });

    const maxScore = Math.max(...Object.values(scores));
    const winnerType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    const resultType = adventurerTypes.find(type => type.id === winnerType);

    if (resultType) {
      setResult(resultType);
      setIsCompleted(true);
      onComplete?.(resultType);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setIsCompleted(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted && result) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-slate-800 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl">
            Votre Profil d'Aventurier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`bg-gradient-to-r ${result.bgGradient} rounded-lg p-6 text-white text-center`}>
            <div className="flex justify-center mb-4">
              {result.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2">{result.name}</h3>
            <p className="text-lg opacity-90">{result.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Vos Traits Caractéristiques :</h4>
            <div className="grid grid-cols-2 gap-2">
              {result.traits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="text-center p-2 bg-purple-500/20 text-purple-300">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Refaire le quiz
            </Button>
            <Button 
              onClick={() => onComplete?.(result)} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Continuer l'aventure
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-slate-800 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-center text-white">
          Découvrez votre Type d'Aventurier
        </CardTitle>
        <CardDescription className="text-center text-purple-200">
          Question {currentQuestion + 1} sur {questions.length}
        </CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-6">
            {questions[currentQuestion].question}
          </h3>
        </div>

        <div className="space-y-3">
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full text-left p-4 h-auto bg-slate-700 hover:bg-slate-600 text-white border-slate-600 hover:border-purple-500"
            >
              {answer.text}
            </Button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            variant="ghost"
            className="text-purple-300 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Question précédente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}