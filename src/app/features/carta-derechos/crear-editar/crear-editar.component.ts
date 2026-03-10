import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartaDerechosService } from '../../../core/services/carta-derechos.service';
import { CartaDerechos, TipoSolicitud, EstadoSolicitud } from '../../../core/models/carta-derechos.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { NavbarComponent } from '../../../shared/components/navbar.component';

@Component({
  selector: 'app-crear-editar-carta',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, NavbarComponent],
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.scss']
})
export class CrearEditarCartaComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  cartaId: number | null = null;
  tipos: TipoSolicitud[] = ['Derecho', 'Deber', 'Consulta', 'Reclamo'];
  estados: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelta', 'Rechazada'];

  private readonly cartaService = inject(CartaDerechosService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  constructor() {
    this.form = new FormGroup({
      tipoSolicitud: new FormControl('Derecho', Validators.required),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
      nombreAfiliado: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,12}$/)]),
      estado: new FormControl('Pendiente', Validators.required),
      observaciones: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.cartaId = +params['id'];
        this.loadCarta();
      }
    });
  }

  loadCarta(): void {
    if (this.cartaId) {
      const carta = this.cartaService.getById(this.cartaId);
      if (carta) {
        this.form.patchValue(carta);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEditing && this.cartaId) {
      this.cartaService.update(this.cartaId, formValue);
    } else {
      this.cartaService.create(formValue as Omit<CartaDerechos, 'id' | 'numeroSolicitud' | 'fechaSolicitud'>);
    }

    this.router.navigate(['/carta-derechos']);
  }

  onCancel(): void {
    this.router.navigate(['/carta-derechos']);
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get numeroDocumento() {
    return this.form.get('numeroDocumento');
  }
}
