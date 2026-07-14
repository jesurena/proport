'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppButton } from '@integrated-computer-system/ui-kit';
import { AppSelect } from '@/components/ui';
import {
  Send, Paperclip, X, Bold, Italic, Underline,
  Link2, List, Minus, Maximize2, ChevronDown, ChevronUp, Trash2, Check,
} from 'lucide-react';
import { CustomerPickerModal } from './CustomerPickerModal';
import { createTicket, getBusinessUnits, getUsers } from '@/lib/tickets';
import { getSuppliers } from '@/lib/suppliers';
import type { TicketPriority, User as UserType } from '@/lib/types';

const REQUEST_TYPES = [
  { value: 'standard', label: 'Standard Price Query' },
  { value: 'volume', label: 'Volume Discount' },
  { value: 'custom', label: 'Custom Quote' },
  { value: 'match', label: 'Supplier Match' },
  { value: 'general', label: 'General Price Inquiry' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  critical: 'bg-red-500/10 text-red-600 border-red-500/30',
};

const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🟠 High' },
  { value: 'critical', label: '🔴 Critical' },
];

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

export function ComposeModal({ open, onClose }: ComposeModalProps) {
  const router = useRouter();
  const businessUnits = getBusinessUnits();
  const allUsers = getUsers();
  const suppliers = getSuppliers();

  const buyers = allUsers.filter((u) => u.role === 'buyer' || u.role === 'admin');
  const salesReps = allUsers.filter((u) => u.role === 'sales');

  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [ao, setAo] = useState('');
  const [cc, setCc] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(null);
  const [requestType, setRequestType] = useState('');
  const [supplier, setSupplier] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const buyerOptions = [
    { value: '', label: 'Unassigned' },
    ...buyers.map((e) => ({ value: e.id, label: e.name })),
  ];
  const aoOptions = [
    { value: '', label: 'Choose AO...' },
    ...businessUnits.map((bu) => ({ value: bu.id, label: bu.name })),
  ];
  const supplierOptions = suppliers.map((s) => ({ value: s.name, label: s.name }));

  // Reset when opened
  useEffect(() => {
    if (open) {
      setMinimized(false);
      setAo(''); setCc(''); setSelectedCustomer(null);
      setRequestType(''); setSupplier(''); setTargetPrice(''); setEstimatedQuantity('');
      setAssignTo(''); setSubject(''); setPriority('medium');
      setAttachments([]); setShowCc(false); setShowDetails(false);
      if (descRef.current) descRef.current.innerHTML = '';
    }
  }, [open]);

  // Auto-build subject
  useEffect(() => {
    const parts = [
      selectedCustomer?.name,
      requestType ? REQUEST_TYPES.find((r) => r.value === requestType)?.label : '',
      supplier ? `(${supplier})` : '',
    ].filter(Boolean);
    if (parts.length) setSubject(parts.join(' - '));
  }, [selectedCustomer, requestType, supplier]);

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const bodyText = descRef.current?.innerText?.trim() || '';
    const ticket = createTicket({
      subject: subject.trim(),
      description: bodyText,
      priority: priority as TicketPriority,
      businessUnitId: businessUnits[0]?.id || '',
      requesterId: selectedCustomer?.id,
      supplierName: supplier || undefined,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      estimatedQuantity: estimatedQuantity ? parseInt(estimatedQuantity) : undefined,
    });
    setSubmitting(false);
    onClose();
    router.push(`/tickets/${ticket.id}`);
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    descRef.current?.focus();
  };

  if (!open) return null;

  const normalHeight = minimized ? '46px' : '82vh';
  const modalStyle = expanded ? {
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
  } : {
    top: `calc(100vh - ${normalHeight})`,
    left: `max(12px, calc(100vw - 780px - 24px))`,
    right: '24px',
    bottom: '0px',
    borderTopLeftRadius: '14px',
    borderTopRightRadius: '14px',
  };

  return (
    <>
      {/* Floating compose window — fixed bottom-right or fullscreen */}
      <div
        className="fixed z-[1000] flex flex-col bg-background border border-border shadow-2xl overflow-hidden transition-all duration-300 ease-in-out"
        style={modalStyle}
      >
        {/* ── Title bar ── */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-[#404040] dark:bg-[#202020] select-none cursor-pointer shrink-0"
          onClick={() => {
            setMinimized((m) => !m);
            if (expanded) setExpanded(false);
          }}
        >
          <span className="text-white text-sm font-semibold truncate">
            {subject || 'Compose New Price Inquiry'}
          </span>
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              title={minimized ? 'Restore' : 'Minimize'}
              onClick={() => {
                setMinimized((m) => !m);
                if (expanded) setExpanded(false);
              }}
              className="w-6 h-6 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {minimized ? <ChevronUp size={13} /> : <Minus size={13} />}
            </button>
            <button
              title={expanded ? 'Restore size' : 'Full size'}
              onClick={() => {
                setExpanded((e) => !e);
                if (minimized) setMinimized(false);
              }}
              className="w-6 h-6 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Maximize2 size={13} />
            </button>
            <button
              title="Discard draft"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body — hidden when minimized */}
        {!minimized && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* ── Fields ── */}
            <div className="divide-y divide-border shrink-0 border-b border-border">

              {/* AO */}
              <GmailRow label="AO">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-40 text-sm">
                    <AppSelect options={aoOptions} value={ao} onChange={setAo} placeholder="Choose AO..." variant="borderless" />
                  </div>
                  <span className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 font-semibold whitespace-nowrap hidden sm:block">
                    BU HEAD auto-copied
                  </span>
                </div>
              </GmailRow>

              {/* To */}
              <GmailRow label="To">
                <div className="flex-1 flex items-center gap-2 min-w-0 text-sm">
                  {selectedCustomer ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral border border-border text-sm font-medium text-text shrink-0 max-w-[240px]">
                      <span className="w-5 h-5 rounded-full bg-accent-1 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {selectedCustomer.name.substring(0, 2).toUpperCase()}
                      </span>
                      <span className="truncate max-w-[150px]">{selectedCustomer.name}</span>
                      <button onClick={() => setSelectedCustomer(null)} className="text-text-info hover:text-danger cursor-pointer shrink-0">
                        <X size={10} />
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setCustomerPickerOpen(true)}
                      className="text-sm text-text-info hover:text-text transition-colors cursor-pointer flex-1 text-left"
                    >
                      Select sales rep...
                    </button>
                  )}
                  {!selectedCustomer && (
                    <button
                      onClick={() => setCustomerPickerOpen(true)}
                      className="text-sm font-semibold text-accent-1 cursor-pointer shrink-0"
                    >
                      Browse
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowCc((v) => !v)}
                  className="text-sm font-semibold text-text-info hover:text-text cursor-pointer ml-3 shrink-0"
                >
                  Cc
                </button>
              </GmailRow>

              {/* CC */}
              {showCc && (
                <GmailRow label="Cc">
                  <input
                    autoFocus
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Add recipients..."
                    className="flex-1 bg-transparent text-sm text-text placeholder:text-text-info/60 outline-none min-w-0"
                  />
                </GmailRow>
              )}

              {/* Subject */}
              <div className="px-4 py-2.5 border-b border-border/40">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full bg-transparent text-sm font-semibold text-text placeholder:text-text-info/50 placeholder:font-normal outline-none"
                />
              </div>

              {/* Details toggle */}
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="w-full px-4 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-info hover:bg-hover/30 transition-colors cursor-pointer text-left"
              >
                <ChevronDown size={11} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                {showDetails ? 'Hide details' : 'Inquiry details (type, supplier, target price, assignee…)'}
              </button>

              {showDetails && (
                <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-3 bg-neutral/20 border-t border-border/30 text-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Inquiry Type</p>
                    <AppSelect options={REQUEST_TYPES} value={requestType} onChange={setRequestType} placeholder="Choose inquiry type" variant="borderless" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Supplier</p>
                    <AppSelect options={supplierOptions} value={supplier} onChange={setSupplier} placeholder="Choose supplier" variant="borderless" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Target Price (USD)</p>
                    <input
                      type="number"
                      step="0.01"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="e.g. 250.00 (optional)"
                      className="w-full bg-transparent py-1 text-sm text-text font-normal placeholder:text-text-info/40 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Est. Quantity</p>
                    <input
                      type="number"
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      placeholder="e.g. 50 (optional)"
                      className="w-full bg-transparent py-1 text-sm text-text font-normal placeholder:text-text-info/40 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Assign To (Buyer)</p>
                    <AppSelect options={buyerOptions} value={assignTo} onChange={setAssignTo} placeholder="Unassigned" variant="borderless" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-text-info font-semibold">Priority</p>
                    <AppSelect options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} placeholder="Choose priority" variant="borderless" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Body ── */}
            <div
              className="flex-1 px-4 py-3 cursor-text overflow-y-auto"
              onClick={() => descRef.current?.focus()}
            >
              <div
                ref={descRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Write your message here..."
                className="min-h-[80px] h-full text-sm text-text leading-[1.8] outline-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-text-info/40 empty:before:pointer-events-none"
              />
            </div>

            {/* ── Attachment chips ── */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-border/40 shrink-0">
                {attachments.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral border border-border text-xs font-medium text-text">
                    <Paperclip size={9} className="text-text-info" />
                    <span className="max-w-[100px] truncate">{f.name}</span>
                    <button onClick={() => setAttachments((p) => p.filter((_, idx) => idx !== i))} className="text-text-info hover:text-danger cursor-pointer">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-1 px-3 py-2.5 border-t border-border/50 bg-background/80 shrink-0">
              <AppButton variant="primary" size="sm" leftIcon={<Send size={12} />} onClick={handleSubmit} loading={submitting}>
                Send
              </AppButton>

              <div className="w-px h-4 bg-border/60 mx-1.5 shrink-0" />

              <ToolbarBtn title="Bold" onClick={() => execCmd('bold')}><Bold size={13} /></ToolbarBtn>
              <ToolbarBtn title="Italic" onClick={() => execCmd('italic')}><Italic size={13} /></ToolbarBtn>
              <ToolbarBtn title="Underline" onClick={() => execCmd('underline')}><Underline size={13} /></ToolbarBtn>

              <div className="w-px h-4 bg-border/60 mx-1 shrink-0" />

              <ToolbarBtn title="List" onClick={() => execCmd('insertUnorderedList')}><List size={13} /></ToolbarBtn>
              <ToolbarBtn title="Link" onClick={() => { const u = prompt('URL:'); if (u) execCmd('createLink', u); }}>
                <Link2 size={13} />
              </ToolbarBtn>

              <div className="w-px h-4 bg-border/60 mx-1 shrink-0" />

              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => setAttachments((p) => [...p, ...Array.from(e.target.files || [])])} />
              <ToolbarBtn title="Attach" onClick={() => fileRef.current?.click()}><Paperclip size={13} /></ToolbarBtn>

              <div className="flex-1" />
              <ToolbarBtn title="Discard" onClick={onClose}><Trash2 size={13} /></ToolbarBtn>
            </div>
          </div>
        )}
      </div>

      {/* Customer picker sub-modal */}
      <CustomerPickerModal
        open={customerPickerOpen}
        onClose={() => setCustomerPickerOpen(false)}
        customers={salesReps}
        selectedCustomer={selectedCustomer}
        onSelect={(c) => setSelectedCustomer(c)}
      />
    </>
  );
}

function GmailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0 px-4 py-2 min-h-[38px]">
      <span className="text-sm text-text-info w-12 shrink-0 font-medium">{label}</span>
      <div className="flex-1 min-w-0 flex items-center">{children}</div>
    </div>
  );
}

function ToolbarBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button title={title} onClick={onClick} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-info hover:bg-hover hover:text-text transition-colors cursor-pointer shrink-0">
      {children}
    </button>
  );
}


