import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { BussinessPointApiService } from '../../../core/service/api-services/bp/bussiness-point';



@Component({
  selector: 'app-bp-list',
  imports: [SHARED_IMPORTS],
  templateUrl: './bp-list.html',
  styleUrl: './bp-list.css',
})
export class BusinessPartnerListComponent  {

  private api = inject(BussinessPointApiService);
  private snack = inject(MatSnackBar);

  displayedColumns: string[] = [
    'name',
    'contact_Person',
    'email',
    'city',
    'type',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAll().subscribe((res: any) => {
      this.dataSource.data = res.data ?? res;
    });
  }

  delete(id: number) {

    if (!confirm('Delete this business partner?')) return;

    this.api.delete(id).subscribe(() => {
      this.snack.open('Deleted successfully', 'OK', { duration: 2000 });
      this.load();
    });
  }
}