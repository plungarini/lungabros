import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl,
  isCover: boolean;
}

@Directive({
  selector: '[dragNdrop]'
})
export class DragNdropDirective {

  @HostBinding('class') classes = 'transition-all duration-300';

  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  @Input() classesDrag: string[] = [];
  @Input() classesNorm: string[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classes = this.classesDrag.join(' ') + ' transition-all duration-300';
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classes = this.classesNorm.join(' ') + ' transition-all duration-300';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classes = this.classesNorm.join(' ') + ' transition-all duration-300';
  
    let files: FileHandle[] = [];
    if (!evt.dataTransfer) return;
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url, isCover: false });
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
