import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormErrorComponent } from '../form-error/form-error';
import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FormErrorComponent,
    SHARED_IMPORTS
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './text-area.html',
   styleUrl: './text-area.css',
})
export class TextAreaComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() submitted = false;

  constructor(private controlContainer: ControlContainer) {}

  get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.controlName) ?? null;
  }
}