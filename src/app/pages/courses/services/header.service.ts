import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

interface CourseHeader {
  title: string;
  subtitle?: string;
  bgImg: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private $header: Subject<CourseHeader> = new Subject();
  
  header = this.$header.asObservable();

  constructor() { }

  setHeader(title: string, bgImg: string, subtitle?: string): void {
    this.$header.next({ title, bgImg, subtitle });
    return;
  }
}
