import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { BussinessPointApiService } from '../../../../core/service/api-services/bp/bussiness-point';

@Component({
  selector: 'app-bp-form',
  imports: [SHARED_IMPORTS],
  templateUrl: './bp-form.html',
  styleUrl: './bp-form.css',
})
export class BpFormComponent implements OnInit {

  isEdit = false;
  id!: number;
  form!: any;

  constructor(
    private fb: FormBuilder,
    private service: BussinessPointApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.form = this.fb.group({
      bp_Id:0,
      // Basic Info
      name: ['', Validators.required],
      contact_Person: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_Number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],

      // Identifiers
      e_Identifier: [''],
      legal_Reg_Identifier: [''],
      legal_Reg_Type: [''],
      tax_Identifier: [''],
      tax_Scheme_Code: [''],

      // Address
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      country_Subdivision: [''],
      country: ['', Validators.required],

      // Type
      is_Seller: [false],
      is_Customer: [false]
    });
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.id = +id;
      this.load();
    }
  }

  load() {
    this.service.getById(this.id).subscribe((res: any) => {
       res.data.mobile_Number = res.data.mobile_No; // Map mobile_Number to mobile for display
      this.form.patchValue(res.data);
    });
  }

  save() {
    if (this.form.invalid) return;
    if (!this.form.value.is_Seller && !this.form.value.is_Customer) {
      this.snackBar.open(
        'Partner must be Seller, Customer, or both',
        'Close',
        { duration: 3000 }
      );
      return;
    }
    const action = this.isEdit
      ? this.service.update( this.form.value)
      : this.service.create(this.form.value);

    action.subscribe(() => {
      this.snackBar.open('Saved successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/bp']);
    });
  }
}