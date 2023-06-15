import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Certification } from '../../models/curriculum.model';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsComponent {

  @Input() certs: Certification[] = [];
  @Input() memberId: number = 0;
}
