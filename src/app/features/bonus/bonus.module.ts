import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonusListComponent } from './bonus-list/bonus-list.component';
import { PendingChangesGuard } from '../../core/services/pending-changes.guard';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: BonusListComponent,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [
    BonusListComponent,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class BonusModule { }
