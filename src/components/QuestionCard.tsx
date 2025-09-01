"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteButtons } from './VoteButtons';
import { Question } from '@/types/forum';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  showFullContent?: boolean;
  onVoteChange?: () => void;
  className?: string;
}

export function QuestionCard({ 
  question, 
  showFullContent = false, 
  onVoteChange,
  className 
}: QuestionCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              targetId={question.id}
              targetType="question"
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              score={question.score}
              onVoteChange={onVoteChange}
            />
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="mb-3">
              {showFullContent ? (
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {question.title}
                </h1>
              ) : (
                <Link 
                  href={`/question/${question.id}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800 hover:underline leading-tight block"
                >
                  {question.title}
                </Link>
              )}
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {showFullContent 
                  ? question.content 
                  : truncateContent(question.content)
                }
              </p>
              {!showFullContent && question.content.length > 200 && (
                <Link 
                  href={`/question/${question.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                >
                  Read more...
                </Link>
              )}
            </div>

            {/* Tags */}
            {question.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: question.authorColor }}
                  />
                  <span className="font-medium">{question.authorName}</span>
                </div>

                {/* Timestamp */}
                <span>{formatTimeAgo(question.createdAt)}</span>
              </div>

              {/* Answer Count */}
              <div className="flex items-center gap-4">
                {!showFullContent && (
                  <Link 
                    href={`/question/${question.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {question.answerCount === 0 ? 'No answers' : 
                     question.answerCount === 1 ? '1 answer' : 
                     `${question.answerCount} answers`}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}