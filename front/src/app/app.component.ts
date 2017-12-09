import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AppService } from './services/app.service';
import { InfoDialogComponent } from './dialog/info-dialog/info-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dialogRef: any;

  constructor(private dialog: MatDialog, private app: AppService) { 
    this.app.onError.subscribe( err => {
      this.dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '600px',
        data: { error: err, message: false }
      });
    });
  }

  openDialog(): void {
    
  }
}
