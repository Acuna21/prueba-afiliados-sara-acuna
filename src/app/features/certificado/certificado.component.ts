import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal, computed } from '@angular/core';
import { CertificadoService } from '../../core/services/certificado.service';
import { Certificado, EPS_LIST } from '../../core/models/certificado.model';
import { ButtonComponent } from '../../shared/components/button.component';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { fechaNacimientoValidator } from './fechaValidators';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, NavbarComponent],
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.scss']
})
export class CertificadoComponent implements OnInit {
  form: FormGroup;
  certificados = signal<Certificado[]>([]);
  selectedCertificado = signal<Certificado | null>(null);
  certificadoText = computed(() => {
    const cert = this.selectedCertificado();
    return cert ? this.certificadoService.generateText(cert) : '';
  });

  showForm = signal(true);
  isLoading = signal(false);
  successMessage = signal('');

  today = this.getToday();

  regimenes = ['Contributivo', 'Subsidiado', 'Vinculado', 'Excepcional'];
  epsList = EPS_LIST;

  constructor(
    private fb: FormBuilder,
    private certificadoService: CertificadoService
  ) {
    this.form = this.fb.group({
      nombreAfiliado: ['', [Validators.required, Validators.minLength(3)]],
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      fechaNacimiento: ['',[Validators.required, fechaNacimientoValidator]],
      regimenAfiliacion: ['Contributivo', Validators.required],
      eps: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCertificados();
  }

  loadCertificados(): void {
    this.certificados.set(this.certificadoService.getAll());
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    
    setTimeout(() => {
      const formValue = this.form.value;
      const newCert = this.certificadoService.create({
        nombreAfiliado: formValue.nombreAfiliado,
        tipoDocumento: formValue.tipoDocumento,
        numeroDocumento: formValue.numeroDocumento,
        fechaNacimiento: new Date(formValue.fechaNacimiento),
        regimenAfiliacion: formValue.regimenAfiliacion,
        eps: formValue.eps
      });

      this.certificados.set(this.certificadoService.getAll());
      this.selectedCertificado.set(newCert);
      this.showForm.set(false);
      this.isLoading.set(false);
      this.successMessage.set(`Certificado ${newCert.numeroCertificado} generado exitosamente`);
      
      setTimeout(() => this.successMessage.set(''), 3000);
    }, 1000);
  }

  onDownload(): void {
    const cert = this.selectedCertificado();
    if (!cert) return;

    const text = this.certificadoText();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `Certificado-${cert.numeroCertificado}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onPrint(): void {
    const cert = this.selectedCertificado();
    if (!cert) return;

    const printWindow = window.open('', '', 'height=400,width=800');
    const printContent = `
      <html>
        <head>
          <title>Certificado ${cert.numeroCertificado}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .certificate { 
              border: 2px solid #4F46E5; 
              padding: 30px; 
              border-radius: 10px;
              background-color: #F9FAFB;
            }
            .certificate h2 { color: #4F46E5; }
            .info { margin: 15px 0; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <h1>CERTIFICADO DE AFILIACIÓN</h1>
              <p><strong>${cert.numeroCertificado}</strong></p>
            </div>
            
            <div class="info">
              <p>${this.certificadoText()}</p>
            </div>

            <div class="info">
              <strong>Datos del Afiliado:</strong>
              <p>
                Nombre: ${cert.nombreAfiliado}<br/>
                Tipo de Documento: ${cert.tipoDocumento}<br/>
                Número de Documento: ${cert.numeroDocumento}<br/>
                Fecha de Nacimiento: ${cert.fechaNacimiento instanceof Date ? cert.fechaNacimiento.toLocaleDateString() : cert.fechaNacimiento}<br/>
                Régimen: ${cert.regimenAfiliacion}<br/>
                EPS: ${cert.eps}
              </p>
            </div>

            <div class="info">
              <strong>Detalles del Certificado:</strong>
              <p>
                Fecha de Solicitud: ${cert.fechaSolicitud instanceof Date ? cert.fechaSolicitud.toLocaleDateString() : cert.fechaSolicitud}
              </p>
            </div>

            <div class="footer">
              <p>Este certificado se genera automáticamente por el Portal de Afiliados</p>
              <p>Válido sin firma digital</p>
            </div>
          </div>
        </body>
      </html>
    `;
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  }

  onNewCertificate(): void {
    this.form.reset({
      regimenAfiliacion: 'Contributivo',
      tipoDocumento: 'CC'
    });
    this.showForm.set(true);
    this.selectedCertificado.set(null);
    this.successMessage.set('');
  }

  selectCertificado(cert: Certificado): void {
    this.selectedCertificado.set(cert);
    this.showForm.set(false);
  }

  get nombreAfiliado() {
    return this.form.get('nombreAfiliado');
  }

  get numeroDocumento() {
    return this.form.get('numeroDocumento');
  }

  get fechaNacimiento() {
    return this.form.get('fechaNacimiento');
  }

  private getToday(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60000);
    
    return localDate.toISOString().split('T')[0];
  }
}
