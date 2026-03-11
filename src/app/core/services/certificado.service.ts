import { Injectable, signal } from '@angular/core';
import { Certificado } from '../models/certificado.model';

/**
 * Servicio encargado de gestionar los certificados de afiliación
 */

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  private certificadosSignal = signal<Certificado[]>(this.loadFromStorage());
  private counterSignal = signal<number>(this.loadCounterFromStorage());

  certificados = this.certificadosSignal.asReadonly();
  counter = this.counterSignal.asReadonly();

  private loadFromStorage(): Certificado[] {
    try {
      const data = localStorage.getItem('certificados');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadCounterFromStorage(): number {
    const counter = localStorage.getItem('certificadosCounter');
    return counter ? parseInt(counter, 10) : 0;
  }

  private saveToStorage(): void {
    localStorage.setItem('certificados', JSON.stringify(this.certificadosSignal()));
    localStorage.setItem('certificadosCounter', this.counterSignal().toString());
  }

  private generateNumeroCertificado(): string {
    const counter = this.counterSignal() + 1;
    this.counterSignal.set(counter);
    const year = new Date().getFullYear();
    const numero = String(counter).padStart(3, '0');
    return `CERT-${year}-${numero}`;
  }


  /**
   * Crea un nuevo certificado 
   * 
   * @param cert Datos del certificado sin id, número ni fecha de solicitud.
   * @returns Certificado completo creado.
   */
  create(cert: Omit<Certificado, 'id' | 'numeroCertificado' | 'fechaSolicitud'>): Certificado {
    const newCert: Certificado = {
      ...cert,
      id: this.certificadosSignal().length ? Math.max(...this.certificadosSignal().map(c => c.id || 0)) + 1 : 1,
      numeroCertificado: this.generateNumeroCertificado(),
      fechaSolicitud: new Date()
    };
    this.certificadosSignal.update(certs => [...certs, newCert]);
    this.saveToStorage();
    return newCert;
  }

  getAll(): Certificado[] {
    return this.certificadosSignal();
  }

  getById(id: number): Certificado | undefined {
    return this.certificadosSignal().find(c => c.id === id);
  }

   /**
   * Genera el texto descriptivo del certificado de afiliación.
   * 
   * @param cert Certificado del afiliado.
   * @returns Texto del certificado.
   */
  generateText(cert: Certificado): string {
    return `Se certifica que el señor(a) ${cert.nombreAfiliado} se encuentra afiliado(a) al régimen ${cert.regimenAfiliacion} de la EPS ${cert.eps} con número de documento ${cert.numeroDocumento}.`;
  }
}
