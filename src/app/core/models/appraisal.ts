export interface Appraisal {
  id: string;
  employeeId: string;
  reviewerId: string;
  date: Date;
  performance: number;
  communication: number;
  teamwork: number;
  initiative: number;
  comments: string;
  status: AppraisalStatus;
  incrementPercentage?: number;
}

export enum AppraisalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
