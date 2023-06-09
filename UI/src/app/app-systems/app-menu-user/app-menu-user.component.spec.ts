import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenuUserComponent } from './app-menu-user.component';

describe('AppMenuUserComponent', () => {
  let component: AppMenuUserComponent;
  let fixture: ComponentFixture<AppMenuUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMenuUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMenuUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
