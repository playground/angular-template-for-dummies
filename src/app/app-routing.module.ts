import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CallbackComponent } from './security/callback/callback.component';

@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'callback', component: CallbackComponent },
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    console.debug(this.constructor.name);
  }
}


