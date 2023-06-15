import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Specs, Story } from '../../models/curriculum.model';

@Component({
  selector: 'app-my-story',
  templateUrl: './my-story.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyStoryComponent implements OnInit {

  @Input() stories: Story[] = [];
  @Input() specs: Specs | undefined;
  @Input() state: 'off' | 'downloading' | 'completed' = 'off';
  @Output() printPdf = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
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

  print(): void {
    if (this.state === 'off')
      this.printPdf.emit();
  }

}
