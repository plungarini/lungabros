import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {

  transform(value: any[], page: number, itemsPerPage: number): any {
    const perPage = +itemsPerPage;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return [ ...value.slice(start, end) ];
  }

}
