import { Injectable } from '@angular/core';
import { Theme } from '../domain';
import { THEME_LIST_DATA } from '../config';

@Injectable()
export class ThemeService {

  theme: Theme;
  themeList: Theme[];

  constructor() {
    this.themeList = THEME_LIST_DATA;
    // console.log(this.themeList);
    this.theme = this.themeList[0];
  }

}
