import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/service/api-services/product/product';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModuleService } from '../../../core/service/api-services/module/module';


@Component({
  selector: 'app-module-dialog',
  imports: [SHARED_IMPORTS],
  templateUrl: './module-dialog.html',
  styleUrl: './module-dialog.css',
})
export class ModuleDialogComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
products: any[] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private moduleService: ModuleService,
    private dialogRef: MatDialogRef<ModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isEdit = !!this.data?.id;

    this.form = this.fb.group({
      module_Id: [0],
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
      product_Id: [0, Validators.required]
     });
this.loadProduct();
    if (this.isEdit) {
      
      this.loadModule();
    }
    else{
      this.loadModuleCode();
    }
  }

 loadModuleCode() {
    this.moduleService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  loadProduct() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data;
    });
  }
 loadModule() {
    this.moduleService.getById(this.data.id).subscribe((res: any) => {
      debugger
      this.form.patchValue(res.data);
    });
  }
  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    const request = this.isEdit
      ? this.moduleService.update(payload)
      : this.moduleService.create(payload);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}