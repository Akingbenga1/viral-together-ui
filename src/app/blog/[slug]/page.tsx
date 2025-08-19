'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';
import { useEffect, useState } from 'react';

async function fetchBlog(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/blog/blogs/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getReadTime(body: string) {
  const wordsPerMinute = 200;
  const wordCount = body.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await fetchBlog(params.slug);
        if (!blogData) {
          notFound();
          return;
        }
        setBlog(blogData);
      } catch (error) {
        console.error('Error loading blog:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [params.slug]);

  if (loading) {
    return (
      <UnauthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </UnauthenticatedLayout>
    );
  }

  if (!blog) {
    return notFound();
  }
  
  return (
    <UnauthenticatedLayout>
      {/* Hero Section with Cover Image */}
      <section className="relative">
        {blog.cover_image_url ? (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img 
              src={blog.cover_image_url} 
              alt={blog.topic} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </Link>
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {blog.topic}
                </h1>
                
                {blog.description && (
                  <p className="text-xl text-white/90 mb-6 max-w-3xl">
                    {blog.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{getReadTime(blog.body)} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 px-4 gradient-bg">
            <div className="container mx-auto">
              <Link 
                href="/blog" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blog</span>
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {blog.topic}
              </h1>
              
              {blog.description && (
                <p className="text-xl text-white/90 mb-8 max-w-3xl">
                  {blog.description}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{getReadTime(blog.body)} min read</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Share Button */}
            <div className="flex justify-end mb-8">
              <button 
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: blog.topic,
                        text: blog.description,
                        url: window.location.href,
                      });
                    } else if (navigator.clipboard) {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    } else {
                      // Fallback for older browsers
                      const textArea = document.createElement('textarea');
                      textArea.value = window.location.href;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      alert('Link copied to clipboard!');
                    }
                  } catch (error) {
                    console.error('Error sharing:', error);
                  }
                }}
                className="btn btn-outline btn-sm flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
            
            {/* Article Body */}
            <article 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:p-4 prose-blockquote:rounded-lg prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: blog.body }} 
            />
            
            {/* Additional Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blog.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={imageUrl} 
                        alt={`Gallery image ${index + 1}`} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Back to Blog CTA */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <Link 
                href="/blog" 
                className="btn btn-primary btn-lg"
              >
                Explore More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </UnauthenticatedLayout>
  );
}


