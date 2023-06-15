import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Curriculum } from '../../models/curriculum.model';



@Component({
  templateUrl: './pdf.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfComponent implements AfterViewInit {
  @Output() public loaded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('cv') cvElement: ElementRef<HTMLDivElement> | undefined;
  cvElementLoaded = false;

  @Input('curriculum') set setCurriculum(value: Curriculum | undefined) {
    if (!value) return;
    this.curriculum = value;
    this.cdRef.detectChanges();
    if (this.cvElementLoaded) this.loaded.emit();
  };

  visible = false;
  curriculum: Curriculum | undefined;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (this.cvElement?.nativeElement) {
      console.log('Preparing view to print...');
      this.cvElementLoaded = true;
      if (!this.curriculum) return;
      this.loaded.emit();
    }
  }

  normMonth(id: number): string {
    switch (id) {
      case 0:
        return 'Gennaio, ';
      case 1:
        return 'Febbraio, ';
      case 2:
        return 'Marzo, ';
      case 3:
        return 'Aprile, ';
      case 4:
        return 'Maggio, ';
      case 5:
        return 'Giugno, ';
      case 6:
        return 'Luglio, ';
      case 7:
        return 'Agosto, ';
      case 8:
        return 'Settembre, ';
      case 9:
        return 'Ottobre, ';
      case 10:
        return 'Novembre, ';
      case 11:
        return 'Dicembre, ';
    
      default:
        return '';
    }
  }

  normLangText(id: number): string {
    switch (id) {
      case 1:
        return 'Madrelingua';
      case 2:
        return 'Conoscenza professionale';
      case 3:
        return 'Colloquiale';
      case 4:
        return 'Livello iniziale';
    
      default:
        return 'Livello iniziale';
    }
  }

  normSocial(id: string): string {
    switch (id) {
      case 'ig':
        return 'Instagram';
      case 'in':
        return 'Linkedin';
      case 'fb':
        return 'Facebook';
      case 'tw':
        return 'Twitter';
    
      default:
        return '';
    }
  }

}
