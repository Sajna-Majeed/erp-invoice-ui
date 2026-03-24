import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { SHARED_IMPORTS } from '../../shared-imports';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'app-number-field',
  standalone: true,
  imports: [
    CommonModule,
    SHARED_IMPORTS,
    InputNumberModule,
    FormErrorComponent
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './number-field.html'
})
export class NumberFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() submitted = false;
  @Input() required = false;

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  @Input() currency?: string;
  @Input() suffix?: string;

  constructor(private controlContainer: ControlContainer) {}

  get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.controlName) ?? null;
  }

}