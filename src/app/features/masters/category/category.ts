import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CategoryService } from '../../../core/service/api-services/category/category';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { TextAreaComponent } from "../../../shared/components/text-area/text-area";
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';

@Component({
  selector: 'app-category',
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
  templateUrl: './category.html',
  styleUrl: './category.css',
  providers: [ConfirmationService, MessageService]
})
export class CategoryComponent {

  category: any[] = [];
  servicetypes: any[] = [];

  loading = false;
  isSaving = false;

  categoryDialog = false;
  dialogTitle = 'Add Category';
  formSubmitted = false;

  form!: FormGroup;
  company: any = {};
  columns: any[] = [];

  constructor(
    private service:CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stservice:ServiceTypeApiService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.loadServiceTypes();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'code', header: 'Code', type: 'text' },
      { field: 'name', header: 'Name', type: 'text' },
      { field: 'serviceType', header: 'Service Type', type: 'text' },
     { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      cat_Id: [0],
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
      st_Id: [null, Validators.required],
      is_active: [true]
    });
  }

  loadServiceTypes() {
    this.loading = true;

    this.stservice.getAll().subscribe((res: any) => {
      this.servicetypes = res.data || [];
      this.loadCatgeories();
    });
  }

  loadCatgeories() {
    this.service.getAll().subscribe((res: any) => {

      this.category = res.data || [];

      this.loading = false;
    });
  }

  loadCode() {
    this.service.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('cat_Id')?.value;

      return this.service
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openCreate() {

    this.form.reset({
      unit_Price: 0,
      is_active: true
    });

    this.dialogTitle = 'Add Category';
    this.categoryDialog = true;
    this.formSubmitted = false;

    this.loadCode();
  }

  openEdit(category: any) {

    this.form.patchValue(category);

    this.dialogTitle = 'Edit Category';
    this.categoryDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.categoryDialog = false;
  }

  saveProduct() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.cat_Id
      ? this.service.update(value)
      : this.service.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.categoryDialog = false;

        this.loadCatgeories();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Category updated' : 'Category created'
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
      message: 'Are you sure you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.service.delete(id).subscribe(() => {

          this.loadCatgeories();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Category deleted successfully'
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

        this.service.toggleStatus(id).subscribe(() => {

          this.loadCatgeories();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Category status updated'
          });

        });

      }
    });
  }

}