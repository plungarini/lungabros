import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/auth/services/users.service';


@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {

	constructor(private usersService: UsersService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
  ): Observable<boolean> {
		return this.usersService.getCurrentUserDb()
			.pipe(
				map(user => {
					if (user?.roles?.admin) return true;

					this.router.navigateByUrl('/login');
					return false;
				}),
			);
	}
}
