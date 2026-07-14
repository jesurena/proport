import { Ticket, User, BusinessUnit } from './types';

// ─── Users ──────────────────────────────────────────────────────────────────

export const SEED_USERS: User[] = [
  { id: 'user-1', name: 'John Dela Cruz',    email: 'jdelacruz@proport.com',  role: 'admin',      department: 'IT' },
  { id: 'user-2', name: 'Maria Santos',       email: 'msantos@proport.com',    role: 'buyer',      department: 'Purchasing' },
  { id: 'user-3', name: 'Rico Mendoza',       email: 'rmendoza@proport.com',   role: 'buyer',      department: 'Purchasing' },
  { id: 'user-4', name: 'Angela Reyes',       email: 'areyes@proport.com',     role: 'sales',     department: 'Human Resources' },
  { id: 'user-5', name: 'Carlos Garcia',      email: 'cgarcia@proport.com',    role: 'sales',     department: 'Finance' },
  { id: 'user-6', name: 'Patricia Lim',       email: 'plim@proport.com',       role: 'sales',     department: 'Operations' },
  { id: 'user-7', name: 'Jose Ramos',         email: 'jramos@proport.com',     role: 'sales',     department: 'Sales' },
  { id: 'user-8', name: 'Diana Torres',       email: 'dtorres@proport.com',     role: 'sales',     department: 'Marketing' },
  { id: 'user-9', name: 'Manuel Villanueva',  email: 'mvillanueva@proport.com', role: 'sales',     department: 'Procurement' },
  { id: 'user-10', name: 'Rosario Cruz',      email: 'rcruz@proport.com',      role: 'sales',     department: 'Legal' },
  { id: 'user-11', name: 'Fernando Aquino',   email: 'faquino@proport.com',   role: 'sales',     department: 'Administration' },
  { id: 'user-12', name: 'Lorna Bautista',    email: 'lbautista@proport.com', role: 'sales',     department: 'Accounting' },
  { id: 'user-13', name: 'Roberto Pascual',   email: 'rpascual@proport.com',   role: 'sales',     department: 'IT' },
  { id: 'user-14', name: 'Cecilia Navarro',   email: 'cnavarro@proport.com',   role: 'sales',     department: 'Logistics' },
  { id: 'user-15', name: 'Armando Flores',    email: 'aflores@proport.com',    role: 'sales',     department: 'Engineering' },
];

// ─── Business Units ─────────────────────────────────────────────────────────

export const SEED_BUSINESS_UNITS: BusinessUnit[] = [
  { id: 'bu-1', name: 'Manila Office', code: 'MNL' },
  { id: 'bu-2', name: 'Cebu Office', code: 'CEB' },
  { id: 'bu-3', name: 'Davao Office', code: 'DVO' },
];

// ─── Helper ─────────────────────────────────────────────────────────────────

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

let ticketIdCounter = 0;
function nextId(): string {
  ticketIdCounter++;
  return `ticket-${ticketIdCounter}`;
}

// ─── Tickets (Inquiries: Price queries, custom quotes, volume discounts) ───

