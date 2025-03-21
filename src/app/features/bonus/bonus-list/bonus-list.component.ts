import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ComponentCanDeactivate } from '../../../core/services/pending-changes.guard';

interface EmployeeBonus {
  employeeId: string;
  name: string;
  department: string;
  performance: number;
  increment: number;
  bonus: number;
  originalIncrement?: number;
  originalBonus?: number;
}

@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class BonusListComponent implements OnInit, ComponentCanDeactivate {
  displayedColumns: string[] = ['employeeId', 'name', 'department', 'performance', 'increment', 'bonus'];
  dataSource: MatTableDataSource<EmployeeBonus>;
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  selectedDepartment = '';
  isLoading = false;
  isSaving = false;
  hasChanges = false;
  filterForm: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource();
    this.filterForm = this.fb.group({
      departmentFilter: [{
        value: '',
        disabled: false
      }],
      searchFilter: [{
        value: '',
        disabled: false
      }]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    if (loading) {
      this.filterForm.disable();
    } else {
      this.filterForm.enable();
    }
  }

  loadEmployees(): void {
    this.setLoading(true);
    // Mock API call with timeout
    setTimeout(() => {
      const mockData: EmployeeBonus[] = [
        {
          employeeId: 'EMP001',
          name: 'John Doe',
          department: 'IT',
          performance: 4.5,
          increment: 10,
          bonus: 50000
        },
        {
          employeeId: 'EMP002',
          name: 'Jane Smith',
          department: 'HR',
          performance: 4.2,
          increment: 8,
          bonus: 40000
        },
        {
          employeeId: 'EMP003',
          name: 'Mike Johnson',
          department: 'Finance',
          performance: 3.8,
          increment: 6,
          bonus: 35000
        }
      ];

      // Store original values for change tracking
      this.dataSource.data = mockData.map(emp => ({
        ...emp,
        originalIncrement: emp.increment,
        originalBonus: emp.bonus
      }));

      this.dataSource.sort = this.sort;
      this.setLoading(false);
    }, 1000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyDepartmentFilter(): void {
    if (!this.selectedDepartment) {
      this.dataSource.filter = '';
      return;
    }

    this.dataSource.filterPredicate = (data: EmployeeBonus) =>
      data.department === this.selectedDepartment;
    this.dataSource.filter = this.selectedDepartment;
  }

  updateIncrement(employee: EmployeeBonus): void {
    if (employee.increment < 0) employee.increment = 0;
    if (employee.increment > 20) employee.increment = 20;
    this.checkForChanges();
  }

  updateBonus(employee: EmployeeBonus): void {
    if (employee.bonus < 0) employee.bonus = 0;
    this.checkForChanges();
  }

  checkForChanges(): void {
    this.hasChanges = this.dataSource.data.some(emp =>
      emp.increment !== emp.originalIncrement ||
      emp.bonus !== emp.originalBonus
    );
  }

  saveChanges(): void {
    if (!this.hasChanges || this.isLoading || this.isSaving) return;

    this.isSaving = true;
    // Mock API call with timeout
    setTimeout(() => {
      // Update original values after successful save
      this.dataSource.data = this.dataSource.data.map(emp => ({
        ...emp,
        originalIncrement: emp.increment,
        originalBonus: emp.bonus
      }));

      this.hasChanges = false;
      this.isSaving = false;
      this.notificationService.success('Changes saved successfully');
    }, 1000);
  }

  get hasUnsavedChanges(): boolean {
    return this.hasChanges;
  }
}
