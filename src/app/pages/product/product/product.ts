import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, of } from 'rxjs';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './product.html',
  styleUrl: './product.css',
  providers: [ConfirmationService, MessageService],
})
export class ProductComponent {
  products: any[] = [];
  productDialog = false;
  dialogTitle = 'Add Product';
  selectedProduct: any = null;
  formSubmitted: boolean = false;
  form!: FormGroup;
  uoms: any[] = [];
  isSaving = false;
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {}
  ngOnInit() {
    this.initForm();
    this.loadUOMs();
    this.load();
  }
  initForm() {
    this.form = this.fb.group({
      id: [null],
      code: [{ value: '', disabled: true }],
      name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur',
        },
      ],
      description: [''],
      uom_Id: [null, Validators.required],
      unit_Price: [null, [Validators.required, Validators.min(0)]],
      tax_Rate: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      is_active: [true],
    });
  }
  load() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data || [];
      this.products.forEach((p: any) => {
        p.uom = this.uoms.find((u) => u.uom_Id === p.uom_Id)?.code || 'N/A';
      });
    });
  }
  loadUOMs() {
    this.productService.getUom().subscribe((res: any) => {
      this.uoms = res.data || [];
    });
  }
  loadCProductCode() {
    this.productService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }
  get f() {
    return this.form.controls;
  }
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }
  currency = 'INR';
  locale = 'en-IN';
  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['maxlength']) return 'Maximum length exceeded.';
    if (control.errors['min']) return 'Value cannot be negative.';
    if (control.errors['max']) return 'Value exceeds allowed limit.';
    if (control.errors['nameExists']) return 'Product name already exists.';
    return 'Invalid value.';
  }
  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return this.productService
        .checkNameExists(control.value, this.form?.get('id')?.value)
        .pipe(map((res: any) => (res.data ? { nameExists: true } : null)));
    };
  }
  // 🔹 Create
  openCreate() {
    this.form.reset({ unit_Price: 0, tax_Rate: 0, is_active: true });
    this.dialogTitle = 'Add Product';
    this.productDialog = true;
    this.loadCProductCode();
  }
  // 🔹 Edit
  openEdit(product: any) {
    this.form.patchValue(product);
    this.dialogTitle = 'Edit Product';
    this.productDialog = true;
    this.form.get('name')?.updateValueAndValidity();
  }
  hideDialog() {
    this.productDialog = false;
  }
  focusFirstInvalid() {
    const firstInvalidControl: HTMLElement | null = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }
  // 🔹 Save (Create or Update)
  saveProduct() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.focusFirstInvalid();
      return;
    }
    this.isSaving = true;
    const value = this.form.getRawValue();
    const request = value.id
      ? this.productService.update(value)
      : this.productService.create(value);
    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.productDialog = false;
        this.formSubmitted = false;
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Product updated' : 'Product created',
        });
      },
      error: () => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed.',
        });
      },
    });
  }
  // 🔹 Delete
  delete(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.delete(product.id).subscribe(() => {
          this.load();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Product deleted successfully',
          });
        });
      },
    });
  }
  // 🔹 Toggle Status
  toggleStatus(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change product status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.productService.toggleStatus(product.prod_Id).subscribe(() => {
          this.load();
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Product status updated',
          });
        });
      },
    });
  }
}
