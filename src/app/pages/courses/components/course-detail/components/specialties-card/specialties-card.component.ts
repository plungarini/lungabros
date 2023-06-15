import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-specialties-card',
  templateUrl: './specialties-card.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialtiesCardComponent implements OnInit {
  @Input() path: string = '';
  @Input() title: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
