"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForumContext } from '@/contexts/ForumContext';
import { CreateAnswerData } from '@/types/forum';

interface AnswerFormProps {
  questionId: string;
  onAnswerAdded?: () => void;
}

export function AnswerForm({ questionId, onAnswerAdded }: AnswerFormProps) {
  const { addAnswer } = useForumContext();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!content.trim()) {
      newErrors.content = 'Answer content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Answer must be at least 20 characters long';
    } else if (content.length > 5000) {
      newErrors.content = 'Answer must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const answerData: CreateAnswerData = {
        questionId,
        content: content.trim()
      };

      await addAnswer(answerData);
      setContent('');
      setErrors({});
      onAnswerAdded?.();
    } catch (error) {
      console.error('Error creating answer:', error);
      setErrors({ general: 'Failed to post answer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    // Clear error when user starts typing
    if (errors.content) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Answer</CardTitle>
        <p className="text-sm text-gray-600">
          Share your knowledge anonymously to help answer this question.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="answer-content" className="text-sm font-medium">
              Answer *
            </Label>
            <Textarea
              id="answer-content"
              placeholder="Provide a detailed answer. Include examples, explanations, or any relevant information that would help solve the problem."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`min-h-[150px] resize-y ${errors.content ? 'border-red-500' : ''}`}
              maxLength={5000}
            />
            <div className="flex justify-between text-sm">
              <span className={errors.content ? 'text-red-500' : 'text-gray-500'}>
                {errors.content || 'Write a helpful and detailed answer'}
              </span>
              <span className="text-gray-400">
                {content.length}/5000
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="min-w-[100px]"
            >
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}