import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useStore, Idea } from '../store/useStore';

export const Ideas: React.FC = () => {
  const { ideas, addIdea, updateIdea, deleteIdea } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'idea' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdea) {
      updateIdea(editingIdea.id, formData);
      setEditingIdea(null);
    } else {
      addIdea(formData);
    }
    setFormData({ title: '', description: '', stage: 'idea' });
    setShowForm(false);
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      stage: idea.stage,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          My Ideas
        </motion.h1>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
        >
          Add New Idea
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingIdea ? 'Edit Idea' : 'Add New Idea'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="testing">Testing</option>
                  <option value="launch">Launch</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">
                  {editingIdea ? 'Update' : 'Add'} Idea
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIdea(null);
                    setFormData({ title: '', description: '', stage: 'idea' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Ideas Grid */}
      {ideas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first startup idea!</p>
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            Add Your First Idea
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {idea.title}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(idea)}
                    className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  idea.stage === 'idea' ? 'bg-blue-100 text-blue-800' :
                  idea.stage === 'prototype' ? 'bg-yellow-100 text-yellow-800' :
                  idea.stage === 'testing' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Trophy size={14} className="text-yellow-500" />
                    <span>{idea.aiScore + idea.crowdVotes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={14} className="text-primary-500" />
                    <span>{idea.totalInvestment}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  Generate BMC
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Start Pitch
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
