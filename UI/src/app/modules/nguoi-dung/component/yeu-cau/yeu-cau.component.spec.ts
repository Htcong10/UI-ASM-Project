import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeuCauComponent } from './yeu-cau.component';

describe('YeuCauComponent', () => {
  let component: YeuCauComponent;
  let fixture: ComponentFixture<YeuCauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeuCauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeuCauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
