import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../core/service/loading-service/loading-service';

@Component({
  selector: 'app-global-spinner',
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './global-spinner.html',
  styleUrl: './global-spinner.css',
})
export class GlobalSpinnerComponent {

   private loadingService = inject(LoadingService);

  loading$ = this.loadingService.loading$;

}