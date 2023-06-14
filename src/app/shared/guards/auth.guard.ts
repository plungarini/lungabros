import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/auth/services/users.service';



@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private usersService: UsersService, private router: Router) {}

	canActivate(route: any, state: RouterStateSnapshot): Observable<boolean> {
		return this.usersService.getCurrentUserDb()
			.pipe(
				map(user => {
					if (user) return true;

					this.router.navigate(['/auth/login'], {
						queryParams: {
							returnUrl: state.url,
						}
					});
					return false;
				}),
			);
	}
}
