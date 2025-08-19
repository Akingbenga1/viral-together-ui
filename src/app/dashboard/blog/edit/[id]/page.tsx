'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Save, ArrowLeft } from 'lucide-react';
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

export default function BlogEditPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = !!user?.roles?.some(r => r.name === 'super_admin');
  const blogId = parseInt(params.id);

  useEffect(() => {
    if (!isLoading && user && !isSuperAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isSuperAdmin && blogId) {
      loadBlog();
    }
  }, [isLoading, user, isSuperAdmin, router, blogId]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      // We need to get the blog by ID, but our API only has getBlogBySlug
      // For now, let's get all blogs and find the one with matching ID
      const blogs = await apiClient.getBlogsAdmin();
      const blog = blogs.find(b => b.id === blogId);
      
      if (!blog) {
        toast.error('Blog not found');
        router.push('/dashboard/blog/list');
        return;
      }

      setTopic(blog.topic);
      setDescription(blog.description || '');
      setBody(blog.body);
      setCoverImageUrl(blog.cover_image_url || '');
      setImages(blog.images || []);
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog');
      router.push('/dashboard/blog/list');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!topic.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!body.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSaving(true);
      await apiClient.updateBlog(blogId, {
        topic: topic.trim(),
        description: description.trim() || undefined,
        body: body.trim(),
        images: images.length > 0 ? images : undefined,
        cover_image_url: coverImageUrl.trim() || undefined,
      });

      toast.success('Blog updated successfully!');
      router.push('/dashboard/blog/list');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setImages([...images, url.trim()]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard/blog/list')}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Update your blog post content and settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Blog Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)} 
                      className="input w-full" 
                      placeholder="Enter blog title..."
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      The slug will be automatically generated from the title.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="input w-full" 
                      rows={3}
                      placeholder="Brief description of your blog post..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="card">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
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
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-primary btn-lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Blog
                    </>
                  )}
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
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Additional Images</label>
                    <button 
                      type="button"
                      onClick={addImageUrl}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Image
                    </button>
                  </div>
                  {images.length > 0 ? (
                    <div className="space-y-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                          <input 
                            value={image}
                            onChange={(e) => {
                              const newImages = [...images];
                              newImages[index] = e.target.value;
                              setImages(newImages);
                            }}
                            className="input flex-1 text-sm"
                          />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No additional images added.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
