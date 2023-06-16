import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { PageLoaderService } from 'src/app/shared/services/page-loader.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styles: [],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  searchBar = new FormControl('');

  private filteredCourses: Course[] = [];

  dbConnection: Subscription | undefined;
  searchBarSub: Subscription | undefined;

  constructor(
    private ngZone: NgZone,
    private db: FirebaseExtendedService,
    private cdRef: ChangeDetectorRef,
		private router: Router,
		private pageLoader: PageLoaderService
  ) {}

	ngOnInit(): void {
		this.pageLoader.show(false);
    this.dbConnection = this.db
      .getCol<Course>('courses')
      .subscribe((courses) => {
        this.courses = this.sortCourses(courses);
        this.filteredCourses = this.courses;
        this.filterSearch(this.searchBar.value || '');
        this.cdRef.detectChanges();
      });
    this.searchBarSub = this.searchBar.valueChanges.subscribe(value => {
      this.filterSearch(value || '');
    });
  }

  ngOnDestroy(): void {
    this.dbConnection?.unsubscribe();
    this.searchBarSub?.unsubscribe();
  }

  editCourse(id: string): void {
    this.ngZone.run(() => this.router.navigate(['admin', 'courses', 'edit', id]));
  }

  formatDate(date?: Timestamp): string {
    if (!date) return '';
    const month = this.normMonth(date.toDate().getMonth());
    const day = date.toDate().getDate();
    const year = date.toDate().getFullYear().toString().slice(2);
    return `${day} ${month}, ${year}`;
  }

  formatDateMobile(date?: Timestamp): string {
    if (!date) return '';
    const month = this.normMonth(date.toDate().getMonth());
    const day = date.toDate().getDate();
    const year = date.toDate().getFullYear().toString().slice(2);
    return `${month}, ${year}`;
  }

  formatCategories(cat: Course['category']): string {
    const normCats: string[] = [];
    cat.forEach(c => {
      const normC = this.normCategory(c);
      if (!normC) return;
      normCats.push(normC);
    });
    return normCats.join(', ');
  }

  trackBy(i: number, item: Course): string {
    return item.id;
  }

  get draftCourses(): Course[] {
    return this.filteredCourses.filter(c => c.hide);
  }

  get publicCourses(): Course[] {
    return this.filteredCourses.filter(c => !c.hide);
  }

  private normCategory(cat: string): string {
    switch (cat) {
      case 'main':
        return 'Principale';
      case 'specialty':
        return 'Specialità';
      case 'experience':
        return 'Esperienza';
      case 'withDives':
        return 'Con immersioni';
      case 'dry':
        return 'A secco';
      case 'junior':
        return 'Junior';
      case 'kids':
        return 'Kids';
    
      default:
        return ''
    }
  }

  private sortCourses(courses: Course[]): Course[] {
    const arr = courses.sort((a, b) => {
      const incl = (c: Course, str: string) => c.category.includes(str);
      const normCat = (c: Course) => {
        return incl(c, 'main')
          ? incl(c, 'one')
            ? 1
            : incl(c, 'two')
            ? 2
            : incl(c, 'three')
            ? 3
            : incl(c, 'four')
            ? 4
            : 5
          : incl(c, 'experience')
          ? 6
          : incl(c, 'specialty')
          ? 7
          : incl(c, 'junior')
          ? 8
          : incl(c, 'kids')
          ? 9
          : 10;
      };
      return normCat(a) - normCat(b);
    });
    return arr;
  }

  private normMonth(month: number): string {
    switch (month) {
      case 0:
        return 'Gen';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'Mag';
      case 5:
        return 'Giu';
      case 6:
        return 'Lug';
      case 7:
        return 'Ago';
      case 8:
        return 'Set';
      case 9:
        return 'Ott';
      case 10:
        return 'Nov';
      case 11:
        return 'Dic';
    
      default:
        return '';
    }
  }

  private filterSearch(value: string): void {
    const normValue = value ? value.toLowerCase().trim() : '';
    this.filteredCourses = this.courses
      .filter((c) => 
        c.id.toLowerCase().includes(normValue) ||
        c.title.toLowerCase().replace('padi®', '').includes(normValue)
      );
  }
}
