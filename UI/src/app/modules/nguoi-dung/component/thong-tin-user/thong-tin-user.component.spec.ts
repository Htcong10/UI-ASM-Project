import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinUserComponent } from './thong-tin-user.component';

describe('ThongTinUserComponent', () => {
  let component: ThongTinUserComponent;
  let fixture: ComponentFixture<ThongTinUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
