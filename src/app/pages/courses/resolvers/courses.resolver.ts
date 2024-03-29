import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	RouterStateSnapshot
} from '@angular/router';
import { Observable, take } from 'rxjs';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { PersonalMetaTagsService } from 'src/app/shared/services/personal-meta-tags.service';
import { Course } from '../../../shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesResolver implements Resolve<Course | undefined> {

	constructor(
		private db: FirebaseExtendedService,
		private meta: PersonalMetaTagsService,
	) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course | undefined> {
    const id = route.paramMap.get('id');
		const course = this.db.getDoc<Course>(`courses/${id}`).pipe(take(1));
    return course;
  }
}
