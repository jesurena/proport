'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppButton, AppAvatar } from '@integrated-computer-system/ui-kit';
import { AppSelect } from '@/components/ui';
import { cn } from '@/components/utils/cn';
import {
  Send, Paperclip, X,
  Minus, Maximize2, ChevronDown, ChevronUp, Trash2, Check, Search, Building2,
} from 'lucide-react';
import { AppUserSelect } from './AppUserSelect';
import { AppUserSelectModal } from './AppUserSelectModal';
import { AppCustomerSelectModal } from './AppCustomerSelectModal';
import { AppSummernoteEditor } from './AppSummernoteEditor';
import { getBrands, type Brand } from '@/lib/brands';
import { createTicket, getBusinessUnits, getUsers } from '@/lib/tickets';
import { getSuppliers } from '@/lib/suppliers';
import type { TicketPriority, User as UserType } from '@/lib/types';

const REQUEST_TYPES = [
  { value: 'cost', label: 'Cost Inquiry' },
  { value: 'demo', label: 'Demo Unit' },
  { value: 'service', label: 'Service Schedule' },
  { value: 'eta', label: 'ETA Inquiry' },
];

const BRAND_TYPE_OPTIONS = [
  { value: 'Focus', label: '⭐ Focus Brand' },
  { value: 'Non Focus', label: '📦 Non-Focus Brand' },
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
  defaultBrandType?: 'Focus' | 'Non Focus';
}

interface SelectOption {
  value: string;
  label: string;
}

