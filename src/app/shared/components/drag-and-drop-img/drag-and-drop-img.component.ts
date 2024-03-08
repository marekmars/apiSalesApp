import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-drag-and-drop-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-and-drop-img.component.html',
  styleUrl: './drag-and-drop-img.component.css'
})
export class DragAndDropImgComponent {

  @ViewChild('dnd') dnd: ElementRef | undefined;
  @Output() filesChanged = new EventEmitter<File[]>();
  @Input() set filesAdded(files: File[]) {
    this.files = files;
  }
  @Input() set imageUrlsAdded(imageUrls: string[]) {
    this.imageUrls = imageUrls;
  }
  @Input() set limitFiles(limit: number){
    this.limit = limit;
  }
  public limit : number = Number.MAX_SAFE_INTEGER;
  public files: File[] = [];
  public fileDragging: number | null = null;
  public fileDropping: number | null = null;
  public imageUrls: string[] = [];
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    // Add your dragover logic here if needed
  }


  onDragLeave(): void {
    // Add your dragleave logic here if needed
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    let files = event.dataTransfer!.files;
    if (files.length > 0) {
      let newFiles = Array.from(files);
      this.files = [...this.files, ...newFiles];

      for (let file of newFiles) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrls.push(e.target!.result as string);
        };
        reader.readAsDataURL(file);
      }

      this.emitFiles();
    }
  }

  dragstart(event: DragEvent, index: number): void {
    this.fileDragging = index;
    event.dataTransfer!.effectAllowed = 'move';
  }

  drop(event: DragEvent, index: number): void {
    event.preventDefault();
    let removed, add;
    let files = [...this.files];
    removed = files.splice(this.fileDragging!, 1);
    files.splice(index, 0, ...removed);
    this.files = files;
    this.emitFiles();
    this.fileDropping = null;
    this.fileDragging = null;
  }

  addFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files) as File[];
      this.files = [...this.files, ...newFiles];
      for (let file of newFiles) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrls.push(e.target!.result as string);
        };
        reader.readAsDataURL(file);
      }
      this.emitFiles();
    }
  }
  removeFile(i: number) {
    this.files.splice(i, 1);
    this.imageUrls.splice(i, 1);
    this.emitFiles();
  }

  private emitFiles(): void {
    this.filesChanged.emit(this.files);
  }


}
