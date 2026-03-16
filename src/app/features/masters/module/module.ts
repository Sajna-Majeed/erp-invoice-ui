import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { UserService } from '../../../core/service/model-services/user/user';
import { ModuleService } from '../../../core/service/api-services/module/module';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    TextFieldComponent,
    SelectFieldComponent,
    CrudTableComponent
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './module.html',
  styleUrl: './module.css',
  providers: [ConfirmationService, MessageService]
})
export class ModuleComponent {

  modules: any[] = [];
  products: any[] = [];

  loading = false;
  isSaving = false;

  moduleDialog = false;
  dialogTitle = 'Add Module';
  formSubmitted = false;

  form!: FormGroup;
  company: any = {};
  columns: any[] = [];

  constructor(
    private productService: ProductService,
    private moduleService: ModuleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userservice: UserService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.initForm();
    this.loadProduct();
    this.company = this.userservice.getCompany();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'code', header: 'Code', type: 'text' },
      { field: 'name', header: 'Name', type: 'text' },
      { field: 'description', header: 'Description', type: 'text' },
      { field: 'product', header: 'Product', type: 'text' },
      { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
  }

  initForm() {
    this.form = this.fb.group({
      module_Id: [null],
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
      product_Id: [null, Validators.required]
    });
  }

  loadProduct() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data;
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.moduleService.getAll().subscribe((res: any) => {
      this.modules = res.data;
      this.modules.forEach((module: any, index: number) => {
        module.product = this.products.find((p: any) => p.prod_Id === module.product_Id)?.name || 'N/A';
      });
      this.loading = false;
    });
  }
  loadModuleCode() {
    this.moduleService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }


  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('module_Id')?.value;

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

    this.dialogTitle = 'Add Module';
    this.moduleDialog = true;
    this.formSubmitted = false;

    this.loadModuleCode();
  }

  openEdit(module: any) {

    this.form.patchValue(module);

    this.dialogTitle = 'Edit Module';
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

    const request = value.id
      ? this.productService.update(value)
      : this.productService.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.moduleDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Module updated' : 'Module created'
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
      message: 'Are you sure you want to delete this module?',
      header: 'Delete Module',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.moduleService.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Module deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change module status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.moduleService.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Module status updated'
          });

        });

      }
    });
  }

}