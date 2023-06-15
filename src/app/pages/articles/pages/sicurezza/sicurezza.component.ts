import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './sicurezza.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      a {
        @apply cursor-pointer underline decoration-indigo-400 decoration-wavy;

        &:not(.text-zinc-200) {
          @apply text-indigo-400;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SicurezzaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
