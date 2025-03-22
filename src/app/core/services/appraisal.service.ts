import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appraisal, AppraisalStatus } from '../models/appraisal';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppraisalService {
  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  getAppraisals(): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.api.apiUrl}/appraisals`);
  }

  getAppraisal(id: string): Observable<Appraisal> {
    return this.http.get<Appraisal>(`${this.api.apiUrl}/appraisals/${id}`);
  }

  getEmployeeAppraisals(employeeId: string): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.api.apiUrl}/appraisals/employee/${employeeId}`);
  }

  getManagerAppraisals(managerId: string): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.api.apiUrl}/appraisals/manager/${managerId}`);
  }

  createAppraisal(appraisal: Partial<Appraisal>): Observable<Appraisal> {
    return this.http.post<Appraisal>(`${this.api.apiUrl}/appraisals`, appraisal);
  }

  updateStatus(id: string, status: AppraisalStatus, managerComments?: string): Observable<Appraisal> {
    return this.http.patch<Appraisal>(`${this.api.apiUrl}/appraisals/${id}/status`, { status, managerComments });
  }

  deleteAppraisal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.apiUrl}/appraisals/${id}`);
  }
}
