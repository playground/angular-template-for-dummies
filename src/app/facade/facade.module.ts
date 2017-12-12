import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NavigationService } from './services/navigation.service';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { FacadeRoutingModule } from './facade-routing.module';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { SideLogoComponent } from './side-logo/side-logo.component';
import { ThemeService } from './services/theme.service';
import { ThemeSelectComponent } from './theme-select/theme-select.component';
import { FormsModule } from '@angular/forms';
import { SideActionsComponent } from './side-actions/side-actions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialDesignModule,
    FacadeRoutingModule
  ],
  declarations: [
    HomeComponent,
    ToolbarComponent,
    SideNavigationComponent,
    UnderConstructionComponent,
    ToolbarMenuComponent,
    SideLogoComponent,
    ThemeSelectComponent,
    SideActionsComponent
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    NavigationService,
    ThemeService
  ]
})
export class FacadeModule { }
