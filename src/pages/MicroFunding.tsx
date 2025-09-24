import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Coins, Trophy, Star, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';

export const MicroFunding: React.FC = () => {
  const { ideas, currentUser, investInIdea, recruitmentPosts } = useStore();
  const [investmentAmount, setInvestmentAmount] = useState<Record<string, number>>({});

  const leaderboardData = ideas
    .map(idea => ({
      id: idea.id,
      title: idea.title.slice(0, 20) + (idea.title.length > 20 ? '...' : ''),
      validationScore: idea.aiScore + idea.crowdVotes,
      totalInvestment: idea.totalInvestment,
      stage: idea.stage,
      hasRecruitment: recruitmentPosts.some(post => post.ideaId === idea.id),
    }))
    .sort((a, b) => b.validationScore - a.validationScore);

  const handleInvest = (ideaId: string) => {
    const amount = investmentAmount[ideaId] || 0;
    if (amount > 0 && amount <= currentUser.tokens) {
      investInIdea(ideaId, amount);
      setInvestmentAmount({ ...investmentAmount, [ideaId]: 0 });
    }
  };

  const setInvestAmount = (ideaId: string, amount: number) => {
    setInvestmentAmount({ ...investmentAmount, [ideaId]: amount });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Micro-Funding Hub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Invest your tokens in promising startup ideas and help them grow. 
          View the leaderboard to see the most validated concepts.
        </p>
      </motion.div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-md p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Investment Portfolio</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span className="text-lg font-medium">{currentUser.tokens} tokens available</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-lg font-medium">{currentUser.investments.length} investments</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentUser.tokens}</div>
            <div className="text-primary-200">Available Tokens</div>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Validation Leaderboard</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaderboardData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} ${name === 'validationScore' ? 'points' : 'tokens'}`,
                  name === 'validationScore' ? 'Validation Score' : 'Total Investment'
                ]}
              />
              <Bar dataKey="validationScore" fill="#2AA7A0" />
              <Bar dataKey="totalInvestment" fill="#0B2545" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Investment Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Opportunities</h2>
        
        {ideas.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No ideas available for investment yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {idea.title}
                  </h3>
                  {recruitmentPosts.some(post => post.ideaId === idea.id) && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Users size={12} />
                      <span>Hiring</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Validation Score</span>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{idea.aiScore + idea.crowdVotes}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Investment</span>
                    <span className="font-medium">{idea.totalInvestment} tokens</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stage</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      idea.stage === 'idea' ? 'bg-blue-100 text-blue-800' :
                      idea.stage === 'prototype' ? 'bg-yellow-100 text-yellow-800' :
                      idea.stage === 'testing' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={currentUser.tokens}
                      value={investmentAmount[idea.id] || ''}
                      onChange={(e) => setInvestAmount(idea.id, parseInt(e.target.value) || 0)}
                      placeholder="Amount"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <span className="text-sm text-gray-600">tokens</span>
                  </div>
                  
                  <Button
                    onClick={() => handleInvest(idea.id)}
                    disabled={
                      !investmentAmount[idea.id] || 
                      investmentAmount[idea.id] > currentUser.tokens ||
                      investmentAmount[idea.id] <= 0
                    }
                    size="sm"
                    className="w-full"
                    icon={TrendingUp}
                  >
                    Invest Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performers</h2>
        <div className="space-y-4">
          {leaderboardData.slice(0, 5).map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-yellow-600' :
                  'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{idea.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Score: {idea.validationScore}</span>
                    <span>Investment: {idea.totalInvestment} tokens</span>
                    {idea.hasRecruitment && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Users size={12} />
                        <span>Hiring</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                <Star className="h-5 w-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
