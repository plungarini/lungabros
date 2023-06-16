import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface CourseHeader {
  title: string;
  subtitle?: string;
	bgImg: string;
	description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private $header: Subject<CourseHeader> = new Subject();
  
  header = this.$header.asObservable();

  constructor() { }

  setHeader(opt: CourseHeader): void {
    this.$header.next(opt);
    return;
  }
}
