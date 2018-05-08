import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getCurrentPageTitle() {
    return element(by.css('.mat-toolbar.mat-primary')).getText();
  }
  
}
