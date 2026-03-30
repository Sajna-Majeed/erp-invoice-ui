import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseModeComponent } from './license-mode';

describe('LicenseModeComponent', () => {
  let component: LicenseModeComponent;
  let fixture: ComponentFixture<LicenseModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
