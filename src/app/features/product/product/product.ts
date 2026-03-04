import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { NumberFieldComponent } from '../../../shared/components/number-field/number-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    TextFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    CrudTableComponent
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
  providers: [ConfirmationService, MessageService]
})
export class ProductComponent {

  products: any[] = [];
  uoms: any[] = [];

  loading = false;
  isSaving = false;

  productDialog = false;
  dialogTitle = 'Add Product';
  formSubmitted = false;

  form!: FormGroup;

  columns = [
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'uom', header: 'UOM', type: 'text' },
    { field: 'unit_Price', header: 'Price', type: 'currency' },
    { field: 'tax_Rate', header: 'Tax', type: 'text' },
    { field: 'is_Active', header: 'Status', type: 'status' ,sortable:false}
  ];

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUOMs();
  }

  initForm() {
    this.form = this.fb.group({
      prod_Id: [null],
      code: [{ value: '', disabled: true }],
      name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      description: [''],
      uom_Id: [null, Validators.required],
      unit_Price: [0, [Validators.required, Validators.min(0)]],
      tax_Rate: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      is_active: [true]
    });
  }

  loadUOMs() {
    this.loading = true;

    this.productService.getUom().subscribe((res: any) => {
      this.uoms = res.data || [];
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe((res: any) => {

      this.products = (res.data || []).map((p: any) => ({
        ...p,
        uom: this.uoms.find(u => u.uom_Id === p.uom_Id)?.code || 'N/A'
      }));

      this.loading = false;
    });
  }

  loadProductCode() {
    this.productService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('prod_Id')?.value;

      return this.productService
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openCreate() {

    this.form.reset({
      unit_Price: 0,
      tax_Rate: 5,
      is_active: true
    });

    this.dialogTitle = 'Add Product';
    this.productDialog = true;
    this.formSubmitted = false;

    this.loadProductCode();
  }

  openEdit(product: any) {

    this.form.patchValue(product);

    this.dialogTitle = 'Edit Product';
    this.productDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.productDialog = false;
  }

  saveProduct() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.id
      ? this.productService.update(value)
      : this.productService.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.productDialog = false;

        this.loadProducts();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Product updated' : 'Product created'
        });

      },
      error: () => {

        this.isSaving = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });

      }
    });
  }

  delete(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.productService.delete(id).subscribe(() => {

          this.loadProducts();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Product deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change product status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.productService.toggleStatus(id).subscribe(() => {

          this.loadProducts();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Product status updated'
          });

        });

      }
    });
  }

}