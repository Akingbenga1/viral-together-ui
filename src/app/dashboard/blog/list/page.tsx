'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Calendar, User, Eye, GripVertical, Monitor, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/Layout/DashboardLayout';
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
        className={`hover:bg-gray-50 ${isDragging ? 'bg-blue-50' : ''}`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab mr-3 p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {blog.topic}
              </div>
              <div className="text-sm text-gray-500">
                /{blog.slug}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 max-w-xs">
            {blog.description ? truncateText(blog.description, 100) : 'No description'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(blog.created_at)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(blog.updated_at)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onViewPublic(blog.slug)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
              title="View public"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(blog.id)}
              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
              title="Edit blog"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(blog.id, blog.topic)}
              disabled={deleteLoading === blog.id}
              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
              title="Delete blog"
            >
              {deleteLoading === blog.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
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
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${isDragging ? 'shadow-lg bg-blue-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab mt-1 p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {blog.topic}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              /{blog.slug}
            </p>
            {blog.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {truncateText(blog.description, 120)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Created: {formatDate(blog.created_at)}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated: {formatDate(blog.updated_at)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewPublic(blog.slug)}
            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          <button
            onClick={() => onEdit(blog.id)}
            className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>
        <button
          onClick={() => onDelete(blog.id, blog.topic)}
          disabled={deleteLoading === blog.id}
          className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        >
          {deleteLoading === blog.id ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage all your blog posts. Create, edit, delete, and view your content. Drag and drop to reorder.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsDesktop(true)}
                className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isDesktop 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Table
              </button>
              <button
                onClick={() => setIsDesktop(false)}
                className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                  !isDesktop 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Cards
              </button>
            </div>
            <button
              onClick={() => router.push('/dashboard/blog')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Blog
            </button>
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="card">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="card">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blogs</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first blog post.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard/blog')}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Blog
                </button>
              </div>
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
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Updated
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
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
    </DashboardLayout>
  );
}
