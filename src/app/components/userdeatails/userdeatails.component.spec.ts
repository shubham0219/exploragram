import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdeatailsComponent } from './userdeatails.component';

describe('UserdeatailsComponent', () => {
  let component: UserdeatailsComponent;
  let fixture: ComponentFixture<UserdeatailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdeatailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdeatailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
