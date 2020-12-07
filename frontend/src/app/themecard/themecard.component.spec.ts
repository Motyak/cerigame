import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemecardComponent } from './themecard.component';

describe('ThemecardComponent', () => {
  let component: ThemecardComponent;
  let fixture: ComponentFixture<ThemecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
