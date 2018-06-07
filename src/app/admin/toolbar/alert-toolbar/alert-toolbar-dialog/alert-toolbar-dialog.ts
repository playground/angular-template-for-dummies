import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AlertService } from "../../../services/alert.service";

@Component({
    selector: 'app-alert-toolbar-dialog',
    styleUrls: ['./alert-toolbar-dialog.scss'],
    templateUrl: 'alert-toolbar-dialog.html',
})
export class AlertToolbarDialog {

    constructor(
        public dialogRef: MatDialogRef<AlertToolbarDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public alertService:AlertService
    ) { 
        
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}