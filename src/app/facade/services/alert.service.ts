import { Injectable, ErrorHandler, NgZone, ApplicationRef } from '@angular/core';
import { Alert } from '../domain/alert';
import { AdminGuiError } from '../errors/admin-gui.error';
import { AlertToolbarComponent } from '../toolbar/alert-toolbar/alert-toolbar.component';

@Injectable()
export class AlertService {

  unreadAlertCount: number = 0;
  readAlerts: number = 0;
  alerts: Alert[] = [];
  alertToolbarComponent: AlertToolbarComponent;

  constructor(
  
  ) {

    //TODO: Temporary    
    this.addError(new Error("Demo Error (just for template check)"));
    this.addRandomAlert();
  }

  addRandomAlert() {
    console.log("Add random alert");
    let alert: Alert = {
      component: "DemoComponent",
      date: new Date(),
      details: "Some additional details Some additional details Some additional details Some additional details Some additional details",
      title: "Random Alert " + this.alerts.length
    }
    this.addAlert(alert);
  }

  public addAlert(alert: Alert): void {
    this.alerts.push(alert);
    this.recalculate();
  }

  public addError(error: Error) {
    let errorAlert: Alert = {
      date: new Date(),
      component: error.name,
      title: error.message,
      details: error.message,
      error: error
    }
    this.addAlert(errorAlert);
  }

  public markAllAsRead(): void {
    this.readAlerts = this.alerts.length;
    this.recalculate();
  }

  public recalculate() {
    this.unreadAlertCount = this.alerts.length - this.readAlerts;
    if (this.alertToolbarComponent != undefined) {
      // NOTE: Required to detect view changes after Global Interceptors work
      this.alertToolbarComponent.detectChanges();
    }
  }

  public unreadAlerts(maxCount: number): Array<Alert> {
    //console.log("unreadAlerts: maxCount=" + maxCount + " / readAlerts=" + this.readAlerts + " / length=" + this.alerts.length);
    let unreadAlerts: Array<Alert> = this.alerts.slice(this.readAlerts, this.alerts.length);
    //console.log(unreadAlerts);
    let topAlerts: Array<Alert> = unreadAlerts.reverse().slice(0, maxCount);
    //console.log(topAlerts);
    return topAlerts;
  }

  public deleteAll() {
    this.alerts = new Array<Alert>();
    this.recalculate();
    this.readAlerts = 0;
  }

  public bindAlertToolbarComponent(alertToolbarComponent: AlertToolbarComponent) {
    this.alertToolbarComponent = alertToolbarComponent;
  }

}
