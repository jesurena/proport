import { Ticket, Reply, User, BusinessUnit, TicketStatus } from './types';
import { getItem, setItem, STORAGE_KEYS } from './storage';

// ─── Seeding ────────────────────────────────────────────────────────────────

export function ensureSeeded(): void {
  const seeded = getItem<boolean>('proport_seeded_v3', false);
  if (!seeded) {
    setItem(STORAGE_KEYS.TICKETS, []);
    setItem(STORAGE_KEYS.USERS, []);
    setItem(STORAGE_KEYS.BUSINESS_UNITS, []);
    setItem(STORAGE_KEYS.NEXT_TICKET_NUMBER, 1000000);
    setItem('proport_seeded_v3', true);
  }
}

// ─── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  ensureSeeded();
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

// ─── Business Units ─────────────────────────────────────────────────────────

export function getBusinessUnits(): BusinessUnit[] {
  ensureSeeded();
  return getItem<BusinessUnit[]>(STORAGE_KEYS.BUSINESS_UNITS, []);
}

// ─── Tickets ────────────────────────────────────────────────────────────────

export function getTickets(): Ticket[] {
  ensureSeeded();
  return getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function getTicketsByStatus(status: TicketStatus): Ticket[] {
  return getTickets().filter((t) => t.status === status);
}

export function createTicket(data: {
  subject: string;
  description: string;
  priority: Ticket['priority'];
  businessUnitId: string;
  requesterId?: string;
  supplierName?: string;
  targetPrice?: number;
  estimatedQuantity?: number;
  brandType?: string;
  aoId?: string;
  cc?: string[];
  customerName?: string;
  projectName?: string;
  brandName?: string;
  tags?: string[];
}): Ticket {
  const tickets = getTickets();
  const users = getUsers();
  const businessUnits = getBusinessUnits();
  const ticketNumber = getItem<number>(STORAGE_KEYS.NEXT_TICKET_NUMBER, tickets.length + 1);

  const requester = users.find((u) => u.id === (data.requesterId || 'user-1'));
  const bu = businessUnits.find((b) => b.id === data.businessUnitId);
  const aoUser = data.aoId ? users.find((u) => u.id === data.aoId) : undefined;

  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    ticketNumber,
    subject: data.subject,
    description: data.description,
    status: 'unassigned',
    priority: data.priority,
    requesterId: requester?.id || 'user-1',
    requesterName: requester?.name || 'Unknown User',
    businessUnitId: data.businessUnitId,
    businessUnitName: bu?.name || 'Unknown',
    aoId: aoUser?.id,
    aoName: aoUser?.name,
    cc: data.cc,
    createdAt: now,
    updatedAt: now,
    replies: [],
    tags: data.tags || [],
    
    // Pricing Fields
    supplierName: data.supplierName,
    targetPrice: data.targetPrice,
    estimatedQuantity: data.estimatedQuantity,
    brandType: data.brandType,
    customerName: data.customerName,
    projectName: data.projectName,
    brandName: data.brandName,
  };

  tickets.unshift(ticket);
  setItem(STORAGE_KEYS.TICKETS, tickets);
  setItem(STORAGE_KEYS.NEXT_TICKET_NUMBER, ticketNumber + 1);

  return ticket;
}

export function addReply(ticketId: string, data: {
  content: string;
  authorId?: string;
}): Reply | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;

  const users = getUsers();
  const author = users.find((u) => u.id === (data.authorId || 'user-1'));

  const reply: Reply = {
    id: `reply-${Date.now()}`,
    ticketId,
    authorId: author?.id || 'user-1',
    authorName: author?.name || 'Unknown User',
    authorAvatar: author?.avatar,
    content: data.content,
    createdAt: new Date().toISOString(),
  };

  tickets[idx].replies.push(reply);
  tickets[idx].updatedAt = reply.createdAt;
  setItem(STORAGE_KEYS.TICKETS, tickets);

  return reply;
}

export function updateTicketStatus(ticketId: string, status: TicketStatus): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;

  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();

  if (status === 'closed') {
    tickets[idx].closedAt = tickets[idx].updatedAt;
  }

  setItem(STORAGE_KEYS.TICKETS, tickets);
  return tickets[idx];
}

export function updateTicketAssignee(ticketId: string, assigneeId?: string): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;

  if (!assigneeId) {
    tickets[idx].assigneeId = undefined;
    tickets[idx].assigneeName = undefined;
    tickets[idx].status = 'unassigned';
  } else {
    const users = getUsers();
    const ids = assigneeId.split(',').map((id) => id.trim());
    const selectedUsers = users.filter((u) => ids.includes(u.id));
    if (selectedUsers.length === 0) return null;

    tickets[idx].assigneeId = selectedUsers.map((u) => u.id).join(',');
    tickets[idx].assigneeName = selectedUsers.map((u) => u.name).join(', ');
    tickets[idx].status = 'assigned';
  }

  tickets[idx].updatedAt = new Date().toISOString();

  setItem(STORAGE_KEYS.TICKETS, tickets);
  return tickets[idx];
}

export function addTicketTags(ticketId: string, tags: string[]): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;

  const currentTags = tickets[idx].tags || [];
  const newTags = Array.from(new Set([...currentTags, ...tags]));
  tickets[idx].tags = newTags;
  tickets[idx].updatedAt = new Date().toISOString();

  setItem(STORAGE_KEYS.TICKETS, tickets);
  return tickets[idx];
}

export function updateTicketCc(ticketId: string, cc: string[]): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;

  tickets[idx].cc = cc;
  tickets[idx].updatedAt = new Date().toISOString();

  setItem(STORAGE_KEYS.TICKETS, tickets);
  return tickets[idx];
}
