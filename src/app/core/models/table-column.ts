export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'currency' | 'status' | 'badge' | 'custom' | 'number'| 'tax';
  sortable?: boolean;
}