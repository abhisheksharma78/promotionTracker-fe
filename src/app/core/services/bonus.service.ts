import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Bonus {
  id: string;
  employeeId: string;
  amount: number;
  incrementPercentage: number;
  year: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeBonus {
  employeeId: string;
  name: string;
  department: string;
  performance: number;
  increment: number;
  bonus: number;
  originalIncrement?: number;
  originalBonus?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BonusService {
  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  getBonuses(): Observable<Bonus[]> {
    return this.http.get<Bonus[]>(`${this.api.apiUrl}/bonuses`);
  }

  getBonus(id: string): Observable<Bonus> {
    return this.http.get<Bonus>(`${this.api.apiUrl}/bonuses/${id}`);
  }

  getEmployeeBonuses(employeeId: string): Observable<Bonus[]> {
    return this.http.get<Bonus[]>(`${this.api.apiUrl}/bonuses/employee/${employeeId}`);
  }

  createBonus(bonus: Partial<Bonus>): Observable<Bonus> {
    return this.http.post<Bonus>(`${this.api.apiUrl}/bonuses`, bonus);
  }

  markAsPaid(id: string): Observable<Bonus> {
    return this.http.patch<Bonus>(`${this.api.apiUrl}/bonuses/${id}/paid`, {});
  }

  deleteBonus(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.apiUrl}/bonuses/${id}`);
  }

  // Batch update bonuses for multiple employees
  updateEmployeeBonuses(bonuses: EmployeeBonus[], approverId: string): Observable<EmployeeBonus[]> {
    return this.http.post<EmployeeBonus[]>(`${this.api.apiUrl}/bonuses/batch`, { bonuses, approverId });
  }
}
