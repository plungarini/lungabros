import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-error-modal-courses',
  templateUrl: './form-error-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorModalComponent implements OnInit {

  @Input() show: boolean = false;
  @Input() invalidInputs: string[] = [];

  @Output() showChange = new EventEmitter<boolean>();
  @Output() saveDraft = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  normPath(str: string): string {
    switch (str) {
      case 'desc':
        return 'Descrizione completa del corso';
      case 'id':
        return 'Lo SLUG del corso è obbligatorio';
      case 'bgImg':
        return 'Imposta un\'immagine di copertina';
      case 'shortDesc':
        return 'Breve descrizione del corso';
      case 'howToCert':
        return 'Come ottenere la tua certificazione';
      case 'gallery':
        return 'Inserisci almeno un paio di immagini';
      case 'howToLearn.eLearning':
        return 'Imparare dall\'eLearning';
      case 'howToLearn.inPerson':
        return 'Imparare con un istruttore';
      case 'specs.foryou':
        return 'Questo corso fa per te se vuoi';
      case 'specs.learnto':
        return 'In questo corso imparerai a';
      case 'specs.specs.time':
        return 'Il tempo totale del corso';
      case 'specs.specs.elearningTime':
        return 'Il tempo richiesto dall\'eLearning';
      case 'specs.specs.pre':
        return 'Prerequisiti del corso';
      case 'category':
        return 'Inserisci un paio di categorie per il corso';
      case 'suggestedCourse':
        return 'Inserisci qualche corso consigliato';
    
      default:
        return '';
    }
  }

  hide(): void {
    this.showChange.emit(false);
  }

  saveAsDraft(): void {
    this.hide();
    this.saveDraft.emit();
  }

}
