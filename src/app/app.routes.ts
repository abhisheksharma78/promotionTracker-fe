import { Routes } from '@angular/router';
import { Role } from './core/models/role';
import { RoleGuardService } from './core/services/role-guard.service';
import { PendingChangesGuard } from './core/services/pending-changes.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    canActivate: [RoleGuardService],
    data: { roles: [Role.USER, Role.ADMIN, Role.HOD, Role.HR, Role.CEO] }
  },
  {
    path: 'appraisal',
    loadChildren: () => import('./features/appraisal/appraisal.module').then(m => m.AppraisalModule),
    canActivate: [RoleGuardService],
    data: { roles: [Role.USER, Role.ADMIN, Role.HOD, Role.HR, Role.CEO] }
  },
  {
    path: 'bonus',
    loadChildren: () => import('./features/bonus/bonus.module').then(m => m.BonusModule),
    canActivate: [RoleGuardService],
    canDeactivate: [PendingChangesGuard],
    data: { roles: [Role.ADMIN, Role.HR] }
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '' }
];
