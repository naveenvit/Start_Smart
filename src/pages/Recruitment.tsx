import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';

export const Recruitment: React.FC = () => {
  const { ideas, recruitmentPosts, addRecruitmentPost, applyToPost } = useStore();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({
    ideaId: '',
    title: '',
    description: '',
    skills: '',
  });
  const [applicationForm, setApplicationForm] = useState({
    applicantName: '',
    email: '',
    message: '',
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    addRecruitmentPost({
      ideaId: postForm.ideaId,
      title: postForm.title,
      description: postForm.description,
      skills: postForm.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setPostForm({ ideaId: '', title: '', description: '', skills: '' });
    setShowPostForm(false);
  };

  const handleSubmitApplication = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    applyToPost(postId, applicationForm);
    setApplicationForm({ applicantName: '', email: '', message: '' });
    setShowApplicationForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruitment Board</h1>
          <p className="text-gray-600">
            Find team members for your startup or join exciting projects as a collaborator.
          </p>
        </motion.div>
        <Button
          onClick={() => setShowPostForm(true)}
          icon={Plus}
        >
          Post a Role
        </Button>
      </div>

      {/* Post Role Modal */}
      {showPostForm && (
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
            <h2 className="text-xl font-bold mb-4">Post a New Role</h2>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Startup Idea
                </label>
                <select
                  value={postForm.ideaId}
                  onChange={(e) => setPostForm({ ...postForm, ideaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select an idea...</option>
                  {ideas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g., Frontend Developer, Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={postForm.description}
                  onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={postForm.skills}
                  onChange={(e) => setPostForm({ ...postForm, skills: e.target.value })}
                  placeholder="e.g., React, TypeScript, UI/UX Design"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">
                  Post Role
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPostForm(false);
                    setPostForm({ ideaId: '', title: '', description: '', skills: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Application Modal */}
      {showApplicationForm && (
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
            <h2 className="text-xl font-bold mb-4">Apply for this Role</h2>
            <form onSubmit={(e) => handleSubmitApplication(e, showApplicationForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={applicationForm.applicantName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, applicantName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={applicationForm.message}
                  onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                  rows={4}
                  placeholder="Why are you interested in this role? What can you bring to the team?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="flex-1" icon={Send}>
                  Submit Application
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowApplicationForm(null);
                    setApplicationForm({ applicantName: '', email: '', message: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Job Listings */}
      {recruitmentPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-md"
        >
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
          <p className="text-gray-600 mb-4">Be the first to post a role and build your team!</p>
          <Button onClick={() => setShowPostForm(true)} icon={Plus}>
            Post the First Role
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitmentPosts.map((post, index) => {
            const idea = ideas.find(idea => idea.id === post.ideaId);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Users size={12} />
                    <span>{post.applications.length}</span>
                  </div>
                </div>
                
                {idea && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Startup: </span>
                    <span className="text-sm font-medium text-primary-600">{idea.title}</span>
                  </div>
                )}
                
                <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>Remote</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowApplicationForm(post.id)}
                  size="sm"
                  className="w-full"
                  icon={Send}
                >
                  Apply Now
                </Button>
                
                {post.applications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Applications:</h4>
                    <div className="space-y-2">
                      {post.applications.slice(-2).map((app) => (
                        <div key={app.id} className="text-xs text-gray-600">
                          <span className="font-medium">{app.applicantName}</span> applied {' '}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
