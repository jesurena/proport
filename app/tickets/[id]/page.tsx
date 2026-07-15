'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AppButton,
  AppAvatar,
} from '@integrated-computer-system/ui-kit';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock3,
  Paperclip,
  Inbox,
  CircleDot,
  ArrowRightLeft,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';
import TicketThread from '@/components/tickets/TicketThread';
import { AppAttachmentCard, AppFilePreview } from '@/components/ui';
import { getTicketById, addReply, updateTicketStatus, updateTicketAssignee, getUsers, addTicketTags } from '@/lib/tickets';
import { STATUS_META, PRIORITY_META } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);
  const [previewFile, setPreviewFile] = useState<File | string | null>(null);

  const [cc, setCc] = useState('');

  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const descRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const buyers = getUsers().filter((u) => u.role === 'buyer' || u.role === 'admin');

  useEffect(() => {
    const t = getTicketById(ticketId);
    if (t) {
      setTicket(t);
    }
  }, [ticketId]);

  const refresh = () => {
    const t = getTicketById(ticketId);
    if (t) setTicket(t);
  };

  const handleSendReply = async () => {
    const contentText = descRef.current?.innerText?.trim() || '';
    if (!contentText) return;
    
    setSending(true);
    await new Promise((r) => setTimeout(r, 300));
    addReply(ticketId, { content: contentText });
    
    if (attachments.length > 0) {
      addTicketTags(ticketId, attachments.map(f => f.name));
    }
    
    if (descRef.current) descRef.current.innerHTML = '';
    setAttachments([]);
    setCc('');
    setSending(false);
    refresh();
  };

  const handleDiscard = () => {
    if (descRef.current) descRef.current.innerHTML = '';
    setAttachments([]);
    setCc('');
  };

  const handleStatusChange = (status: TicketStatus) => {
    updateTicketStatus(ticketId, status);
    refresh();
  };

  const handleAssign = (userId: string) => {
    updateTicketAssignee(ticketId, userId);
    refresh();
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    descRef.current?.focus();
  };

  if (!ticket) {
    return (
      <>
        <ProportNavbar title="Inquiry Not Found" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-text-info">
          <XCircle size={48} className="mb-3 opacity-30" />
          <p className="text-lg font-medium">Inquiry not found</p>
          <AppButton variant="ghost" className="mt-4" onClick={() => router.push('/tickets')}>
            ← Back to Inquiries
          </AppButton>
        </div>
      </>
    );
  }

  const statusMeta = STATUS_META[ticket.status];
  const priorityMeta = PRIORITY_META[ticket.priority];

  const getStatusIcon = (status: TicketStatus, size: number = 24) => {
    switch (status) {
      case 'unassigned':
        return <Inbox size={size} />;
      case 'assigned':
        return <CircleDot size={size} />;
      case 'pending':
        return <Clock3 size={size} />;
      case 'answered':
        return <CheckCircle2 size={size} />;
      case 'closed':
        return <XCircle size={size} />;
      case 'escalated':
        return <AlertTriangle size={size} />;
      case 'reassigned':
        return <ArrowRightLeft size={size} />;
      default:
        return <FileText size={size} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      <ProportNavbar title={`Inquiry #${String(ticket.ticketNumber).padStart(4, '0')}`} />

      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/tickets')}
          className="flex items-center gap-2 text-sm text-text-info hover:text-text transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Back to Inquiries
        </button>

        {/* Header Title */}
        <h1 className="text-xl font-bold text-text leading-snug mb-4">
          {ticket.businessUnitName} - {ticket.subject}
        </h1>

        {/* ═══════════ Two-Column Layout ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── LEFT COLUMN: Subject, Thread, Composer ── */}
          <div className="space-y-0">
            {/* Subject Card */}
            <div className="rounded-t-xl border border-border/60 bg-card-bg p-5 shadow-sm">
              <h2 className="text-lg font-bold text-text leading-snug">{ticket.subject}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span 
                  className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: statusMeta.color }}
                >
                  {statusMeta.label}
                </span>
                <span 
                  className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${priorityMeta.color}18`, color: priorityMeta.color, border: `1px solid ${priorityMeta.color}30` }}
                >
                  {priorityMeta.label} Priority
                </span>
                <span className="text-[11px] font-semibold text-accent-1 bg-accent-1/10 border border-accent-1/20 px-2 py-0.5 rounded">
                  {ticket.businessUnitName}
                </span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="border-x border-border/60 bg-card-bg px-5 pt-5 pb-2">
              <TicketThread
                replies={ticket.replies}
                ticketDescription={ticket.description}
                ticketCreatedAt={ticket.createdAt}
                requesterName={ticket.requesterName}
                requesterAvatar={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requesterName.split(' ').map(n => n[0]).join('')}`}
              />
            </div>

            {/* Reply Composer */}
            {ticket.status !== 'closed' && (
              <div className="rounded-b-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden flex flex-col">
                {/* Cc input */}
                <div className="flex items-center gap-3 px-5 py-2.5 bg-neutral/5 border-b border-border/30">
                  <span className="text-xs font-semibold text-text-info uppercase tracking-wider shrink-0 select-none">Cc:</span>
                  <input
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Separate emails with commas..."
                    className="w-full bg-transparent border-none outline-none text-xs text-text placeholder-text-info/30"
                  />
                </div>

                {/* Editable body */}
                <div 
                  className="cursor-text overflow-y-auto min-h-[160px] max-h-[320px] px-5 py-5 bg-background"
                  onClick={() => descRef.current?.focus()}
                >
                  <div
                    ref={descRef}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Write your message here..."
                    className="h-full text-sm text-text leading-[1.8] outline-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-text-info/40 empty:before:pointer-events-none"
                  />
                </div>

                {/* Attachment chips */}
                {attachments.length > 0 && (
                  <div className="px-5 py-2.5 flex flex-wrap gap-2.5 border-t border-border/20 bg-neutral/5 max-h-[140px] overflow-y-auto">
                    {attachments.map((f, i) => (
                      <AppAttachmentCard
                        key={i}
                        name={f.name}
                        size={f.size}
                        onRemove={() => setAttachments((p) => p.filter((_, idx) => idx !== i))}
                        onClick={() => setPreviewFile(f)}
                        variant="uploading"
                      />
                    ))}
                  </div>
                )}
                <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => setAttachments((p) => [...p, ...Array.from(e.target.files || [])])} />

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-neutral/5">
                  <div className="flex items-center">
                    <button
                      onClick={handleSendReply}
                      disabled={sending}
                      className="bg-[#0B2545] dark:bg-[#134074] hover:opacity-90 disabled:opacity-50 text-white font-medium text-xs rounded-full px-5 py-2.5 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Send size={13} />
                      {sending ? 'Sending...' : 'Send'}
                    </button>

                    <div className="w-px h-5 bg-border/40 mx-3 shrink-0" />

                    <div className="flex items-center gap-0.5">
                      <ToolbarBtn title="Bold" onClick={() => execCmd('bold')}><Bold size={14} /></ToolbarBtn>
                      <ToolbarBtn title="Italic" onClick={() => execCmd('italic')}><Italic size={14} /></ToolbarBtn>
                      <ToolbarBtn title="Underline" onClick={() => execCmd('underline')}><Underline size={14} /></ToolbarBtn>
                    </div>

                    <div className="w-px h-5 bg-border/40 mx-3 shrink-0" />

                    <div className="flex items-center gap-0.5">
                      <ToolbarBtn title="List" onClick={() => execCmd('insertUnorderedList')}><List size={14} /></ToolbarBtn>
                      <ToolbarBtn title="Link" onClick={() => { const u = prompt('URL:'); if (u) execCmd('createLink', u); }}><Link2 size={14} /></ToolbarBtn>
                    </div>

                    <div className="w-px h-5 bg-border/40 mx-3 shrink-0" />

                    <ToolbarBtn title="Attach File" onClick={() => fileRef.current?.click()}><Paperclip size={14} /></ToolbarBtn>
                  </div>

                  <ToolbarBtn title="Discard" onClick={handleDiscard}><Trash2 size={14} /></ToolbarBtn>
                </div>
              </div>
            )}
            {ticket.status === 'closed' && (
              <div className="rounded-b-xl border border-border/60 bg-card-bg px-5 py-4 shadow-sm" />
            )}
          </div>

          {/* ── RIGHT COLUMN: Actions, Info, Files ── */}
          <div className="space-y-4">
            {/* Inquiry Actions Card */}
            <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-neutral/5">
                <span className="text-sm font-bold text-text">Inquiry Actions</span>
              </div>
              <div className="p-4 space-y-3">
                <div 
                  className="relative overflow-hidden rounded-md p-4 text-white shadow-md flex items-center justify-between"
                  style={{ 
                    background: `linear-gradient(135deg, ${statusMeta.color} 0%, ${statusMeta.color}dd 100%)` 
                  }}
                >
                  <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 dark:bg-black/20 rounded-md backdrop-blur-md shrink-0 shadow-inner flex items-center justify-center">
                      {getStatusIcon(ticket.status, 22)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block">Current Status</span>
                      <span className="text-sm font-extrabold uppercase tracking-wide block mt-0.5">{statusMeta.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-wider shrink-0 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                </div>

                <div className="flex gap-2 relative mt-1">
                  {ticket.status !== 'closed' ? (
                    ticket.status !== 'answered' ? (
                      <button 
                        onClick={() => handleStatusChange('answered')}
                        className="flex-1 bg-[#0B2545] dark:bg-[#134074] text-white hover:opacity-90 transition-all font-semibold rounded-md py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        ✓ Mark Answered
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange('closed')}
                        className="flex-1 bg-[#0B2545] dark:bg-[#134074] text-white hover:opacity-90 transition-all font-semibold rounded-md py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        ✕ Close Inquiry
                      </button>
                    )
                  ) : (
                    <button 
                      onClick={() => handleStatusChange('assigned')}
                      className="flex-1 bg-[#0B2545] dark:bg-[#134074] text-white hover:opacity-90 transition-all font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      ↺ Reopen Inquiry
                    </button>
                  )}

                  <button
                    onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                    className="w-9 h-9 border border-border/60 bg-neutral/5 hover:bg-hover text-text-info hover:text-text rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {actionDropdownOpen && (
                    <div className="absolute right-0 top-11 w-44 bg-card-bg border border-border shadow-lg rounded-lg py-1 z-10">
                      {ticket.status !== 'closed' ? (
                        <>
                          {ticket.status !== 'escalated' && (
                            <button
                              onClick={() => { handleStatusChange('escalated'); setActionDropdownOpen(false); }}
                              className="w-full text-left px-4 py-2 text-xs text-text hover:bg-hover transition-colors"
                            >
                              ⚠ Escalate
                            </button>
                          )}
                          {ticket.status === 'answered' && (
                            <button
                              onClick={() => { handleStatusChange('assigned'); setActionDropdownOpen(false); }}
                              className="w-full text-left px-4 py-2 text-xs text-text hover:bg-hover transition-colors"
                            >
                              ↺ Mark Unanswered
                            </button>
                          )}
                          {ticket.status !== 'answered' && (
                            <button
                              onClick={() => { handleStatusChange('closed'); setActionDropdownOpen(false); }}
                              className="w-full text-left px-4 py-2 text-xs text-text hover:bg-hover transition-colors"
                            >
                              ✕ Close Inquiry
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => { handleStatusChange('assigned'); setActionDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-text hover:bg-hover transition-colors"
                        >
                          ↺ Reopen
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Assignee Selection */}
                {ticket.status !== 'closed' && (
                  <div className="mt-2 pt-3 border-t border-border/20">
                    <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block mb-2">Buyer (Assignee)</span>
                    {ticket.assigneeName ? (
                      <div className="flex items-center gap-2 mb-3 bg-neutral/5 p-2 rounded-md border border-border/40">
                        <AppAvatar name={ticket.assigneeName} src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.assigneeName}`} size={20} />
                        <span className="text-xs font-semibold text-text truncate flex-1">{ticket.assigneeName}</span>
                      </div>
                    ) : (
                      <p className="text-xs italic text-text-info mb-3">No buyer assigned</p>
                    )}
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="w-full text-center text-xs font-semibold text-text bg-neutral/15 hover:bg-neutral/25 border border-border/40 py-2 rounded-md transition-colors cursor-pointer"
                    >
                      {ticket.assigneeId ? 'Reassign Buyer' : 'Assign Buyer'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Information Card */}
            <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden">
              <div 
                onClick={() => setInfoExpanded(!infoExpanded)}
                className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-neutral/5 cursor-pointer select-none hover:bg-neutral/10"
              >
                <span className="text-sm font-bold text-text">Inquiry Information</span>
                {infoExpanded ? <ChevronUp size={14} className="text-text-info" /> : <ChevronDown size={14} className="text-text-info" />}
              </div>
              {infoExpanded && (
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Reference</span>
                    <span className="font-semibold text-text text-xs">#{String(ticket.ticketNumber).padStart(4, '0')}</span>
                  </div>
                  {ticket.supplierName && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-info text-xs">Supplier</span>
                      <span className="font-semibold text-text text-xs">{ticket.supplierName}</span>
                    </div>
                  )}
                  {ticket.targetPrice !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-info text-xs">Target Price</span>
                      <span className="font-semibold text-text text-xs">${ticket.targetPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {ticket.estimatedQuantity !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-info text-xs">Est. Quantity</span>
                      <span className="font-semibold text-text text-xs">{ticket.estimatedQuantity} units</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Requester</span>
                    <span className="font-semibold text-text text-xs">{ticket.requesterName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Business Unit</span>
                    <span className="font-semibold text-text text-xs">{ticket.businessUnitName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Priority</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priorityMeta.color }} />
                      <span className="font-semibold text-text text-xs capitalize">{priorityMeta.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Created</span>
                    <span className="font-semibold text-text text-xs">{formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-info text-xs">Updated</span>
                    <span className="font-semibold text-text text-xs">{formatDate(ticket.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Files Shared Card */}
            <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden">
              <div 
                onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}
                className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-neutral/5 cursor-pointer select-none hover:bg-neutral/10"
              >
                <span className="text-sm font-bold text-text">Files Shared</span>
                {attachmentsExpanded ? <ChevronUp size={14} className="text-text-info" /> : <ChevronDown size={14} className="text-text-info" />}
              </div>
              {attachmentsExpanded && (
                <div className="p-4 space-y-3 flex flex-col items-center">
                  {ticket.tags && ticket.tags.length > 0 ? (
                    ticket.tags.map((tag, idx) => (
                      <AppAttachmentCard
                        key={idx}
                        name={tag}
                        variant="shared"
                        onClick={() => setPreviewFile(tag)}
                        onDownload={() => {
                          alert(`Downloading: ${tag}`);
                        }}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-text-info italic">No files shared</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Buyer Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card-bg border border-border rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">Select Buyer</h3>
              <button 
                onClick={() => setAssignModalOpen(false)}
                className="text-text-info hover:text-text text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[300px] overflow-y-auto space-y-2">
              {buyers.map((buyer) => (
                <div
                  key={buyer.id}
                  onClick={() => {
                    handleAssign(buyer.id);
                    setAssignModalOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    ticket.assigneeId === buyer.id
                      ? 'border-accent-1 bg-accent-1/5'
                      : 'border-border/40 hover:bg-hover'
                  }`}
                >
                  <AppAvatar name={buyer.name} src={`https://api.dicebear.com/7.x/initials/svg?seed=${buyer.name}`} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{buyer.name}</p>
                    <p className="text-[10px] text-text-info uppercase tracking-wider mt-0.5">{buyer.role}</p>
                  </div>
                  {ticket.assigneeId === buyer.id && (
                    <span className="text-xs text-accent-1 font-bold">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AppFilePreview
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </>
  );
}

function ToolbarBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button 
      type="button"
      title={title} 
      onClick={onClick} 
      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-info hover:bg-hover hover:text-text transition-colors cursor-pointer shrink-0"
    >
      {children}
    </button>
  );
}
