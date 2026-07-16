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
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  brandType?: string;
  requestType?: string;
  businessUnitId: string;
  businessUnitName: string;
  aoId?: string;
  aoName?: string;
  cc?: string[];
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
  unassigned: { label: 'Unassigned', color: '#8b8b8b', chipVariant: 'unassigned' },
  assigned:   { label: 'Assigned',   color: '#3b82f6', chipVariant: 'assigned' },
  pending:    { label: 'Pending',    color: '#f59e0b', chipVariant: 'pending' },
  answered:   { label: 'Answered',   color: '#10b981', chipVariant: 'answered' },
  closed:     { label: 'Closed',     color: '#6b7280', chipVariant: 'closed' },
  escalated:  { label: 'Escalated',  color: '#ef4444', chipVariant: 'escalated' },
  reassigned: { label: 'Reassigned', color: '#8b5cf6', chipVariant: 'reassigned' },
  'bu-approval': { label: 'BU Approval', color: '#ec4899', chipVariant: 'bu-approval' },
  'bu-declined': { label: 'BU Declined', color: '#ef4444', chipVariant: 'bu-declined' },
  'final-approval': { label: 'Final Approval', color: '#10b981', chipVariant: 'final-approval' },
  'adel-declined': { label: 'Declined by Adel', color: '#ef4444', chipVariant: 'adel-declined' },
};

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#6b7280' },
  medium:   { label: 'Medium',   color: '#f59e0b' },
  high:     { label: 'High',     color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' },
};
