import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';
import { apiClient } from '@/lib/api';

export const dynamic = 'force-static';

async function fetchBlogs() {
  try {
    const blogs = await apiClient.getBlogs();
    return blogs;
  } catch {
    return [] as any[];
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

export default async function BlogListPage() {
  const blogs = await fetchBlogs();
  
  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section className="py-16 px-4 gradient-bg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Insights & Stories
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover the latest trends, tips, and success stories from the world of influencer marketing
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No blog posts yet</h2>
              <p className="text-gray-600">Check back soon for exciting content!</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {blogs.map((blog: any, index: number) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`} 
                  className={`masonry-item card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group ${
                    index % 3 === 0 ? 'masonry-large' : index % 4 === 0 ? 'masonry-medium' : 'masonry-small'
                  }`}
                >
                  {blog.cover_image_url && (
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={blog.cover_image_url} 
                        alt={blog.topic} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.topic}
                    </h2>
                    
                    {blog.description && (
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {blog.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getReadTime(blog.body)} min read</span>
                        </div>
                      </div>
                      
                      <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>


    </UnauthenticatedLayout>
  );
}


