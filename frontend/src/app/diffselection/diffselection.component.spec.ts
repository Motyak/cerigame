import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffselectionComponent } from './diffselection.component';

describe('DiffselectionComponent', () => {
  let component: DiffselectionComponent;
  let fixture: ComponentFixture<DiffselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
