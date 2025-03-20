import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ]
})
export class SidebarComponent {
  isAdminOrHR$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAdminOrHR$ = this.authService.currentUser$.pipe(
      map(user => user?.role === Role.ADMIN || user?.role === Role.HR)
    );
  }
}
