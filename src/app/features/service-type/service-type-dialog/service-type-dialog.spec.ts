import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeDialog } from './service-type-dialog';

describe('ServiceTypeDialog', () => {
  let component: ServiceTypeDialog;
  let fixture: ComponentFixture<ServiceTypeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceTypeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
