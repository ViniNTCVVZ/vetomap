import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AppService } from './services/app.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dialogRef: any;

  constructor(private dialog: MatDialog, private app: AppService) { 
    this.app.onError.subscribe( err => {
      this.dialogRef = this.dialog.open(DialogComponent, {
        width: '600px',
        data: { error: err, message: false }
      });
    });
  }

  openDialog(): void {
    
  }
}
