'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { Collaboration, Business } from '@/types';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Handshake,
  ShieldCheck,
  DollarSign,
  Loader2,
  Download,
  Eye,
  MessageCircle,
  TrendingUp,
  MoreVertical
} from 'lucide-react';

export default function CollaborationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const promotionId = useMemo(() => Number(params?.id), [params]);

  const [promotionData, setPromotionData] = useState<{
    promotion: {
      id: number;
      uuid: string | null;
      business_id: number;
      promotion_name: string;
      promotion_item: string;
      description: string | null;
      start_date: string | null;
      end_date: string | null;
      discount: string | null;
      budget: string | null;
      spent_amount: string | null;
      status: string | null;
      target_audience: string | null;
      social_media_platform_id: number;
      created_at: string | null;
      updated_at: string | null;
    };
    business: {
      id: number;
      name: string;
      description: string | null;
      website: string | null;
      industry: string | null;
      created_at: string | null;
    };
    collaboration_metadata: {
      statistics: {
        total_collaborations: number;
        active_collaborations: number;
        approved_collaborations: number;
        pending_collaborations: number;
        rejected_collaborations: number;
      };
      active_influencers: Array<{
        influencer_id: number;
        influencer_name: string;
        collaboration_id: number;
        collaboration_status: string;
        collaboration_type: string;
        proposed_amount: string | null;
        negotiated_amount: string | null;
        created_at: string | null;
      }>;
    };
    collaboration_documents: Array<{
      id: number;
      type: string;
      subtype: string;
      file_path: string;
      generated_at: string | null;
      created_at: string | null;
      parameters: any;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId || Number.isNaN(promotionId)) return;

    const fetchPromotionDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPromotionDetailsWithCollaborationMetadata(promotionId);
        setPromotionData(data);
      } catch (err) {
        console.error('Failed to fetch promotion details with collaboration metadata', err);
        setError('Unable to load promotion details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [promotionId]);

  const statusPill = (status: string) => {
    const base = 'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border';
    switch (status) {
      case 'active':
        return `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/20`;
      case 'pending':
        return `${base} bg-amber-500/15 text-amber-300 border-amber-500/20`;
      case 'completed':
        return `${base} bg-blue-500/15 text-blue-300 border-blue-500/20`;
      default:
        return `${base} bg-slate-600/20 text-slate-300 border-slate-600/30`;
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Export functions
  const exportToCSV = () => {
    if (!promotionData) return;
    
    const headers = [
      'Influencer Name',
      'Status',
      'Type',
      'Proposed Amount',
      'Agreed Amount',
      'Created Date'
    ];
    
    const rows = promotionData.collaboration_metadata.active_influencers.map(inf => [
      inf.influencer_name,
      inf.collaboration_status,
      inf.collaboration_type,
      inf.proposed_amount || '—',
      inf.negotiated_amount || '—',
      inf.created_at ? new Date(inf.created_at).toLocaleDateString() : '—'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `influencers_${promotionData.promotion.promotion_name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    if (!promotionData) return;
    
    const data = promotionData.collaboration_metadata.active_influencers.map(inf => ({
      'Influencer Name': inf.influencer_name,
      'Status': inf.collaboration_status,
      'Type': inf.collaboration_type,
      'Proposed Amount': inf.proposed_amount || '—',
      'Agreed Amount': inf.negotiated_amount || '—',
      'Created Date': inf.created_at ? new Date(inf.created_at).toLocaleDateString() : '—'
    }));
    
    // For now, we'll export as CSV with Excel extension
    // In a real implementation, you'd use a library like xlsx
    const headers = Object.keys(data[0] || {});
    const csvContent = [headers, ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))]
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `influencers_${promotionData.promotion.promotion_name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  const exportToPDF = () => {
    if (!promotionData) return;
    
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const tableHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Influencer Report - ${promotionData.promotion.promotion_name}</title>
          <style>
            @media print {
              @page {
                margin: 0.5in;
                size: A4;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #007acc;
            }
            
            .header h1 {
              color: #007acc;
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: 600;
            }
            
            .header-info {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              font-size: 14px;
              color: #666;
            }
            
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            
            .stat-item {
              text-align: center;
            }
            
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #007acc;
              display: block;
            }
            
            .stat-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            
            th {
              background: linear-gradient(135deg, #007acc, #0056b3);
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #eee;
              font-size: 13px;
            }
            
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            
            tr:hover {
              background-color: #e3f2fd;
            }
            
            .status {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
            }
            
            .status.approved {
              background: #e8f5e8;
              color: #2e7d32;
            }
            
            .status.active {
              background: #e3f2fd;
              color: #1976d2;
            }
            
            .status.pending {
              background: #fff3e0;
              color: #f57c00;
            }
            
            .amount {
              font-weight: 600;
              color: #2e7d32;
            }
            
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Influencer Collaboration Report</h1>
            <div class="header-info">
              <div><strong>Promotion:</strong> ${promotionData.promotion.promotion_name}</div>
              <div><strong>Business:</strong> ${promotionData.business.name}</div>
              <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">${promotionData.collaboration_metadata.statistics.total_collaborations}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${promotionData.collaboration_metadata.statistics.approved_collaborations}</span>
              <span class="stat-label">Approved</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${promotionData.collaboration_metadata.statistics.active_collaborations}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${promotionData.collaboration_metadata.statistics.pending_collaborations}</span>
              <span class="stat-label">Pending</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Influencer Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Proposed Amount</th>
                <th>Agreed Amount</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${promotionData.collaboration_metadata.active_influencers.map(inf => `
                <tr>
                  <td><strong>${inf.influencer_name}</strong><br><small style="color: #666;">ID: ${inf.influencer_id}</small></td>
                  <td><span class="status ${inf.collaboration_status}">${inf.collaboration_status}</span></td>
                  <td>${inf.collaboration_type.replace('_', ' ')}</td>
                  <td class="amount">${inf.proposed_amount ? `$${parseFloat(inf.proposed_amount).toLocaleString()}` : '—'}</td>
                  <td class="amount">${inf.negotiated_amount ? `$${parseFloat(inf.negotiated_amount).toLocaleString()}` : '—'}</td>
                  <td>${inf.created_at ? new Date(inf.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Report generated by Viral Together Platform | ${new Date().toLocaleDateString()}</p>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(tableHTML);
    printWindow.document.close();
  };

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-slate-300">Loading collaboration...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to load</h3>
            <p className="text-slate-300">{error}</p>
          </div>
        )}

        {!loading && !error && promotionData && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-white">{promotionData.promotion.promotion_name}</h1>
                    <div className="flex flex-col gap-1 text-slate-400 text-sm mt-1">
                      <div className="flex items-center gap-3">
                        <span>Promotion ID: {promotionData.promotion.id}</span>
                        <span className="text-slate-600">•</span>
                        <span>Business ID: {promotionData.business.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">Business: <span className="text-white">{promotionData.business.name}</span></span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-300">Total Collaborations: <span className="text-white">{promotionData.collaboration_metadata.statistics.total_collaborations}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={statusPill(promotionData.promotion.status || 'pending')}>
                  <span className="mr-1">{statusIcon(promotionData.promotion.status || 'pending')}</span>
                  <span className="capitalize">{promotionData.promotion.status || 'pending'}</span>
                </span>
              </div>
            </div>

            {/* Collaboration Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-emerald-400">{promotionData.collaboration_metadata.statistics.total_collaborations}</div>
                <div className="text-slate-400 text-sm">Total Collaborations</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-blue-400">{promotionData.collaboration_metadata.statistics.approved_collaborations}</div>
                <div className="text-slate-400 text-sm">Approved</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-emerald-400">{promotionData.collaboration_metadata.statistics.active_collaborations}</div>
                <div className="text-slate-400 text-sm">Active</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-amber-400">{promotionData.collaboration_metadata.statistics.pending_collaborations}</div>
                <div className="text-slate-400 text-sm">Pending</div>
              </div>
            </div>

          {/* Active Influencers table section - MOVED UP */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-cyan-300" />
                <h3 className="text-white font-semibold">Active Influencers</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/70 hover:text-white transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                    <MoreVertical className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={exportToCSV}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        📊 Export as CSV
                      </button>
                      <button
                        onClick={exportToExcel}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        📈 Export as Excel
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        📄 Export as PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full w-full text-sm">
                  <thead className="bg-slate-800/60">
                    <tr className="text-left text-slate-200">
                      <th className="py-3 px-5 font-medium">Influencer</th>
                      <th className="py-3 px-5 font-medium">Status</th>
                      <th className="py-3 px-5 font-medium">Type</th>
                      <th className="py-3 px-5 font-medium">Proposed Amount</th>
                      <th className="py-3 px-5 font-medium">Agreed Amount</th>
                      <th className="py-3 px-5 font-medium">Since</th>
                      <th className="py-3 px-5 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {promotionData.collaboration_metadata.active_influencers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 px-5 text-center text-slate-400">
                          No active influencers for this promotion.
                        </td>
                      </tr>
                    ) : (
                      promotionData.collaboration_metadata.active_influencers.map((inf) => (
                        <tr key={`${inf.collaboration_id}-${inf.influencer_id}`} className="hover:bg-slate-700/20">
                          <td className="py-3 px-5">
                            <button
                              onClick={() => router.push(`/influencer/${inf.influencer_id}`)}
                              className="text-white font-medium hover:text-cyan-400 transition-colors duration-200 text-left"
                              title={`View ${inf.influencer_name}'s profile`}
                            >
                              {inf.influencer_name}
                            </button>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              inf.collaboration_status === 'approved' 
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                : inf.collaboration_status === 'active'
                                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                                : 'bg-slate-500/15 text-slate-300 border border-slate-500/20'
                            }`}>
                              {inf.collaboration_status}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-slate-300 capitalize">{inf.collaboration_type}</td>
                          <td className="py-3 px-5 text-slate-300">
                            {inf.proposed_amount ? `$${parseFloat(inf.proposed_amount).toLocaleString()}` : '—'}
                          </td>
                          <td className="py-3 px-5 text-slate-300">
                            {inf.negotiated_amount ? `$${parseFloat(inf.negotiated_amount).toLocaleString()}` : '—'}
                          </td>
                          <td className="py-3 px-5 text-slate-400">
                            {inf.created_at ? new Date(inf.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/business/collaborations/${inf.collaboration_id}`)}
                                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded transition-all duration-200"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/business/collaborations/${inf.collaboration_id}/messages`)}
                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded transition-all duration-200"
                                title="View Messages"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/business/collaborations/${inf.collaboration_id}/analytics`)}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded transition-all duration-200"
                                title="View Analytics"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Collaboration Documents - NEW PANEL */}
          <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-300" />
                <h3 className="text-white font-semibold">Collaboration Documents</h3>
              </div>
              <span className="text-xs text-slate-400">{promotionData.collaboration_documents.length} document{promotionData.collaboration_documents.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50">
              {promotionData.collaboration_documents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <p>No completed collaboration request documents found for this promotion.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {promotionData.collaboration_documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">
                              {doc.type} - {doc.subtype}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 truncate" title={doc.file_path}>
                              {doc.file_path}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {doc.generated_at ? new Date(doc.generated_at).toLocaleDateString() : new Date(doc.created_at!).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(doc.file_path, '_blank')}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 flex-shrink-0"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Promotion Details */}
          <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Promotion Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <span className="text-slate-400 text-sm">Promotion</span>
                <div className="text-white font-medium">{promotionData.promotion.promotion_name}</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <span className="text-slate-400 text-sm">Item</span>
                <div className="text-white font-medium">{promotionData.promotion.promotion_item}</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <span className="text-slate-400 text-sm">Business</span>
                <div className="text-white font-medium">{promotionData.business.name}</div>
              </div>
              {promotionData.promotion.start_date && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">Start</span>
                  <div className="text-white font-medium">{new Date(promotionData.promotion.start_date).toLocaleDateString()}</div>
                </div>
              )}
              {promotionData.promotion.end_date && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">End</span>
                  <div className="text-white font-medium">{new Date(promotionData.promotion.end_date).toLocaleDateString()}</div>
                </div>
              )}
              {promotionData.promotion.budget && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">Budget</span>
                  <div className="text-white font-medium">${parseFloat(promotionData.promotion.budget).toLocaleString()}</div>
                </div>
              )}
              {promotionData.promotion.discount && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">Discount</span>
                  <div className="text-white font-medium">{promotionData.promotion.discount}%</div>
                </div>
              )}
              {promotionData.promotion.status && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">Status</span>
                  <div className="text-white font-medium capitalize">{promotionData.promotion.status}</div>
                </div>
              )}
              {promotionData.promotion.target_audience && (
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <span className="text-slate-400 text-sm">Target Audience</span>
                  <div className="text-white font-medium">{promotionData.promotion.target_audience}</div>
                </div>
              )}
            </div>
            {promotionData.promotion.description && (
              <div className="mt-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <span className="block text-slate-400 text-sm mb-1">Description</span>
                <p className="text-slate-200 text-sm">{promotionData.promotion.description}</p>
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}



