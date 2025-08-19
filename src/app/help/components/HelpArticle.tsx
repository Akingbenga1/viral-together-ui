'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, ThumbsUp, ThumbsDown, Bookmark, Share2 } from 'lucide-react';
import { HelpArticle as HelpArticleType } from '../data/helpContent';

interface HelpArticleProps {
  article: HelpArticleType;
  searchQuery?: string;
}

export default function HelpArticle({ article, searchQuery = '' }: HelpArticleProps) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Track recently viewed articles
  useEffect(() => {
    if (expanded) {
      const recentlyViewed = JSON.parse(localStorage.getItem('help-recently-viewed') || '[]');
      const updated = [article.id, ...recentlyViewed.filter((id: string) => id !== article.id)].slice(0, 10);
      localStorage.setItem('help-recently-viewed', JSON.stringify(updated));
    }
  }, [expanded, article.id]);

  // Check if article is bookmarked on mount
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('help-bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(article.id));
  }, [article.id]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    // In a real implementation, you might send this to analytics
    console.log(`Article ${article.id} marked as ${type}`);
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('help-bookmarks') || '[]');
    const updated = isBookmarked 
      ? bookmarks.filter((id: string) => id !== article.id)
      : [...bookmarks, article.id];
    
    localStorage.setItem('help-bookmarks', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  };

  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.question,
          text: article.answer.substring(0, 100) + '...',
          url: `${window.location.origin}/help#${article.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/help#${article.id}`;
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow" id={article.id}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
        aria-expanded={expanded}
        aria-controls={`article-${article.id}`}
      >
        <h3 className="font-medium text-gray-900 pr-4">
          {highlightText(article.question, searchQuery)}
        </h3>
        <div className="flex-shrink-0 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark();
              }}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                isBookmarked ? 'text-primary-600' : 'text-gray-400'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareArticle();
              }}
              className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100" id={`article-${article.id}`}>
          <div className="pt-4">
            <div className="prose prose-sm max-w-none text-gray-700">
              {highlightText(article.answer, searchQuery)}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Feedback Section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">Was this article helpful?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleFeedback('helpful')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    feedback === 'helpful'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes, helpful</span>
                </button>
                <button
                  onClick={() => handleFeedback('not-helpful')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    feedback === 'not-helpful'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>No, not helpful</span>
                </button>
              </div>
              {feedback && (
                <p className="text-sm text-gray-500 mt-2">
                  Thank you for your feedback!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
