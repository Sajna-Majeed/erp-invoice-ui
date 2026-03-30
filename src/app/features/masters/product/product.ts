import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CategoryService } from '../../../core/service/api-services/category/category';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { ProductService } from '../../../core/service/api-services/product/product';
import { TextAreaComponent } from "../../../shared/components/text-area/text-area";

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    TextFieldComponent,
    SelectFieldComponent,
    CrudTableComponent,
    TextAreaComponent
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
  categories: any[] = [];

  loading = false;
  isSaving = false;

  moduleDialog = false;
  dialogTitle = 'Add Product';
  formSubmitted = false;

  isALF:boolean=false;
  form!: FormGroup;
  company: any = {};
  columns: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private service: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.initForm();
    this.loadCategory();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'code', header: 'Code', type: 'text' },
      { field: 'name', header: 'Name', type: 'text' },
      // { field: 'category', header: 'Category', type: 'text' },
      { field: 'description', header: `Description`, type: 'text' },
      { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
  }

  initForm() {
    this.form = this.fb.group({
      pd_Id: [null],
      code: [{ value: ''}],
      name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      description: [''],
      cat_Id: [null, Validators.required]
    });
  }

  loadCategory() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data;
      this.loadProduct();
    });
  }

  loadProduct() {
    this.loading = true;
    this.service.getAll().subscribe((res: any) => {
      this.products = res.data;
      this.products.forEach((product: any, index: number) => {
        product.category = this.categories.find((c: any) => c.cat_Id === product.cat_Id)?.name || 'N/A';
      });
      this.loading = false;
    });
  }

  loadProductCode() {
    this.service.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }


  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('pd_Id')?.value;

      return this.service
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openCreate() {

    this.form.reset({
      unit_Rate: 0,
      alf_Rate: 0,
      is_active: true
    });

    this.dialogTitle = 'Add Product';
    this.moduleDialog = true;
    this.formSubmitted = false;

    this.loadProductCode();
  }


  openEdit(module: any) {

    this.form.patchValue(module);

    this.dialogTitle = 'Edit Product';
    this.moduleDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.moduleDialog = false;
  }

  saveModule() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.pd_Id
      ? this.service.update(value)
      : this.service.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.moduleDialog = false;

        this.loadProduct();

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
      message: 'Are you sure you want to delete this Licese Type?',
      header: 'Delete Licese Type',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.delete(id).subscribe(() => {

          this.loadProduct();

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
      message: 'Are you sure you want to change Product status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.service.toggleStatus(id).subscribe(() => {

          this.loadProduct();

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