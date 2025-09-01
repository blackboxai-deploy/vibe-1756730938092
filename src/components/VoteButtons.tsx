"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VoteType, TargetType } from '@/types/forum';
import { useForumContext } from '@/contexts/ForumContext';

interface VoteButtonsProps {
  targetId: string;
  targetType: TargetType;
  upvotes: number;
  downvotes: number;
  score: number;
  className?: string;
  onVoteChange?: () => void;
}

export function VoteButtons({
  targetId,
  targetType,
  upvotes,
  downvotes,
  score,
  className,
  onVoteChange
}: VoteButtonsProps) {
  const { handleVote, getUserVoteStatus } = useForumContext();
  
  const userVote = getUserVoteStatus(targetId, targetType);

  const handleVoteClick = async (voteType: VoteType) => {
    await handleVote(targetId, targetType, voteType);
    onVoteChange?.();
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* Upvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600",
          userVote === 'upvote' && "bg-green-100 text-green-600"
        )}
        onClick={() => handleVoteClick('upvote')}
      >
        <svg
          className="h-4 w-4"
          fill={userVote === 'upvote' ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </Button>

      {/* Score Display */}
      <div className={cn(
        "text-sm font-medium min-w-[2rem] text-center",
        score > 0 && "text-green-600",
        score < 0 && "text-red-600",
        score === 0 && "text-gray-600"
      )}>
        {score}
      </div>

      {/* Downvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600",
          userVote === 'downvote' && "bg-red-100 text-red-600"
        )}
        onClick={() => handleVoteClick('downvote')}
      >
        <svg
          className="h-4 w-4"
          fill={userVote === 'downvote' ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Vote Counts (Optional - for debugging) */}
      {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
        <div className="text-xs text-gray-400 text-center">
          ↑{upvotes} ↓{downvotes}
        </div>
      )}
    </div>
  );
}