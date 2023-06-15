import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Curriculum } from '../../models/curriculum.model';

@Component({
  selector: 'app-short-desc',
  templateUrl: './short-desc.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShortDescComponent implements OnInit {

  @Input() desc: string = '';
  @Input() name: string = '';
  @Input() socials: Curriculum['specs']['socials'] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
