"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOption } from '@/types/forum';

interface SortDropdownProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onValueChange, className }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">
          <div className="flex flex-col items-start">
            <span className="font-medium">Latest</span>
            <span className="text-xs text-gray-500">Most recent questions</span>
          </div>
        </SelectItem>
        <SelectItem value="popular">
          <div className="flex flex-col items-start">
            <span className="font-medium">Popular</span>
            <span className="text-xs text-gray-500">Highest voted questions</span>
          </div>
        </SelectItem>
        <SelectItem value="most-answers">
          <div className="flex flex-col items-start">
            <span className="font-medium">Most Answered</span>
            <span className="text-xs text-gray-500">Questions with most responses</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}