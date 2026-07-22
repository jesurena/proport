'use client';

import React, { useState } from 'react';
import { ChevronDown, Send, Trash2, X, Plus, Paperclip } from 'lucide-react';
import { AppAvatar, AppLabel, AppButton } from '@integrated-computer-system/ui-kit';
import { AppSummernoteEditor } from '@/modules/compose/components/AppSummernoteEditor';
import { AppUserSelectModal } from '@/modules/compose/components/AppUserSelectModal';
import { AppAttachmentCard } from '@/components/ui';
import { getUsers } from '@/lib/tickets';
import type { TicketStatus, User } from '@/lib/types';

interface TicketReplyComposerProps {
  sending: boolean;
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  selectedCcUsers: User[];
  setSelectedCcUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onSendReply: (contentText: string, statusAction?: TicketStatus) => void;
  onDiscard: () => void;
  setPreviewFile: (file: any) => void;
}

export function TicketReplyComposer({
  sending,
  attachments,
  setAttachments,
  selectedCcUsers,
  setSelectedCcUsers,
  onSendReply,
  onDiscard,
  setPreviewFile,
}: TicketReplyComposerProps) {
  const [replyText, setReplyText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<number>(0);
  const [ccFocused, setCcFocused] = useState(false);
  const [ccModalOpen, setCcModalOpen] = useState(false);

  const allUsers = getUsers();

  const actions: Array<{ label: string; status?: TicketStatus }> = [
    { label: 'Send', status: undefined },
    { label: 'Send & Mark Answered', status: 'answered' },
    { label: 'Send & Reset', status: 'assigned' },
    { label: 'Send & Close', status: 'closed' },
  ];

  const handleMainSend = () => {
    // Strip HTML tags to check if there is actual content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = replyText;
    const plainText = tempDiv.innerText?.trim() || '';
    
    if (!plainText) return;
    onSendReply(replyText, actions[selectedAction].status);
    setReplyText('');
  };

  const handleDiscardAll = () => {
    setReplyText('');
    setSelectedCcUsers([]);
    onDiscard();
  };

  return (
    <div className="rounded-b-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden flex flex-col">
      
      {/* CC Recipient Row (Styled like ComposeModal) */}
      <div className="flex items-center gap-0 px-4 py-2 border-b border-border/30 bg-neutral/5 min-h-[46px]">
        <AppLabel as="span" variant="label" className="text-xs font-semibold text-text-info uppercase tracking-wider shrink-0 w-12 select-none">
          Cc
        </AppLabel>
        <div className="flex-1 min-w-0 text-sm flex items-center">
          <div
            onClick={() => {
              setCcFocused(true);
              setCcModalOpen(true);
            }}
            className="flex-1 flex flex-wrap items-center gap-1.5 bg-transparent cursor-pointer transition-colors group py-1"
          >
            {selectedCcUsers.length === 0 ? (
              <AppLabel as="span" variant="description" className="text-text-info/50 select-none text-xs">
                Add CC recipients...
              </AppLabel>
            ) : (
              selectedCcUsers.map((user) => {
                const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name.split(' ').map((n) => n[0]).join('')}`;
                return (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral border border-border text-xs font-semibold text-text max-w-[200px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AppAvatar src={avatarUrl} name={user.name} size={16} className="text-[8px] font-bold" />
                    <AppLabel as="span" variant="label" className="truncate text-xs font-semibold">
                      {user.name}
                    </AppLabel>
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
              className="text-xs font-semibold text-accent-1 cursor-pointer shrink-0 group-hover:text-accent-1/80 py-0.5 px-2"
            >
              Browse
            </button>
          </div>
          <AppLabel as="span" variant="info" className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap ml-3 hidden xl:inline-block shrink-0 select-none">
            (Your BU HEAD is automatically copied upon request.)
          </AppLabel>
        </div>
      </div>

      {/* Editor Body (Summernote Editor) */}
      <div className="flex-1 overflow-y-auto">
        <AppSummernoteEditor
          value={replyText}
          onChange={setReplyText}
          placeholder="Write your reply here..."
          height={180}
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
              onRemove={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
              onClick={() => setPreviewFile(f)}
            />
          ))}
        </div>
      )}

      {/* Editor Footer / Actions Row */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 bg-neutral/5">
        <div className="flex items-center gap-3">
          <label className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/60 hover:bg-hover text-text-info hover:text-text cursor-pointer transition-colors shrink-0">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
                }
              }}
            />
            <Paperclip size={14} />
          </label>
        </div>

        {/* Action button split group */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-stretch">
            <AppButton
              variant="primary"
              size="sm"
              leftIcon={!sending && <Send size={12} />}
              onClick={handleMainSend}
              loading={sending}
              disabled={sending}
              className="!bg-[#0B2545] dark:!bg-[#134074] hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 !rounded-l-md !rounded-r-none transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {sending ? 'Sending...' : actions[selectedAction].label}
            </AppButton>
            <AppButton
              variant="primary"
              size="sm"
              onClick={() => !sending && setDropdownOpen(!dropdownOpen)}
              disabled={sending}
              className="!bg-[#0B2545] dark:!bg-[#134074] hover:opacity-95 text-white border-l border-white/20 px-2 !rounded-r-md !rounded-l-none flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronDown size={14} />
            </AppButton>

            {dropdownOpen && (
              <div className="absolute right-0 bottom-full mb-1.5 w-56 bg-card-bg border border-border shadow-lg rounded-lg py-1.5 z-20">
                {actions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAction(idx);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-text hover:bg-hover transition-colors font-medium"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDiscardAll}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-info hover:bg-hover hover:text-text transition-colors cursor-pointer shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>
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
    </div>
  );
}
