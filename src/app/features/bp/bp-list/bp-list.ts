import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { BussinessPointApiService } from '../../../core/service/api-services/bp/bussiness-point';
@Component({
  selector: 'app-bp-list',
  imports: [SHARED_IMPORTS],
  templateUrl: './bp-list.html',
  styleUrl: './bp-list.css',
})
export class BpListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'email', 'mobile', 'type', 'actions'];
  data: any[] = [];

  constructor(
    private service: BussinessPointApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((res: any) => {
      this.data = res.data;
       this.data.forEach((bp: any, index: number) => {
          bp.id = index + 1;
        });
    });
  }

  create() {
    this.router.navigate(['/bp/create']);
  }

  edit(row: any) {
    this.router.navigate(['/bp/edit', row.bp_Id]);
  }

  
 
 delete(id: number) {

  // this.confirm.open({
  //  title: 'Delete Partner',
  //  message: 'Are you sure you want to delete this partner?',
  //   confirmText: 'Yes, Delete',
  //   cancelText: 'Cancel',
  //   color: 'warn'
  // }).subscribe(result => {

  //   if (result) {
  //      this.service.delete(id).subscribe(() => {
  //       this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
  //       this.load();
  //     });
  //     }

  // });
}
}