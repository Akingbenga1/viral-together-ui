'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { JoinGroupResponse } from '@/types';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';

function JoinCoachingGroupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [groupInfo, setGroupInfo] = useState<any>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setJoinCode(code.toUpperCase());
      // Optionally fetch group info to show details
      fetchGroupInfo(code);
    }
  }, [searchParams]);

  const fetchGroupInfo = async (code: string) => {
    try {
      const groupData = await apiClient.getGroupInfoByCode(code);
      setGroupInfo(groupData);
    } catch (error) {
      console.error('Error fetching group info:', error);
      // Don't show error to user, just don't display group info
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setMessage('Please enter a join code');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await apiClient.joinCoachingGroup({
        join_code: joinCode.trim(),
        payment_reference: paymentReference.trim() || undefined
      });

      setMessage(response.message);

      if (response.success) {
        // Redirect to coaching dashboard after successful join
        setTimeout(() => {
          router.push('/dashboard/coaching');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error joining coaching group:', error);
      setMessage(error.response?.data?.detail || 'Failed to join group. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="form-container-dark w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-form-text mb-2">Join Coaching Group</h1>
            <p className="text-form-text-muted text-sm">
              Enter the join code to become a member of this coaching group
            </p>
          </div>

          {/* Group Info (if available) */}
          {groupInfo && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-cyan-300 mb-2">{groupInfo.name}</h3>
              <p className="text-cyan-200 text-sm">{groupInfo.description}</p>
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  groupInfo.is_paid 
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {groupInfo.is_paid ? 'Paid Group' : 'Free Group'}
                </span>
              </div>
            </div>
          )}

          {/* Join Form */}
          <form onSubmit={handleJoinGroup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="joinCode" className="label-dark">
                Join Code *
              </label>
              <input
                id="joinCode"
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="input-dark font-mono tracking-wider"
                placeholder="Enter the join code"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentReference" className="label-dark">
                Payment Reference (optional)
              </label>
              <input
                id="paymentReference"
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="input-dark"
                placeholder="Enter payment reference if this is a paid group"
              />
              <p className="text-xs text-form-text-muted mt-1">
                Only required for paid coaching groups
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-xl flex items-start space-x-3 ${
                message.includes('Failed') || message.includes('error') || message.includes('invalid')
                  ? 'bg-red-500/10 border border-red-500/20'
                  : 'bg-green-500/10 border border-green-500/20'
              }`}>
                {message.includes('Failed') || message.includes('error') || message.includes('invalid') ? (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-sm font-medium ${
                  message.includes('Failed') || message.includes('error') || message.includes('invalid')
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>
                  {message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !joinCode.trim()}
              className="btn-dark-primary w-full h-12 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                'Join Group'
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-8 text-center pt-6 border-t border-form-border/20">
            <button
              onClick={() => router.push('/dashboard/coaching')}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              ← Back to Coaching Dashboard
            </button>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}

export default function JoinCoachingGroup() {
  return (
    <Suspense fallback={
      <UnifiedDashboardLayout>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="form-container-dark w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-form-text mb-2">Loading...</h1>
              <p className="text-form-text-muted text-sm">Preparing join form</p>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    }>
      <JoinCoachingGroupContent />
    </Suspense>
  );
}
