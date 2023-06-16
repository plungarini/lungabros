import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CourseFilters } from 'src/app/pages/courses/models/course-filters.model';



@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {

  @Output() filters = new EventEmitter<CourseFilters>();
	@Output() clear = new EventEmitter();
	
	@Input() id: 'mobile' | 'desktop' = 'desktop';

  form = new FormGroup({
    kids: new FormControl(false),
    junior: new FormControl(false),
    main: new FormControl(false),
    specialty: new FormControl(false),
    withDives: new FormControl(false),
    experience: new FormControl(false),
    dry: new FormControl(false),
  });
	formSub: Subscription | undefined;
	
	
  constructor() { }

  ngOnInit(): void {
    this.formSub = this.form.valueChanges.subscribe((value) => {
			const normBool = (value: any) => typeof value === 'boolean' ? value : false;
			const filtersValue = [
				{ name: 'kids', enabled: normBool(this.form.value.kids) },
				{ name: 'junior', enabled: normBool(this.form.value.junior) },
				{ name: 'main', enabled: normBool(this.form.value.main) },
				{ name: 'specialty', enabled: normBool(this.form.value.specialty) },
				{ name: 'withDives', enabled: normBool(this.form.value.withDives) },
				{ name: 'experience', enabled: normBool(this.form.value.experience) },
				{ name: 'dry', enabled: normBool(this.form.value.dry) },
			];
      this.filters.emit({ category: filtersValue });
    });
  }

	clearFilters(): void {
    this.clear.emit();
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

}
