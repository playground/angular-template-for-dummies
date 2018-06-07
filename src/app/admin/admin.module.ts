import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { GlobalErrorInterceptor } from './interceptors/global-error.interceptor';
import { ErrorPipe } from './pipes/error.pipe';
import { AlertService } from './services/alert.service';
import { NavigationService } from './services/navigation.service';
import { ThemeService } from './services/theme.service';
import { SideActionsComponent } from './side-navigation/side-actions/side-actions.component';
import { SideLogoComponent } from './side-navigation/side-logo/side-logo.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { AlertToolbarDialog } from './toolbar/alert-toolbar/alert-toolbar-dialog/alert-toolbar-dialog';
import { AlertToolbarComponent } from './toolbar/alert-toolbar/alert-toolbar.component';
import { ThemeSelectComponent } from './toolbar/theme-select/theme-select.component';
import { ToolbarMenuComponent } from './toolbar/toolbar-menu/toolbar-menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialDesignModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
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
export class AdminModule { }
