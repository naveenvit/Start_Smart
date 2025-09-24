import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  MessageCircle, 
  TrendingUp, 
  Users,
  Plus,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { StatCard } from '../components/UI/StatCard';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';

export const Dashboard: React.FC = () => {
  const { ideas, currentUser, investments, recruitmentPosts } = useStore();
  
  const totalInvestment = ideas.reduce((sum, idea) => sum + idea.totalInvestment, 0);
  const activeRecruitments = recruitmentPosts.length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 rounded-lg shadow-xl"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-12 text-white">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Welcome to StartSmart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-primary-100 mb-8 max-w-2xl"
          >
            Your AI-powered platform for learning, validating, and showcasing startup ideas. 
            Get mentorship, create business models, practice pitching, and attract micro-funding.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/ideas">
              <Button variant="secondary" icon={Plus}>
                Submit New Idea
              </Button>
            </Link>
            <Link to="/mentor">
              <Button variant="outline" icon={MessageCircle}>
                Chat with AI Mentor
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary-300 opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-primary-400 opacity-20"></div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Ideas"
          value={ideas.length}
          icon={Lightbulb}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Available Tokens"
          value={currentUser.tokens}
          icon={Zap}
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Total Investment"
          value={`${totalInvestment} tokens`}
          icon={TrendingUp}
          color="warning"
          delay={0.2}
        />
        <StatCard
          title="Active Recruitments"
          value={activeRecruitments}
          icon={Users}
          color="primary"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/ideas">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors cursor-pointer"
            >
              <Lightbulb className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Manage Ideas</h3>
              <p className="text-sm text-gray-600 mt-2">Submit and manage your startup ideas</p>
            </motion.div>
          </Link>
          
          <Link to="/mentor">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors cursor-pointer"
            >
              <MessageCircle className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900">AI Mentor</h3>
              <p className="text-sm text-gray-600 mt-2">Get AI-powered guidance and advice</p>
            </motion.div>
          </Link>
          
          <Link to="/funding">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors cursor-pointer"
            >
              <TrendingUp className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Funding Hub</h3>
              <p className="text-sm text-gray-600 mt-2">Invest tokens and view leaderboard</p>
            </motion.div>
          </Link>
          
          <Link to="/recruitment">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors cursor-pointer"
            >
              <Users className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Recruitment</h3>
              <p className="text-sm text-gray-600 mt-2">Find team members and collaborators</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Ideas */}
      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Ideas</h2>
            <Link to="/ideas">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.slice(0, 3).map((idea) => (
              <motion.div
                key={idea.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{idea.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{idea.aiScore + idea.crowdVotes}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    idea.stage === 'idea' ? 'bg-blue-100 text-blue-800' :
                    idea.stage === 'prototype' ? 'bg-yellow-100 text-yellow-800' :
                    idea.stage === 'testing' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {idea.stage}
                  </span>
                  <span className="text-sm text-gray-600">{idea.totalInvestment} tokens</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
