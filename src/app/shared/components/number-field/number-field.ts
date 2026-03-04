import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared-imports';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'app-number-field',
  imports: [CommonModule, InputNumberModule,SHARED_IMPORTS,FormErrorComponent],
  templateUrl: './number-field.html',
  styleUrl: './number-field.css',
})
export class NumberFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup;
  @Input() submitted = false;

  @Input() mode: string = 'decimal';
  @Input() currency?: string;
  @Input() suffix?: string;

}