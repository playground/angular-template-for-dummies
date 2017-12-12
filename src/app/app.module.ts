import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { FacadeModule } from './facade/facade.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowcaseModule } from './showcase/showcase.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FacadeModule,
    ShowcaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
