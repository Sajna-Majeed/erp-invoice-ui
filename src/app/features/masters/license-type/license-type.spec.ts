import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseTypeComponent } from './license-type';

describe('LicenseTypeComponent', () => {
  let component: LicenseTypeComponent;
  let fixture: ComponentFixture<LicenseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
