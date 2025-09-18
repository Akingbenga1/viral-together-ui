'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Save, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';

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
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1 leading-tight tracking-tight">
                      Create Blog Post ✍️
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Share insights and stories with your audience
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => router.push('/dashboard/blog/list')}
                  className="btn-dark px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  <span>Blog List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Blog Creation Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Blog Content</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="label-dark mb-3">Title</label>
                      <input 
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)} 
                        className="input-dark w-full text-white placeholder:text-slate-400" 
                        placeholder="Enter your blog title..."
                        required 
                      />
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">URL slug will be automatically generated from the title</p>
                    </div>
                    
                    <div>
                      <label className="label-dark mb-3">Short Description</label>
                      <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="textarea-dark w-full text-white placeholder:text-slate-400" 
                        rows={3}
                        placeholder="Brief description of your blog post..."
                      />
                    </div>
                  </div>
                </div>

                {/* CKEditor */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="mb-6">
                    <label className="label-dark mb-3">Content</label>
                    <div className="bg-form-surface/50 border border-form-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
                      <style jsx>{`
                        :global(.ql-editor.ql-blank::before) {
                          color: #94a3b8 !important;
                          opacity: 1 !important;
                          font-style: normal !important;
                        }
                        :global(.ql-editor) {
                          color: #e2e8f0 !important;
                        }
                        :global(.ql-editor p) {
                          color: #e2e8f0 !important;
                        }
                        :global(.ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6) {
                          color: #f1f5f9 !important;
                        }
                        :global(.ql-editor strong) {
                          color: #f1f5f9 !important;
                        }
                        :global(.ql-editor em) {
                          color: #e2e8f0 !important;
                        }
                        :global(.ql-editor ul li, .ql-editor ol li) {
                          color: #e2e8f0 !important;
                        }
                        :global(.ql-toolbar) {
                          background: #1e293b !important;
                          border-bottom: 1px solid #334155 !important;
                        }
                        :global(.ql-toolbar .ql-stroke) {
                          stroke: #94a3b8 !important;
                        }
                        :global(.ql-toolbar .ql-fill) {
                          fill: #94a3b8 !important;
                        }
                        :global(.ql-toolbar button:hover .ql-stroke) {
                          stroke: #e2e8f0 !important;
                        }
                        :global(.ql-toolbar button:hover .ql-fill) {
                          fill: #e2e8f0 !important;
                        }
                        :global(.ql-toolbar button.ql-active .ql-stroke) {
                          stroke: #06b6d4 !important;
                        }
                        :global(.ql-toolbar button.ql-active .ql-fill) {
                          fill: #06b6d4 !important;
                        }
                        :global(.ql-toolbar button:hover) {
                          background: #334155 !important;
                        }
                        :global(.ql-toolbar .ql-picker-label) {
                          color: #94a3b8 !important;
                        }
                        :global(.ql-toolbar .ql-picker-label:hover) {
                          color: #e2e8f0 !important;
                        }
                        :global(.ql-toolbar .ql-picker-options) {
                          background: #1e293b !important;
                          border: 1px solid #334155 !important;
                        }
                        :global(.ql-toolbar .ql-picker-item) {
                          color: #94a3b8 !important;
                        }
                        :global(.ql-toolbar .ql-picker-item:hover) {
                          background: #334155 !important;
                          color: #e2e8f0 !important;
                        }
                      `}</style>
                      {typeof window !== 'undefined' && (
                        <ReactQuill
                          value={body}
                          onChange={setBody}
                          placeholder="Start writing your blog post..."
                          theme="snow"
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
                  <button type="submit" className="btn-dark-primary px-8 h-14 rounded-xl font-medium flex items-center space-x-3">
                    <Save className="w-5 h-5" />
                    <span>Publish Blog Post</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Media */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-3">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Media</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="label-dark mb-3">Cover Image URL</label>
                    <input 
                      value={coverImageUrl} 
                      onChange={(e) => setCoverImageUrl(e.target.value)} 
                      className="input-dark w-full text-white placeholder:text-slate-400" 
                      placeholder="https://example.com/image.jpg"
                    />
                    {coverImageUrl && (
                      <div className="mt-3">
                        <img 
                          src={coverImageUrl} 
                          alt="Cover preview" 
                          className="w-full h-32 object-cover rounded-xl border border-slate-600/30"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="label-dark mb-3">Additional Images</label>
                    <textarea
                      value={images.join('\n')}
                      onChange={(e) => setImages(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                      className="textarea-dark w-full text-white placeholder:text-slate-400"
                      rows={4}
                      placeholder="Enter image URLs (one per line)"
                    />
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">Enter one URL per line</p>
                  </div>
                </div>
              </div>

              {/* Publishing Info */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Publishing</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-medium text-amber-400 px-2 py-1 bg-amber-500/20 rounded-lg text-sm">Draft</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <span className="text-slate-400">Author:</span>
                    <span className="font-medium text-white">{user?.username}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <span className="text-slate-400">Created:</span>
                    <span className="font-medium text-cyan-400">Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}


