import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IxImgComponent } from '@imgix/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('ix') ixEl: IxImgComponent | undefined;

  @Input() align: 'object-center' | 'object-bottom' | 'object-top' | 'object-left' | 'object-right' = 'object-center';

  loaded = false;
  img = 'gallery/instructors.jpg';

  constructor() { }

  ngOnInit(): void {
    
  }

}
