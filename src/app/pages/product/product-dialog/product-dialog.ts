import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/service/api-services/product/product';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-product-dialog',
  imports: [SHARED_IMPORTS],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
})
export class ProductDialogComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isEdit = !!this.data?.id;

    this.form = this.fb.group({
      prod_Id: [0],
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
      uom: ['PCS', Validators.required],
      unit_Price: [0, [Validators.required, Validators.min(0)]],
      tax_Rate: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true]
    });

    if (this.isEdit) {
      this.loadProduct();
    }
    else{
      this.loadCProductCode();
    }
  }

 loadCProductCode() {
    this.productService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  loadProduct() {
    this.productService.getById(this.data.id).subscribe((res: any) => {
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
      ? this.productService.update(payload)
      : this.productService.create(payload);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}