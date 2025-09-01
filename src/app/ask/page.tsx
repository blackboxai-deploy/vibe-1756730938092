"use client";

import React from 'react';
import { QuestionForm } from '@/components/QuestionForm';

export default function AskQuestionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ask a Question
        </h1>
        <p className="text-gray-600">
          Get help from our community by asking your question anonymously. 
          Be specific and provide enough detail to help others understand and answer your question.
        </p>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Tips for asking a great question:
        </h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Be specific and descriptive in your title</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Explain what you've tried and what didn't work</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Include relevant code, error messages, or examples</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use tags to help others find and categorize your question</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Be respectful and patient while waiting for answers</span>
          </li>
        </ul>
      </div>

      {/* Question Form */}
      <QuestionForm />
    </div>
  );
}