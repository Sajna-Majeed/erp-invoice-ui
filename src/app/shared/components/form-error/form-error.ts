import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule, MessageModule],
  templateUrl: './form-error.html'
})
export class FormErrorComponent {

  @Input() control!: AbstractControl | null;
  @Input() label = '';
  @Input() show = false;

  get message(): string | null {

    if (!this.control) return null;

    if (!this.control.invalid) return null;

    if (!(this.control.touched || this.show)) return null;

    const errors = this.control.errors;

    if (!errors) return null;

    if (errors['required']) return `${this.label} is required`;
    if (errors['maxlength']) return `${this.label} is too long`;
    if (errors['min']) return `${this.label} cannot be negative`;
    if (errors['max']) return `${this.label} exceeds limit`;
    if (errors['nameExists']) return `${this.label} already exists`;
    if (errors['dateRangeInvalid']) return `Effective To must be after Effective From`;
    return 'Invalid value';
  }
}