'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Calendar, User, Eye, GripVertical, Monitor, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { Blog } from '@/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Blog Item Component
interface SortableBlogItemProps {
  blog: Blog;
  isDesktop: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number, title: string) => void;
  onViewPublic: (slug: string) => void;
  deleteLoading: number | null;
  formatDate: (date: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}

function SortableBlogItem({ 
  blog, 
  isDesktop, 
  onEdit, 
  onDelete, 
  onViewPublic, 
  deleteLoading, 
  formatDate, 
  truncateText 
}: SortableBlogItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blog.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isDesktop) {
    // Desktop table row
    return (
      <tr 
        ref={setNodeRef} 
        style={style} 
        className={`hover:bg-slate-700/20 transition-colors ${isDragging ? 'bg-cyan-500/10' : ''}`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab mr-3 p-1 hover:bg-slate-600/30 rounded-lg transition-colors"
            >
              <GripVertical className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {blog.topic}
              </div>
              <div className="text-sm text-slate-400">
                /{blog.slug}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-slate-300 max-w-xs">
            {blog.description ? truncateText(blog.description, 100) : 'No description'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-slate-400">
            <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
            {formatDate(blog.created_at)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-slate-400">
            <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
            {formatDate(blog.updated_at)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onViewPublic(blog.slug)}
              className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
              title="View public"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(blog.id)}
              className="text-purple-400 hover:text-purple-300 p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
              title="Edit blog"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(blog.id, blog.topic)}
              disabled={deleteLoading === blog.id}
              className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-slate-700/30 disabled:opacity-50 transition-colors"
              title="Delete blog"
            >
              {deleteLoading === blog.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Mobile card view
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-sm hover:border-slate-600/50 transition-all duration-300 ${isDragging ? 'shadow-lg bg-cyan-500/10 border-cyan-500/30' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab mt-1 p-1 hover:bg-slate-600/30 rounded-lg transition-colors"
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {blog.topic}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              /{blog.slug}
            </p>
            {blog.description && (
              <p className="text-sm text-slate-300 mt-3 leading-relaxed line-clamp-2">
                {truncateText(blog.description, 120)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-cyan-400" />
            Created: {formatDate(blog.created_at)}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-cyan-400" />
            Updated: {formatDate(blog.updated_at)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewPublic(blog.slug)}
            className="inline-flex items-center px-3 py-2 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-colors font-medium"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          <button
            onClick={() => onEdit(blog.id)}
            className="inline-flex items-center px-3 py-2 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors font-medium"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>
        <button
          onClick={() => onDelete(blog.id, blog.topic)}
          disabled={deleteLoading === blog.id}
          className="inline-flex items-center px-3 py-2 text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/30 disabled:opacity-50 transition-colors font-medium"
        >
          {deleteLoading === blog.id ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-400 mr-1"></div>
          ) : (
            <Trash2 className="w-3 h-3 mr-1" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}

export default function BlogListPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  const isSuperAdmin = !!user?.roles?.some(r => r.name === 'super_admin');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check for desktop/mobile on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isLoading && user && !isSuperAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isSuperAdmin) {
      loadBlogs();
    }
  }, [isLoading, user, isSuperAdmin, router]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlogs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Here you could save the new order to the backend
        toast.success('Blog order updated');
        
        return newOrder;
      });
    }
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await apiClient.getBlogsAdmin();
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blogId: number) => {
    router.push(`/dashboard/blog/edit/${blogId}`);
  };

  const handleDelete = async (blogId: number, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(blogId);
      await apiClient.deleteBlog(blogId);
      toast.success('Blog deleted successfully');
      // Remove from local state
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewPublic = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <UnifiedDashboardLayout>
        <div className="min-h-full w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            <div className="flex items-center justify-center min-h-96">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
              </div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <UnifiedDashboardLayout>
      <div className="min-h-full w-full overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-none">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
                  Blog Management 📝
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Manage all your blog posts. Create, edit, delete, and view your content. Drag and drop to reorder.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                {/* View Toggle */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1 border border-slate-700/50">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setIsDesktop(true)}
                      className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isDesktop 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/30'
                      }`}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Table
                    </button>
                    <button
                      onClick={() => setIsDesktop(false)}
                      className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        !isDesktop 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/30'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Cards
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/blog')}
                  className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Blog</span>
                </button>
              </div>
            </div>
          </div>

          {/* Blog List */}
          {loading ? (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
                </div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No blogs yet</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">Get started by creating your first blog post to share with your audience.</p>
                <button
                  onClick={() => router.push('/dashboard/blog')}
                  className="btn-dark-primary px-6 h-12 rounded-xl font-medium flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Blog</span>
                </button>
              </div>
            </div>
          ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blogs.map(blog => blog.id)} strategy={verticalListSortingStrategy}>
              {isDesktop ? (
                /* Desktop Table View */
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-600/30">
                      <thead className="bg-slate-700/30">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Updated
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800/20 divide-y divide-slate-600/20">
                        {blogs.map((blog) => (
                          <SortableBlogItem
                            key={blog.id}
                            blog={blog}
                            isDesktop={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewPublic={handleViewPublic}
                            deleteLoading={deleteLoading}
                            formatDate={formatDate}
                            truncateText={truncateText}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Mobile Card View */
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <SortableBlogItem
                      key={blog.id}
                      blog={blog}
                      isDesktop={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewPublic={handleViewPublic}
                      deleteLoading={deleteLoading}
                      formatDate={formatDate}
                      truncateText={truncateText}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
          )}
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
