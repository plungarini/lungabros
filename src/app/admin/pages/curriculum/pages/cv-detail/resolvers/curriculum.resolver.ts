import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import {
    Certification,
    Curriculum,
} from 'src/app/pages/about/pages/curriculum/models/curriculum.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';

@Injectable({
  providedIn: 'root',
})
export class CurriculumResolver
  implements Resolve<Partial<Curriculum> | Curriculum | undefined>
{
  constructor(private db: FirebaseExtendedService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Partial<Curriculum> | Curriculum | undefined> {
    const id = route.paramMap.get('id');
    const cv = this.db.getCol<Certification>(`draft-cv/${id}/certs`).pipe(
      switchMap((certDraft) => {
        return certDraft.length > 0
          ? of(certDraft)
          : this.db.getCol<Certification>(`cv/${id}/certs`);
      }),
      switchMap((certDraft) => {
        return this.db.getDoc<Partial<Curriculum>>(`draft-cv/${id}`).pipe(
          switchMap((draft) => {
            const normCv: Partial<Curriculum> = { ...draft, certs: certDraft };
            return draft
              ? of(normCv)
              : this.db.getDoc<Curriculum>(`cv/${id}`).pipe(
                  switchMap((curriculum) => {
                    const normCurriculum: Partial<Curriculum> = {
                      ...curriculum,
                      certs: certDraft,
                    };
                    return of(normCurriculum);
                  }),
                );
          })
        );
      })
    );
    return cv;
  }
}
