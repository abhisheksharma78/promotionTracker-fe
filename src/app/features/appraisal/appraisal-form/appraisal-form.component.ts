import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { AppraisalService } from '../../../core/services/appraisal.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Appraisal, AppraisalStatus } from '../../../core/models/appraisal';
import { Role } from '../../../core/models/role';
import { ComponentCanDeactivate } from '../../../core/services/pending-changes.guard';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class AppraisalFormComponent implements OnInit, ComponentCanDeactivate {
  appraisalForm: FormGroup;
  isEditMode = false;
  canSetIncrement = false;
  isLoading = false;
  ratings = [1, 2, 3, 4, 5];
  private initialFormValue: any;
  private hasChanges = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private appraisalService: AppraisalService,
    private notificationService: NotificationService
  ) {
    this.appraisalForm = this.fb.group({
      employeeId: ['', Validators.required],
      date: [new Date(), Validators.required],
      performance: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      teamwork: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      initiative: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', Validators.required],
      incrementPercentage: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadAppraisal(id);
    }

    const user = this.authService.getCurrentUser();
    this.canSetIncrement = user?.role === Role.ADMIN || user?.role === Role.HR;

    if (!this.canSetIncrement) {
      this.appraisalForm.get('incrementPercentage')?.disable();
    }

    // Store initial form value for change detection
    this.initialFormValue = this.appraisalForm.getRawValue();
    this.appraisalForm.valueChanges.subscribe(() => {
      this.checkFormChanges();
    });
  }

  private checkFormChanges(): void {
    const currentValue = this.appraisalForm.getRawValue();
    this.hasChanges = Object.keys(this.initialFormValue).some(key =>
      JSON.stringify(this.initialFormValue[key]) !== JSON.stringify(currentValue[key])
    );
  }

  get hasUnsavedChanges(): boolean {
    return this.hasChanges;
  }

  private loadAppraisal(id: string): void {
    this.isLoading = true;
    this.appraisalService.getAppraisal(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (appraisal) => {
        this.appraisalForm.patchValue({
          ...appraisal,
          performance: appraisal.performance.toString(),
          communication: appraisal.communication.toString(),
          teamwork: appraisal.teamwork.toString(),
          initiative: appraisal.initiative.toString()
        });
        this.initialFormValue = this.appraisalForm.getRawValue();
      },
      error: () => {
        this.notificationService.error('Failed to load appraisal');
        this.router.navigate(['/appraisal']);
      }
    });
  }

  onSubmit(): void {
    if (this.appraisalForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.appraisalForm.getRawValue();
      const appraisal: Partial<Appraisal> = {
        ...formValue,
        performance: Number(formValue.performance),
        communication: Number(formValue.communication),
        teamwork: Number(formValue.teamwork),
        initiative: Number(formValue.initiative),
        status: this.isEditMode ? AppraisalStatus.IN_REVIEW : AppraisalStatus.DRAFT,
        reviewerId: this.authService.getCurrentUser()?.id
      };

      const request = this.isEditMode ?
        this.appraisalService.updateStatus(this.route.snapshot.params['id'], AppraisalStatus.IN_REVIEW) :
        this.appraisalService.createAppraisal(appraisal);

      request.pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.notificationService.success(
            `Appraisal ${this.isEditMode ? 'updated' : 'created'} successfully`
          );
          this.hasChanges = false;
          this.router.navigate(['/appraisal']);
        },
        error: () => {
          this.notificationService.error(
            `Failed to ${this.isEditMode ? 'update' : 'create'} appraisal`
          );
        }
      });
    } else {
      this.notificationService.error('Please fill in all required fields correctly.');
    }
  }
}
