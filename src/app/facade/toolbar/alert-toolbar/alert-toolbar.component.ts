import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { MatDrawer, MatDialog } from '@angular/material';
import { AlertToolbarDialog } from './alert-toolbar-dialog/alert-toolbar-dialog';
import { AlertAnimation } from './alert-toolbar.animation';


@Component({
  selector: 'app-alert-toolbar',
  templateUrl: './alert-toolbar.component.html',
  styleUrls: ['./alert-toolbar.component.scss'],
  animations: [AlertAnimation],

})
export class AlertToolbarComponent implements OnInit {

  constructor(
    public alertService: AlertService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
   this.alertService.bindAlertToolbarComponent(this);
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertToolbarDialog, {
      width: '500px',
      height: '100%'
      //, data: { name: this.name, animal: this.animal }
    }).updatePosition({ top: '0px', right: '0px' });


    /*
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    */
  }

  detectChanges() {
    this.cd.detectChanges();
  }

  
}
