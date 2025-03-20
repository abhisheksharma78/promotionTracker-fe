import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.notificationService.error('Please login to continue');
      this.router.navigate(['/auth/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as Role[];
    if (!allowedRoles?.includes(user.role)) {
      this.notificationService.error('You do not have permission to access this page');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
