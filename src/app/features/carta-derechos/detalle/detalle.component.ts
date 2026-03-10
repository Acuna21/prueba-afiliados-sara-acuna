import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartaDerechosService } from '../../../core/services/carta-derechos.service';
import { CartaDerechos } from '../../../core/models/carta-derechos.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { BadgeComponent } from '../../../shared/components/badge.component';
import { NavbarComponent } from '../../../shared/components/navbar.component';
import { signal } from '@angular/core';

@Component({
  selector: 'app-detalle-carta',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, NavbarComponent],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleCartaComponent implements OnInit {
  carta = signal<CartaDerechos | null>(null);

  private readonly cartaService = inject(CartaDerechosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const carta = this.cartaService.getById(+params['id']);
        this.carta.set(carta || null);
      }
    });
  }

  onEdit(): void {
    if (this.carta()?.id) {
      this.router.navigate(['/carta-derechos-editar', this.carta()?.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/carta-derechos']);
  }
}
