import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appraisal, AppraisalStatus } from '../../../core/models/appraisal';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Role } from '../../../core/models/role';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-appraisal-list',
  templateUrl: './appraisal-list.component.html',
  styleUrls: ['./appraisal-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class AppraisalListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'employee', 'performance', 'status', 'increment', 'actions'];
  appraisals: Appraisal[] = [];
  canCreateAppraisal = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppraisals();
    this.authService.currentUser$.subscribe(user => {
      this.canCreateAppraisal = user?.role !== Role.USER;
    });
  }

  loadAppraisals(): void {
    this.isLoading = true;
    // Mock data loading with timeout - replace with actual API call
    setTimeout(() => {
      this.appraisals = [
        {
          id: '1',
          employeeId: 'EMP001',
          reviewerId: 'REV001',
          date: new Date(),
          performance: 4,
          communication: 4,
          teamwork: 4,
          initiative: 3,
          comments: 'Good performance overall',
          status: AppraisalStatus.IN_REVIEW,
          incrementPercentage: 10
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  canEditAppraisal(appraisal: Appraisal): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    if (user.role === Role.ADMIN || user.role === Role.HR) return true;

    if (user.role === Role.HOD) {
      return appraisal.status !== AppraisalStatus.APPROVED;
    }

    return user.id === appraisal.employeeId && appraisal.status === AppraisalStatus.DRAFT;
  }

  canDeleteAppraisal(appraisal: Appraisal): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === Role.ADMIN || user?.role === Role.HR;
  }

  deleteAppraisal(appraisal: Appraisal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Appraisal', message: 'Are you sure you want to delete this appraisal?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // Mock API call with timeout
        setTimeout(() => {
          this.appraisals = this.appraisals.filter(a => a.id !== appraisal.id);
          this.notificationService.success('Appraisal deleted successfully');
          this.isLoading = false;
        }, 1000);
      }
    });
  }
}
