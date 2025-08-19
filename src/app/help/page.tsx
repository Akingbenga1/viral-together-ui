'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Home, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';
import { helpContent } from './data/helpContent';
import HelpSearch from './components/HelpSearch';
import HelpCategory from './components/HelpCategory';
import HelpNavigation from './components/HelpNavigation';
import HelpIndex from './components/HelpIndex';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Load recently viewed articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('help-recently-viewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return helpContent;
    
    return helpContent.map(category => ({
      ...category,
      articles: category.articles.filter(article => {
        const query = searchQuery.toLowerCase();
        return (
          article.question.toLowerCase().includes(query) ||
          article.answer.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        );
      })
    })).filter(category => category.articles.length > 0);
  }, [searchQuery]);

  // Get popular articles (first 3 from each category)
  const popularArticles = useMemo(() => {
    return helpContent.flatMap(category => 
      category.articles.slice(0, 3).map(article => ({
        ...article,
        categoryTitle: category.title,
        categoryId: category.id
      }))
    );
  }, []);

  // Get recently viewed articles
  const recentlyViewedArticles = useMemo(() => {
    return helpContent.flatMap(category => 
      category.articles.filter(article => 
        recentlyViewed.includes(article.id)
      ).map(article => ({
        ...article,
        categoryTitle: category.title,
        categoryId: category.id
      }))
    ).slice(0, 5);
  }, [recentlyViewed]);

  const totalArticles = helpContent.reduce((total, category) => total + category.articles.length, 0);
  const filteredArticleCount = filteredCategories.reduce((total, category) => total + category.articles.length, 0);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Scroll to the category
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <UnauthenticatedLayout>
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-gray-900 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Help Center</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of Viral Together
          </p>
          
          {/* Search */}
          <HelpSearch 
            onSearch={setSearchQuery}
            placeholder="Search for help articles..."
          />

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-sm text-gray-600">
              {filteredArticleCount > 0 ? (
                <>Showing {filteredArticleCount} of {totalArticles} articles</>
              ) : (
                <>No articles found for "{searchQuery}"</>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {searchQuery ? (
            /* Search Results Layout */
            <>
              {/* Quick Links Section for Search Results */}
              <div className="mb-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Popular Articles */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">Popular Articles</h2>
                    </div>
                    <div className="space-y-3">
                      {popularArticles.slice(0, 5).map((article) => (
                        <Link
                          key={article.id}
                          href={`#${article.id}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            {article.question}
                          </h3>
                          <p className="text-xs text-gray-500">{article.categoryTitle}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Recently Viewed */}
                  {recentlyViewedArticles.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-primary-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Recently Viewed</h2>
                      </div>
                      <div className="space-y-3">
                        {recentlyViewedArticles.map((article) => (
                          <Link
                            key={article.id}
                            href={`#${article.id}`}
                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="font-medium text-gray-900 text-sm mb-1">
                              {article.question}
                            </h3>
                            <p className="text-xs text-gray-500">{article.categoryTitle}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Two Column Layout for Search Results */}
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <HelpNavigation 
                      activeCategory={activeCategory}
                      onCategoryClick={handleCategoryClick}
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  {filteredCategories.length > 0 ? (
                    <div className="space-y-6">
                      {filteredCategories.map((category) => (
                        <div key={category.id} id={category.id}>
                          <HelpCategory
                            category={category}
                            searchQuery={searchQuery}
                            isExpanded={!!searchQuery || activeCategory === category.id}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* No Results */
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No articles found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We couldn't find any articles matching your search. Try different keywords or browse our categories.
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="btn btn-primary"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Default Layout with Help Index */
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <HelpNavigation 
                    activeCategory={activeCategory}
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <HelpIndex onCategoryClick={handleCategoryClick} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@viraltogether.com"
                className="btn btn-primary"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
              <Link
                href="/about"
                className="btn btn-outline"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}
