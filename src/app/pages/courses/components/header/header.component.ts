import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IxImgComponent } from '@imgix/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('ix') ixEl: IxImgComponent | undefined;

  @Input() title = '';
  @Input() subtitle = '';
  @Input() set imgPath(value: string) {
    if (!value) return;
    this.img = value;
    setTimeout(() => {
      this.loaded = true;
      this.ixEl?.ngAfterViewInit();
    }, 100);
  };

  loaded = false;
  img = 'stock/header.jpeg';

  constructor() { }

  ngOnInit(): void {
    
  }

}
