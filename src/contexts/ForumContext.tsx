"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Question,
  Answer,
  User,
  CreateQuestionData,
  CreateAnswerData,
  VoteType,
  TargetType,
  SortOption
} from '@/types/forum';
import {
  getQuestions,
  getQuestion,
  getAnswers,
  createQuestion,
  createAnswer,
  vote,
  getUserVote,
  getCurrentUser,
  searchQuestions
} from '@/lib/forum-storage';

interface ForumContextType {
  // State
  questions: Question[];
  currentUser: User;
  loading: boolean;

  // Actions
  loadQuestions: (sortBy?: SortOption) => void;
  loadQuestion: (id: string) => Promise<Question | null>;
  loadAnswers: (questionId: string) => Promise<Answer[]>;
  addQuestion: (data: CreateQuestionData) => Promise<Question>;
  addAnswer: (data: CreateAnswerData) => Promise<Answer>;
  handleVote: (targetId: string, targetType: TargetType, voteType: VoteType) => Promise<boolean>;
  getUserVoteStatus: (targetId: string, targetType: TargetType) => VoteType | null;
  searchForQuestions: (query: string) => Question[];
  refreshData: () => void;
}

const ForumContext = createContext<ForumContextType | null>(null);

export function useForumContext() {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForumContext must be used within a ForumProvider');
  }
  return context;
}

interface ForumProviderProps {
  children: ReactNode;
}

export function ForumProvider({ children }: ForumProviderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user and load initial data
    const user = getCurrentUser();
    setCurrentUser(user);
    loadQuestions();
    setLoading(false);
  }, []);

  const loadQuestions = (sortBy: SortOption = 'latest') => {
    const loadedQuestions = getQuestions(sortBy);
    setQuestions(loadedQuestions);
  };

  const loadQuestion = async (id: string): Promise<Question | null> => {
    const question = getQuestion(id);
    if (question) {
      // Update the question in current questions list
      setQuestions(prev => 
        prev.map(q => q.id === question.id ? question : q)
      );
    }
    return question;
  };

  const loadAnswers = async (questionId: string): Promise<Answer[]> => {
    return getAnswers(questionId);
  };

  const addQuestion = async (data: CreateQuestionData): Promise<Question> => {
    const newQuestion = createQuestion(data);
    setQuestions(prev => [newQuestion, ...prev]);
    return newQuestion;
  };

  const addAnswer = async (data: CreateAnswerData): Promise<Answer> => {
    const newAnswer = createAnswer(data);
    
    // Update question answer count
    setQuestions(prev =>
      prev.map(q => 
        q.id === data.questionId 
          ? { ...q, answerCount: q.answerCount + 1 }
          : q
      )
    );
    
    return newAnswer;
  };

  const handleVote = async (targetId: string, targetType: TargetType, voteType: VoteType): Promise<boolean> => {
    const success = vote(targetId, targetType, voteType);
    
    if (success) {
      if (targetType === 'question') {
        // Refresh the specific question to update vote counts
        const updatedQuestion = getQuestion(targetId);
        if (updatedQuestion) {
          setQuestions(prev =>
            prev.map(q => q.id === targetId ? updatedQuestion : q)
          );
        }
      }
      // For answers, the parent component should refresh its data
    }
    
    return success;
  };

  const getUserVoteStatus = (targetId: string, targetType: TargetType): VoteType | null => {
    return getUserVote(targetId, targetType);
  };

  const searchForQuestions = (query: string): Question[] => {
    return searchQuestions(query);
  };

  const refreshData = () => {
    loadQuestions();
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const contextValue: ForumContextType = {
    // State
    questions,
    currentUser,
    loading,

    // Actions
    loadQuestions,
    loadQuestion,
    loadAnswers,
    addQuestion,
    addAnswer,
    handleVote,
    getUserVoteStatus,
    searchForQuestions,
    refreshData
  };

  return (
    <ForumContext.Provider value={contextValue}>
      {children}
    </ForumContext.Provider>
  );
}