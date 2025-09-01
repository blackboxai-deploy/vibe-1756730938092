"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/QuestionCard';
import { AnswerCard } from '@/components/AnswerCard';
import { AnswerForm } from '@/components/AnswerForm';
import { useForumContext } from '@/contexts/ForumContext';
import { Question, Answer } from '@/types/forum';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loadQuestion, loadAnswers } = useForumContext();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const questionId = params.id as string;

  useEffect(() => {
    loadQuestionData();
  }, [questionId]);

  const loadQuestionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [questionData, answersData] = await Promise.all([
        loadQuestion(questionId),
        loadAnswers(questionId)
      ]);

      if (!questionData) {
        setError('Question not found');
        return;
      }

      setQuestion(questionData);
      setAnswers(answersData);
    } catch (err) {
      console.error('Error loading question:', err);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerAdded = () => {
    // Reload answers to show the new one
    loadQuestionData();
  };

  const handleVoteChange = () => {
    // Reload question and answers to update vote counts
    loadQuestionData();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h1>
          <p className="text-gray-600 mb-6">
            The question you're looking for doesn't exist or may have been removed.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Link href="/">
              <Button>
                Browse Questions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Question</span>
      </nav>

      {/* Question */}
      <QuestionCard 
        question={question}
        showFullContent={true}
        onVoteChange={handleVoteChange}
      />

      {/* Answers Section */}
      <div className="space-y-6">
        {/* Answers Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {answers.length === 0 ? 'No Answers Yet' : 
             answers.length === 1 ? '1 Answer' : 
             `${answers.length} Answers`}
          </h2>
          {answers.length > 1 && (
            <span className="text-sm text-gray-600">
              Sorted by votes
            </span>
          )}
        </div>

        {/* Answers List */}
        {answers.length > 0 && (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard 
                key={answer.id} 
                answer={answer}
                onVoteChange={handleVoteChange}
              />
            ))}
          </div>
        )}

        {/* No Answers Message */}
        {answers.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Be the first to answer!
            </h3>
            <p className="text-gray-600 mb-4">
              Help the community by providing a helpful answer to this question.
            </p>
          </div>
        )}
      </div>

      {/* Answer Form */}
      <AnswerForm 
        questionId={questionId}
        onAnswerAdded={handleAnswerAdded}
      />

      {/* Back to Questions */}
      <div className="text-center pt-6">
        <Link href="/">
          <Button variant="outline">
            ← Back to All Questions
          </Button>
        </Link>
      </div>
    </div>
  );
}