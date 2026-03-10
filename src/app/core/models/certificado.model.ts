export interface Certificado {
  id?: number;
  nombreAfiliado: string;
  tipoDocumento: 'CC' | 'Pasaporte' | 'CE';
  numeroDocumento: string;
  fechaNacimiento: Date;
  regimenAfiliacion: 'Contributivo' | 'Subsidiado' | 'Especial';
  eps: string;
  fechaSolicitud: Date;
  numeroCertificado: string;
}

export type TipoDocumento = 'CC' | 'Pasaporte' | 'CE';
export type RegimenAfiliacion = 'Contributivo' | 'Subsidiado' | 'Especial';

export const EPS_LIST = [
  'Nueva EPS',
  'Sanitas',
  'Compensar',
  'Sura',
  'Coomeva',
  'Famisanar',
  'SOS',
  'Medimás',
  'Aliansalud'
];
