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
  selector: 'app-date-field',
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
  templateUrl: './date-field.html'
})
export class DateFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() dateFormat!: string;
  @Input() submitted = false;
  @Input() required = false;
  constructor(private controlContainer: ControlContainer) { }

  get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.controlName) ?? null;
  }
}