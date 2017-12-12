import { Component, OnInit } from '@angular/core';
import { NavigationItem } from '../domain';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { NavigationItemState } from '../animation';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  animations: [NavigationItemState]
})
export class SideNavigationComponent implements OnInit {

  private routerSubscription: Subscription;
  
  constructor(
    public navigationService: NavigationService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.subscribeNavigation();
  }

  public subscribeNavigation() {
    this.routerSubscription = this.router.events.subscribe(i => this.onRouterNavigation(i));
  }

  /**
   * Parses URL and map route to active menu selection
   * @param observableEvent Router event
   */
  private onRouterNavigation(observableEvent) {
    if (observableEvent instanceof NavigationEnd) {
      // TODO: make it nicer
      console.log("onRouterNavigation: Full page refresh detected: urlAfterRedirects=" + observableEvent.urlAfterRedirects);
      this.navigationService.getNavigationList().forEach((g) => {
        g.items.forEach((i) => {
          if ("/" + i.routerLink === observableEvent.urlAfterRedirects) {
            this.navigationService.selectedNavigationItem = i;
          }
        });
      });
      // if not found then set first element as active
      if (this.navigationService.selectedNavigationItem == null) {
        console.log("onRouterNavigation: URL address not mapped to menu selection. Using default");
        this.navigationService.selectedNavigationItem = this.navigationService.getNavigationList()[0].items[0];
      }
      this.navigationService.updateSelectedNavigationGroup();
      // Unsubscribing, because needed only on full-page refresh with URL address
      this.routerSubscription.unsubscribe();
    }
  }

  public onClickNavigationItem(navigationItem: NavigationItem) {
    this.navigationService.selectedNavigationItem = navigationItem;
    this.navigationService.updateSelectedNavigationGroup();
  }

  public isSelectedItem(navigationItem: NavigationItem) {
    return navigationItem == this.navigationService.selectedNavigationItem;
  }
  
}
