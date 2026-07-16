import { getItem, setItem } from './storage';
import type { Brand } from '../modules/brand';

const STORAGE_KEY = 'proport_brands';

const DEFAULT_BRANDS: Brand[] = [
  { id: '1', name: '1CLOUDHUB', type: 'Focus' },
  { id: '2', name: 'ACCUPOWER', type: 'Non Focus' },
  { id: '3', name: 'ACCUTONE', type: 'Non Focus' },
  { id: '4', name: 'ACER', type: 'Focus' },
  { id: '5', name: 'ACS', type: 'Non Focus' },
  { id: '6', name: 'ADAFRUIT', type: 'Non Focus' },
  { id: '7', name: 'ADAPTEC', type: 'Non Focus' },
  { id: '8', name: 'ADATA', type: 'Non Focus' },
];

export function ensureBrandsSeeded(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    setItem(STORAGE_KEY, DEFAULT_BRANDS);
  }
}

export function getBrands(): Brand[] {
  ensureBrandsSeeded();
  return getItem<Brand[]>(STORAGE_KEY, DEFAULT_BRANDS);
}

export function addBrand(name: string, type: 'Focus' | 'Non Focus'): Brand {
  const brands = getBrands();
  const newBrand: Brand = {
    id: String(Date.now()),
    name,
    type,
  };
  const updated = [...brands, newBrand];
  setItem(STORAGE_KEY, updated);

  // Log activity
  logActivity('System', `Added new brand: ${name} (${type})`);

  return newBrand;
}

export function addBrands(items: { name: string; type: 'Focus' | 'Non Focus' }[]): Brand[] {
  const brands = getBrands();
  const newBrands = items.map((item, index) => ({
    id: String(Date.now() + index),
    name: item.name.toUpperCase().trim(),
    type: item.type,
  }));
  const updated = [...brands, ...newBrands];
  setItem(STORAGE_KEY, updated);

  newBrands.forEach(nb => {
    logActivity('System', `Added new brand: ${nb.name} (${nb.type})`);
  });

  return newBrands;
}

export function updateBrand(id: string, name: string, type: 'Focus' | 'Non Focus'): Brand | null {
  const brands = getBrands();
  const idx = brands.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const oldBrand = brands[idx];
  const updatedBrand: Brand = {
    ...oldBrand,
    name,
    type,
  };

  const updated = [...brands];
  updated[idx] = updatedBrand;
  setItem(STORAGE_KEY, updated);

  // Log activity
  logActivity('System', `Updated brand: ${oldBrand.name} -> ${name} (${type})`);

  return updatedBrand;
}

export function deleteBrand(id: string): boolean {
  const brands = getBrands();
  const brandToDelete = brands.find((b) => b.id === id);
  if (!brandToDelete) return false;

  const filtered = brands.filter((b) => b.id !== id);
  setItem(STORAGE_KEY, filtered);

  // Log activity
  logActivity('System', `Deleted brand: ${brandToDelete.name}`);

  return true;
}

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
    // ignore
  }
}
