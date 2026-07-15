export interface Customer {
  id: string;
  name: string;
  salesArea: string;
  buAo: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '10029341', name: 'ACW COMPU ADD, INCORPORATED', salesArea: 'CAC 10', buAo: 'CAC - CAC HP ORIG REWARDS' },
  { id: '10029342', name: 'Adaptive Radios Communications Technologies, Inc. (Unit 807 Parkway Corporate Center)', salesArea: 'Prospective Customer', buAo: 'BU5 - CAMILLE KILAKIGA' },
  { id: '10029343', name: 'ADDESSA CORP.', salesArea: 'Prospective Customer', buAo: 'BU12 - LADY LYN DELA CRUZ' },
  { id: '10029344', name: 'Addessa Corporation', salesArea: 'Prospective Customer', buAo: 'BU12 - LADY LYN DELA CRUZ' },
  { id: '10029345', name: 'INTEGRATED COMPUTER SYSTEMS, INC.', salesArea: 'CAC 20', buAo: 'CAC - CAC ENTERPRISE' },
  { id: '10029346', name: 'ABENSON VENTURES INC.', salesArea: 'CAC 10', buAo: 'BU2 - GERALDINE CASTRO' },
  { id: '10029347', name: 'ABOITIZ POWER CORPORATION', salesArea: 'CAC 30', buAo: 'BU10 - JOEL DIAZ' },
  { id: '10029348', name: 'ACCENTURE INC.', salesArea: 'CAC 20', buAo: 'BU3 - MARK ANTHONY' },
  { id: '10029349', name: 'Acesite (Phils.) Hotel Corporation', salesArea: 'Prospective Customer', buAo: 'BU8 - MARIA CLARA' },
  { id: '10029350', name: 'ALASKA MILK CORPORATION', salesArea: 'CAC 10', buAo: 'BU5 - CAMILLE KILAKIGA' },
  { id: '10029351', name: 'ALLIANCE GLOBAL GROUP, INC.', salesArea: 'CAC 10', buAo: 'BU5 - CAMILLE KILAKIGA' },
  { id: '10029352', name: 'Globe Telecom, Inc.', salesArea: 'CAC 30', buAo: 'BU3 - MARK ANTHONY' },
  { id: '10029353', name: 'SM Prime Holdings, Inc.', salesArea: 'CAC 10', buAo: 'BU5 - CAMILLE KILAKIGA' },
  { id: '10029354', name: 'ABS-CBN CORPORATION', salesArea: 'CAC 10', buAo: 'BU2 - GERALDINE CASTRO' },
];

export function getCustomers(): Customer[] {
  return MOCK_CUSTOMERS;
}
