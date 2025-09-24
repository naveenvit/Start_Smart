import { create } from 'zustand';

export interface Idea {
  id: string;
  title: string;
  description: string;
  stage: 'idea' | 'prototype' | 'testing' | 'launch';
  aiScore: number;
  crowdVotes: number;
  totalInvestment: number;
  createdAt: Date;
  userId: string;
  bmcGenerated?: boolean;
}

export interface Investment {
  id: string;
  investorId: string;
  ideaId: string;
  amount: number;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  tokens: number;
  ideas: string[];
  investments: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface PitchSession {
  id: string;
  ideaId: string;
  currentQuestion: number;
  answers: string[];
  score?: number;
  feedback?: string[];
  completed: boolean;
}

export interface RecruitmentPost {
  id: string;
  ideaId: string;
  title: string;
  description: string;
  skills: string[];
  applications: Application[];
  createdAt: Date;
}

export interface Application {
  id: string;
  applicantName: string;
  email: string;
  message: string;
  appliedAt: Date;
}

interface AppState {
  // User state
  currentUser: User;
  
  // Ideas state
  ideas: Idea[];
  
  // Investments state
  investments: Investment[];
  
  // Chat state
  chatMessages: ChatMessage[];
  
  // Pitch sessions
  pitchSessions: PitchSession[];
  
  // Recruitment posts
  recruitmentPosts: RecruitmentPost[];
  
  // Actions
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'userId'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  
  investInIdea: (ideaId: string, amount: number) => void;
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  startPitchSession: (ideaId: string) => string;
  updatePitchSession: (sessionId: string, updates: Partial<PitchSession>) => void;
  
  addRecruitmentPost: (post: Omit<RecruitmentPost, 'id' | 'createdAt' | 'applications'>) => void;
  applyToPost: (postId: string, application: Omit<Application, 'id' | 'appliedAt'>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: {
    id: 'user-1',
    name: 'John Doe',
    tokens: 100,
    ideas: [],
    investments: [],
  },
  
  ideas: [],
  investments: [],
  chatMessages: [
    {
      id: 'welcome',
      type: 'ai',
      content: 'Hello! I\'m your AI mentor. I\'m here to help you develop and validate your startup ideas. What would you like to work on today?',
      timestamp: new Date(),
    }
  ],
  pitchSessions: [],
  recruitmentPosts: [],
  
  addIdea: (ideaData) => {
    const idea: Idea = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      createdAt: new Date(),
      userId: get().currentUser.id,
      aiScore: Math.floor(Math.random() * 40) + 60, // 60-100
      crowdVotes: 0,
      totalInvestment: 0,
    };
    
    set((state) => ({
      ideas: [...state.ideas, idea],
      currentUser: {
        ...state.currentUser,
        ideas: [...state.currentUser.ideas, idea.id],
      },
    }));
  },
  
  updateIdea: (id, updates) => {
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, ...updates } : idea
      ),
    }));
  },
  
  deleteIdea: (id) => {
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
      currentUser: {
        ...state.currentUser,
        ideas: state.currentUser.ideas.filter((ideaId) => ideaId !== id),
      },
    }));
  },
  
  investInIdea: (ideaId, amount) => {
    const state = get();
    if (state.currentUser.tokens < amount) return;
    
    const investment: Investment = {
      id: `inv-${Date.now()}`,
      investorId: state.currentUser.id,
      ideaId,
      amount,
      timestamp: new Date(),
    };
    
    set((state) => ({
      investments: [...state.investments, investment],
      currentUser: {
        ...state.currentUser,
        tokens: state.currentUser.tokens - amount,
        investments: [...state.currentUser.investments, investment.id],
      },
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              totalInvestment: idea.totalInvestment + amount,
              crowdVotes: idea.crowdVotes + 1,
            }
          : idea
      ),
    }));
  },
  
  addChatMessage: (messageData) => {
    const message: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
  },
  
  startPitchSession: (ideaId) => {
    const sessionId = `session-${Date.now()}`;
    const session: PitchSession = {
      id: sessionId,
      ideaId,
      currentQuestion: 0,
      answers: [],
      completed: false,
    };
    
    set((state) => ({
      pitchSessions: [...state.pitchSessions, session],
    }));
    
    return sessionId;
  },
  
  updatePitchSession: (sessionId, updates) => {
    set((state) => ({
      pitchSessions: state.pitchSessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
    }));
  },
  
  addRecruitmentPost: (postData) => {
    const post: RecruitmentPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
      applications: [],
    };
    
    set((state) => ({
      recruitmentPosts: [...state.recruitmentPosts, post],
    }));
  },
  
  applyToPost: (postId, applicationData) => {
    const application: Application = {
      ...applicationData,
      id: `app-${Date.now()}`,
      appliedAt: new Date(),
    };
    
    set((state) => ({
      recruitmentPosts: state.recruitmentPosts.map((post) =>
        post.id === postId
          ? { ...post, applications: [...post.applications, application] }
          : post
      ),
    }));
  },
}));
