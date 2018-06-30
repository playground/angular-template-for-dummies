import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { 
  MatSelectModule, 
  MatIconModule,
  MatButtonModule,
  MatInputModule, 
  MatListModule } from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
  exports: [
    // Material
    MatSelectModule, 
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
