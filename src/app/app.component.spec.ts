import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { FacadeComponent } from './facade/facade/facade.component';
import {MockComponent} from 'ng2-mock-component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent({ selector: 'app-facade' }),
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
