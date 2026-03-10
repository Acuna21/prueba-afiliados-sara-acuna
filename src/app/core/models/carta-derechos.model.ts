export interface CartaDerechos {
  id?: number;
  numeroSolicitud: string;
  tipoSolicitud: 'Derecho' | 'Deber' | 'Consulta' | 'Reclamo';
  descripcion: string;
  nombreAfiliado: string;
  numeroDocumento: string;
  fechaSolicitud: Date;
  estado: 'Pendiente' | 'En proceso' | 'Resuelta' | 'Rechazada';
  observaciones?: string;
}

export type TipoSolicitud = 'Derecho' | 'Deber' | 'Consulta' | 'Reclamo';
export type EstadoSolicitud = 'Pendiente' | 'En proceso' | 'Resuelta' | 'Rechazada';
