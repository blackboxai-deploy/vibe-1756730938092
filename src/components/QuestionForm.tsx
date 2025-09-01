"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForumContext } from '@/contexts/ForumContext';
import { CreateQuestionData } from '@/types/forum';

export function QuestionForm() {
  const router = useRouter();
  const { addQuestion } = useForumContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.length > 300) {
      newErrors.title = 'Title must be less than 300 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Question content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Question content must be at least 20 characters long';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Question content must be less than 5000 characters';
    }

    if (formData.tags.length > 500) {
      newErrors.tags = 'Tags must be less than 500 characters';
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
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Limit to 5 tags

      const questionData: CreateQuestionData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags
      };

      const question = await addQuestion(questionData);
      router.push(`/question/${question.id}`);
    } catch (error) {
      console.error('Error creating question:', error);
      setErrors({ general: 'Failed to create question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Ask a Question</CardTitle>
        <p className="text-gray-600">
          Share your question anonymously and get help from the community.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Question Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Be specific and imagine you're asking a question to another person"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
              maxLength={300}
            />
            <div className="flex justify-between text-sm">
              <span className={errors.title ? 'text-red-500' : 'text-gray-500'}>
                {errors.title || 'A clear, descriptive title for your question'}
              </span>
              <span className="text-gray-400">
                {formData.title.length}/300
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Question Details *
            </Label>
            <Textarea
              id="content"
              placeholder="Provide as much detail as possible. Include what you've tried, what you expected to happen, and what actually happened."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`min-h-[200px] resize-y ${errors.content ? 'border-red-500' : ''}`}
              maxLength={5000}
            />
            <div className="flex justify-between text-sm">
              <span className={errors.content ? 'text-red-500' : 'text-gray-500'}>
                {errors.content || 'Explain your question in detail'}
              </span>
              <span className="text-gray-400">
                {formData.content.length}/5000
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags (Optional)
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="javascript, react, programming (separate with commas)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className={errors.tags ? 'border-red-500' : ''}
              maxLength={500}
            />
            <div className="flex justify-between text-sm">
              <span className={errors.tags ? 'text-red-500' : 'text-gray-500'}>
                {errors.tags || 'Add up to 5 tags separated by commas to help others find your question'}
              </span>
              <span className="text-gray-400">
                {formData.tags.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}