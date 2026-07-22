export type TicketStatus =
  | 'unassigned'
  | 'assigned'
  | 'pending'
  | 'answered'
  | 'closed'
  | 'escalated'
  | 'reassigned'
  | 'bu-approval'
  | 'bu-declined'
  | 'final-approval'
  | 'adel-declined';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'admin' | 'buyer' | 'sales' | 'super_user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
}

export interface Reply {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string; // ISO string
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  assignees?: { id: string; name: string; avatar?: string; email?: string }[];
  brandType?: string;
  requestType?: string;
  businessUnitId: string;
  businessUnitName: string;
  AccountGroup?: string;
  aoId?: string;
  aoName?: string;
  ccUsers?: { id: string; name: string; email: string; avatar?: string }[];
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  closedAt?: string;   // ISO string
  replies: Reply[];
  tags?: string[];
  
  // Custom Price Inquiry Fields
  supplierName?: string;
  targetPrice?: number;
  estimatedQuantity?: number;
  customerName?: string;
  projectName?: string;
  brandName?: string;
}

export const STATUS_META: Record<TicketStatus, { label: string; color: string; chipVariant: string }> = {
  unassigned: { label: 'Unassigned', color: '#71717a', chipVariant: 'unassigned' },
  assigned:   { label: 'Assigned',   color: '#059669', chipVariant: 'assigned' },
  pending:    { label: 'Pending',    color: '#f59e0b', chipVariant: 'pending' },
  answered:   { label: 'Answered',   color: '#0d9488', chipVariant: 'answered' },
  closed:     { label: 'Closed',     color: '#059669', chipVariant: 'closed' },
  escalated:  { label: 'Escalated',  color: '#dc2626', chipVariant: 'escalated' },
  reassigned: { label: 'Reassigned', color: '#4f46e5', chipVariant: 'reassigned' },
  'bu-approval': { label: 'BU Approval', color: '#db2777', chipVariant: 'bu-approval' },
  'bu-declined': { label: 'BU Declined', color: '#dc2626', chipVariant: 'bu-declined' },
  'final-approval': { label: 'Final Approval', color: '#059669', chipVariant: 'final-approval' },
  'adel-declined': { label: 'Declined by Adel', color: '#dc2626', chipVariant: 'adel-declined' },
};

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#6b7280' },
  medium:   { label: 'Medium',   color: '#f59e0b' },
  high:     { label: 'High',     color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' },
};
