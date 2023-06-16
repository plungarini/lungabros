import { Injectable } from '@angular/core';
import { deleteField, Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { assignWith } from 'lodash';
import { take } from 'rxjs';
import {
    Certification,
    Curriculum,
} from 'src/app/pages/about/pages/curriculum/models/curriculum.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';

@Injectable({
  providedIn: 'root',
})
export class CvFormService {
  constructor(private db: FirebaseExtendedService, private router: Router) {}

  async saveCv(
    formCv: Partial<Curriculum>,
    status: 'draft' | 'publish',
    originalCv?: Partial<Curriculum>,
    certs?: Partial<Certification>[],
  ): Promise<void> {
    try {
      const normId = formCv.name?.split(' ').join('-').toLowerCase();
      if (status === 'publish') {
        await this.deleteDraft(normId, false);
        this.db
          .getCol<Certification>(`draft-cv/${normId}/certs`)
          .pipe(take(1))
          .subscribe((certifications) => {
            if (certifications && certifications.length <= 0) return;
            certifications.forEach((c) => {
              this.db.delete(`draft-cv/${normId}/certs/${c.id}`);
            });
          });
      }
      if (!normId) return;

      if (certs && certs.length > 0) {
        this.addCertifications(certs, normId, status);
      }

      formCv.draft =
        status === 'draft'
          ? {
              createdAt:
                formCv.draft?.createdAt || Timestamp.fromDate(new Date()),
              updatedAt: Timestamp.fromDate(new Date()),
            }
          : undefined;
      formCv.createdAt = originalCv?.createdAt;

      const normCourse = () => {
        formCv.stories = formCv.stories?.map((s) => ({ ...s, desc: s.desc.replace(/\n/g, '<br/>')}));
        return assignWith({}, formCv, (_, value) =>
          typeof value == 'undefined' || typeof value == null
            ? deleteField()
            : value
        );
      };

      await this.db.upsert<Curriculum>(
        `${status === 'draft' ? 'draft-cv' : 'cv'}/${normId}`,
        normCourse()
      );

      this.router.navigate(['admin', 'cv']);
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async deleteDraft(id?: string, wRouting: boolean = true): Promise<void> {
    if (!id) return;
    const normId = id.split(' ').join('-').toLowerCase();
    const exists = await this.db.docExists(`draft-cv/${normId}`);
    if (exists) {
      await this.db.delete(`draft-cv/${normId}`);
    }
    if (wRouting) this.router.navigate(['admin', 'cv']);
    return;
  }

  private addCertifications(
    certs: Partial<Certification>[],
    id: string,
    status: 'draft' | 'publish'
  ): void {
    certs.forEach((c) => {
      if (!c.id) return;
      const toDelete = c.id.includes('toDelete');
      const path = `${status === 'draft' ? 'draft-cv' : 'cv'}`;
      if (toDelete) {
        c.id = c.id.replace('toDelete-', '');
        return this.db.delete(`${path}/${id}/certs/${c.id}`);
      }
      const normId = c.id.includes('toCreate') ? this.db.generateId() : c.id;
      c.id = normId;
      return this.db.upsert(`${path}/${id}/certs/${normId}`, c);
    });
  }
}
