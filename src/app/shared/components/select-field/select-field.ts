import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../form-error/form-error';
import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [
    CommonModule,
    SHARED_IMPORTS,
    FormErrorComponent
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './select-field.html'
})
export class SelectFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() options: any[] = [];
  @Input() optionLabel!: string;
  @Input() optionValue!: string;
  @Input() submitted = false;
  @Input() required = false;

@Output() selectionChange = new EventEmitter<any>();

  constructor(private controlContainer: ControlContainer) {}

  get control(): AbstractControl | null {
    return this.controlContainer.control?.get(this.controlName) ?? null;
  }

  onSelectChange(event: any) {
  this.selectionChange.emit(event.value);
}
}