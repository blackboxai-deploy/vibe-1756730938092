import { 
  ForumData, 
  Question, 
  Answer, 
  Vote, 
  User, 
  CreateQuestionData, 
  CreateAnswerData, 
  VoteType, 
  TargetType,
  SortOption 
} from '@/types/forum';

const STORAGE_KEY = 'qa-forum-data';
const USER_KEY = 'qa-forum-user';

// Anonymous user colors for consistent identification
const ANONYMOUS_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
];

function getRandomColor(): string {
  return ANONYMOUS_COLORS[Math.floor(Math.random() * ANONYMOUS_COLORS.length)];
}

function generateAnonymousName(userId: string): string {
  // Create a consistent number based on userId
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const num = Math.abs(hash) % 9999 + 1;
  return `Anonymous User #${num.toString().padStart(4, '0')}`;
}

export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    // Return default user for SSR
    return {
      id: 'temp-user',
      displayName: 'Anonymous User #0001',
      color: ANONYMOUS_COLORS[0]
    };
  }

  let user = localStorage.getItem(USER_KEY);
  if (!user) {
    const userId = crypto.randomUUID();
    const color = getRandomColor();
    const newUser: User = {
      id: userId,
      displayName: generateAnonymousName(userId),
      color: color
    };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  }
  return JSON.parse(user);
}

function getForumData(): ForumData {
  if (typeof window === 'undefined') {
    return { questions: [], answers: [], votes: [], users: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialData: ForumData = {
      questions: [],
      answers: [],
      votes: [],
      users: []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
}

function saveForumData(data: ForumData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function calculateScore(upvotes: number, downvotes: number): number {
  return upvotes - downvotes;
}

export function getQuestions(sortBy: SortOption = 'latest'): Question[] {
  const data = getForumData();
  const questions = [...data.questions];

  // Calculate scores and answer counts
  questions.forEach(question => {
    const questionVotes = data.votes.filter(v => v.targetId === question.id && v.targetType === 'question');
    question.upvotes = questionVotes.filter(v => v.type === 'upvote').length;
    question.downvotes = questionVotes.filter(v => v.type === 'downvote').length;
    question.score = calculateScore(question.upvotes, question.downvotes);
    question.answerCount = data.answers.filter(a => a.questionId === question.id).length;
  });

  // Sort based on option
  switch (sortBy) {
    case 'popular':
      return questions.sort((a, b) => b.score - a.score);
    case 'most-answers':
      return questions.sort((a, b) => b.answerCount - a.answerCount);
    case 'latest':
    default:
      return questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function getQuestion(id: string): Question | null {
  const data = getForumData();
  const question = data.questions.find(q => q.id === id);
  if (!question) return null;

  // Calculate current vote counts
  const votes = data.votes.filter(v => v.targetId === id && v.targetType === 'question');
  question.upvotes = votes.filter(v => v.type === 'upvote').length;
  question.downvotes = votes.filter(v => v.type === 'downvote').length;
  question.score = calculateScore(question.upvotes, question.downvotes);
  question.answerCount = data.answers.filter(a => a.questionId === id).length;

  return question;
}

export function getAnswers(questionId: string): Answer[] {
  const data = getForumData();
  const answers = data.answers.filter(a => a.questionId === questionId);

  // Calculate scores for each answer
  answers.forEach(answer => {
    const answerVotes = data.votes.filter(v => v.targetId === answer.id && v.targetType === 'answer');
    answer.upvotes = answerVotes.filter(v => v.type === 'upvote').length;
    answer.downvotes = answerVotes.filter(v => v.type === 'downvote').length;
    answer.score = calculateScore(answer.upvotes, answer.downvotes);
  });

  // Sort by score (highest first)
  return answers.sort((a, b) => b.score - a.score);
}

export function createQuestion(questionData: CreateQuestionData): Question {
  const data = getForumData();
  const user = getCurrentUser();
  
  const question: Question = {
    id: crypto.randomUUID(),
    title: questionData.title,
    content: questionData.content,
    tags: questionData.tags,
    authorId: user.id,
    authorName: user.displayName,
    authorColor: user.color,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    score: 0,
    answerCount: 0
  };

  data.questions.push(question);
  
  // Add user to users list if not exists
  if (!data.users.find(u => u.id === user.id)) {
    data.users.push(user);
  }
  
  saveForumData(data);
  return question;
}

export function createAnswer(answerData: CreateAnswerData): Answer {
  const data = getForumData();
  const user = getCurrentUser();
  
  const answer: Answer = {
    id: crypto.randomUUID(),
    questionId: answerData.questionId,
    content: answerData.content,
    authorId: user.id,
    authorName: user.displayName,
    authorColor: user.color,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    score: 0
  };

  data.answers.push(answer);
  
  // Add user to users list if not exists
  if (!data.users.find(u => u.id === user.id)) {
    data.users.push(user);
  }
  
  saveForumData(data);
  return answer;
}

export function vote(targetId: string, targetType: TargetType, voteType: VoteType): boolean {
  const data = getForumData();
  const user = getCurrentUser();
  
  // Check if user already voted on this target
  const existingVoteIndex = data.votes.findIndex(
    v => v.targetId === targetId && v.targetType === targetType && v.userId === user.id
  );
  
  if (existingVoteIndex >= 0) {
    const existingVote = data.votes[existingVoteIndex];
    if (existingVote.type === voteType) {
      // Remove vote if clicking same vote type (toggle off)
      data.votes.splice(existingVoteIndex, 1);
    } else {
      // Change vote type
      existingVote.type = voteType;
    }
  } else {
    // Add new vote
    const newVote: Vote = {
      id: crypto.randomUUID(),
      userId: user.id,
      targetId,
      targetType,
      type: voteType,
      createdAt: new Date().toISOString()
    };
    data.votes.push(newVote);
  }
  
  saveForumData(data);
  return true;
}

export function getUserVote(targetId: string, targetType: TargetType): VoteType | null {
  const data = getForumData();
  const user = getCurrentUser();
  
  const vote = data.votes.find(
    v => v.targetId === targetId && v.targetType === targetType && v.userId === user.id
  );
  
  return vote ? vote.type : null;
}

export function searchQuestions(query: string): Question[] {
  const questions = getQuestions();
  if (!query.trim()) return questions;
  
  const searchTerm = query.toLowerCase();
  return questions.filter(q => 
    q.title.toLowerCase().includes(searchTerm) ||
    q.content.toLowerCase().includes(searchTerm) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}