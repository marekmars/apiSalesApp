import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'shared-drag-and-drop-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-and-drop-img.component.html',
  styleUrl: './drag-and-drop-img.component.css'
})
export class DragAndDropImgComponent {
  public readonly toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    background: '#4881a0',
    iconColor: 'white',
    color: 'white',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  public limit: number = Number.MAX_SAFE_INTEGER;
  public files: File[] = [];
  public fileDragging: number | null = null;
  public fileDropping: number | null = null;
  public imageUrls: string[] = [];
  @ViewChild('dnd') dnd: ElementRef | undefined;
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() imgUrl = new EventEmitter<string>();
  @Input() set filesAdded(files: File[]) {
    this.files = files;
  }
  @Input() set imageUrlsAdded(imageUrls: string[]) {
    this.imageUrls = imageUrls;
  }
  @Input() set limitFiles(limit: number) {
    this.limit = limit;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (this.dnd)
      this.dnd.nativeElement.classList.add('hover');
    // Add your dragover logic here if needed
  }


  onDragLeave(): void {
    if (this.dnd)
      this.dnd.nativeElement.classList.remove('hover');
    // Add your dragleave logic here if needed
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    let files = event.dataTransfer!.files;
    const maxImages = this.limit - this.imageUrls.length;

    if (maxImages === 0 || files.length > maxImages) {
      (async () => {
        await this.toast.fire({
          icon: 'info',
          title: 'You have reached the maximum limit of files. Please delete some files to add more.',
        })
      })()

      return;
    }
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
  // removeFile(i: number) {
  //   console.log(i);
  //   this.files.splice(i, 1);
  //   this.imgUrl.emit(this.imageUrls[i]);
  //   this.imageUrls.splice(i, 1);
  //   this.emitFiles();
  // }

  removeFile(i: number) {


    if (this.imageUrls.length != this.files.length) {

      console.log("entro ");
      console.log(i + this.imageUrls.length);
    } else {
      this.files.splice(i, 1);
    }
    if (this.imageUrls[i].length < 50) {
      this.imgUrl.emit(this.imageUrls[i]);
    } else {
      this.files.splice(i - this.imageUrls.length, 1);
    }

    this.imageUrls.splice(i, 1);
    this.emitFiles();
  }

  private emitFiles(): void {
    this.filesChanged.emit(this.files);

  }


}
