export interface Portabilidad {
  id?: number;
  nombreAfiliado: string;
  tipoDocumento: 'CC' | 'Pasaporte' | 'CE';
  numeroDocumento: string;
  epsOrigen: string;
  epsDestino: string;
  motivoTraslado: 'Cambio de EPS' | 'Cambio de ciudad' | 'Cambio de empleo' | 'Otro';
  descripcionMotivo?: string;
  fechaSolicitud: Date;
  estado: 'Radicada' | 'En revisión' | 'Aprobada' | 'Negada';
}

export type MotivoTraslado = 'Cambio de EPS' | 'Cambio de ciudad' | 'Cambio de empleo' | 'Otro';
export type EstadoPortabilidad = 'Radicada' | 'En revisión' | 'Aprobada' | 'Negada';

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
