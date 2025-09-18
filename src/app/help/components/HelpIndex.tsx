'use client';

import Link from 'next/link';
import { Rocket, Users, Briefcase, CreditCard, HelpCircle, ArrowRight, BookOpen, MessageCircle, Star } from 'lucide-react';
import { helpContent } from '../data/helpContent';

interface HelpIndexProps {
  onCategoryClick?: (categoryId: string) => void;
}

export default function HelpIndex({ onCategoryClick }: HelpIndexProps) {
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      rocket: <Rocket className="w-6 h-6" />,
      users: <Users className="w-6 h-6" />,
      briefcase: <Briefcase className="w-6 h-6" />,
      'credit-card': <CreditCard className="w-6 h-6" />,
      'help-circle': <HelpCircle className="w-6 h-6" />
    };
    return iconMap[iconName] || <HelpCircle className="w-6 h-6" />;
  };

  const getPopularArticles = (categoryId: string) => {
    const category = helpContent.find(cat => cat.id === categoryId);
    return category?.articles.slice(0, 3) || [];
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to the Help Center
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find everything you need to know about Viral Together. Whether you&apos;re an influencer looking to grow your business or a company seeking authentic partnerships, we&apos;ve got you covered.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpContent.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCategoryClick?.(category.id)}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white mr-4">
                {getIcon(category.icon)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.articles.length} articles</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Popular Articles Preview */}
            <div className="space-y-2 mb-4">
              {getPopularArticles(category.id).map((article) => (
                <div key={article.id} className="text-sm">
                  <Link
                    href={`#${article.id}`}
                    className="text-gray-700 hover:text-primary-600 transition-colors line-clamp-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    • {article.question}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {category.articles.length} articles available
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Quick Access
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
            <p className="text-sm text-gray-600 mb-3">
              New to Viral Together? Start here to learn the basics.
            </p>
            <button
              onClick={() => onCategoryClick?.('getting-started')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Get Started →
            </button>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Need Support?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </p>
            <a
              href="mailto:support@viraltogether.com"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support →
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Popular Topics</h4>
            <p className="text-sm text-gray-600 mb-3">
              Browse our most frequently asked questions and popular guides.
            </p>
            <button
              onClick={() => onCategoryClick?.('troubleshooting')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Topics →
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {helpContent.length}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {helpContent.reduce((total, category) => total + category.articles.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Articles</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            24/7
          </div>
          <div className="text-sm text-gray-600">Support Available</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            100%
          </div>
          <div className="text-sm text-gray-600">Free Access</div>
        </div>
      </div>
    </div>
  );
}

