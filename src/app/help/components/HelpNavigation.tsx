'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Bookmark, Clock, TrendingUp, HelpCircle, Users, Briefcase, CreditCard, Rocket } from 'lucide-react';
import { helpContent } from '../data/helpContent';

interface HelpNavigationProps {
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export default function HelpNavigation({ activeCategory, onCategoryClick }: HelpNavigationProps) {
  const [expanded, setExpanded] = useState(true);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      rocket: <Rocket className="w-4 h-4" />,
      users: <Users className="w-4 h-4" />,
      briefcase: <Briefcase className="w-4 h-4" />,
      'credit-card': <CreditCard className="w-4 h-4" />,
      'help-circle': <HelpCircle className="w-4 h-4" />
    };
    return iconMap[iconName] || <HelpCircle className="w-4 h-4" />;
  };

  const getBookmarkedArticles = () => {
    if (typeof window === 'undefined') return [];
    const bookmarks = JSON.parse(localStorage.getItem('help-bookmarks') || '[]');
    return helpContent.flatMap(category => 
      category.articles.filter(article => bookmarks.includes(article.id))
    ).slice(0, 3);
  };

  const getRecentlyViewedArticles = () => {
    if (typeof window === 'undefined') return [];
    const recentlyViewed = JSON.parse(localStorage.getItem('help-recently-viewed') || '[]');
    return helpContent.flatMap(category => 
      category.articles.filter(article => recentlyViewed.includes(article.id))
    ).slice(0, 3);
  };

  const bookmarkedArticles = getBookmarkedArticles();
  const recentlyViewedArticles = getRecentlyViewedArticles();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Help Navigation</h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
            <nav className="space-y-2">
              {helpContent.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryClick?.(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex-shrink-0 text-gray-500">
                    {getIcon(category.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{category.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{category.articles.length} articles</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/help#getting-started"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <Rocket className="w-4 h-4 text-gray-400" />
                <span>Getting Started Guide</span>
              </Link>
              <Link
                href="/help#for-influencers"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <Users className="w-4 h-4 text-gray-400" />
                <span>Influencer Resources</span>
              </Link>
              <Link
                href="/help#for-businesses"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>Business Resources</span>
              </Link>
              <Link
                href="/help#troubleshooting"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Technical Support</span>
              </Link>
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewedArticles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recently Viewed
              </h3>
              <div className="space-y-2">
                {recentlyViewedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/help#${article.id}`}
                    className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.question}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarked Articles */}
          {bookmarkedArticles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarked
              </h3>
              <div className="space-y-2">
                {bookmarkedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/help#${article.id}`}
                    className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.question}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Need More Help?</h3>
            <div className="space-y-2">
              <a
                href="mailto:support@viraltogether.com"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <span>Email Support</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

