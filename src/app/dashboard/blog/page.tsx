'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Save, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';

// Import Quill styles
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 bg-gray-50 min-h-96 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
});

export default function BlogCreatePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const isSuperAdmin = !!user?.roles?.some(r => r.name === 'super_admin');

  useEffect(() => {
    if (!isLoading && user && !isSuperAdmin) {
      toast.error('Forbidden');
      router.replace('/dashboard');
    }
  }, [user, isLoading, isSuperAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in');
      return;
    }
    if (!isSuperAdmin) {
      toast.error('Forbidden');
      return;
    }
    if (!body.trim()) {
      toast.error('Please add some content to your blog post');
      return;
    }
    try {
      await apiClient.createBlog({
        author_id: user.id,
        topic,
        description,
        body,
        images,
        cover_image_url: coverImageUrl,
      });
      toast.success('Blog created successfully!');
      router.push('/blog');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to create blog');
    }
  };

  if (isLoading) return null;

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Create Blog Post
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Share insights and stories with your audience
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button 
                type="button"
                onClick={() => router.push('/dashboard/blog/list')}
                className="btn btn-outline btn-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Blog list
              </button>
            </div>
          </div>

          {/* Blog Creation Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="card">
                  <div className="flex items-center mb-4">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Blog Content</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input 
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)} 
                        className="input w-full" 
                        placeholder="Enter your blog title..."
                        required 
                      />
                      <p className="text-sm text-gray-500 mt-1">URL slug will be automatically generated from the title</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                      <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="input w-full resize-none" 
                        rows={3}
                        placeholder="Brief description of your blog post..."
                      />
                    </div>
                  </div>
                </div>

                {/* CKEditor */}
                <div className="card">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="border rounded-lg overflow-hidden">
                      {typeof window !== 'undefined' && (
                        <ReactQuill
                          value={body}
                          onChange={setBody}
                          placeholder="Start writing your blog post..."
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              [{ 'indent': '-1'}, { 'indent': '+1' }],
                              ['link', 'image', 'video'],
                              ['blockquote', 'code-block'],
                              [{ 'align': [] }],
                              ['clean']
                            ]
                          }}
                          formats={[
                            'header', 'bold', 'italic', 'underline', 'strike',
                            'list', 'bullet', 'indent',
                            'link', 'image', 'video',
                            'blockquote', 'code-block', 'align'
                          ]}
                          style={{
                            height: '400px'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Save className="w-4 h-4 mr-2" />
                    Publish Blog Post
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Media */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <Image className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Media</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input 
                      value={coverImageUrl} 
                      onChange={(e) => setCoverImageUrl(e.target.value)} 
                      className="input w-full" 
                      placeholder="https://example.com/image.jpg"
                    />
                    {coverImageUrl && (
                      <div className="mt-2">
                        <img 
                          src={coverImageUrl} 
                          alt="Cover preview" 
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                    <textarea
                      value={images.join('\n')}
                      onChange={(e) => setImages(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                      className="input w-full resize-none"
                      rows={4}
                      placeholder="Enter image URLs (one per line)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter one URL per line</p>
                  </div>
                </div>
              </div>

              {/* Publishing Info */}
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">Draft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Author:</span>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


