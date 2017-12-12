import { Injectable } from '@angular/core';
import { NavigationGroup, NavigationItem } from '../domain';
import { NAVIGATION_MENU_DATA } from '../config';

@Injectable()
export class NavigationService {

  public navigationList: NavigationGroup[];
  
    public selectedNavigationItem: NavigationItem;
    private selectedNavigationGroup: NavigationGroup;
  
    constructor() {
      this.navigationList = NAVIGATION_MENU_DATA;
    }
  
    public getNavigationList(): NavigationGroup[] {
      return this.navigationList;
    }
  
    public updateSelectedNavigationGroup() {
      var result: NavigationGroup;
      this.navigationList.forEach((g) => {
        g.items.forEach((i) => {
          if (this.selectedNavigationItem.name == i.name) {
            //console.log("Found group: " + g.name)
            this.selectedNavigationGroup = g;
          }
        });
      });
    }

}
