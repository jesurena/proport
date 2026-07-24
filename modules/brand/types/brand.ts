export type BrandType = 'Focus' | 'Non Focus';

export interface BrandAssignee {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  type: BrandType;
  defaultAssignee?: string;
  assignees?: BrandAssignee[];
}
