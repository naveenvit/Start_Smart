import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';

const investorQuestions = [
  {
    id: 1,
    question: "What problem does your startup solve and how big is this problem?",
    tips: "Focus on a real, painful problem that affects many people. Quantify the market size and impact.",
  },
  {
    id: 2,
    question: "What is your unique value proposition and competitive advantage?",
    tips: "Explain what makes you different and why customers would choose you over competitors.",
  },
  {
    id: 3,
    question: "Who is your target customer and how will you reach them?",
    tips: "Be specific about your customer segments and demonstrate understanding of their needs.",
  },
  {
    id: 4,
    question: "What is your revenue model and how will you make money?",
    tips: "Show clear paths to profitability and sustainable business model.",
  },
  {
    id: 5,
    question: "What traction do you have and what are your key metrics?",
    tips: "Present concrete evidence of progress: users, revenue, partnerships, etc.",
  },
  {
    id: 6,
    question: "How much funding do you need and how will you use it?",
    tips: "Be specific about funding amount and provide detailed breakdown of usage.",
  },
];

const generateFeedback = (answer: string, questionId: number): { score: number; feedback: string } => {
  const wordCount = answer.split(' ').length;
  const hasNumbers = /\d/.test(answer);
  const hasSpecifics = answer.toLowerCase().includes('specifically') || answer.toLowerCase().includes('example');
  
  let score = 50; // Base score
  
  // Scoring logic
  if (wordCount > 50) score += 15;
  if (wordCount > 100) score += 10;
  if (hasNumbers) score += 15;
  if (hasSpecifics) score += 10;
  if (answer.length > 200) score += 10;
  
  score = Math.min(score, 100);
  
  const feedbacks = [
    score >= 85 ? "Excellent answer! You provided comprehensive details with specific examples and metrics." :
    score >= 70 ? "Good answer! Consider adding more specific examples or quantifiable metrics." :
    score >= 55 ? "Decent answer! Try to be more specific and provide concrete evidence." :
    "Your answer needs more detail. Include specific examples, metrics, and clearer explanations.",
  ];
  
  return {
    score,
    feedback: feedbacks[0],
  };
};

export const PitchCoach: React.FC = () => {
  const { ideas, startPitchSession, updatePitchSession, pitchSessions } = useStore();
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [sessionData, setSessionData] = useState<any>(null);

  const handleStartSession = () => {
    if (!selectedIdeaId) return;
    
    const sessionId = startPitchSession(selectedIdeaId);
    setCurrentSession(sessionId);
    setSessionData({
      currentQuestion: 0,
      answers: [],
      scores: [],
      feedbacks: [],
    });
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;
    
    const currentQuestionIndex = sessionData.currentQuestion;
    const { score, feedback } = generateFeedback(currentAnswer, currentQuestionIndex + 1);
    
    const newAnswers = [...sessionData.answers, currentAnswer];
    const newScores = [...sessionData.scores, score];
    const newFeedbacks = [...sessionData.feedbacks, feedback];
    
    setSessionData({
      ...sessionData,
      answers: newAnswers,
      scores: newScores,
      feedbacks: newFeedbacks,
      currentQuestion: currentQuestionIndex + 1,
    });
    
    // Update store
    updatePitchSession(currentSession, {
      answers: newAnswers,
      currentQuestion: currentQuestionIndex + 1,
      completed: currentQuestionIndex + 1 >= investorQuestions.length,
      score: newScores.reduce((a, b) => a + b, 0) / newScores.length,
      feedback: newFeedbacks,
    });
    
    setCurrentAnswer('');
  };

  const handleRestart = () => {
    setCurrentSession('');
    setSessionData(null);
    setCurrentAnswer('');
    setSelectedIdeaId('');
  };

  const currentQuestion = sessionData ? investorQuestions[sessionData.currentQuestion] : null;
  const isCompleted = sessionData && sessionData.currentQuestion >= investorQuestions.length;
  const averageScore = sessionData && sessionData.scores.length > 0 
    ? Math.round(sessionData.scores.reduce((a: number, b: number) => a + b, 0) / sessionData.scores.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Pitch Coach</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Practice your pitch with our AI coach. Answer investor questions and receive 
          instant feedback to improve your presentation skills.
        </p>
      </motion.div>

      {!currentSession ? (
        /* Setup Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select an Idea to Practice</h2>
          {ideas.length === 0 ? (
            <div className="text-center py-8">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No ideas found. Please add an idea first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <select
                value={selectedIdeaId}
                onChange={(e) => setSelectedIdeaId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select an idea...</option>
                {ideas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.title}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={handleStartSession}
                icon={Play}
                disabled={!selectedIdeaId}
                size="lg"
                className="w-full"
              >
                Start Pitch Practice
              </Button>
            </div>
          )}
          
          {/* Preview Questions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investorQuestions.slice(0, 4).map((q, index) => (
                <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">Question {index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-600">{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : isCompleted ? (
        /* Results Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pitch Practice Completed!</h2>
            <div className="text-3xl font-bold text-primary-500 mb-2">{averageScore}/100</div>
            <p className="text-gray-600">Overall Score</p>
          </div>
          
          <div className="space-y-6">
            {investorQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sessionData.scores[index] >= 85 ? 'bg-green-100 text-green-800' :
                    sessionData.scores[index] >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sessionData.scores[index]}/100
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{question.question}</p>
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm text-gray-700">{sessionData.answers[index]}</p>
                </div>
                <p className="text-sm text-gray-600">{sessionData.feedbacks[index]}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button onClick={handleRestart} icon={RotateCcw} size="lg">
              Practice Again
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Question Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {sessionData.currentQuestion + 1} of {investorQuestions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((sessionData.currentQuestion) / investorQuestions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((sessionData.currentQuestion) / investorQuestions.length) * 100}%` }}
                className="bg-primary-500 h-2 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion?.question}
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> {currentQuestion?.tips}
              </p>
            </div>
          </div>
          
          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">
                {currentAnswer.split(' ').length} words
              </span>
              <span className="text-sm text-gray-500">
                Recommended: 50+ words
              </span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleRestart}>
              Exit Practice
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              icon={ArrowRight}
            >
              Submit Answer
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
