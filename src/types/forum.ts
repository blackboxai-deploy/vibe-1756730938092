export interface User {
  id: string;
  displayName: string;
  color: string;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string; // questionId or answerId
  targetType: 'question' | 'answer';
  type: 'upvote' | 'downvote';
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
}

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorColor: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
  answerCount: number;
}

export interface ForumData {
  questions: Question[];
  answers: Answer[];
  votes: Vote[];
  users: User[];
}

export type VoteType = 'upvote' | 'downvote';
export type TargetType = 'question' | 'answer';
export type SortOption = 'latest' | 'popular' | 'most-answers';

export interface CreateQuestionData {
  title: string;
  content: string;
  tags: string[];
}

export interface CreateAnswerData {
  questionId: string;
  content: string;
}