"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionCard } from '@/components/QuestionCard';
import { SortDropdown } from '@/components/SortDropdown';
import { useForumContext } from '@/contexts/ForumContext';
import { SortOption } from '@/types/forum';

export default function HomePage() {
  const { questions, loadQuestions, searchForQuestions } = useForumContext();
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  useEffect(() => {
    loadQuestions(sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredQuestions(searchForQuestions(searchQuery.trim()));
    } else {
      setFilteredQuestions(questions);
    }
  }, [searchQuery, questions, searchForQuestions]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to QA Forum
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ask questions anonymously and get answers from the community
        </p>
        <Link href="/ask">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Ask Your First Question
          </Button>
        </Link>
      </div>

      {/* Search and Sort Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <SortDropdown 
              value={sortBy} 
              onValueChange={handleSortChange}
              className="w-[180px]"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {searchQuery ? (
            <>
              Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} 
              {' '}for "{searchQuery}"
              {filteredQuestions.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              )}
            </>
          ) : (
            `Showing ${filteredQuestions.length} question${filteredQuestions.length !== 1 ? 's' : ''}`
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse all questions.
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to ask a question and start the conversation!
                </p>
                <Link href="/ask">
                  <Button>
                    Ask the First Question
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard 
              key={question.id} 
              question={question}
              onVoteChange={() => loadQuestions(sortBy)}
            />
          ))
        )}
      </div>

      {/* Footer CTA */}
      {filteredQuestions.length > 0 && !searchQuery && (
        <div className="text-center py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Have a question?
            </h3>
            <p className="text-gray-600 mb-4">
              Ask anonymously and get help from our community of experts.
            </p>
            <Link href="/ask">
              <Button>
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}