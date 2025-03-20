import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/role';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock login - replace with actual API call
    if (email === 'admin@example.com' && password === 'admin') {
      const user: User = {
        id: '1',
        email,
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN
      };
      return of(user).pipe(
        delay(1000),
        tap(user => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        })
      );
    }

    return throwError(() => new Error('Invalid email or password'));
  }

  logout(): Observable<void> {
    // Mock logout - replace with actual API call
    return of(void 0).pipe(
      delay(1000),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}
