import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';
import { Role } from '../../../core/models/role';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isAdminOrHR = false;

  // Mock data - replace with actual API calls
  pendingAppraisals = 5;
  totalEmployees = 150;
  pendingReviews = 12;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdminOrHR = user?.role === Role.ADMIN || user?.role === Role.HR;
    });
  }
}
