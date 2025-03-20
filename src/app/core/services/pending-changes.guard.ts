import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

export interface ComponentCanDeactivate {
  hasUnsavedChanges: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | boolean {
    if (!component.hasUnsavedChanges) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave?'
      }
    });

    return dialogRef.afterClosed();
  }
}
