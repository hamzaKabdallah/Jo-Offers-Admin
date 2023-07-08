import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
  @Input() formDataKey!: string;

  @Output() data: EventEmitter<File> = new EventEmitter();
  public files: NgxFileDropEntry[] = [];
  
  /**
   *
   */
  constructor(
    private http: HttpClient
  ) {
    
  }
  protected dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here access the real file
          console.log(droppedFile.relativePath, file);

          this.data.emit(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
}
