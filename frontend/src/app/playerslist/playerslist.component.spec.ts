import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerslistComponent } from './playerslist.component';

describe('PlayerslistComponent', () => {
  let component: PlayerslistComponent;
  let fixture: ComponentFixture<PlayerslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
