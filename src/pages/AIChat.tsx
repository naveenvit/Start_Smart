import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';

const mockResponses = [
  {
    keywords: ['idea', 'startup', 'business'],
    response: "That sounds like an interesting concept! Let me help you develop it further. What problem does your idea solve? Who is your target audience?",
  },
  {
    keywords: ['market', 'competition', 'competitors'],
    response: "Great question about market analysis! To understand your competitive landscape, I'd suggest: 1) Identify direct and indirect competitors, 2) Analyze their strengths and weaknesses, 3) Find your unique value proposition. What makes your solution different?",
  },
  {
    keywords: ['revenue', 'monetization', 'money'],
    response: "Revenue models are crucial! Consider these options: 1) Subscription/SaaS, 2) Transaction fees, 3) Freemium model, 4) Advertisement, 5) One-time purchase. Which aligns best with your business model?",
  },
  {
    keywords: ['customer', 'user', 'target'],
    response: "Understanding your customers is key! Try creating user personas by defining: demographics, pain points, behaviors, and needs. Have you validated your assumptions with potential customers?",
  },
  {
    keywords: ['help', 'guidance', 'advice'],
    response: "I'm here to help! I can assist with: business model development, market validation, pitch preparation, competitive analysis, and growth strategies. What specific area would you like to focus on?",
  },
];

const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const mockResponse of mockResponses) {
    if (mockResponse.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return mockResponse.response;
    }
  }
  
  return "That's an interesting point! Could you tell me more about your specific goals? I'm here to help you develop your startup idea, validate your market, or prepare your pitch. What would you like to work on today?";
};

export const AIChat: React.FC = () => {
  const { chatMessages, addChatMessage } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    addChatMessage({
      type: 'user',
      content: newMessage,
    });

    const userMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      addChatMessage({
        type: 'ai',
        content: response,
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary-900 text-white p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Mentor</h1>
              <p className="text-primary-200 text-sm">Your startup guidance assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary-500' : 'bg-gray-200'}`}>
                    {message.type === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-gray-600" />
                    )}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-2">
                <div className="p-2 bg-gray-200 rounded-full">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your startup..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              icon={Send}
            >
              Send
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
