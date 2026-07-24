export type BrandType = 'Focus' | 'Non Focus';

export interface Brand {
  id: string;
  name: string;
  type: BrandType;
  defaultAssignee?: string;
}
