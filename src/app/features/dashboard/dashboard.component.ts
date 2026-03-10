import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { interval, Subscription, startWith } from 'rxjs';
import { DASHBOARD_MODULES } from './dashboard.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDateTime = signal<Date>(new Date());
  private dateUpdateSubscription: Subscription | null = null;

  modules = DASHBOARD_MODULES;

  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.dateUpdateSubscription = interval(60000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.currentDateTime.set(new Date());
      });
  }

  ngOnDestroy(): void {
    if (this.dateUpdateSubscription) {
      this.dateUpdateSubscription.unsubscribe();
    }
  }

  goToModule(ruta: string): void {
    this.router.navigate([ruta]);
  }

  get formattedDate(): string {
    const date = this.currentDateTime();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleDateString('es-CO', options);
  }
}
