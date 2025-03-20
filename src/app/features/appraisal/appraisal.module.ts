import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalListComponent } from './appraisal-list/appraisal-list.component';
import { AppraisalFormComponent } from './appraisal-form/appraisal-form.component';
import { PendingChangesGuard } from '../../core/services/pending-changes.guard';

const routes: Routes = [
  { path: '', component: AppraisalListComponent },
  {
    path: 'new',
    component: AppraisalFormComponent,
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'edit/:id',
    component: AppraisalFormComponent,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [
    AppraisalListComponent,
    AppraisalFormComponent,
    RouterModule.forChild(routes)
  ]
})
export class AppraisalModule { }
