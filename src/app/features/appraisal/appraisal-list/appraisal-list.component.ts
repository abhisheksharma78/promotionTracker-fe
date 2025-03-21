import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appraisal, AppraisalStatus } from '../../../core/models/appraisal';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppraisalService } from '../../../core/services/appraisal.service';
import { Role } from '../../../core/models/role';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';

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
    private appraisalService: AppraisalService,
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
    const user = this.authService.getCurrentUser();

    let appraisalRequest = this.appraisalService.getAppraisals();
    if (user?.role === Role.USER) {
      appraisalRequest = this.appraisalService.getEmployeeAppraisals(user.id);
    } else if (user?.role === Role.HOD) {
      appraisalRequest = this.appraisalService.getManagerAppraisals(user.id);
    }

    appraisalRequest.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (appraisals) => {
        this.appraisals = appraisals;
      },
      error: () => {
        this.notificationService.error('Failed to load appraisals');
      }
    });
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
        this.appraisalService.deleteAppraisal(appraisal.id).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: () => {
            this.appraisals = this.appraisals.filter(a => a.id !== appraisal.id);
            this.notificationService.success('Appraisal deleted successfully');
          },
          error: () => {
            this.notificationService.error('Failed to delete appraisal');
          }
        });
      }
    });
  }
}
