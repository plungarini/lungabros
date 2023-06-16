import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import {
	Curriculum,
	CvLanguage,
	CvSocial,
	FormCurriculum,
} from 'src/app/pages/about/pages/curriculum/models/curriculum.model';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';
import { CvFormService } from './services/cv-form.service';

type CertForm = FormGroup<{
  id: FormControl<string>;
  title: FormControl<string>;
  priority: FormControl<number | undefined>;
  isPro: FormControl<boolean>;
  hide: FormControl<boolean>;
}>;

type FormStories = FormGroup<{
  title: FormControl<string>;
  desc: FormControl<string>;
  time: FormControl<string>;
  isWorkingExperience: FormControl<boolean>;
}>;

type FormLangs = FormGroup<{
  flag: FormControl<string>;
  name: FormControl<string>;
  level: FormControl<number>;
}>;

type FormSocials = FormGroup<{
  id: FormControl<string>;
  username: FormControl<string>;
}>;

@Component({
  selector: 'app-cv-detail',
  templateUrl: './cv-detail.component.html',
  styleUrls: ['./cv-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvDetailComponent implements OnInit {
  curriculum: Curriculum | undefined;
  invalidInputs: string[] = [];
  showErrorsModal = false;

  form = new FormGroup(
    {
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      birthday: new FormControl<string>(this.formatDate(new Date()), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      desc: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      contacts: new FormGroup({
        email: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        phone: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      specs: new FormGroup({
        passions: new FormArray<FormControl<string>>([], {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        memberId: new FormControl<number>(0, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      draft: new FormGroup({
        createdAt: new FormControl(),
        updatedAt: new FormControl(),
      }),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
    },
    { updateOn: 'blur' }
  );

  storiesArr = new FormGroup(
    {
      storiesArr: new FormArray<FormStories>([]),
    },
    { updateOn: 'blur' }
  );
  certsArr = new FormGroup(
    {
      certsArr: new FormArray<CertForm>([]),
    },
    { updateOn: 'blur' }
  );
  socialsArr = new FormGroup(
    {
      socialsArr: new FormArray<FormSocials>([]),
    },
    { updateOn: 'blur' }
  );
  langsArr = new FormGroup(
    {
      langsArr: new FormArray<FormLangs>([]),
    },
    { updateOn: 'blur' }
  );

  emptyCertForm: CertForm | undefined;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
		private cvFormService: CvFormService,
		private pageLoader: PageLoaderService,
  ) {}

	ngOnInit(): void {
		this.pageLoader.show(false);

    this.route.data.pipe(take(1)).subscribe(({ cv }) => {
      this.curriculum = cv;
      this.form.patchValue(this.normCv(cv));
      this.setArrays();
      this.form.markAsPristine();
      this.cdRef.detectChanges();
    });

    this.emptyCertForm = this.certGroupTemplate();
    this.cdRef.detectChanges();
  }

  submitForm(status: 'draft' | 'publish'): void {
    const normCurriculum: Curriculum = {
      ...this.form.value,
      name: this.form.value.name || '',
      birthday: Timestamp.fromDate(
        new Date(this.form.value.birthday || new Date().toDateString())
      ),
      desc: this.form.value.desc || '',
      contacts: {
        email: this.form.value.contacts?.email || '',
        phone: this.form.value.contacts?.phone || '',
      },
      specs: {
        memberId: this.form.value.specs?.memberId || 0,
        passions: this.form.value.specs?.passions || [],
        socials:
          this.socialsArr.value.socialsArr?.map((s) => ({
            id: (s.id || 'ig') as CvSocial['id'],
            username: s.username || '',
          })) || [],
        lang:
          this.langsArr.value.langsArr?.map((l) => ({
            level: l.level || 1,
            flag: (l.flag || 'it') as CvLanguage['flag'],
            name:
              l.flag === 'it'
                ? 'Italiano'
                : l.flag === 'en'
                ? 'Inglese'
                : l.flag === 'fr'
                ? 'Francese'
                : l.flag === 'de'
                ? 'Tedesco'
                : '',
          })) || [],
      },
      stories:
        this.storiesArr.value.storiesArr
          ?.map((s) => ({
            title: s.title || '',
            desc: s.desc || '',
            isWorkingExperience: !!s.isWorkingExperience,
            time: Timestamp.fromDate(
              new Date(s.time || new Date().toDateString())
            ),
          }))
          .sort(
            (a, b) => a.time.toDate().getTime() - b.time.toDate().getTime()
          ) || [],
      certs: [],
      draft: this.curriculum?.draft,
    };

    const findInvalidControls = () => {
      const invalid = new Set<string>([]);
      const controls = {
        ...this.form.controls,
      };
      const contacts = this.form.controls.contacts.controls;
      const specs = this.form.controls.specs.controls;
      const passions = this.form.controls.specs.controls.passions.controls;
      const stories = this.storiesArr.controls.storiesArr.controls;
      const certs = this.certsArr.controls.certsArr.controls;
      const socials = this.socialsArr.controls.socialsArr.controls;
      const langs = this.langsArr.controls.langsArr.controls;
      for (const name in controls) {
        if (name === 'contacts' || name === 'specs') continue;
        if ((controls as any)[name]?.invalid) {
          invalid.add(name);
        }
      }
      for (const name in contacts) {
        if ((contacts as any)[name]?.invalid) {
          invalid.add(`contacts.${name}`);
        }
      }
      for (const name in specs) {
        if ((specs as any)[name]?.invalid) {
          invalid.add(`specs.${name}`);
        }
      }
      const checkControls = (formGroup: FormGroup, str: string) => {
        const formGroupControls = formGroup.controls;
        for (const name in formGroupControls) {
          if ((formGroupControls as any)[name]?.invalid) {
            invalid.add(`${str}.${name}`);
          }
        }
      }
      stories.forEach((item) => checkControls(item, 'stories'));
      certs.forEach((item) => checkControls(item, 'certs'));
      socials.forEach((item) => checkControls(item, 'socials'));
      langs.forEach((item) => checkControls(item, 'langs'));
      passions.forEach((item) => { if (item.invalid) invalid.add('passions') });
      return invalid;
    };
    const invalid = findInvalidControls();


    if (invalid.size > 0 && status === 'draft') {
      this.cvFormService.saveCv(normCurriculum, status, this.curriculum, this.certsArr.controls.certsArr.value);
    } else if (invalid.size <= 0) {
      this.cvFormService.saveCv(normCurriculum, status, this.curriculum, this.certsArr.controls.certsArr.value);
    } else {
      console.warn('Devi cambiare stato in Bozza o aggiornare campi', invalid);
      this.invalidInputs = [...invalid];
      this.showErrorsModal = true;
    }
  }

  deleteDraft(): void {
    this.cvFormService.deleteDraft(this.form.controls.name.value);
  }

  get stories(): any[] {
    return this.storiesArr.controls.storiesArr.controls;
  }

  get langs(): any[] {
    return this.langsArr.controls.langsArr.controls;
  }

  get socials(): any[] {
    return this.socialsArr.controls.socialsArr.controls;
  }

  get certifications(): any[] {
    return this.certsArr.controls.certsArr.value;
  }

  get skills(): string[] {
    return this.form.controls.specs.controls.passions.value;
  }

  addSocial(): void {
    this.socialsArr.controls.socialsArr.push(this.socialsGroupTemplate());
  }

  deleteSocial(index: number): void {
    this.socialsArr.controls.socialsArr.removeAt(index);
  }

  addSkill(): void {
    this.form.controls.specs.controls.passions.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      })
    );
  }

  deleteSkill(index: number): void {
    this.form.controls.specs.controls.passions.removeAt(index);
  }

  addNewStory(): void {
    this.storiesArr.controls.storiesArr.push(this.storyGroupTemplate());
  }

  deleteStory(index: number): void {
    this.storiesArr.controls.storiesArr.removeAt(index);
  }

  addNewCert(): void {
    if (!this.emptyCertForm || !this.emptyCertForm.value.title) return;
    this.emptyCertForm.patchValue({ id: 'toCreate' });
    const newForm = this.certGroupTemplate(this.emptyCertForm.value);
    this.certsArr.controls.certsArr.push(newForm);
    this.emptyCertForm.reset();
    this.sortCerts();
  }

  deleteCert(index: number): void {
    const thisId = this.certsArr.controls.certsArr.at(index).value.id || '';
    if (thisId.includes('toCreate')) {
      return this.certsArr.controls.certsArr.removeAt(index);
    }
    this.certsArr.controls.certsArr
      .at(index)
      .patchValue({ id: `toDelete-${thisId}`, hide: true });
    this.sortCerts();
  }

  sortCerts(): void {
    const control = this.certsArr.controls.certsArr;
    const arr = control.value
      .sort(
        (a, b) =>
          (a.isPro ? a?.priority || 40 : 50) -
          (b.isPro ? b?.priority || 40 : 50)
      )
      .map((a) => ({
        title: a.title || '',
        id: a.id || '',
        isPro: a.isPro === undefined ? true : a.isPro,
        priority: a.priority,
        hide: a.hide === undefined ? true : a.hide,
      }));
    control.setValue(arr);
    this.cdRef.detectChanges();
  }

  addNewLang(): void {
    this.langsArr.controls.langsArr.push(this.langsGroupTemplate());
  }

  deleteLang(index: number): void {
    this.langsArr.controls.langsArr.removeAt(index);
  }

  private normCv(cv: Curriculum): FormCurriculum {
    const birthday = this.formatDate(cv.birthday?.toDate() || new Date());
    return {
      birthday,
      contacts: cv.contacts,
      desc: cv.desc,
      name: cv.name,
      specs: {
        passions: cv.specs?.passions || [],
        memberId: cv.specs?.memberId || 0,
      },
    };
  }

  private setArrays(): void {
    this.curriculum?.stories?.forEach((story) => {
      const formTemplate = this.storyGroupTemplate(story);
      this.storiesArr.controls.storiesArr.push(formTemplate);
    });
    this.curriculum?.certs.forEach((cert) => {
      const formTemplate = this.certGroupTemplate(cert);
      this.certsArr.controls.certsArr.push(formTemplate);
    });
    this.curriculum?.specs?.lang?.forEach((lang) => {
      const formTemplate = this.langsGroupTemplate(lang);
      this.langsArr.controls.langsArr.push(formTemplate);
    });
    if ((this.curriculum?.specs?.lang?.length || 0) <= 0) {
      this.addNewLang();
    }
    this.curriculum?.specs?.socials?.forEach((social) => {
      const formTemplate = this.socialsGroupTemplate(social);
      this.socialsArr.controls.socialsArr.push(formTemplate);
    });
    if ((this.curriculum?.specs?.socials?.length || 0) <= 0) {
      this.addSocial();
    }
    this.curriculum?.specs?.passions?.forEach((passion) => {
      const formTemplate = new FormControl(passion, {
        nonNullable: true,
        validators: [Validators.required],
      });
      this.form.controls.specs.controls.passions.push(formTemplate);
    });
    if ((this.curriculum?.specs?.passions?.length || 0) <= 0) {
      this.addSkill();
    }
    this.sortCerts();
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  }

  private storyGroupTemplate = (story?: Curriculum['stories'][0]) =>
    new FormGroup({
      title: new FormControl<string>(story?.title || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      desc: new FormControl<string>(
        story?.desc.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n') || '',
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      time: new FormControl<string>(
        this.formatDate(story?.time?.toDate() || new Date()),
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      isWorkingExperience: new FormControl<boolean>(
        story?.isWorkingExperience === undefined
          ? true
          : story?.isWorkingExperience,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });
  private certGroupTemplate = (cert?: Partial<Curriculum['certs'][0]>) =>
    new FormGroup({
      id: new FormControl<string>(cert?.id || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      title: new FormControl<string>(cert?.title || 'PADI® ', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      priority: new FormControl<number | undefined>(
        cert?.priority || undefined,
        {
          nonNullable: true,
        }
      ),
      isPro: new FormControl<boolean>(
        cert?.isPro === undefined ? true : cert?.isPro,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      hide: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  private langsGroupTemplate = (lang?: Curriculum['specs']['lang'][0]) =>
    new FormGroup({
      flag: new FormControl<string>(lang?.flag || 'it', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      name: new FormControl<string>(lang?.name || 'Italiano', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      level: new FormControl<number>(lang?.level || 1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  private socialsGroupTemplate = (social?: Curriculum['specs']['socials'][0]) =>
    new FormGroup({
      id: new FormControl<string>(social?.id || 'ig', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl<string>(social?.username || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
}
