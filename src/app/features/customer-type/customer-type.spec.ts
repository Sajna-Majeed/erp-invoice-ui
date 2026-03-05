import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerType } from './customer-type';

describe('CustomerType', () => {
  let component: CustomerType;
  let fixture: ComponentFixture<CustomerType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
