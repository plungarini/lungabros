import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {

  @Input() itemsCount = 0;
  @Input() itemsPerPage = 9;
  @Input() currentPage = 1;
  @Output() changePage = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  get pagesArray(): number[] {
    return Array.from(Array(Math.ceil(this.itemsCount / this.itemsPerPage)).keys()).map((i) => i+1);
  }

  get isLastPage(): boolean {
    return this.pagesArray[this.pagesArray.length - 1] === this.currentPage;
  }

  onChangePage(page: number): void {
    this.changePage.emit(page);
  }

}
