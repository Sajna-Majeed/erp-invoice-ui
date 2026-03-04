export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'currency' | 'status' | 'badge' | 'custom';
  sortable?: boolean;
}