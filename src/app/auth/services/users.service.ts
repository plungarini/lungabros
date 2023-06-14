import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { getAuth, User } from '@firebase/auth';
import { Observable, of, switchMap } from 'rxjs';
import { FirebaseExtendedService } from 'src/app/shared/services/firebase-extended.service';
import { User as DbUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  
  private defaultRoles: DbUser['roles'] = {
    subscriber: false,
    editor: false,
    admin: true,
  };
  private auth = getAuth();

  constructor(private db: FirebaseExtendedService) {}

  /**
   * Update or create a user.
   *
   * @param user User details as firebase.User interface.
   * @param additionalDetails If provides, set additional details to the UserDetails.additional interface.
   */
  async editOrCreate(
    user: User,
    forceEdits: boolean = true,
    additionalDetails?: any,
    isSignup?: boolean
  ): Promise<boolean> {
    try {
      const toFirebaseUser: DbUser = {
        id: user.uid || '',
        name: user.displayName || additionalDetails?.fullName || '',
        email: user.email || '',
        disabled: false,
        roles: additionalDetails?.roles || this.defaultRoles,
      };

      if (forceEdits || isSignup) {
        await this.db.upsert(`/users/${user.uid}`, toFirebaseUser);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Edit user details.
   */
  async edit(uid: string, data: any): Promise<void> {
    if (!uid) return;
    await this.db.upsert(`/users/${uid}`, data);
  }

  /**
   * Get all Users with a query (if set).
   *
   * @returns an Observable with a list of Users.
   */
  getAll(query?: any): Observable<DbUser[]> {
    return this.db.getCol<DbUser>('users', query);
  }

  /**
   * Get a single user.
   *
   * @param id Set it to firebase.User.uid
   */
  get(id?: string): Observable<DbUser | undefined> {
    if (!id) return of(undefined);
    return this.db.getDoc<DbUser>(`users/${id}`);
  }

  /**
   * Get current user from Firebase.
   */
  getCurrentFire(): Observable<User | null> {
    return user(this.auth);
  }

  /**
   * Get current user from db.
   */
  getCurrentUserDb(): Observable<DbUser | undefined> {
    return this.getCurrentFire()
      .pipe(
        switchMap((fireUser) => this.get(fireUser?.uid))
      );
  }
}
