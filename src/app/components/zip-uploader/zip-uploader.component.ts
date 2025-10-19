import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { UploadService } from 'src/app/services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-zip-uploader',
  templateUrl: './zip-uploader.component.html',
  styleUrls: ['./zip-uploader.component.scss']
})
export class ZipUploaderComponent {
  isOver = false;
  uploading = false;
  progress = 0;

  constructor(private uploadService: UploadService) { }

  file: File | null = null;
  errorMsg = '';

  get fileName(): string { return this.file?.name ?? ''; }
  get fileSizeMB(): string { return this.file ? (this.file.size / (1024*1024)).toFixed(2) : '0.00'; }

  handleDrop(entries: NgxFileDropEntry[]) {
    this.clearError();
    this.file = null;

    const entry = entries.find(e => e.fileEntry.isFile)?.fileEntry as FileSystemFileEntry | undefined;
    if (!entry) {
      this.errorMsg = 'Envie apenas 1 arquivo .zip (diretórios não são suportados).';
      return;
    }

    entry.file((f: File) => this.trySetFile(f));
  }

  removeFile() {
    this.file = null;
    this.progress = 0;
    this.uploading = false;
    this.clearError();
  }

  upload() {
    if (!this.file || this.uploading) return;

    this.uploading = true;
    this.progress = 0;
    this.clearError();

    this.uploadService.uploadZip(this.file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.progress = 100;
          console.log('Upload concluído:', event.body);
        }
      },
      error: (err) => {
        this.uploading = false;
        this.errorMsg = err.error?.error || 'Erro no upload';
      }
    });
  }


  // --- helpers ---
  private trySetFile(f: File) {
    const nameOk = f.name.toLowerCase().endsWith('.zip');
    const mimeOk = this.isZipMime(f.type);
    if (!nameOk && !mimeOk) {
      this.errorMsg = 'Apenas arquivos .zip são aceitos.';
      return;
    }
    this.file = f;
    this.progress = 0;
    this.uploading = false;
    // void this.upload();
  }

  private isZipMime(type?: string): boolean {
    if (!type) return false;
    return type === 'application/zip'
        || type === 'application/x-zip-compressed'
        || type === 'multipart/x-zip'
        || type === 'application/octet-stream';
  }

  private clearError() { this.errorMsg = ''; }
}
