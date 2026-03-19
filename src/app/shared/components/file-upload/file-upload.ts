import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-file-upload',
  standalone: true,
    imports: [ FileUploadModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUploadComponent {

  // 🔹 INPUT (from parent)
  @Input() existingFiles: any[] = [];

  // 🔹 OUTPUT (to parent)
  @Output() filesChanged = new EventEmitter<{
    newFiles: File[],
    deletedFileIds: number[]
  }>();

  // 🔹 INTERNAL STATE
  newFiles: File[] = [];
  deletedFileIds: number[] = [];

  // 🔥 MERGED VIEW
get allFiles() {
  return [
    ...this.existingFiles.map(f => ({
      ...f,
      isExisting: true,
      displayName: f.original_Name
    })),
    ...this.newFiles.map(f => ({
      file: f, // keep original reference
      isExisting: false,
      displayName: f.name
    }))
  ];
}
  // 🔹 SELECT FILES
  onSelect(event: any) {
    console.log(this.allFiles);
    const files = event.files || [];

    for (let i = 0; i < files.length; i++) {
      this.newFiles.push(files[i]);
    }

    this.emitChanges();
  }

  // 🔹 REMOVE FILE
removeFile(file: any, index: number) {

  if (file.isExisting) {
    this.deletedFileIds.push(file.id);
    this.existingFiles = this.existingFiles.filter(f => f.id !== file.id);
  } else {
    this.newFiles = this.newFiles.filter(f => f !== file.file);
  }

  this.emitChanges();
}

  // 🔹 ICON
  getFileIcon(file: any): string {
    const name = file.original_Name || file.name || '';
    const ext = name.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf': return 'pi pi-file-pdf text-red-500';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'pi pi-image text-blue-500';
      case 'xls':
      case 'xlsx': return 'pi pi-file-excel text-green-500';
      case 'doc':
      case 'docx': return 'pi pi-file-word text-blue-700';
      default: return 'pi pi-file';
    }
  }

  // 🔥 EMIT TO PARENT
  emitChanges() {
    this.filesChanged.emit({
      newFiles: this.newFiles,
      deletedFileIds: this.deletedFileIds
    });
  }
}