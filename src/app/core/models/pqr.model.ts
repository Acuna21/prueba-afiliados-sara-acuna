export interface PQR {
  id?: number;
  numeroPQR: string;
  tipoPQR: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';
  nombreAfiliado: string;
  correoContacto: string;
  telefonoContacto: string;
  descripcion: string;
  fechaRecepcion: Date;
  fechaRespuesta?: Date;
  estado: 'Recibido' | 'En trámite' | 'Respondido' | 'Cerrado';
  respuesta?: string;
}

export type TipoPQR = 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';
export type EstadoPQR = 'Recibido' | 'En trámite' | 'Respondido' | 'Cerrado';
