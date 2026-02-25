import { Component, OnInit, inject } from '@angular/core';
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
export class BpForm implements OnInit {

  private api = inject(BussinessPointApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  isEdit = false;
  id!: number;

  model: any = {
    is_Customer: false,
    is_Seller: false
  };

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.isEdit = true;
      this.id = +paramId;
      this.load();
    }
  }

  load() {
    this.api.getById(this.id).subscribe((res: any) => {
      this.model = res.data ?? res;
    });
  }

  submit(form: any) {

    if (!form.valid) return;

    if (this.isEdit) {
      this.api.update(this.id, this.model).subscribe(() => {
        this.snack.open('Updated successfully', 'OK', { duration: 2000 });
        this.router.navigate(['/dashboard/bp']);
      });
    } else {
      this.api.create(this.model).subscribe(() => {
        this.snack.open('Created successfully', 'OK', { duration: 2000 });
        this.router.navigate(['/dashboard/bp']);
      });
    }
  }
}