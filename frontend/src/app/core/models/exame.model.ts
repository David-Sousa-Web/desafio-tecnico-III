export enum Modalidade {
  CR = 'CR',
  CT = 'CT',
  DX = 'DX',
  MG = 'MG',
  MR = 'MR',
  NM = 'NM',
  OT = 'OT',
  PT = 'PT',
  RF = 'RF',
  US = 'US',
  XA = 'XA',
}

export const MODALIDADES_OPTIONS = [
  { label: 'CR - Computed Radiography', value: Modalidade.CR },
  { label: 'CT - Computed Tomography', value: Modalidade.CT },
  { label: 'DX - Digital Radiography', value: Modalidade.DX },
  { label: 'MG - Mammography', value: Modalidade.MG },
  { label: 'MR - Magnetic Resonance', value: Modalidade.MR },
  { label: 'NM - Nuclear Medicine', value: Modalidade.NM },
  { label: 'OT - Other', value: Modalidade.OT },
  { label: 'PT - Positron Emission Tomography', value: Modalidade.PT },
  { label: 'RF - Radio Fluoroscopy', value: Modalidade.RF },
  { label: 'US - Ultrasound', value: Modalidade.US },
  { label: 'XA - X-Ray Angiography', value: Modalidade.XA },
];

export interface Exame {
  id: string;
  pacienteId: string;
  modalidade: Modalidade;
  dataExame: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExameDto {
  pacienteId: string;
  modalidade: Modalidade;
  dataExame: string;
  idempotencyKey: string;
}

