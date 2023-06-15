import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

	private $loader = new BehaviorSubject<{ show: boolean }>({ show: true });

	constructor() {
	}

	get(): Observable<{ show: boolean }> {
		return this.$loader.asObservable();
	}

	show(status: boolean): void {
		if (status) {
			this.$loader.next({ show: status });
		} else {
			setTimeout(() => {
				this.$loader.next({ show: !!status });
			}, 1000);
		}
	}
}
