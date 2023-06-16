import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';

@Injectable({
  providedIn: 'root',
})
export class CourseAdminResolver implements Resolve<Partial<Course> | Course | undefined> {
  constructor(private db: FirebaseExtendedService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Partial<Course> | Course | undefined> {
    const id = route.paramMap.get('id');
    const course = this.db
      .getDoc<Partial<Course>>(`draft-courses/${id}`)
      .pipe(
        switchMap((draft) => {
          const normDraft: Partial<Course> = { ...draft, hide: true };          
          return draft
            ? of(normDraft)
            : this.db.getDoc<Course>(`courses/${id}`)
        })
      );
    return course;
  }
}
