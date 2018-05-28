import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NavigationService } from './services/navigation.service';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { FacadeRoutingModule } from './facade-routing.module';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ThemeService } from './services/theme.service';
import { FormsModule } from '@angular/forms';
import { ToolbarMenuComponent } from './toolbar/toolbar-menu/toolbar-menu.component';
import { ThemeSelectComponent } from './toolbar/theme-select/theme-select.component';
import { SideLogoComponent } from './side-navigation/side-logo/side-logo.component';
import { SideActionsComponent } from './side-navigation/side-actions/side-actions.component';
import { FacadeComponent } from './facade/facade.component';
import { AlertService } from './services/alert.service';
import { GlobalErrorInterceptor } from './interceptors/global-error.interceptor';
import { AlertToolbarComponent } from './toolbar/alert-toolbar/alert-toolbar.component';
import { AlertToolbarDialog } from './toolbar/alert-toolbar/alert-toolbar-dialog/alert-toolbar-dialog';
import { ErrorPipe } from './pipes/error.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialDesignModule,
    FacadeRoutingModule
  ],
  declarations: [
    FacadeComponent,
    ToolbarComponent,
    SideNavigationComponent,
    UnderConstructionComponent,
    ToolbarMenuComponent,
    SideLogoComponent,
    ThemeSelectComponent,
    SideActionsComponent,
    AlertToolbarComponent,
    AlertToolbarDialog,
    ErrorPipe
  ],
  exports: [
    FacadeComponent
  ],
  providers: [
    NavigationService,
    ThemeService,
    AlertService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorInterceptor
    }
  ],
  entryComponents: [
    AlertToolbarDialog
  ]
})
export class FacadeModule { }
