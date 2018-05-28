import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { FacadeModule } from './facade/facade.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowcaseModule } from './showcase/showcase.module';
import { ThreeExamplesModule } from './three-examples/three-examples.module';@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FacadeModule,
    ShowcaseModule,
    ThreeExamplesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
