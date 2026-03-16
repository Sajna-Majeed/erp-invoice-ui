import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customprice } from './custom-price';

describe('Customprice', () => {
  let component: Customprice;
  let fixture: ComponentFixture<Customprice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customprice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customprice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
