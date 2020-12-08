import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeselectionComponent } from './themeselection.component';

describe('ThemeselectionComponent', () => {
  let component: ThemeselectionComponent;
  let fixture: ComponentFixture<ThemeselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
