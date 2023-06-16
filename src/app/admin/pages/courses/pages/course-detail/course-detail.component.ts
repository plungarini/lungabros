import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';
import { Subscription, take } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { FileHandle } from './pipes/drag-ndrop.directive';
import { CourseFormService } from './services/course-form.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Partial<Course> | undefined;
  allCourses: {
    id: string;
    title: string;
  }[] = [];
  filteredCourses: {
    id: string;
    title: string;
  }[] = [];
  allCategories = [
    'main',
    'specialty',
    'experience',
    'kids',
    'junior',
    'withDives',
    'dry',
  ];

  dbConnection: Subscription | undefined;
  invalidInputs: string[] = [];
  showErrorsModal = false;

  fileDropper = new FormControl<FileHandle[]>([], { nonNullable: true });

  form = new FormGroup(
    {
      id: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hide: new FormControl<boolean>(true),
      title: new FormControl<string>('PADI® NOME_DEL_CORSO', [
        Validators.required,
      ]),
      bgImg: new FormControl<string>('', [Validators.required]),
      shortDesc: new FormControl<string>('', [Validators.required]),
      category: new FormControl<string[]>([], { nonNullable: true }),
      desc: new FormControl<string>('', [Validators.required]),
      howToCert: new FormControl<string>('', [Validators.required]),
      courseAdvice: new FormControl<string[]>([], { nonNullable: true }),
      suggestedCourse: new FormControl<string[]>([], { nonNullable: true }),
      gallery: new FormControl<string[]>([], [Validators.required]),
      howToLearn: new FormGroup({
        eLearning: new FormControl<string>('', [Validators.required]),
        inPerson: new FormControl<string>('', [Validators.required]),
      }),
      specs: new FormGroup({
        foryou: new FormArray<FormControl<string>>([], {
          updateOn: 'blur',
        }),
        learnto: new FormArray<FormControl<string>>([], {
          updateOn: 'blur',
        }),
        specs: new FormGroup({
          time: new FormGroup({
            time: new FormControl<string>('', [Validators.required]),
            unit: new FormControl<'hours' | 'days' | 'minutes'>('days', [
              Validators.required,
            ]),
          }),
          elearningTime: new FormGroup({
            time: new FormControl<string>('', [Validators.required]),
            unit: new FormControl<'hours' | 'days' | 'minutes'>('hours', [
              Validators.required,
            ]),
          }),
          dives: new FormControl<number | undefined>(undefined),
          depth: new FormControl<number | undefined>(undefined),
          age: new FormControl<number | undefined>(undefined),
          pre: new FormControl<string>('', [Validators.required]),
        }),
      }),
      createdAt: new FormControl<Timestamp | undefined>(undefined),
      updatedAt: new FormControl<Timestamp | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private db: FirebaseExtendedService,
    private courseFormService: CourseFormService,
		private sanitizer: DomSanitizer,
		private pageLoader: PageLoaderService,
  ) {}

	ngOnInit(): void {
		this.pageLoader.show(false);
		
    this.route.data.pipe(take(1)).subscribe(({ course }) => {
      this.course = this.normCourse(course);
      this.form.patchValue(this.course);
      this.cdRef.detectChanges();
    });

    this.dbConnection = this.db
      .getCol<Course>('courses')
      .subscribe((courses) => {
        this.allCourses = courses.map((c) => ({ id: c.id, title: c.title }));
        this.filteredCourses = this.allCourses;
        this.setArrays();
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.dbConnection?.unsubscribe();
  }

  deleteDraft(): void {
    this.courseFormService.deleteDraft(this.form.value.id);
  }

  fileDrop(event: FileHandle[], fileEvent?: Event): void {
    const mapFiles = (files: FileList | null) => {
      if (!files) return;
      const arr: FileHandle[] = [];
      for (let i = 0; i < files.length; i++) {
        arr.push({
          file: files[i],
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(files[i])
          ),
          isCover: false,
        });
      }
      return arr;
    };
    const files = fileEvent
      ? mapFiles((fileEvent.target as HTMLInputElement).files)
      : event.filter((f) => f.file.type.includes('image'));
    if (!files || files?.length <= 0) return;
    const res = this.fileDropper.value;
    files.forEach((f) => {
      res.push(f);
      const gallery = this.form.get('gallery') as FormControl<string[]>;
      gallery.patchValue([f.file.name, ...gallery.value]);
      this.cdRef.detectChanges();
    });
  }

  deleteUploadImage(index: number): void {
    if (this.fileDropper.value?.at(index)?.isCover) {
      this.form.get('bgImg')?.patchValue('');
    }
    this.fileDropper.value?.splice(index, 1);
    this.cdRef.detectChanges();
  }

  deleteGalleryImage(index: number): void {
    if (this.isGalleryImageCover(index)) {
      this.form.get('bgImg')?.patchValue('');
    }
    this.form.get('gallery')?.value?.splice(index, 1);
    this.cdRef.detectChanges();
  }

  setCoverImage(index: number): void {
    const url = this.gallery.at(index);
    if (!url) return;
    this.fileDropper.value?.forEach((e) => (e.isCover = false));
    this.form.get('bgImg')?.patchValue(url);
    this.cdRef.detectChanges();
  }

  setUploadCoverImage(index: number): void {
    const file = this.fileDropper.value?.at(index);
    if (!file) return;
    this.fileDropper.value?.forEach((e) => (e.isCover = false));
    file.isCover = true;
    this.form.get('bgImg')?.patchValue(file.file.name);
    this.cdRef.detectChanges();
  }

  isGalleryImageCover(index: number): boolean {
    const url = this.gallery.at(index);
    if (!url) return false;
    return this.form.get('bgImg')?.value === url;
  }

  get gallery(): string[] {
    return (this.form.get('gallery') as FormControl<string[]>)?.value?.filter(
      (img) => img.includes('/')
    );
  }

  get isEqualCourse(): boolean {
    return isEqual(this.form.value, this.course);
  }

  get publishCourse(): boolean {
    return !!!this.form.get('hide')?.value;
  }

  get specsForyou(): string[] {
    return this.form.get(['specs', 'foryou'])?.value || [];
  }

  get specsLearnto(): string[] {
    return this.form.get(['specs', 'learnto'])?.value || [];
  }

  get courseAdvices(): string[] {
    return this.form.get('courseAdvice')?.value || [];
  }
  get suggestedCourses(): string[] {
    return this.form.get('suggestedCourse')?.value || [];
  }

  get canPublishCourse(): boolean {
    return this.form.valid && !this.form.get('hide')?.value;
  }

  setPublishStatus(value: boolean) {
    this.form.get('hide')?.patchValue(!value);
  }

  deleteFormStrArr(path: string | string[], i: number): void {
    (this.form.get(path) as FormArray)?.removeAt(i);
  }

  newDummyFormStrArr(path: string | string[]): void {
    const control = new FormControl<string>('', {
      nonNullable: true,
      updateOn: 'blur',
      validators: [Validators.required],
    });
    (this.form.get(path) as FormArray)?.push(control);
  }

  normSuggestedCoursesName(item: string): string {
    return (
      this.allCourses
        .find((c) => c.id.toLowerCase().trim() === item.toLowerCase().trim())
        ?.title.replace('PADI®', '')
        .trim() || ''
    );
  }

  filterSuggestedCourse(value: string, input?: HTMLInputElement): void {
    if (!value) {
      this.filteredCourses = this.allCourses;
      if (input) input.value = '';
      this.cdRef.detectChanges();
      return;
    }
    this.filteredCourses = this.allCourses.filter(
      (c) =>
        c.id.toLowerCase().trim().includes(value) ||
        c.title.toLowerCase().replace('padi®', '').trim().includes(value)
    );
    this.cdRef.detectChanges();
  }

  isSuggestedCourseSelected(item: string, path: 'advice' | 'suggest'): boolean {
    return !!this.form
      .get(path === 'suggest' ? 'suggestedCourse' : 'courseAdvice')
      ?.value?.includes(item);
  }

  selectSuggestedCourse(item: string, path: 'advice' | 'suggest'): void {
    if (this.isSuggestedCourseSelected(item, path))
      return this.removeSuggestedCourse(item, path);

    const arr = this.form.get(
      path === 'suggest' ? 'suggestedCourse' : 'courseAdvice'
    ) as FormControl<string[]>;
    if (!arr) return;
    arr.patchValue([item, ...arr.value]);
    this.cdRef.detectChanges();
  }

  removeSuggestedCourse(
    item: string,
    path: 'advice' | 'suggest',
    event?: MouseEvent
  ): void {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    const arr =
      this.form.get(path === 'suggest' ? 'suggestedCourse' : 'courseAdvice')
        ?.value || [];
    const i = arr.indexOf(item);
    arr.splice(i, 1);
    this.cdRef.detectChanges();
  }

  selectCategory(cat: string): void {
    if (this.isCatSelected(cat)) return;
    const currentCats = this.form.get('category') as FormControl<string[]>;
    if (!currentCats) return;
    currentCats.patchValue([cat, ...currentCats.value]);
    this.cdRef.detectChanges();
  }

  removeCat(cat: string, event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    const currentCats =
      (this.form.get('category') as FormControl<string[]>)?.value || [];
    const i = currentCats.indexOf(cat);
    currentCats.splice(i, 1);
    this.cdRef.detectChanges();
  }

  isCatSelected(cat: string): boolean {
    const catArr = (this.form.get('category') as FormArray)?.value;
    return (catArr || []).includes(cat);
  }

  normCategoryName(cat: string): string {
    switch (cat) {
      case 'main':
        return 'Principale';
      case 'specialty':
        return 'Specialità';
      case 'experience':
        return 'Esperienza';
      case 'kids':
        return 'Kids';
      case 'junior':
        return 'Junior';
      case 'withDives':
        return 'Con immersioni';
      case 'dry':
        return 'A secco';

      default:
        return '';
    }
  }

  submitForm(status: 'draft' | 'publish'): void {
    if (
      (this.isEqualCourse && status === 'draft' && this.form.value.hide) ||
      (this.isEqualCourse && status === 'publish' && !this.form.value.hide)
    )
      return;

    const findInvalidControls = () => {
      const invalid = new Set<string>([]);
      const controls = this.form.controls;
      for (const name in controls) {
        if (name === 'specs' || name === 'howToLearn') continue;
        if ((controls as any)[name].invalid) {
          invalid.add(name);
        }
      }

      const howToLearn = this.form.controls.howToLearn.controls;
      const specs = this.form.controls.specs.controls;
      const specsSpecs = this.form.controls.specs.controls.specs.controls;
      const specsTime =
        this.form.controls.specs.controls.specs.controls.time.controls;
      const specsElearningTime =
        this.form.controls.specs.controls.specs.controls.elearningTime.controls;

      for (const name in howToLearn) {
        if ((howToLearn as any)[name].invalid) {
          invalid.add(`howToLearn.${name}`);
        }
      }
      for (const name in specs) {
        if ((specs as any)[name].invalid) {
          invalid.add(`specs.${name}`);
        }
      }
      for (const name in specsSpecs) {
        if ((specsSpecs as any)[name].invalid) {
          invalid.add(`specs.specs.${name}`);
        }
      }
      for (const name in specsTime) {
        if ((specsTime as any)[name].invalid) {
          invalid.add(`specs.specs.time.${name}`);
        }
      }
      for (const name in specsElearningTime) {
        if ((specsElearningTime as any)[name].invalid) {
          invalid.add(`specs.specs.elearningTime.${name}`);
        }
      }

      const checkArrays = (controls: string[]) => {
        controls.forEach((c) => {
          const arr = (this.form.get(c)?.value as string[]) || [];
          if (arr.length <= 0) invalid.add(c);
        });
      };
      checkArrays(['category', 'suggestedCourse', 'gallery']);

      return [...invalid];
    };
    const invalid = findInvalidControls();
    if (
      invalid.length > 0 &&
      status === 'draft' &&
      !!this.form.get('id')?.value
    ) {
      this.courseFormService.saveCourse(
        this.form.value as Partial<Course>,
        status,
        this.course,
        this.fileDropper.value
      );
    } else if (invalid.length <= 0) {
      this.courseFormService.saveCourse(
        this.form.value as Partial<Course>,
        status,
        this.course,
        this.fileDropper.value
      );
    } else {
      console.warn('Devi cambiare stato in Bozza o aggiornare campi', invalid);
      this.invalidInputs = [...invalid];
      this.showErrorsModal = true;
    }
  }

  private setArrays(): void {
    this.course?.specs?.foryou?.forEach((item) => {
      this.form.controls.specs.controls.foryou.push(
        new FormControl(item, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    });
    if ((this.course?.specs?.foryou?.length || 0) <= 0) {
      this.form.controls.specs.controls.foryou.push(
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    }
    this.course?.specs?.learnto?.forEach((item) => {
      this.form.controls.specs.controls.learnto.push(
        new FormControl(item, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    });
    if ((this.course?.specs?.learnto?.length || 0) <= 0) {
      this.form.controls.specs.controls.learnto.push(
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    }
  }

  private normCourse(course: Partial<Course>): Partial<Course> {
    const gallery = course?.gallery?.sort((a, b) => {
      const normA = parseFloat(a.replace(/(?:[^0-9]*)/g, ''));
      const normB = parseFloat(b.replace(/(?:[^0-9]*)/g, ''));
      return normA - normB;
    });
    const specsTime = course?.specs?.specs.time;
    const time: Course['specs']['specs']['time'] | undefined =
      typeof (specsTime as any) === 'string'
        ? { time: specsTime as unknown as string, unit: 'days' }
        : specsTime;
    const specsElearningTime = course?.specs?.specs.elearningTime;
    const elearningTime: Course['specs']['specs']['time'] | undefined =
      typeof (specsElearningTime as any) === 'string'
        ? { time: specsElearningTime as unknown as string, unit: 'hours' }
        : specsElearningTime;
    const normedCourse: Partial<Course> = gallery
      ? { ...course, gallery }
      : course;
    if (normedCourse?.specs?.specs.time && time)
      normedCourse.specs.specs.time = time;
    if (normedCourse?.specs?.specs.elearningTime && elearningTime)
      normedCourse.specs.specs.elearningTime = elearningTime;
    normedCourse.desc =
      normedCourse.desc?.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n') || '';
    normedCourse.shortDesc =
      normedCourse.shortDesc?.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n') ||
      '';
    normedCourse.howToCert =
      normedCourse.howToCert?.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n') ||
      '';
    if (normedCourse.howToLearn)
      normedCourse.howToLearn.eLearning =
        normedCourse.howToLearn?.eLearning
          ?.replace(/<br>/g, '\n')
          .replace(/<br\/>/g, '\n') || '';
    if (normedCourse.howToLearn)
      normedCourse.howToLearn.inPerson =
        normedCourse.howToLearn?.inPerson
          ?.replace(/<br>/g, '\n')
          .replace(/<br\/>/g, '\n') || '';
    return normedCourse;
  }
}
