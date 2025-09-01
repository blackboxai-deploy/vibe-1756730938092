"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VoteButtons } from './VoteButtons';
import { Answer } from '@/types/forum';
import { cn } from '@/lib/utils';

interface AnswerCardProps {
  answer: Answer;
  onVoteChange?: () => void;
  className?: string;
}

export function AnswerCard({ answer, onVoteChange, className }: AnswerCardProps) {
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

  return (
    <Card className={cn("hover:shadow-sm transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              targetId={answer.id}
              targetType="answer"
              upvotes={answer.upvotes}
              downvotes={answer.downvotes}
              score={answer.score}
              onVoteChange={onVoteChange}
            />
          </div>

          {/* Answer Content */}
          <div className="flex-1 min-w-0">
            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {answer.content}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: answer.authorColor }}
                  />
                  <span className="font-medium">{answer.authorName}</span>
                </div>

                {/* Timestamp */}
                <span>{formatTimeAgo(answer.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}