import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  imports: [CommonModule,MessageModule],
  templateUrl: './form-error.html',
  styleUrl: './form-error.css',
})
export class FormErrorComponent {

  @Input() control!: AbstractControl | null;
  @Input() label: string = '';
  @Input() show: boolean = false;

}