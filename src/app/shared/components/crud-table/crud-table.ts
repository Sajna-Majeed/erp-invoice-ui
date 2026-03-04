import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-crud-table',
  imports: [CommonModule,SHARED_IMPORTS],
  templateUrl: './crud-table.html',
  styleUrl: './crud-table.css',
})
export class CrudTableComponent {

  @Input() data: any[] = [];
  @Input() columns: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<any>();

}