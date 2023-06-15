import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IxImgComponent } from '@imgix/angular';

@Component({
  selector: 'app-course-certification',
  templateUrl: './course-certification.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCertificationComponent implements OnInit {
  @ViewChild('ix') ixEl: IxImgComponent | undefined;

  @Input() text: string = '';
  @Input('img') set setImg(value: string[]) {
    this.img = value[Math.floor(Math.random() * value.length)];
    this.ixEl?.ngAfterViewInit();
  };

  img: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
