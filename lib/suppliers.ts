import { getItem, setItem } from './storage';

export interface Supplier {
  id: string;
  name: string;
  typeId: number; // 1 = Hardware/Systems, 2 = Software/Cloud
  typeName: string;
}

const STORAGE_KEY = 'proport_suppliers';

const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Ingram Micro', typeId: 2, typeName: 'Software/Cloud' },
  { id: '2', name: 'Tech Data', typeId: 1, typeName: 'Hardware/Systems' },
  { id: '3', name: 'Synnex', typeId: 1, typeName: 'Hardware/Systems' },
  { id: '4', name: 'Arrow Electronics', typeId: 2, typeName: 'Software/Cloud' },
  { id: '5', name: 'D&H Distributing', typeId: 1, typeName: 'Hardware/Systems' },
];

export function ensureSuppliersSeeded(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    setItem(STORAGE_KEY, DEFAULT_SUPPLIERS);
  }
}

export function getSuppliers(): Supplier[] {
  ensureSuppliersSeeded();
  return getItem<Supplier[]>(STORAGE_KEY, DEFAULT_SUPPLIERS);
}

export function addSupplier(name: string, typeId: number): Supplier {
  const suppliers = getSuppliers();
  const newSupplier: Supplier = {
    id: String(Date.now()),
    name,
    typeId,
    typeName: typeId === 1 ? 'Hardware/Systems' : 'Software/Cloud',
  };
  const updated = [...suppliers, newSupplier];
  setItem(STORAGE_KEY, updated);
  
  // Log activity
  logActivity('System', `Added new supplier: ${name}`);
  
  return newSupplier;
}

export function updateSupplier(id: string, name: string, typeId: number): Supplier | null {
  const suppliers = getSuppliers();
  const idx = suppliers.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const oldSupplier = suppliers[idx];
  const updatedSupplier: Supplier = {
    ...oldSupplier,
    name,
    typeId,
    typeName: typeId === 1 ? 'Hardware/Systems' : 'Software/Cloud',
  };
  
  const updated = [...suppliers];
  updated[idx] = updatedSupplier;
  setItem(STORAGE_KEY, updated);
  
  // Log activity
  logActivity('System', `Updated supplier: ${oldSupplier.name} -> ${name}`);
  
  return updatedSupplier;
}

export function deleteSupplier(id: string): boolean {
  const suppliers = getSuppliers();
  const supplierToDelete = suppliers.find((b) => b.id === id);
  if (!supplierToDelete) return false;

  const filtered = suppliers.filter((b) => b.id !== id);
  setItem(STORAGE_KEY, filtered);
  
  // Log activity
  logActivity('System', `Deleted supplier: ${supplierToDelete.name}`);
  
  return true;
}

// Simple internal helper to log actions to user logs dynamically
function logActivity(module: string, activity: string) {
  try {
    const logsKey = 'tcd_user_logs';
    const raw = localStorage.getItem(logsKey);
    const logs = raw ? JSON.parse(raw) : [];
    const newLog = {
      id: String(Date.now() + Math.random()),
      name: 'John Dela Cruz',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
      module,
      activity,
      dateTime: new Date().toISOString(),
    };
    localStorage.setItem(logsKey, JSON.stringify([newLog, ...logs].slice(0, 150)));
  } catch (e) {
    // ignore logging errors
  }
}