export function ComposeModal({ open, onClose, defaultBrandType }: ComposeModalProps) {
  const router = useRouter();
  const businessUnits = getBusinessUnits();
  const allUsers = getUsers();
  const suppliers = getSuppliers();

  const buyers = allUsers.filter((u) => u.role === 'buyer' || u.role === 'admin');
  const salesReps = allUsers.filter((u) => u.role === 'sales');

  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [ao, setAo] = useState('user-1');
  const [selectedCcUsers, setSelectedCcUsers] = useState<UserType[]>([]);
  const [ccModalOpen, setCcModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [supplier, setSupplier] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [brandType, setBrandType] = useState<string>('');
  const [brand, setBrand] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [ccFocused, setCcFocused] = useState(false);
  const [projectFocused, setProjectFocused] = useState(false);
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const buyerOptions = [
    { value: '', label: 'Unassigned' },
    ...buyers.map((e) => ({ value: e.id, label: e.name })),
  ];
  const supplierOptions = suppliers.map((s) => ({ value: s.name, label: s.name }));

  const brandsList = useMemo(() => {
    const allBrands = getBrands();
    if (defaultBrandType) {
      return allBrands.filter((b: Brand) => b.type === defaultBrandType);
    }
    return allBrands;
  }, [defaultBrandType]);

  const brandOptions = useMemo(() => {
    return brandsList.map((b) => ({ value: b.name, label: b.name }));
  }, [brandsList]);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setMinimized(false);
      setAo('user-1'); setSelectedCcUsers([]);
      setRequestType(''); setSupplier(''); setTargetPrice(''); setEstimatedQuantity('');
      setAssignTo(''); setSubject(''); setPriority('medium');
      setBrandType(defaultBrandType || '');
      setBrand('');
      setCustomerName(''); setProjectName(''); setCustomerModalOpen(false);
      setAttachments([]); setShowDetails(false);
      setDescription('');
    }
  }, [open, defaultBrandType]);

  // Dynamic subject auto-builder
  useEffect(() => {
    if (requestType || customerName || brand) {
      const requestLabel = REQUEST_TYPES.find((r) => r.value === requestType)?.label || '';
      let prefix = requestLabel;
      if (requestType === 'cost') {
        prefix = 'RFQ';
      }

      const parts = [];
      if (prefix) {
        parts.push(prefix);
      }

      const custPart = customerName || 'Customer Name';
      const brandPart = `(${brand || 'Brand'})`;
      parts.push(`${custPart}: ${brandPart}`);

      setSubject(parts.join(' - '));
    } else {
      setSubject('');
    }
  }, [requestType, customerName, brand]);

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    // Strip HTML tags to get plain text for the description field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const bodyText = tempDiv.innerText?.trim() || '';
    const ticket = createTicket({
      subject: subject.trim(),
      description: bodyText,
      priority: priority as TicketPriority,
      businessUnitId: businessUnits[0]?.id || '',
      requesterId: ao,
      supplierName: supplier || undefined,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      estimatedQuantity: estimatedQuantity ? parseInt(estimatedQuantity) : undefined,
      brandType: brandType || undefined,
      brandName: brand || undefined,
      aoId: ao || undefined,
      cc: selectedCcUsers.length ? selectedCcUsers.map((u) => u.email) : undefined,
      customerName: customerName.trim() || undefined,
      projectName: projectName.trim() || undefined,
    });
    setSubmitting(false);
    onClose();
    router.push(`/tickets/${ticket.id}`);
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
              <GmailRow label="Ao" labelWidthClass="w-28">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-72 text-sm">
                    <AppUserSelect users={allUsers} value={ao} onChange={setAo} placeholder="Choose AO..." variant="borderless" />
                  </div>
                </div>
              </GmailRow>

              {/* Cc */}
              <GmailRow
                label="Cc"
                showLabel={selectedCcUsers.length > 0 || ccFocused || ccModalOpen}
                labelWidthClass="w-28"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 text-sm">
                  <div
                    onClick={() => {
                      setCcFocused(true);
                      setCcModalOpen(true);
                    }}
                    className="flex-1 flex flex-wrap items-center gap-1.5 bg-transparent cursor-pointer transition-colors group"
                  >
                    {selectedCcUsers.length === 0 ? (
                      <span className="text-text-info/50 select-none">Add CC recipients...</span>
                    ) : (
                      selectedCcUsers.map((user) => {
                        const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name.split(' ').map(n => n[0]).join('')}`;
                        return (
                          <span
                            key={user.id}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral border border-border text-xs font-semibold text-text max-w-[200px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AppAvatar src={avatarUrl} name={user.name} size={16} className="text-[8px] font-bold" />
                            <span className="truncate">{user.name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedCcUsers((prev) => prev.filter((u) => u.id !== user.id))}
                              className="text-text-info hover:text-danger cursor-pointer shrink-0"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        );
                      })
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCcFocused(true);
                        setCcModalOpen(true);
                      }}
                      className="text-xs font-semibold text-accent-1 cursor-pointer shrink-0 group-hover:text-accent-1/80 py-1"
                    >
                      Browse
                    </button>
                  </div>
                  <span className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 font-semibold whitespace-nowrap ml-3 hidden xl:inline-block shrink-0">
                    (Your BU HEAD is automatically copied upon request.)
                  </span>
                </div>
              </GmailRow>

              {/* Customer Row */}
              <GmailRow
                label="Customer"
                showLabel={!!customerName || customerModalOpen}
                labelWidthClass="w-28"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 text-sm">
                  <div
                    onClick={() => setCustomerModalOpen(true)}
                    className="flex-1 flex items-center gap-1.5 bg-transparent cursor-pointer transition-colors group"
                  >
                    {!customerName ? (
                      <span className="text-text-info/50 select-none">Select customer...</span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral border border-border text-xs font-semibold text-text max-w-[480px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Building2 size={11} className="text-text-info shrink-0" />
                        <span className="truncate">{customerName}</span>
                        <button
                          type="button"
                          onClick={() => setCustomerName('')}
                          className="text-text-info hover:text-danger cursor-pointer shrink-0 ml-0.5"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomerModalOpen(true);
                      }}
                      className="text-xs font-semibold text-accent-1 cursor-pointer shrink-0 group-hover:text-accent-1/80 py-1"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </GmailRow>

              {/* Project Row */}
              <GmailRow
                label="Project"
                showLabel={!!projectName || projectFocused}
                labelWidthClass="w-28"
              >
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onFocus={() => setProjectFocused(true)}
                  onBlur={() => setProjectFocused(false)}
                  placeholder={projectName || projectFocused ? "Enter project name..." : "Project"}
                  className="w-full bg-transparent text-sm text-text placeholder:text-text-info/40 outline-none"
                />
              </GmailRow>

              {/* Request Type & Brand split row */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-border border-b border-border">
                {/* Request Type */}
                <div className="flex items-center gap-0 px-4 min-h-[38px] transition-all">
                  <span
                    className={cn(
                      "text-sm text-text-info shrink-0 font-medium transition-all duration-200 overflow-hidden",
                      requestType ? "w-28 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
                    )}
                  >
                    Request Type
                  </span>
                  <div className="flex-1 text-sm">
                    <AppSelect
                      options={REQUEST_TYPES}
                      value={requestType}
                      onChange={setRequestType}
                      placeholder={requestType ? "Please choose request type" : "Request Type"}
                      variant="borderless"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div className="flex items-center gap-0 px-4 py-1.5 min-h-[38px] transition-all md:pl-2">
                  <span
                    className={cn(
                      "text-sm text-text-info shrink-0 font-medium transition-all duration-200 overflow-hidden",
                      brand ? "w-28 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
                    )}
                  >
                    Brand
                  </span>
                  <div className="flex-1 text-sm">
                    <AppSelect
                      options={brandOptions}
                      value={brand}
                      onChange={setBrand}
                      placeholder={brand ? "Choose brand" : "Brand"}
                      variant="borderless"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Row */}
              <GmailRow
                label="Subject"
                showLabel={!!subject || subjectFocused}
                labelWidthClass="w-28"
              >
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setSubjectFocused(true)}
                  onBlur={() => setSubjectFocused(false)}
                  placeholder={subject || subjectFocused ? "Enter subject..." : "Subject"}
                  className="w-full bg-transparent text-sm text-text placeholder:text-text-info/50 placeholder:font-normal outline-none"
                />
              </GmailRow>

            </div>

            {/* ── Body (Summernote Editor) ── */}
            <div className="flex-1 overflow-y-auto">
              <AppSummernoteEditor
                value={description}
                onChange={setDescription}
                placeholder="Write your message here..."
                height={250}
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

            {/* ── Action Bar ── */}
            <div className="flex items-center gap-1 px-3 py-2.5 border-t border-border/50 bg-background/80 shrink-0">
              <AppButton variant="primary" size="sm" leftIcon={<Send size={12} />} onClick={handleSubmit} loading={submitting}>
                Send
              </AppButton>

              <div className="w-px h-4 bg-border/60 mx-1.5 shrink-0" />

              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => setAttachments((p) => [...p, ...Array.from(e.target.files || [])])} />
              <button title="Attach" onClick={() => fileRef.current?.click()} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-info hover:bg-hover hover:text-text transition-colors cursor-pointer shrink-0">
                <Paperclip size={13} />
              </button>

              <div className="flex-1" />
              <button title="Discard" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-info hover:bg-hover hover:text-text transition-colors cursor-pointer shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AppUserSelectModal
        open={ccModalOpen}
        onClose={() => {
          setCcModalOpen(false);
          setCcFocused(false);
        }}
        users={allUsers}
        selectedUsers={selectedCcUsers}
        onSelect={setSelectedCcUsers}
      />

      <AppCustomerSelectModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSelect={setCustomerName}
        initialSearch={customerName}
      />
    </>
  );
}

function GmailRow({
  label,
  children,
  showLabel = true,
  labelWidthClass = 'w-12',
}: {
  label: string;
  children: React.ReactNode;
  showLabel?: boolean;
  labelWidthClass?: string;
}) {
  return (
    <div className="flex items-center gap-0 px-4 py-2 min-h-[38px] transition-all">
      <span
        className={cn(
          "text-sm text-text-info shrink-0 font-medium transition-all duration-200 overflow-hidden",
          showLabel ? cn("opacity-100 mr-2", labelWidthClass) : "w-0 opacity-0 mr-0"
        )}
      >
        {label}
      </span>
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
