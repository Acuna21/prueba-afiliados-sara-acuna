import { ModuleCard } from '../../core/models/dashboard.model';

export const DASHBOARD_MODULES: ModuleCard[] = [
  {
    id: 'carta-derechos',
    titulo: 'Carta de Derechos y Deberes',
    descripcion: 'Gestiona y consultatus solicitudes de derechos y deberes',
    icono: '📋',
    ruta: '/carta-derechos'
  },
  {
    id: 'certificado',
    titulo: 'Certificado de Afiliación',
    descripcion: 'Descarga tu certificado de afiliación. Válido para trámites y consultas.',
    icono: '📜',
    ruta: '/certificado'
  },
  {
    id: 'portabilidad',
    titulo: 'Solicitud de Portabilidad',
    descripcion: 'Solicita el traslado a otra EPS. Proceso simple en 3 pasos.',
    icono: '🔄',
    ruta: '/portabilidad'
  },
  {
    id: 'pqr',
    titulo: 'PQR Recepcionado',
    descripcion: 'Peticiones, Quejas, Reclamos y Sugerencias. Recibe respuesta a tu consulta.',
    icono: '💬',
    ruta: '/pqr'
  }
];
