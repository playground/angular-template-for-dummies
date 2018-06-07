import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertToolbarComponent } from './alert-toolbar.component';
import { MaterialDesignModule } from '../../../material-design/material-design.module';
import { AlertService } from '../../services/alert.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertToolbarComponent', () => {
  let component: AlertToolbarComponent;
  let fixture: ComponentFixture<AlertToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertToolbarComponent ],
      imports: [MaterialDesignModule, BrowserAnimationsModule],
      providers: [AlertService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
