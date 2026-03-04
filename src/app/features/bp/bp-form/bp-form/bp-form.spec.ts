import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpForm } from './bp-form';

describe('BpForm', () => {
  let component: BpForm;
  let fixture: ComponentFixture<BpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
