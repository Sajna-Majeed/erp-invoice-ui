import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from '../../form-error/form-error/form-error';
import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, InputTextModule, FormErrorComponent,SHARED_IMPORTS],
  templateUrl: './text-field.html',
    styleUrl: './text-field.css',
})
export class TextFieldComponent {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() form!: FormGroup;
  @Input() submitted = false;

}