export const SEED_TICKETS: Ticket[] = [
  // ── Unassigned ──
  {
    id: nextId(), ticketNumber: 1,
    subject: 'Price inquiry for 50x Microsoft Office 365 Business Premium licenses',
    description: 'A prospective client is looking to purchase 50 Microsoft O365 Business Premium annual licenses. What is our current distributor cost and what margin can we offer?',
    status: 'unassigned', priority: 'medium',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: hoursAgo(2), updatedAt: hoursAgo(2),
    replies: [],
    supplierName: 'Ingram Micro',
    targetPrice: 22,
    estimatedQuantity: 50,
  },
  {
    id: nextId(), ticketNumber: 2,
    subject: 'Quote request for Cisco Catalyst 9300 switches batch',
    description: 'Need custom distributor pricing from Synnex for 12 units of Cisco Catalyst 9300-48UX-A switches. Client is asking for a volume discount.',
    status: 'unassigned', priority: 'high',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: hoursAgo(5), updatedAt: hoursAgo(5),
    replies: [],
    supplierName: 'Synnex',
    targetPrice: 4500,
    estimatedQuantity: 12,
  },
  // ── Assigned ──
  {
    id: nextId(), ticketNumber: 3,
    subject: 'Volume discount pricing for 100x Lenovo ThinkPad L14',
    description: 'Sales needs a special bid pricing for 100 units of Lenovo ThinkPad L14 Gen 4. Target price from client is $850 per unit. Can we check with Tech Data or Lenovo direct bid team if we can get a special cost of $720?',
    status: 'assigned', priority: 'high',
    requesterId: 'user-8', requesterName: 'Diana Torres',
    assigneeId: 'user-2', assigneeName: 'Maria Santos',
    businessUnitId: 'bu-2', businessUnitName: 'Cebu Office',
    createdAt: daysAgo(1), updatedAt: hoursAgo(8),
    supplierName: 'Tech Data',
    targetPrice: 850,
    estimatedQuantity: 100,
    replies: [
      {
        id: 'reply-1', ticketId: 'ticket-3', authorId: 'user-2', authorName: 'Maria Santos',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
        content: 'Hi Diana, checking this with our Tech Data account manager. I will request a special bid number for this quantity.',
        createdAt: hoursAgo(8),
      },
    ],
  },
  {
    id: nextId(), ticketNumber: 4,
    subject: 'Supplier match request for Palo Alto PA-440 firewalls',
    description: 'Competitor offered PA-440 for $1,200. Can we match or beat this price? Arrow Electronics is currently quoting us $1,050. Let\'s see if we can get a supplier discount.',
    status: 'assigned', priority: 'medium',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    assigneeId: 'user-3', assigneeName: 'Rico Mendoza',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
    supplierName: 'Arrow Electronics',
    targetPrice: 1200,
    estimatedQuantity: 2,
    replies: [],
  },
  // ── Pending ──
  {
    id: nextId(), ticketNumber: 5,
    subject: 'SLA upgrade pricing for government project bid',
    description: 'Special contract pricing inquiry for 3 years 24/7 support SLA. The client requires a package cost rather than standard monthly pricing.',
    status: 'pending', priority: 'high',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    assigneeId: 'user-2', assigneeName: 'Maria Santos',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
    supplierName: 'D&H Distributing',
    targetPrice: 18000,
    estimatedQuantity: 1,
    replies: [
      {
        id: 'reply-2', ticketId: 'ticket-5', authorId: 'user-2', authorName: 'Maria Santos',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
        content: 'Waiting for D&H support desk to send the custom pricing sheet for extended SLAs. They promised it by end of day.',
        createdAt: daysAgo(3),
      },
      {
        id: 'reply-3', ticketId: 'ticket-5', authorId: 'user-7', authorName: 'Jose Ramos',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JR',
        content: 'Thanks Maria. The client wants to review this during our sales presentation on Thursday.',
        createdAt: daysAgo(2),
      },
    ],
  },
  {
    id: nextId(), ticketNumber: 6,
    subject: 'Custom server specs quotation from Synnex',
    description: 'Looking for distributor pricing on a custom HPE ProLiant DL380 server config with 2x Xeon Scalable CPUs and 128GB RAM. Synnex is the preferred supplier.',
    status: 'pending', priority: 'low',
    requesterId: 'user-8', requesterName: 'Diana Torres',
    assigneeId: 'user-3', assigneeName: 'Rico Mendoza',
    businessUnitId: 'bu-2', businessUnitName: 'Cebu Office',
    createdAt: daysAgo(7), updatedAt: daysAgo(4),
    supplierName: 'Synnex',
    targetPrice: 6200,
    estimatedQuantity: 1,
    replies: [
      {
        id: 'reply-4', ticketId: 'ticket-6', authorId: 'user-3', authorName: 'Rico Mendoza',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RM',
        content: 'Hi Diana, HPE quotes take about 48 hours. I\'ve submitted the specs sheet to the Synnex partner portal and am waiting for the official quotation.',
        createdAt: daysAgo(4),
      },
    ],
  },
  // ── Answered ──
  {
    id: nextId(), ticketNumber: 7,
    subject: 'Special pricing on Adobe Creative Cloud renewal for university',
    description: 'We need pricing for 200 annual seats of Adobe Creative Cloud. The target price per seat is $180/year for this education account.',
    status: 'answered', priority: 'medium',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    assigneeId: 'user-2', assigneeName: 'Maria Santos',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
    supplierName: 'Ingram Micro',
    targetPrice: 180,
    estimatedQuantity: 200,
    replies: [
      {
        id: 'reply-5', ticketId: 'ticket-7', authorId: 'user-2', authorName: 'Maria Santos',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
        content: 'Hi Jose, I got Ingram Micro to approve the education pricing at $175 per seat, which beats our target of $180. I\'ve uploaded the formal quote sheet.',
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: nextId(), ticketNumber: 8,
    subject: 'Price check on Fortinet FortiGate-60F firewalls',
    description: 'Check stock status and cost for 5x FortiGate-60F. We need these shipped to Manila by next week.',
    status: 'answered', priority: 'medium',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    assigneeId: 'user-3', assigneeName: 'Rico Mendoza',
    businessUnitId: 'bu-1', businessUnitName: 'Manila Office',
    createdAt: daysAgo(4), updatedAt: daysAgo(2),
    supplierName: 'Arrow Electronics',
    targetPrice: 550,
    estimatedQuantity: 5,
    replies: [
      {
        id: 'reply-6', ticketId: 'ticket-8', authorId: 'user-3', authorName: 'Rico Mendoza',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RM',
        content: 'Arrow has stock ready in Singapore. Unit cost is $520, which is lower than the target. Delivery takes 3-4 working days.',
        createdAt: daysAgo(2),
      },
    ],
  },
  // ── Closed ──
  {
    id: nextId(), ticketNumber: 9,
    subject: 'Urgent price match for Dell Latitude laptops',
    description: 'We need to quote $920 per unit for 15 Dell Latitude 5440 to win the bid. Tech Data standard cost is $950. Can Dell match it?',
    status: 'closed', priority: 'high',
    requesterId: 'user-8', requesterName: 'Diana Torres',
    assigneeId: 'user-2', assigneeName: 'Maria Santos',
    businessUnitId: 'bu-2', businessUnitName: 'Cebu Office',
    createdAt: daysAgo(6), updatedAt: daysAgo(5), closedAt: daysAgo(5),
    supplierName: 'Tech Data',
    targetPrice: 920,
    estimatedQuantity: 15,
    replies: [
      {
        id: 'reply-7', ticketId: 'ticket-9', authorId: 'user-2', authorName: 'Maria Santos',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
        content: 'Dell approved the special pricing for $910. I\'ve updated our systems and generated the quote.',
        createdAt: daysAgo(6),
      },
      {
        id: 'reply-8', ticketId: 'ticket-9', authorId: 'user-8', authorName: 'Diana Torres',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DT',
        content: 'Quote sent and accepted by the client. Thanks for the quick support, closing this ticket.',
        createdAt: daysAgo(5),
      },
    ],
  },
  {
    id: nextId(), ticketNumber: 10,
    subject: 'Supplier discount on HPE storage expansion shelf',
    description: 'Client is adding an expansion shelf to their HPE MSA array. Synnex is asking for project registration details to give extra discount.',
    status: 'closed', priority: 'medium',
    requesterId: 'user-7', requesterName: 'Jose Ramos',
    assigneeId: 'user-3', assigneeName: 'Rico Mendoza',
    businessUnitId: 'bu-3', businessUnitName: 'Davao Office',
    createdAt: daysAgo(10), updatedAt: daysAgo(8), closedAt: daysAgo(8),
    supplierName: 'Synnex',
    targetPrice: 12000,
    estimatedQuantity: 1,
    replies: [
      {
        id: 'reply-9', ticketId: 'ticket-10', authorId: 'user-3', authorName: 'Rico Mendoza',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RM',
        content: 'Synnex approved a 15% discount after project registration. Final price is $11,500. Order has been placed.',
        createdAt: daysAgo(8),
      },
    ],
  },
];

export const INITIAL_NEXT_TICKET_NUMBER = 11;
