import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';


@Component({
  selector: 'app-service-type-dialog',
  imports: [SHARED_IMPORTS],
  templateUrl: './service-type-dialog.html',
  styleUrl: './service-type-dialog.css',
})
export class ServiceTypeDialogComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private serviceTypeservice: ServiceTypeApiService,
    private dialogRef: MatDialogRef<ServiceTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isEdit = !!this.data?.id;

    this.form = this.fb.group({
      st_Id: [0],
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
     });

    if (this.isEdit) {
      this.loadServiceType();
    }
    else{
      this.loadServicetypeCode();
    }
  }

 loadServicetypeCode() {
    this.serviceTypeservice.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  loadServiceType() {
    this.serviceTypeservice.getById(this.data.id).subscribe((res: any) => {
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
      ? this.serviceTypeservice.update(payload)
      : this.serviceTypeservice.create(payload);

    request.subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}