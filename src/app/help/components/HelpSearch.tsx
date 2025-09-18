'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { helpContent } from '../data/helpContent';

interface HelpSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function HelpSearch({ onSearch, placeholder = "Search for help articles..." }: HelpSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate search suggestions based on content
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const allArticles = helpContent.flatMap(category => category.articles);
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const matches = allArticles
      .map(article => {
        const question = article.question.toLowerCase();
        const answer = article.answer.toLowerCase();
        const tags = article.tags.map(tag => tag.toLowerCase());
        
        // Calculate relevance score
        let score = 0;
        searchTerms.forEach(term => {
          if (question.includes(term)) score += 3; // Question matches are most relevant
          if (answer.includes(term)) score += 1; // Answer matches are less relevant
          if (tags.some(tag => tag.includes(term))) score += 2; // Tag matches are relevant
        });
        
        return { article, score };
      })
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(match => match.article);
    
    return matches;
  }, [query]);

  // Popular search terms
  const popularSearches = [
    'account setup',
    'payment issues',
    'collaboration process',
    'profile optimization',
    'technical support'
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && focusedSuggestion >= 0) {
      e.preventDefault();
      const suggestion = suggestions[focusedSuggestion];
      handleSuggestionClick(suggestion.question);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto mb-8" ref={suggestionsRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setFocusedSuggestion(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto light-scrollbar">
          {query.length < 2 ? (
            /* Popular Searches */
            <div className="p-4">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600">Popular searches</span>
              </div>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            /* Search Results */
            <div className="p-4">
              <div className="text-sm font-medium text-gray-600 mb-3">
                Search results ({suggestions.length})
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.question)}
                    className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                      index === focusedSuggestion
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium mb-1">{suggestion.question}</div>
                    <div className="text-gray-500 text-xs line-clamp-2">
                      {suggestion.answer.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* No Results */
            <div className="p-4 text-center text-gray-500 text-sm">
              No articles found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
