import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared-imports';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'app-select-field',
  imports: [FormErrorComponent, CommonModule, SHARED_IMPORTS],
  templateUrl: './select-field.html',
  styleUrl: './select-field.css',
})
export class SelectFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup;
  @Input() options: any[] = [];
  @Input() optionLabel!: string;
  @Input() optionValue!: string;
  @Input() submitted = false;

}