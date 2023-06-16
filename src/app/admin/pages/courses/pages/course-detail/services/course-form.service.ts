import { Injectable } from '@angular/core';
import { Timestamp, deleteField } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { assignWith } from 'lodash';
import { Course } from 'src/app/shared/models/course.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { FileHandle } from '../pipes/drag-ndrop.directive';
import { ImageUploadService } from './image-upload.service';

@Injectable({
  providedIn: 'root',
})
export class CourseFormService {
  constructor(
    private db: FirebaseExtendedService,
    private imageUpload: ImageUploadService,
    private router: Router
  ) {}

  async saveCourse(
    formCourse: Partial<Course>,
    status: 'draft' | 'publish',
    originalCourse?: Partial<Course>,
    uploadImages?: FileHandle[]
  ): Promise<void> {
    try {
      if (!formCourse.id) return;

      if (uploadImages?.length) {
        const uploads = await this.imageUpload.uploadImages(
          uploadImages,
          formCourse.id
        );
        uploads.forEach((item) => {
          const url = item.ref.fullPath;
          const name = item.metadata.customMetadata?.['originalName'];
          formCourse.gallery?.push(url);
          if (formCourse.bgImg !== name) return;
          formCourse.bgImg = url;
        });
      }

      formCourse.desc = formCourse.desc?.replace(/\n/g, '<br/>');
      formCourse.shortDesc = formCourse.shortDesc?.replace(/\n/g, '<br/>');
      formCourse.howToCert = formCourse.howToCert?.replace(/\n/g, '<br/>');
      if (formCourse.howToLearn)
        formCourse.howToLearn.eLearning =
          formCourse.howToLearn?.eLearning?.replace(/\n/g, '<br/>');
      if (formCourse.howToLearn)
        formCourse.howToLearn.inPerson =
          formCourse.howToLearn?.inPerson?.replace(/\n/g, '<br/>');

      if (status === 'publish') {
        const exists = await this.db.docExists(
          `draft-courses/${formCourse.id}`
        );
        if (exists) await this.db.delete(`draft-courses/${formCourse.id}`);
      }

      formCourse.draft =
        status === 'draft'
          ? {
              createdAt:
                formCourse.draft?.createdAt || Timestamp.fromDate(new Date()),
              updatedAt: Timestamp.fromDate(new Date()),
            }
          : undefined;
      formCourse.hide = status === 'draft';
      formCourse.createdAt = originalCourse?.createdAt;

      const normCourse = () => {
        return assignWith({}, formCourse, (_, value) =>
          typeof value == 'undefined' ? deleteField() : value
        );
      };

      const exists = await this.db.docExists(`courses/${formCourse.id}`);
      await this.db.upsert<Course>(
        `${status === 'draft' ? 'draft-courses' : 'courses'}/${formCourse.id}`,
        normCourse()
      );
      if (!exists)
        await this.db.upsert<Course>(`courses/${formCourse.id}`, normCourse());
      else
        await this.db.upsert<Course>(`courses/${formCourse.id}`, {
          hide: formCourse.hide,
        });

      if (originalCourse && formCourse.id !== originalCourse.id) {
        console.warn(
          `DELETING COURSE... -> Substituting '${originalCourse.id}' with '${formCourse.id}'`
        );
        await this.db.delete(`courses/${originalCourse.id}`);
      }

      this.router.navigate(['admin', 'courses']);
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async deleteDraft(id?: string): Promise<void> {
    if (!id) return;
    const exists = await this.db.docExists(`draft-courses/${id}`);
    if (exists) {
      await this.db.delete(`draft-courses/${id}`);
      this.db.upsert(`courses/${id}`, { hide: false });
    }
    this.router.navigate(['admin', 'courses']);
    return;
  }
}
