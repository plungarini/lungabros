import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-error-modal-cv',
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
        return 'Breve descrizione';
      case 'contacts.email':
        return 'Indirizzo email';
      case 'contacts.phone':
        return 'Numero di telefono';
      case 'specs.passions':
        return 'Le tue skills lavorative';
      case 'socials.username':
        return 'L\'username di un social';
      case 'birthday':
        return 'Data di nascita';
      case 'specs.memberId':
        return 'Numero membro PADI';
      case 'stories.title':
        return 'Il titolo di una storia';
      case 'stories.desc':
        return 'La descrizione di una storia';
    
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
